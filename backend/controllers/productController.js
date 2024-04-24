import asyncHandler from '../middleware/async.js'
import Product from '../models/product.js'

// @desc fetch all products
// @route GET api/v1/products
// @access Public
export const getProducts = asyncHandler(async (req, res, next) => {
  const pageSize = 8
  const page = Number(req.query.pageNumber || 1)
  // for Searching item with name.
  const searchTerm = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {}

  // limit the count with search term
  const count = await Product.countDocuments({ ...searchTerm })
  // also limit the product array with search terms.
  const products = await Product.find({ ...searchTerm }) // empty object to take all the document in db.
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
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
    throw new Error('Product not found with this id.')
  }
})

// @desc D Create Product Review
// @route post api/v1/product/:id
// @access Private/Admin
export const createNewReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    )
    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed.')
    }
    const reviewe = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment,
    }
    product.reviews.push(reviewe)
    // Number of Review of for that vary product.
    product.numReviews = product.reviews.length

    // calculating product rating
    product.rating =
      product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
      product.reviews.length

    await product.save()
    res
      .status(201)
      .json({ message: 'Reviewe add to the product successfully.' })
  } else {
    res.status(404)
    throw new Error('Product not found.')
  }
})

// ==============================> ADMIN <=================================

// @desc creating new Product
// @route post api/v1/product/new
// @access Private/Admin
export const createProduct = asyncHandler(async (req, res, next) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Simple Brand',
    category: 'Sample Category',
    description: 'sample description',
    countInStock: 0,
  })
  await product.save()
  res.status(201).json(product)
})

// @desc update product
// @route Put api/v1/products/:id
// @access Private / Admin
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { price, name, description, image, brand, category, countInStock } =
    req.body
  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updateProduct = await product.save()
    res.json(updateProduct)
  } else {
    res.status(404)
    throw new Error('Resource not found.')
  }
})

// @desc Delete Product
// @route post api/v1/product/:id
// @access Private/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await Product.deleteOne({ _id: product._id })
    res.status(200).json({ message: 'Product Deleted successfully.' })
  } else {
    res.status(404)
    throw new Error('Product deletion faild. Product not found.')
  }
})

// @desc  get top rated product
// @route post api/v1/product/top
// @access public
export const getTopProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)
  res.status(200).json(products)
})
