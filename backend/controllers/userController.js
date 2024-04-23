import asyncHandler from '../middleware/async.js'
import User from '../models/user.js'
import generateToken from '../utils/generateToken.js'

// @desc Auth User and get Token
// @route POST api/v1/users/login
// @access Public
export const authUser = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body
  const user = await User.findOne({ email: email })

  if (user && (await user.matchPassword(password))) {
    // Generating token and storing it in cookie
    generateToken(res, user._id)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    //UnAuthorized
    res.status(401)
    return next(new Error('Inavlid Email or Password.'))
  }
})

// @desc Registerd User
// @route GET api/v1/users
// @access Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body
  const existUser = await User.findOne({ email })
  if (existUser) {
    res.status(400) // client error they did some thing wrong.
    throw new Error('Email already resgistered. Please pick another one.')
  }
  const user = await User.create({ name, email, password })
  if (user) {
    // Generating token and storing it in cookie
    generateToken(res, user._id)

    // 201 mean All good something is created.
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data.')
  }
})

// @desc Registerd Logout User
// @route POST api/v1/users/logout
// @access Private
export const logoutUser = asyncHandler(async (req, res, next) => {
  // Clearing Cookie...
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  })
  res.status(200).json({ message: 'User logout successfully' })
})

// @desc Get  User Profile
// @route get api/v1/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found.')
  }
})

// @desc Registerd Logout User
// @route PUT api/v1/users/profile
// @access Private
export const updateUserProfle = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    // password is hashed so we can't put it the outer if block.
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(401)
    throw new Error('User not Found!.')
  }
})

// ================> ADMIN CONTROLLER <===================

// @desc Get All User
// @route GET api/v1/users
// @access Private/Admin
export const getAllUser = asyncHandler(async (req, res, next) => {
  const users = await User.find({})
  res.status(200).json(users)
})

// @desc Get  User by Id
// @route GET api/v1/users.:id
// @access Private/Admin
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.status(200).json(user)
  } else {
    res.status(404)
    throw new Error('User is not found with this user id.')
  }
})

// @desc Updata  User by admin
// @route PUT api/v1/users/:id
// @access Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    if (user.isAdmin) {
      res.status(400).json('Can not delete admin user.')
    }
    await User.deleteOne({ _id: user._id })
    res.status(200).json({ message: 'User deleted successfully' })
  } else {
    res.status(404)
    throw new Error('User is not found with this user id.')
  }
})

// @desc Update User
// @route DELETE api/v1/users/:id
// @access Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = Boolean(req.body.isAdmin)

    const updatedUser = await user.save()
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User is not found with this user id.')
  }
})
