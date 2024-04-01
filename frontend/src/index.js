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
import App from './App'
import reportWebVitals from './reportWebVitals'

// Pages
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" index={true} element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

reportWebVitals()
