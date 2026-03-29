const express = require('express')
const cors = require('cors')
const cookiparser = require('cookie-parser')
const connection = require('./config/connection')
const dotenv = require('dotenv')
const authRouter = require('./routes/auth.router')
const userRouter = require('./routes/user.router')
const orderRouter = require('./routes/order.router')

dotenv.config()
connection()

// Instnace of Express
const app = express()
app.set('trust proxy',1)

// Middleware
app.use(express.json())
app.use(cors())
app.use(cookiparser())

// Auth Router
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/order',orderRouter)


app.use((err, req, res, next) => {
   const statusCode = err.statusCode || 500;
   res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error'
   });
});

const PORT = process.env.PORT || 5000
app.listen(PORT,'0.0.0.0',()=>console.log(`Server Runnig On ${PORT}`))