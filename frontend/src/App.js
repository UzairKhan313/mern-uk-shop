import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'

import Header from './components/Header'
import Footer from './components/Footer'

const App = () => {
  const readCookie = () => {
    const cookie = Cookies.get('jwt', { path: '/', domain: 'localhost:3000' })
    if (!cookie) {
      console.log('cookie not found')
    } else {
      console.log('cookie is found : ', cookie)
    }
  }
  useEffect(() => {
    readCookie()
  }, [])

  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer position="top-center" />
    </>
  )
}

export default App
