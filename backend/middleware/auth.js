import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import asyncHandler from './async.js'
import User from '../models/user.js'

// Protect Routes from unAuthorized user.
export const protectRoutes = asyncHandler(async (req, res, next) => {
  let token

  // Read the JWT toke from the token.
  token = req.cookies.jwt // we store our cookie with name jwt

  if (token) {
    try {
      // Decoding token for user id.
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      const userId = decodedToken.userId
      // finding user with that id in the Database and adding user to the request.
      req.user = await User.findById(userId).select('-password')
      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized!. Token failed')
    }
  } else {
    res.status(401)
    throw new Error('Not authorized!. No token')
  }
})

// Adming middlewaer . looking for those user which are admin or not.
export const adminRoutes = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as admin')
  }
})
