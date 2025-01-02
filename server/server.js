import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRoute from './routes/imageRoute.js';

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(cors());

await connectDB();

app.use('/api/user' , userRouter);
app.use('/api/image' , imageRoute);

app.listen(PORT , () => {
    console.log("server is running !" + PORT);
    
})