import React from 'react'
import { Table, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { FaTimes, FaTrash, FaEdit, FaCheck } from 'react-icons/fa'

import Message from '../../components/Message'
import Loader from '../../components/Loader'
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '../../slices/userApiSlice'
import { toast } from 'react-toastify'

const UserList = () => {
  // Fetching all users query.
  const { data: users, refetch, isLoading, error } = useGetUsersQuery()
  const [deleteUser, { isLoading: loadingUserDeletion }] =
    useDeleteUserMutation()

  const deleteUserHandler = async (id) => {
    if (window.confirm('Are you sure do you want to delete this user')) {
      try {
        await deleteUser(id)
        refetch()
        toast.success('User deleted successfully.')
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }
  return (
    <>
      <h2>All Users</h2>
      {loadingUserDeletion && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error?.data?.message || error?.error}</Message>
      ) : (
        <Table striped bordered responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>

                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button className="btn-sm " variant="light">
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
                    onClick={() => deleteUserHandler(user._id)}
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

export default UserList
