import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import razorpay from 'razorpay';
import transactionModel from "../models/transactionModel.js";

const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(401).json({ success: false, message: "Missing Details" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name, email, password: hashedPassword
        }
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.status(200).json({ success: true, token, user: { name: user.name } })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            return res.status(200).json({ success: true, token, user: { name: user.name } })
        } else {
            return res.json({ success: false, message: "Password does not match!" });
        }

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

const userCredit = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        return res.status(200).json({ success: true, credits: user.creditBalance, user: { name: user.name } })

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {
    try {
      const { userId, planId } = req.body;
  
      // Validate input
      if (!userId || !planId) {
        return res.status(401).json({ success: false, message: "Missing Details" });
      }
  
      // Fetch user
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      let credits, plan, amount, date;
  
      // Determine plan details
      switch (planId) {
        case "Basic":
          plan = "Basic";
          credits = 100;
          amount = 10;
          break;
        case "Advance":
          plan = "Advance";
          credits = 500;
          amount = 50;
          break;
        case "Business":
          plan = "Business";
          credits = 5000;
          amount = 250;
          break;
        default:
          return res.status(400).json({ success: false, message: "Plan not found" });
      }
  
      // Create transaction
      date = Date.now();
      const transactionData = { userId, plan, amount, credits, date };
      const newTransaction = await transactionModel.create(transactionData);
  
      // Prepare Razorpay options
      const options = {
        amount: amount * 100, // Amount in paise
        currency: process.env.CURRENCY,
        receipt: newTransaction._id.toString(),
      };
  
      // Create Razorpay order
      razorpayInstance.orders.create(options, (error, order) => {
        if (error) {
          console.error("Razorpay error:", error); // Log the error for debugging
          return res.status(500).json({ success: false, message: "Razorpay order creation failed", error });
        }
  
        // Send success response with order details
        return res.status(200).json({ success: true, order });
      });
    } catch (error) {
      // Catch and handle unexpected errors
      console.error("Server error:", error); // Log the error for debugging
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  
export { userRegister, userLogin, userCredit , paymentRazorpay }