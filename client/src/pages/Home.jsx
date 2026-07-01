import React from 'react'
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { Star, MapPin, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { attractionService } from '../services/attractionService'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()
  const [featured, setFeatured] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    loadFeatured()
  }, [])

  const loadFeatured = async () => {
    try {
      const response = await attractionService.getFeaturedAttractions()
      setFeatured(response.data)
    } catch (error) {
      console.error('Failed to load featured attractions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <Container className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">Welcome to Cameroon Tourism</h1>
            <p className="hero-subtitle">Africa in Miniature - Discover the Beauty of Cameroon</p>
            <Button
              size="lg"
              className="btn-primary mt-4"
              onClick={() => navigate('/attractions')}
            >
              Explore Now
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* Featured Attractions */}
      <section className="featured-section py-5">
        <Container>
          <h2 className="section-title">Featured Attractions</h2>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Row className="g-4">
              {featured.map((attraction, index) => (
                <Col md={6} lg={4} key={attraction.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="attraction-card">
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
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="badge bg-warning">
                            <Star size={14} /> {attraction.average_rating || 'N/A'}
                          </span>
                          <span className="text-primary fw-bold">XAF {attraction.entry_fee}</span>
                        </div>
                        <Button
                          variant="primary"
                          className="w-100"
                          onClick={() => navigate(`/attractions/${attraction.id}`)}
                        >
                          View Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-primary text-white">
        <Container>
          <Row className="text-center">
            <Col md={4}>
              <h3 className="display-5">30+</h3>
              <p>Attractions</p>
            </Col>
            <Col md={4}>
              <h3 className="display-5">10+</h3>
              <p>Regions</p>
            </Col>
            <Col md={4}>
              <h3 className="display-5">1000+</h3>
              <p>Happy Visitors</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}

export default Home
