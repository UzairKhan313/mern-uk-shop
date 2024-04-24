import React from 'react'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Paginate from '../../components/Paginate'

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from '../../slices/productApiSlice'

const ProductList = () => {
  const { pageNumber } = useParams()
  // mutation for getting product details.
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  })

  // mutationn for updating product
  const [createProduct, { isLoading: createProductLoading }] =
    useCreateProductMutation()

  // mutation for deleting product
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation()

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

  // Delete product handler.
  const deleteProductHanlder = async (id) => {
    if (window.confirm('Are you sure do you want to delete the product.')) {
      try {
        await deleteProduct(id)
        refetch()
        toast.success('Product deleted successfully')
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
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
      {loadingDelete && <Loader />}
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
            {data.products.map((product) => (
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
      {data && (
        <Paginate pages={data.pages} currentPage={data.page} isAdmin={true} />
      )}
    </>
  )
}

export default ProductList
