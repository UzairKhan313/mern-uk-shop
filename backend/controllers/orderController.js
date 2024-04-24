import asyncHandler from '../middleware/async.js'
import Order from '../models/order.js'

import Product from '../models/product.js'
import { calcPrices } from '../utils/calculatePrice.js'
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js'

// @desc create new Order
// @route POST api/v1/order
// @access Private
export const addOrderItems = asyncHandler(async (req, res, next) => {
  // const {
  //   orderItems,
  //   shippingAddress,
  //   paymentMethod,
  //   itemsPrice,
  //   taxPrice,
  //   shippingPrice,
  //   totalPrice,
  // } = req.body
  // if (orderItems && orderItems.length === 0) {
  //   res.status(400)
  //   throw new Error('No Order Item')
  // } else {
  //   const order = new Order({
  //     orderItems: orderItems.map((product) => {
  //       return { ...product, product: product._id, _id: undefined }
  //     }),
  //     user: req.user._id,
  //     shippingAddress,
  //     paymentMethod,
  //     itemsPrice,
  //     taxPrice,
  //     shippingPrice,
  //     totalPrice,
  //   })
  //   const createdOrder = await order.save()
  //   res.status(201).json(createdOrder)
  // }

  const { orderItems, shippingAddress, paymentMethod } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
  } else {
    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    })

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      )
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      }
    })

    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems)

    const order = new Order({
      orderItems: dbOrderItems,
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
  // const orderId = req.body.params
  // const order = await Order.findById(orderId)
  // if (order) {
  //   order.isPaid = true
  //   order.paidAt = Date.now()
  //   order.paymentResult = {
  //     id: req.body.id,
  //     status: req.body.status,
  //     updated_time: req.body.update_time,
  //     email: req.body.payer.email_address,
  //   }
  //   const updatedOrder = await order.save()
  //   res.status(200).json(updatedOrder)
  // } else {
  //   res.status(404)
  //   throw new Error('Order not found!.')
  // }

  const { verified, value } = await verifyPayPalPayment(req.body.id)
  if (!verified) throw new Error('Payment not verified')

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id)
  if (!isNewTransaction) throw new Error('Transaction has been used before')

  const order = await Order.findById(req.params.id)

  if (order) {
    // check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value
    if (!paidCorrectAmount) throw new Error('Incorrect amount paid')

    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
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
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    const updatedOrder = await order.save()
    res.status(200).json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found.')
  }
})

// @desc  Get all orders
// @route GET api/v1/orders/:id/pay
// @access Private / Admin
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.status(200).json(orders)
})
