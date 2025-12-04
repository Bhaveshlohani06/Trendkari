import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Badge, ProgressBar, Alert } from "react-bootstrap";
import API from "../../utils/api";
import Layout from "../Layout/Layout";

// Enhanced color scheme and icons
const getWeatherConfig = (condition, temp) => {
  const configs = {
    Clear: {
      bg: "warning",
      gradient: "linear-gradient(135deg, #ffd89b, #19547b)",
      icon: "☀️",
      timeOfDay: temp > 25 ? "Sunny Day" : "Clear Night"
    },
    Clouds: {
      bg: "secondary",
      gradient: "linear-gradient(135deg, #bdc3c7, #2c3e50)",
      icon: "☁️",
      timeOfDay: "Cloudy"
    },
    Rain: {
      bg: "primary",
      gradient: "linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)",
      icon: "🌧️",
      timeOfDay: "Rainy"
    },
    Drizzle: {
      bg: "info",
      gradient: "linear-gradient(135deg, #89F7FE, #66A6FF)",
      icon: "🌦️",
      timeOfDay: "Drizzly"
    },
    Thunderstorm: {
      bg: "dark",
      gradient: "linear-gradient(135deg, #0F2027, #203A43, #2C5364)",
      icon: "⛈️",
      timeOfDay: "Stormy"
    },
    Snow: {
      bg: "light",
      gradient: "linear-gradient(135deg, #E6DADA, #274046)",
      icon: "❄️",
      timeOfDay: "Snowy"
    },
    default: {
      bg: "light",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)",
      icon: "🌈",
      timeOfDay: "Normal"
    }
  };

  return configs[condition] || configs.default;
};

// Agricultural insights based on weather
const getAgriculturalInsights = (weatherData) => {
  const { temp, condition, humidity } = weatherData;
  const insights = [];

  if (condition === "Rain" || condition === "Drizzle") {
    insights.push({
      type: "success",
      title: "🌱 Perfect for Sowing",
      message: "Ideal conditions for planting rice, maize, and vegetables. Soil moisture is optimal."
    });
    insights.push({
      type: "info", 
      title: "💧 Water Management",
      message: "No irrigation needed. Natural rainfall sufficient for crops."
    });
  }

  if (temp < 15) {
    insights.push({
      type: "warning",
      title: "🥶 Winter Crops",
      message: "Suitable for wheat, barley, and mustard. Protect sensitive plants from frost."
    });
  }

  if (temp > 30) {
    insights.push({
      type: "danger",
      title: "🌡️ Heat Alert",
      message: "Consider shade nets for delicate crops. Increase irrigation frequency."
    });
  }

  if (humidity > 80) {
    insights.push({
      type: "info",
      title: "🍄 Fungal Watch",
      message: "High humidity may cause fungal diseases. Monitor crops closely."
    });
  }

  if (condition === "Clear" && temp > 25) {
    insights.push({
      type: "success",
      title: "☀️ Harvest Ready",
      message: "Excellent weather for harvesting and drying crops."
    });
  }

  // Default insight if none match
  if (insights.length === 0) {
    insights.push({
      type: "secondary",
      title: "🌾 Normal Farming",
      message: "Continue regular farming activities. Weather conditions are stable."
    });
  }

  return insights;
};

// Fun facts based on weather
const getFunFacts = (condition, temp) => {
  const facts = {
    Rain: [
      "💧 Raindrops are not tear-shaped - they resemble hamburger buns!",
      "🌧️ The smell of rain is called 'petrichor'",
      "☔ Umbrellas were originally used for shade from the sun"
    ],
    Clouds: [
      "☁️ Clouds are made of tiny water droplets or ice crystals",
      "📊 Meteorologists classify clouds into 10 basic types",
      "⚡ The average cumulus cloud weighs about 1.1 million pounds!"
    ],
    Clear: [
      "☀️ Sunlight takes 8 minutes to reach Earth",
      "🌈 The sky is blue due to Rayleigh scattering",
      "🌡️ Temperature can drop significantly at night with clear skies"
    ],
    Thunderstorm: [
      "⚡ Lightning strikes the Earth about 100 times per second",
      "🌩️ Thunderstorms help regulate the Earth's electrical balance",
      "🌀 The largest thunderstorms can be over 10 miles high"
    ],
    Snow: [
      "❄️ No two snowflakes are exactly alike",
      "🌨️ Snow is actually colorless and translucent",
      "🏔️ Snow reflects up to 90% of sunlight"
    ]
  };

  const conditionFacts = facts[condition] || [
    "🌍 Weather affects our daily lives in countless ways",
    "📡 Modern weather forecasting uses supercomputers and satellites",
    "🔬 Meteorology is the scientific study of weather"
  ];

  return conditionFacts[Math.floor(Math.random() * conditionFacts.length)];
};

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [defaultLoaded, setDefaultLoaded] = useState(false);

  // Load default city on component mount
  useEffect(() => {
    const loadDefaultCity = async () => {
      if (!defaultLoaded) {
        setLoading(true);
        try {
          const { data } = await API.get(`/weather/?city=Ramganj Mandi`);
          setWeatherData([data]);
          setDefaultLoaded(true);
        } catch (err) {
          console.error("Error loading default city:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDefaultCity();
  }, [defaultLoaded]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    try {
      const { data } = await API.get(`/weather/?city=${city}`);
      // Check if city already exists
      if (!weatherData.some(w => w.city.toLowerCase() === data.city.toLowerCase())) {
        setWeatherData((prev) => [...prev, data]);
      } else {
        alert(`Weather data for ${data.city} is already displayed.`);
      }
      setCity("");
    } catch (err) {
      alert("City not found or error fetching data. Please check the city name and try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeCity = (cityToRemove) => {
    setWeatherData(prev => prev.filter(w => w.city !== cityToRemove));
  };

  const getTemperatureVariant = (temp) => {
    if (temp < 10) return "info";
    if (temp < 20) return "success";
    if (temp < 30) return "warning";
    return "danger";
  };

  const getUvIndex = (temp, condition) => {
    if (condition === "Clear") {
      if (temp > 30) return { level: "Very High", value: 9, variant: "danger" };
      if (temp > 25) return { level: "High", value: 7, variant: "warning" };
      return { level: "Moderate", value: 5, variant: "info" };
    }
    if (condition === "Clouds") return { level: "Low", value: 3, variant: "success" };
    return { level: "Very Low", value: 1, variant: "secondary" };
  };

  return (
    <Layout>
    <Container className="py-4 bg-light min-vh-100">
      {/* Header Section */}

      {/* Search Section */}
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body className="py-3">
          <Form onSubmit={handleSearch}>
            <Row className="g-2 align-items-center">
              <Col md={8} lg={9}>
                <Form.Control
                  type="text"
                  placeholder="Enter city name to compare with Ramganj Mandi..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border-0 shadow-sm"
                  size="lg"
                />
              </Col>
              <Col md={4} lg={3}>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading || !city.trim()} 
                  className="w-100"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Loading...
                    </>
                  ) : (
                    "Add City"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Weather Cards */}
      <Row className="g-4">
        {weatherData.map((w, index) => {
          const config = getWeatherConfig(w.condition, w.temp);
          const insights = getAgriculturalInsights(w);
          const funFact = getFunFacts(w.condition, w.temp);
          const uvIndex = getUvIndex(w.temp, w.condition);

          return (
            <Col key={`${w.city}-${index}`} xs={12} md={6} lg={4}>
              <Card 
                className="shadow-lg border-0 weather-card h-100"
                style={{ 
                  background: config.gradient,
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Card.Body className="text-white position-relative">
                  {/* Header with city and remove button */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4 className="fw-bold mb-1">{w.city}</h4>
                      <Badge bg="light" text="dark" className="mb-2">
                        {config.timeOfDay}
                      </Badge>
                    </div>
                    {w.city !== "Ramganj Mandi" && (
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="rounded-circle"
                        onClick={() => removeCity(w.city)}
                        style={{ width: '30px', height: '30px' }}
                      >
                        ×
                      </Button>
                    )}
                  </div>

                  {/* Main weather info */}
                  <div className="text-center my-4">
                    <div className="display-1 fw-bold">{Math.round(w.temp)}°C</div>
                    <div className="h3 mb-2">
                      {config.icon} {w.condition}
                    </div>
                    <div className="text-white-50">
                      Feels like {Math.round(w.feelsLike)}°C
                    </div>
                  </div>

                  {/* Weather details grid */}
                  <Row className="g-2 mb-3">
                    <Col xs={6}>
                      <div className="text-center p-2 bg-white bg-opacity-25 rounded">
                        <div>💧 Humidity</div>
                        <strong>{w.humidity}%</strong>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="text-center p-2 bg-white bg-opacity-25 rounded">
                        <div>💨 Wind</div>
                        <strong>{w.windSpeed} m/s</strong>
                      </div>
                    </Col>
                  </Row>

                  {/* UV Index */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>UV Index: {uvIndex.level}</small>
                      <small>{uvIndex.value}/10</small>
                    </div>
                    <ProgressBar 
                      variant={uvIndex.variant} 
                      now={uvIndex.value * 10} 
                      className="bg-white bg-opacity-25"
                    />
                  </div>

                  {/* Agricultural Insights */}
                  <div className="mb-3">
                    <h6 className="mb-2">🌾 Agricultural Insights</h6>
                    {insights.map((insight, i) => (
                      <Alert key={i} variant={insight.type} className="py-2 mb-2 small">
                        <strong>{insight.title}:</strong> {insight.message}
                      </Alert>
                    ))}
                  </div>

                  {/* Fun Fact */}
                  <div className="bg-white bg-opacity-25 rounded p-2 small">
                    <strong>💡 Did you know?</strong> {funFact}
                  </div>

                  {/* Last updated */}
                  <div className="text-center mt-3">
                    <small className="text-white-50">
                      Updated: {new Date(w.updatedAt).toLocaleTimeString()}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Empty State */}
      {weatherData.length === 0 && !loading && (
        <Card className="text-center py-5 border-0">
          <Card.Body>
            <div className="display-1 text-muted mb-3">🌤️</div>
            <h5 className="text-muted">No weather data available</h5>
            <p className="text-muted">Start by adding a city to compare weather conditions</p>
          </Card.Body>
        </Card>
      )}

      {/* Footer */}
 
    </Container>
      </Layout>
  );
};

export default WeatherDashboard;