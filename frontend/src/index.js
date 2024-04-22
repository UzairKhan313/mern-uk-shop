import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/bootstrap.custom.css'
import './assets/styles/index.css'

import reportWebVitals from './reportWebVitals'
//PayPal
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import { Provider } from 'react-redux'
import store from './store.js'
import App from './App'

// Utils for Route Protection.
import PrivateRoutes from './components/PrivateRoutes.js'
import AdminRoutes from './components/AdmingRoutes.js'

// Pages
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetails'
import Cart from './pages/Cart.js'
import Login from './pages/Login.js'
import Signup from './pages/Signup.js'
import Shipping from './pages/Shipping.js'
import Payment from './pages/Payment.js'
import PlaceOrder from './pages/PlaceOrder.js'
import Order from './pages/Order.js'
import Profile from './pages/Profile.js'
import OrderList from './pages/admin/OrderList.js'
import ProductList from './pages/admin/ProductList.js'
import EditProduct from './pages/admin/EditProduct.js'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" index={true} element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="" element={<PrivateRoutes />}>
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="" element={<AdminRoutes />}>
        <Route path="/admin/orderlist" element={<OrderList />} />
        <Route path="/admin/productlist" element={<ProductList />} />
        <Route path="/admin/product/:id/edit" element={<EditProduct />} />
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
)

reportWebVitals()
