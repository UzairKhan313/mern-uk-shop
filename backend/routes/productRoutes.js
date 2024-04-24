import express from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createNewReview,
} from '../controllers/productController.js'
import { protectRoutes, adminRoutes } from '../middleware/auth.js'

const router = express.Router()

router.route('/').get(getProducts)

router.route('/new').post(protectRoutes, adminRoutes, createProduct)
router
  .route('/:id')
  .get(getProductById)
  .put(protectRoutes, adminRoutes, updateProduct)
  .delete(protectRoutes, adminRoutes, deleteProduct)

router.route('/:id/reviews').post(protectRoutes, createNewReview)
export default router
