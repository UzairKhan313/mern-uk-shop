import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, Card, ListGroup, Form, Button } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'

import Message from '../components/Message'
import { addToCart, removeItemFromCart } from '../slices/cartSlice'

const Cart = () => {
  const navigate = useNavigate()
  const dispatach = useDispatch()

  //Accessing Cart items.
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const addToCartHandler = async (product, qty) => {
    dispatach(addToCart({ ...product, qty: qty }))
  }

  const removeItemFromCartHandler = async (id) => {
    dispatach(removeItemFromCart(id))
  }

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping')
  }

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your Cart is Empty <Link to="/">Fill Now</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => {
              return (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) => {
                          addToCartHandler(item, Number(e.target.value))
                        }}
                      >
                        {[...Array(item.countInStock).keys()].map((item) => (
                          <option
                            style={{
                              backgroundColor: '#7B8A8B',
                              color: 'white',
                            }}
                            key={item + 1}
                          >
                            {item + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type="btn"
                        variant="light"
                        onClick={() => removeItemFromCartHandler(item._id)}
                      >
                        <FaTrash style={{ color: 'red' }} />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal : ({cartItems.reduce((acc, item) => acc + item.qty, 0)}
                ) items
              </h2>
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default Cart
