import express from 'express'
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelievered,
} from '../controllers/orderController.js'

import { protectRoutes, adminRoutes } from '../middleware/auth.js'

const router = express.Router()

router
  .route('/')
  .post(protectRoutes, addOrderItems)
  .get(protectRoutes, adminRoutes, getAllOrders)

router.route('/mine').get(protectRoutes, getMyOrders)
router.route('/:id').get(protectRoutes, getOrderById)
router.route('/:id/pay').put(protectRoutes, updateOrderToPaid)
router
  .route('/:id/deliver')
  .put(protectRoutes, adminRoutes, updateOrderToDelievered)

export default router
