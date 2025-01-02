import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";

export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;

        // Validate user and prompt
        const user = await userModel.findById(userId);
        if (!user || !prompt) {
            return res.status(401).json({ success: false, message: "Missing details" });
        }

        // Check user's credit balance
        if (user.creditBalance <= 0) {
            return res.status(401).json({ success: false, message: "No Credits Balance", creditBalance: user.creditBalance });
        }

        // Prepare form data
        const formData = new FormData();
        formData.append("prompt", prompt);

        // Make the API call
        const { data } = await axios.post(
            "https://clipdrop-api.co/text-to-image/v1",
            formData,
            {
                headers: {
                    "x-api-key": process.env.CLIPDROP_API,
                    ...formData.getHeaders(), // Add formData-specific headers
                },
                responseType: "arraybuffer", // Expect binary data
            }
        );

        // Process the image data
        const base64Image = Buffer.from(data, "binary").toString("base64");
        const resultImage = `data:image/png;base64,${base64Image}`;

        // Update user's credit balance
        const curCreditBalance = user.creditBalance - 1;
        await userModel.findByIdAndUpdate(user._id, { creditBalance: curCreditBalance });

        return res.status(200).json({
            success: true,
            message: "Image generated",
            resultImage,
            creditBalance: curCreditBalance,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
