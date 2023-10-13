const express = require('express');
const app = express();
require('dotenv').config()
const bodyParser = require('body-parser');
require('dotenv/config');
const mongoose = require('mongoose');
const expressJwt= require('express-jwt');

const authjwt = require('./middleware/authentication');

const Product = require('./Models/product');
const Order = require('./Models/order');
const Category = require('./Models/category');
const User = require('./Models/user');


const productRoute=require('./Routers/product')
const orderRoute = require('./Routers/order')
const categoryRouter = require('./Routers/category')
const userRouter = require('./Routers/user')



const api = process.env.API_URL
const MongoUrl= process.env.MONGO_URL;

//Database







try{
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://127.0.0.1:27017/eShop');
    console.log('Connected to mongo successfully');
}catch(err){
    console.log(err);
}


app.use(bodyParser.json());
app.use(authjwt);



app.use('/product',productRoute);
app.use('/order',orderRoute);
app.use('/category',categoryRouter);
app.use('/user',userRouter);
app.use('/puplic/uploads',express.static(__dirname + '/puplic/uploads'))


app.listen(5000,()=>{
    console.log('app listening on port 5000');
})