import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-custom">
      <Container>
        <Row className="py-5">
          <Col md={3} className="mb-4">
            <h5 className="footer-title">🇨🇲 Cameroon Tourism</h5>
            <p className="text-muted">Discover Africa in Miniature with our platform featuring 30+ attractions across all regions.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </Col>

          <Col md={3} className="mb-4">
            <h6 className="footer-title">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/attractions">Attractions</a></li>
              <li><a href="/">Home</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </Col>

          <Col md={3} className="mb-4">
            <h6 className="footer-title">Information</h6>
            <ul className="list-unstyled">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#help">Help Center</a></li>
            </ul>
          </Col>

          <Col md={3} className="mb-4">
            <h6 className="footer-title">Contact Us</h6>
            <div className="contact-info">
              <p><Mail size={16} /> info@cameroon-tourism.com</p>
              <p><Phone size={16} /> +237 123 456 789</p>
              <p><MapPin size={16} /> Yaoundé, Cameroon</p>
            </div>
          </Col>
        </Row>

        <Row className="border-top pt-4">
          <Col md={6}>
            <p className="text-muted">&copy; {currentYear} Cameroon Tourism. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-end">
            <p className="text-muted">Made with ❤️ for Cameroon</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
