import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import connectDB from './config/DB.js'

// importing Routes
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

import { notFound, errorHandler } from './middleware/error.js'

dotenv.config()

const port = process.env.PORT || 8000

connectDB() // Connection to Database.
const app = express()

// Body parser middleware.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Cookie parser middleware.
app.use(cookieParser())

// controllers Routes
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/orders', orderRoutes)

// Error handler routes
app.use(notFound)
app.use(errorHandler)

// Starting the Server.
app.listen(port, () => {
  console.log(`Server is Running on port https://localhost:${port}`)
})
