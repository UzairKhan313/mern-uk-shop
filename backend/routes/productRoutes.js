import express from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createNewReview,
  getTopProducts,
} from '../controllers/productController.js'
import { protectRoutes, adminRoutes } from '../middleware/auth.js'

import checkObjectId from '../middleware/checkObjectId.js'

const router = express.Router()

router.route('/').get(getProducts)
router.route('/top').get(getTopProducts)

router.route('/new').post(protectRoutes, adminRoutes, createProduct)
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protectRoutes, adminRoutes, checkObjectId, updateProduct)
  .delete(protectRoutes, adminRoutes, checkObjectId, deleteProduct)

router.route('/:id/reviews').post(protectRoutes, checkObjectId, createNewReview)
export default router
