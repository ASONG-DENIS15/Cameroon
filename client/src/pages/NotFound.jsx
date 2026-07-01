import React from 'react'
import { Container } from 'react-bootstrap'

const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-1">404</h1>
      <p className="fs-4">Page not found</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </Container>
  )
}

export default NotFound
