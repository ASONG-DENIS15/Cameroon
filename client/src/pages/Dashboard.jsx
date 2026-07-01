import React from 'react'
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { adminService } from '../services/adminService'
import toast from 'react-hot-toast'
import './Dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = React.useState(null)
  const [topAttractions, setTopAttractions] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const user = JSON.parse(localStorage.getItem('user'))

  React.useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied')
      window.location.href = '/'
      return
    }
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsResponse, attractionsResponse] = await Promise.all([
        adminService.getDashboardStatistics(),
        adminService.getTopAttractions()
      ])
      setStats(statsResponse.data)
      setTopAttractions(attractionsResponse.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  return (
    <Container className="dashboard-page py-5">
      <h1 className="mb-4">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <Row className="mb-4 g-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <h6 className="text-muted">Total Users</h6>
              <h2>{stats?.totalUsers || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <h6 className="text-muted">Total Bookings</h6>
              <h2>{stats?.totalBookings || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <h6 className="text-muted">Confirmed</h6>
              <h2>{stats?.confirmedBookings || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <h6 className="text-muted">Total Revenue</h6>
              <h2>XAF {(stats?.totalRevenue || 0).toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">Top Attractions</Card.Title>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topAttractions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="booking_count" fill="#009639" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">Quick Actions</Card.Title>
            </Card.Header>
            <Card.Body>
              <Button variant="primary" className="w-100 mb-2">Manage Bookings</Button>
              <Button variant="secondary" className="w-100 mb-2">Add Attraction</Button>
              <Button variant="info" className="w-100">View Reports</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
