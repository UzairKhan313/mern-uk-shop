import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        display: 'block',
        margin: 'auto',
        height: '100px',
        width: '100px',
      }}
    />
  )
}

export default Loader
