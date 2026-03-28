const express = require('express')
const cors = require('cors')
const cookieparser = require('cookie-parser')
const connection = require('./config/connection')
const dotenv = require('dotenv')
const authRouter = require('./routes/auth.router')
const categoryRouter= require('./routes/category.router');

dotenv.config()
connection()

// Instnace of Express
const app = express()
app.set('trust proxy',1)

// Middleware
app.use(express.json())
app.use(cors())
app.use(cookieparser())

// Auth Router
app.use('/api/auth',authRouter)
app.use('/api/category',categoryRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
   const statusCode = err.statusCode || 500;
   res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error'
   });
});

const PORT = process.env.PORT || 5000
app.listen(PORT,'0.0.0.0',()=>console.log(`Server Running On ${PORT}`))