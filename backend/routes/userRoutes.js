import express from 'express'
import {
  authUser,
  logoutUser,
  registerUser,
  getAllUser,
  getUserById,
  deleteUser,
  updateUser,
  updateUserProfle,
  getUserProfile,
} from '../controllers/userController.js'

import { protectRoutes, adminRoutes } from '../middleware/auth.js'

const router = express.Router()

router.route('/').post(registerUser).get(protectRoutes, adminRoutes, getAllUser)
router.post('/logout', logoutUser)
router.post('/login', authUser)
router
  .route('/profile')
  .get(protectRoutes, getUserProfile)
  .post(protectRoutes, updateUserProfle)

// =============> ADMIN <====================
router
  .route('/:id')
  .delete(protectRoutes, adminRoutes, deleteUser)
  .get(protectRoutes, adminRoutes, getUserById)
  .put(protectRoutes, adminRoutes, updateUser)

export default router
