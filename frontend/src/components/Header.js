import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useLogoutMutation } from '../slices/userApiSlice'
import { logout } from '../slices/authSllice'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // use Selectio take a funtion and we destruct any thing from that function
  // cart is comming from our store that we define it in there.
  const { cartItems } = useSelector((state) => state.cart)

  const [logoutApiCall] = useLogoutMutation()

  // Getting User info from the state
  const { userInfo } = useSelector((state) => state.auth)

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate('/login')
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <h3 style={{ marginBottom: 0 }}>UK SHOP</h3>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart />
                  <span style={{ marginLeft: '4px' }}>Cart</span>
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: '3px' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser />
                    <span style={{ marginLeft: '4px' }}>Sign In</span>
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
