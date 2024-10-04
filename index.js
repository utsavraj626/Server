const express = require("express");
require('dotenv').config();
const cors=require("cors");
const database = require('../Server/Database/mongodb');
var cookieParser = require('cookie-parser')
// const bodyParser = require('body-parser');

const app=express();

const PORT = process.env.PORT||8000;
app.use(express.json());
app.use(express.urlencoded({limit: '16kb'}));
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
database.connect();

app.use(
	cors({
		
		origin: "http://localhost:3000",
		// origin: "*",
		// origin:"https://picland-azure.vercel.app/",
		credentials: true,
	})
);

//setting up routes
const userRoute = require("./Router/userRouter");
app.use('/api',userRoute);
const addFood = require("./Router/addfoodRouter");
app.use('/api',addFood);
// const addFood = require("./Router/addfoodRouter");
// app.use('/api',getAllFood);
const cartRoute = require('./Router/CartRouter');
app.use('/api',cartRoute);
const OrderRoute = require('./Router/OrderRouter');
app.use('/api',OrderRoute);
const GetOrder = require('./Router/getOrderRouter');
app.use('/api',GetOrder);
const Payment = require('./Router/PaymentRoute');
app.use('/api',Payment);
app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`);
});
