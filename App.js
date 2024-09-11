const express = require("express");
require('dotenv').config();
// const cookieParser=require("cookie-parser");
const cors=require("cors");
const database = require('../Server/Database/mongodb');
// const cloudinary=require("./config/cloudinary");

const app=express();

const PORT = process.env.PORT||8000;
app.use(express.json());
// app.use(cookieParser());
database.connect();
// cloudinary.cloudinaryConnect();
// console.log("cloudinary connected successfully");
// app.use(
// 	cors({
		
// 		origin: "http://localhost:3000",
// 		// origin: "*",
// 		// origin:"https://picland-azure.vercel.app/",
// 		credentials: true,
// 	})
// );
// app.use(fileupload({
//     useTempFiles : true,
//     tempFileDir : '/tmp'
// }));
//setting up routes
const userRoute = require("./Router/userRouter");
app.use('/api',userRoute);
const addFood = require("./Router/addfoodRouter");
app.use('/api',addFood);
const cartRoute = require('./Router/CartRouter');
app.use('/api',cartRoute);
app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`);
});