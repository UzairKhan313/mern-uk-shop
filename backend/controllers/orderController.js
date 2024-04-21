import asyncHandler from '../middleware/async.js'
import Order from '../models/order.js'

// @desc create new Order
// @route POST api/v1/order
// @access Private
export const addOrderItems = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body
  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No Order Item')
  } else {
    const order = new Order({
      orderItems: orderItems.map((product) => {
        return { ...product, product: product._id, _id: undefined }
      }),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })
    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

// @desc Get Login User Orders
// @route GET api/v1/orders/mine
// @access Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
  res.status(200).json(orders)
})

// @desc  update Order to paid
// @route PUT api/v1/orders/:id/pay
// @access Private
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const orderId = req.body.params
  const order = await Order.findById(orderId)
  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updated_time: req.body.update_time,
      email: req.body.payer.email_address,
    }
    const updatedOrder = await order.save()
    res.status(200).json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found!.')
  }
})

// @desc Get  Orders by Id
// @route GET api/v1/orders/:id
// @access Private/
export const getOrderById = asyncHandler(async (req, res, next) => {
  // Getting order by and all get the user name and email throught populate method.
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )
  if (order) {
    res.status(200).json(order)
  } else {
    res.status(404)
    throw new Error('Order not Found!.')
  }
})

// ======================> ADMIN ROUTES <======================

// @desc  update Order to Deliever
// @route GET api/v1/orders/:id/pay
// @access Private / Admin
export const updateOrderToDelievered = asyncHandler(async (req, res, next) => {
  res.send('Update order to Delievered')
})

// @desc  Get all orders
// @route GET api/v1/orders/:id/pay
// @access Private / Admin
export const getAllOrders = asyncHandler(async (req, res, next) => {
  res.send('Update order to Delievered')
})
