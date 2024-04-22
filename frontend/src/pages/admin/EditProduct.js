import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
} from '../../slices/productApiSlice'

const EditProduct = () => {
  const { id: productId } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId)

  const [updateProduct, { isLoading: updateLoading }] =
    useUpdateProductMutation()

  useEffect(() => {
    if (product) {
      setName(product.name)
      setPrice(product.price)
      setImage(product.image)
      setBrand(product.brand)
      setCategory(product.category)
      setCountInStock(product.countInStock)
      setDescription(product.description)
    }
  }, [product])

  const submitHandler = async (e) => {
    e.preventDefault()

    const updateProductDetail = {
      productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    }

    const result = await updateProduct(updateProductDetail)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Product updated successfully')
      navigate('/admin/productlist')
    }
  }
  return (
    <>
      <Link to="/admin/productlist">Go Back</Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {updateLoading && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message>{error?.data?.message || error.error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="price" className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            {/* IMAGE PLACE HOLDER  */}

            <Form.Group controlId="brand" className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="countInStock" className="mb-3">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default EditProduct
