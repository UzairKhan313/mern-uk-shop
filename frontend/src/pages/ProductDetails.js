import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import Ratings from '../components/Ratings'
import Loader from '../components/Loader'
import Message from '../components/Message'

import {
  useGetProductDetailsQuery,
  useCreateProductReviewMutation,
} from '../slices/productApiSlice'
import { addToCart } from '../slices/cartSlice'

const ProductDetail = () => {
  const { id: productId } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  // initilizing useNavgitate for Navigation.
  const naviagte = useNavigate()

  // inintilizing useDispatch for dispatching cart action.
  const dispatch = useDispatch()

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId)

  const { userInfo } = useSelector((state) => state.auth)

  const [createReview, { isLoading: reviewLoading }] =
    useCreateProductReviewMutation()

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: quantity }))
    naviagte('/cart')
  }

  const reviewSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      await createReview({ productId, rating, comment }).unwrap()
      refetch()
      toast.success('Reviewed submitted successfully')
      setRating(0)
      setComment('')
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message || error.error)
    }
  }

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>{product.name}</ListGroup.Item>
                <ListGroup.Item>
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price : {product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description : {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price : </Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status : </Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {/* // Qunatity of the porduct */}
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Quantity : </Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Number(e.target.value))
                            }
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (item) => (
                                <option
                                  style={{
                                    backgroundColor: '#7B8A8B',
                                    color: 'white',
                                  }}
                                  key={item + 1}
                                >
                                  {item + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review">
            <Col md={6}>
              <h2>Reivews</h2>
              {product.reviews.length === 0 && (
                <Message>No Reviews added yet</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((rev) => {
                  return (
                    <ListGroup.Item key={rev._id}>
                      <strong>{rev.name}</strong>
                      <Ratings value={rev.rating} />
                      <p>{rev.createdAt.substring(0, 10)}</p>
                      <p>{rev.comment}</p>
                    </ListGroup.Item>
                  )
                })}

                <ListGroup.Item>
                  <h2> Write a customar Review</h2>
                  {reviewLoading && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={reviewSubmitHandler}>
                      <Form.Group controlId="rating" className="my-2">
                        <Form.Label>Ratings</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Vary Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment" className="my-2">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          value={comment}
                          rows={3}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>
                      <Button
                        disabled={reviewLoading}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a reiview
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductDetail
