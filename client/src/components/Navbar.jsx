import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Navbar as NavbarBs, Nav, Button } from 'react-bootstrap'
import { Menu, X, LogOut, User } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const [expanded, setExpanded] = React.useState(false)
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <NavbarBs bg="light" expand="lg" className="navbar-custom" sticky="top">
      <Container>
        <NavbarBs.Brand as={Link} to="/" className="fw-bold">
          <span className="brand-text">🇨🇲 Cameroon Tourism</span>
        </NavbarBs.Brand>
        <NavbarBs.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />
        <NavbarBs.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/attractions">Attractions</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="text-primary">
                  Dashboard
                </Nav.Link>
                <div className="d-flex align-items-center gap-2">
                  <User size={18} />
                  <span className="text-muted">{user.name}</span>
                </div>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" size="sm">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary" size="sm">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </NavbarBs.Collapse>
      </Container>
    </NavbarBs>
  )
}

export default Navbar
