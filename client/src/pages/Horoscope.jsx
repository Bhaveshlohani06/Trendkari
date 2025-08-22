import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import Layout from "../Layout/Layout";
import { Container, Row, Col, Card, Badge, Alert } from 'react-bootstrap';


const DailyHoroscope = () => {
  const [user, setUser] = useState(null);
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!u || !token) {
      setLoading(false);
      return;
    }

    setUser(u);
    fetchHoroscope(token);
  }, []);

  const fetchHoroscope = async (token) => {
    setLoading(true);
    try {
      const res = await API.get("/horoscope/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHoroscope(res.data);
    } catch (err) {
      console.error("Error fetching horoscope:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading your horoscope...</p>;
  if (!horoscope) return <p className="text-center mt-5">No horoscope found for today.</p>;

  return (
    <Layout>

<div className="min-vh-100 bg-light">
  <Container className="py-5">
    {/* Header Section */}
    <Row className="mb-4">
      <Col>
        <div className="d-flex align-items-center mb-3">
          <h1 className="display-5 fw-bold text-primary me-3">Hello, {user?.name || "Friend"}</h1>
          <i className="fas fa-star text-warning fs-2"></i>
        </div>
        
        <div className="d-flex flex-wrap align-items-center text-muted">
          <span className="d-flex align-items-center me-4 mb-2">
            <i className="fas fa-moon me-2"></i>
            <span>Zodiac: {horoscope.zodiac?.english || user?.zodiacSign || "—"}</span>
          </span>
          <span className="d-flex align-items-center me-4 mb-2">
            <i className="fas fa-calendar me-2"></i>
            <span>{new Date(horoscope.generatedAt).toLocaleDateString()}</span>
          </span>
        </div>
      </Col>
    </Row>

    {/* Main Horoscope Card */}
    <Row>
      <Col>
        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
          <Card.Header className="bg-gradient-primary text-white py-4 border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="h1 fw-bold mb-0 text-dark">{horoscope.title}</h2>
              <i className="fas fa-globe-asia fs-1 opacity-75"></i>
            </div>
          </Card.Header>
          
          <Card.Body className="p-4 p-md-5">
            {/* Summary Section */}
            <Alert variant="light" className="border-0 rounded-3 bg-light-blue">
              <h5 className="d-flex align-items-center mb-3">
                <i className="fas fa-file-alt text-primary me-2"></i>
                Daily Summary
              </h5>
              
              <p className="lead text-dark mb-3">
                {horoscope.summary?.english}
              </p>
              
              {horoscope.summary?.hindi && (
                <p className="text-dark mb-0 font-devanagari fs-5">
                  {horoscope.summary.hindi}
                </p>
              )}
            </Alert>

            {/* Sections */}
            {horoscope.sections?.map((sec, idx) => (
              <div key={idx} className="mb-4 pb-4 border-bottom">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary p-2 rounded-circle me-3">
                    <i className={`fas fa-${idx % 2 === 0 ? 'heart' : 'star'} text-white`}></i>
                  </div>
                  <h3 className="h4 fw-bold text-dark mb-0">{sec.heading}</h3>
                </div>
                
                <Row>
                  <Col md={6}>
                    <p className="text-muted mb-3 mb-md-0">{sec.text?.english}</p>
                  </Col>
                  {sec.text?.hindi && (
                    <Col md={6}>
                      <p className="text-muted mb-0 font-devanagari">{sec.text.hindi}</p>
                    </Col>
                  )}
                </Row>
              </div>
            ))}

            {/* Lucky Details */}
            {horoscope.lucky && (
              <Card className="border-0 bg-light-warning mt-4">
                <Card.Body className="p-4">
                  <h4 className="d-flex align-items-center mb-3">
                    <i className="fas fa-clover text-success me-2"></i>
                    Your Lucky Elements
                  </h4>
                  
                  <Row>
                    <Col sm={6} className="mb-3 mb-sm-0">
                      <div className="d-flex align-items-center">
                        {/* <div className="bg-white shadow-sm rounded-3 p-3 me-3">
                          <i className="fas fa-palette text-primary fs-4"></i>
                        </div> */}
                        <div>
                          <h6 className="text-muted mb-0">Lucky Color</h6>
                          <p className="fw-bold text-dark mb-0">{horoscope.lucky.color}</p>
                        </div>
                      </div>
                    </Col>
                    
                    <Col sm={6}>
                      <div className="d-flex align-items-center">
                        <div className="bg-white shadow-sm rounded-3 p-3 me-3">
                          <i className="fas fa-hashtag text-info fs-4"></i>
                        </div>
                        <div>
                          <h6 className="text-muted mb-0">Lucky Number</h6>
                          <p className="fw-bold text-dark mb-0">{horoscope.lucky.number}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* Tags */}
            {horoscope.tags?.length > 0 && (
              <div className="mt-4 pt-3">
                <h5 className="d-flex align-items-center mb-3">
                  <i className="fas fa-tags text-secondary me-2"></i>
                  Related Topics
                </h5>
                
                <div className="d-flex flex-wrap gap-2">
                  {horoscope.tags.map((tag, i) => (
                    <Badge 
                      key={i}
                      bg="outline-primary" 
                      className="px-3 py-2 rounded-pill text-primary bg-light"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
</div>
    </Layout>
  );
};

export default DailyHoroscope;
