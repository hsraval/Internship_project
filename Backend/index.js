const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const cookieparser = require('cookie-parser')
const connection = require('./config/connection')
const authRouter = require('./routes/auth.router')
const categoryRouter= require('./routes/category.router');
const productRouter=require('./routes/product.router');
const orderRouter = require('./routes/order.router')
const userRouter = require('./routes/user.router');
const wishlistRouter=require('./routes/wishlist.router');

connection()

const app = express()
app.set('trust proxy',1)

app.use(express.json())
app.use(cors())
app.use(cookieparser())
app.use(express.urlencoded({extended:true}));

app.use('/api/auth',authRouter)
app.use('/api/category',categoryRouter);
app.use('/api/product',productRouter);
app.use('/api/user',userRouter);
app.use('/api/order',orderRouter);
app.use('/api/wishlist',wishlistRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
   if(err.code==="LIMIT_UNEXPECTED_FILE"){
      return res.status(400).json({success:false,message:"you can upload maximum 5 images only"});
   }
   const statusCode = err.statusCode || 500;
   res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error'
   });
});

const PORT = process.env.PORT || 5000
app.listen(PORT,'0.0.0.0',()=>console.log(`Server Running On ${PORT}`))
