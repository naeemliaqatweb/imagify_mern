import  {generateImage}  from "../controllers/imageController.js";
import express from "express";
import userAuth from "../middleware/auth.js";


const imageRoute = express();

imageRoute.post("/generate-image" , userAuth , generateImage);

export default imageRoute;