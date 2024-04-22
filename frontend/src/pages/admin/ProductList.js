import React from 'react'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'

import Message from '../../components/Message'
import Loader from '../../components/Loader'

import {
  useCreateProductMutation,
  useGetProductsQuery,
} from '../../slices/productApiSlice'

const ProductList = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery()
  const [createProduct, { isLoading: createProductLoading }] =
    useCreateProductMutation()

  const createProductHandler = async () => {
    if (window.confirm('Are your sure you want to create new product')) {
      try {
        await createProduct()
        refetch()
        toast.success('Product created successfully')
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  const deleteProductHanlder = (id) => {
    console.log(id)
  }

  return (
    <>
      <Row className="align-item-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {createProductLoading && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm mx-2">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    style={{
                      color: 'red',
                      backgroundColor: 'transparent',
                      border: 'transparent',
                    }}
                    onClick={() => deleteProductHanlder(product._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default ProductList
