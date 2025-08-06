// src/pages/CoverPage.jsx
import { Container, Navbar, Nav, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import JoinModal from "../Components/JoinModal";
import React, { useState } from "react";

const CoverPage = () => {
      const [showJoinModal, setShowJoinModal] = useState(false);


  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Gradient Navbar */}
      <Navbar expand="lg" className="px-4 py-3" style={{ 
        background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)'
      }}>
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-3 text-white">TrendKari</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 text-white" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center gap-3">
              <Link className="nav-link text-white" to="/about">Our Story</Link>
              <Link className="nav-link text-white" to="/write">Write</Link>
              <Link className="nav-link text-white" to="/login">Sign in</Link>
              <Link >
                <Button variant="light" className="rounded-pill px-4 fw-medium" onClick={() => setShowJoinModal(true)}>Get started</Button>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Hero Section */}
      <section className="flex-grow-1 d-flex align-items-center py-5">
        <Container className="text-center py-5">
          <Row className="justify-content-center">
            <Col lg={8} xl={7}>
              <h1 className="display-4 fw-bold mb-4" style={{ lineHeight: '1.2' }}>
                Where <span className="text-primary">ideas</span> flourish and <span className="text-primary">stories</span> inspire
              </h1>
              <p className="lead text-muted mb-5 fs-4">
                Join a community of thinkers, writers, and curious minds. Share your perspective or discover something new.
              </p>
              <Link>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="px-5 py-3 fw-bold rounded-pill shadow"
                  onClick={() => setShowJoinModal(true)}
                  style={{
                    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                    border: 'none'
                  }}
                >
                  Start Exploring
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
            <JoinModal show={showJoinModal} onHide={() => setShowJoinModal(false)} />


      {/* Featured Content Preview */}
      {/* <section className="py-5 bg-light">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <div className="p-4 bg-white rounded-3 shadow-sm h-100">
                <h3 className="h5 fw-bold">Thought-provoking</h3>
                <p className="text-muted">Discover articles that challenge conventional thinking</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-4 bg-white rounded-3 shadow-sm h-100">
                <h3 className="h5 fw-bold">Expert Insights</h3>
                <p className="text-muted">Learn from industry leaders and specialists</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-4 bg-white rounded-3 shadow-sm h-100">
                <h3 className="h5 fw-bold">Diverse Perspectives</h3>
                <p className="text-muted">Explore viewpoints from around the world</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section> */}

      {/* Footer */}
      {/* Compact One-Line Footer */}
<footer className="bg-light text-white py-3">
  <Container>
    <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 gap-md-4">
      <small className="text-muted">© {new Date().getFullYear()} TrendKari</small>
      <Link to="/about" className="text-muted text-light small">About</Link>
      <Link to="/help" className="text-muted small">Help</Link>
      <Link to="/privacy" className="text-muted small">Privacy</Link>
      <Link to="/terms" className="text-muted small">Terms</Link>
      <div className="d-flex gap-3 ms-md-3">
        <a href="#" className="text-muted"><i className="bi bi-twitter"></i></a>
        <a href="#" className="text-muted"><i className="bi bi-instagram"></i></a>
        <a href="#" className="text-muted"><i className="bi bi-facebook"></i></a>
      </div>
    </div>
  </Container>
</footer>
    </div>
  );
};

export default CoverPage;   