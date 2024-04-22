import express from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
} from '../controllers/productController.js'
import { protectRoutes, adminRoutes } from '../middleware/auth.js'

const router = express.Router()

router.route('/').get(getProducts)

router.route('/new').post(protectRoutes, adminRoutes, createProduct)
router
  .route('/:id')
  .get(getProductById)
  .put(protectRoutes, adminRoutes, updateProduct)

export default router
