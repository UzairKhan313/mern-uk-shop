import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import { useRegistereMutation } from '../slices/userApiSlice'
import { setCredientials } from '../slices/authSllice'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [registere, { isLoading }] = useRegistereMutation()

  const { userInfo } = useSelector((state) => state.auth)

  // looking in the url for redirect if the user is login the it proceed to checkout other user redirect to login page.
  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (confirmPassword !== password) {
      toast.error('Password do not matched')
    } else {
      try {
        // making login request.
        const response = await registere({ name, email, password }).unwrap()
        // storing the user info in local storage through the setCredientials slice
        dispatch(setCredientials({ ...response }))
        navigate(redirect)
        toast.success('Login successfully')
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="confirmpassword" className="my-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="my-3"
          disabled={isLoading}
        >
          Login In
        </Button>
        {isLoading && <Loader />}
      </Form>
      <Row>
        <Col>
          Already have account ?
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default Signup
