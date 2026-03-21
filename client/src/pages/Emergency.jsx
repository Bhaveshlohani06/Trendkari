import React from "react";
import Layout from "../Layout/Layout";
import { Container, Card, ListGroup, Badge } from "react-bootstrap";

const Emergency = () => {
  const contacts = [
    {
      city: "Kota",
      services: [
        {
          name: "Police Control Room",
          phone: "100",
          address: "Police Control Room, Nayapura, Kota, Rajasthan"
        },
        {
          name: "Ambulance",
          phone: "108",
          address: "Government Medical College Hospital, Kota"
        },
        {
          name: "Fire Station",
          phone: "101",
          address: "Fire Station, Talwandi, Kota"
        }
      ]
    },
    {
      city: "Ramganj Mandi",
      services: [
        {
          name: "Police Station",
          phone: "100",
          address: "Police Station, Ramganj Mandi, Kota District"
        },
        {
          name: "Ambulance",
          phone: "108",
          address: "Community Health Center, Ramganj Mandi"
        },
        {
          name: "Fire Service",
          phone: "101",
          address: "Fire Service Unit, Ramganj Mandi"
        }
      ]
    }
  ];

  return (
    <Layout>
      <Container className="py-4" style={{ maxWidth: "800px" }}>
        
        <h2 className="text-center mb-4">🚨 Emergency Contacts</h2>

        {contacts.map((cityData, index) => (
          <Card key={index} className="mb-4 shadow-sm rounded-4">
            <Card.Body>
              <h4 className="fw-bold mb-3">{cityData.city}</h4>

              <ListGroup variant="flush">
                {cityData.services.map((service, i) => (
                  <ListGroup.Item key={i} className="py-3">
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{service.name}</h6>
                        <small className="text-muted">
                          {service.address}
                        </small>
                      </div>

                      <a
                        href={`tel:${service.phone}`}
                        className="btn btn-danger btn-sm"
                      >
                        Call {service.phone}
                      </a>
                    </div>

                  </ListGroup.Item>
                ))}
              </ListGroup>

            </Card.Body>
          </Card>
        ))}

      </Container>
    </Layout>
  );
};

export default Emergency;