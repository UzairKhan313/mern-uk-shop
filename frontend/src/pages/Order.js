import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
  useDelieverOrderMutation,
} from '../slices/orderApiSlice'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'

const Order = () => {
  const { id: orderId } = useParams()
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId)

  const [payOrder] = usePayOrderMutation()

  const [deliverOrder, { isLoading: loadingDeliever }] =
    useDelieverOrderMutation()

  //FROM PAYPAL SCRIPT.
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPaypal,
  } = useGetPayPalClientIdQuery()

  // GETTING USERINFO FROM THE STATE.
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (paypal) {
      if (!errorPaypal && !loadingPayPal) {
        const loadPaypalScript = async () => {
          paypalDispatch({
            type: 'resetOptions',
            value: {
              'client-id': paypal.clientId,
              currency: 'USD',
            },
          })
          paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
        }
        if (order && !order.isPaid) {
          if (!window.paypal) {
            loadPaypalScript()
          }
        }
      }
    }
  }, [order, paypal, loadingPayPal, errorPaypal, paypalDispatch])

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap()
        refetch()
        toast.success('Payment successfully.')
      } catch (error) {
        toast.error(error?.data?.message || error?.message)
      }
    })
  }

  const onApproveTest = async () => {
    await payOrder({ orderId, details: { payer: {} } })
    refetch()
    toast.success('Payment successfully.')
  }

  const onError = (err) => {
    toast.error(err.message)
  }
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_unit: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId
      })
  }

  const deliveredOrderHandler = async () => {
    try {
      await deliverOrder(orderId)
      refetch()
      toast.success('Order Delivered Successfully')
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h1>Order : {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name : </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email : </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address : </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delievered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delievered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Methods</h2>
              <p>
                <strong>Method : </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              {order.orderItems.map((item, index) => {
                return (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} X {item.price} = ${item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )
              })}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summery</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items Price</Col>
                  <Col>{order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping Price</Col>
                  <Col>{order.shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Tax Price</Col>
                  <Col>{order.taxPrice}</Col>
                </Row>
                <Row>
                  <Col>Total Price</Col>
                  <Col>{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Pay order place holder  */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPayPal && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: '10px' }}
                      >
                        Pay Order
                      </Button>
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {/* MARK AS DELIEVERED */}
              {loadingDeliever && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelievered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliveredOrderHandler}
                    >
                      Mark is delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Order
