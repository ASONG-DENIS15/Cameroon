import React from 'react'
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap'
import { MapPin, Star, DollarSign, Clock } from 'lucide-react'
import { attractionService } from '../services/attractionService'
import { regionService } from '../services/regionService'
import './Attractions.css'

const Attractions = () => {
  const [attractions, setAttractions] = React.useState([])
  const [regions, setRegions] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [filters, setFilters] = React.useState({})
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    loadRegions()
    loadAttractions()
  }, [])

  React.useEffect(() => {
    loadAttractions()
  }, [filters, page])

  const loadRegions = async () => {
    try {
      const response = await regionService.getAllRegions()
      setRegions(response.data)
    } catch (error) {
      console.error('Failed to load regions:', error)
    }
  }

  const loadAttractions = async () => {
    setLoading(true)
    try {
      const response = await attractionService.getAllAttractions(page, 9, filters)
      setAttractions(response.data)
    } catch (error) {
      console.error('Failed to load attractions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value || undefined
    }))
    setPage(1)
  }

  return (
    <Container className="attractions-page py-5">
      <h1 className="mb-4">Explore Attractions</h1>

      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Region</Form.Label>
            <Form.Select name="region_id" onChange={handleFilterChange}>
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select name="category" onChange={handleFilterChange}>
              <option value="">All Categories</option>
              <option value="natural">Natural</option>
              <option value="cultural">Cultural</option>
              <option value="historical">Historical</option>
              <option value="adventure">Adventure</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Min Price (XAF)</Form.Label>
            <Form.Control type="number" name="min_price" onChange={handleFilterChange} />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Max Price (XAF)</Form.Label>
            <Form.Control type="number" name="max_price" onChange={handleFilterChange} />
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="g-4">
          {attractions.map(attraction => (
            <Col md={6} lg={4} key={attraction.id}>
              <Card className="attraction-card h-100">
                <Card.Img
                  variant="top"
                  src={attraction.image_url || 'https://via.placeholder.com/300x200'}
                  alt={attraction.title}
                />
                <Card.Body>
                  <Card.Title>{attraction.title}</Card.Title>
                  <p className="text-muted small">
                    <MapPin size={14} /> {attraction.location}
                  </p>
                  <div className="attraction-info mb-3">
                    <span className="badge bg-warning">
                      <Star size={14} /> {attraction.average_rating || 'N/A'}
                    </span>
                    <span className="badge bg-info">{attraction.category}</span>
                  </div>
                  <p className="text-muted small">{attraction.description.substring(0, 100)}...</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-primary fw-bold">XAF {attraction.entry_fee}</span>
                    <Button variant="primary" size="sm">
                      Book Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default Attractions
