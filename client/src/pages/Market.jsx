import React from "react";
import Layout from "../Layout/Layout";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Market = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Container className="py-5 text-center" style={{ maxWidth: "600px" }}>
        
        <Card className="shadow-lg border-0 p-4 rounded-4">
          <div style={{ fontSize: "60px" }}>🛒</div>

          <h2 className="mt-3 fw-bold">Market</h2>

          <p className="text-muted mt-2">
            We’re working on bringing you real-time mandi prices, local deals,
            and marketplace features.
          </p>

          <h5 className="mt-3 text-warning">🚧 Coming Soon</h5>

          <Button
            variant="outline-primary"
            className="mt-4"
            onClick={() => navigate("/")}
          >
            Go Back Home
          </Button>
        </Card>

      </Container>
    </Layout>
  );
};

export default Market;