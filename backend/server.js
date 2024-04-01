import express from 'express'
import dotenv from 'dotenv'
import products from './data/products.js'

dotenv.config()

const port = process.env.PORT || 8000

const app = express()

app.get('/api/v1/products', (req, res, next) => {
  res.json(products)
})

app.get('/api/v1/product/:id', (req, res, next) => {
  const id = req.params.id
  const product = products.find((product) => product._id === id)
  res.json(product)
})

app.listen(port, () => {
  console.log(`Server is Running on port https://localhost/${port}`)
})
