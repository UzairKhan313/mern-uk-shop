import express from 'express'
import dotenv from 'dotenv'

import connectDB from './config/DB.js'

// importing Routes
import productRoutes from './routes/productRoutes.js'

import { notFound, errorHandler } from './middleware/error.js'

dotenv.config()

const port = process.env.PORT || 8000

connectDB() // Connection to Database.
const app = express()

app.use('/api/v1/products', productRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is Running on port https://localhost:${port}`)
})
