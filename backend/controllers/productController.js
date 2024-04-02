import asyncHandler from '../middleware/async.js'
import Product from '../models/product.js'

// @desc fetch all products
// @route GET api/v1/products
// @access Public
export const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({}) // empty object to take all the document in db.
  res.json(products)
})

// @desc fetch  product
// @route GET api/v1/products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res, next) => {
  const id = req.params.id
  const product = await Product.findById(id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Resource not found.')
  }
})
