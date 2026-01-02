import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import Sidebar from "./Sidebar";
import { Container, Row, Col, Alert } from "react-bootstrap";

const Layout = ({ children, title = "", description = "", keywords = "", author = "" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const today = new Date();
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Page metadata */}
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title ? `${title} | Trendkari` : "Trendkari"}</title>
      </Helmet>

      {/* News ticker */}
{/* <Alert
  variant="warning"
  className="py-2 mb-0 rounded-0 small fw-medium"
  style={{ whiteSpace: "nowrap" }}
>
  <marquee behavior="scroll" direction="left" scrollamount="4">
    📍 {formattedDate} — 
    <a
      href="/city"
      className="text-dark text-decoration-none fw-semibold"
    >
      Local Updates
    </a> |  
    <a
      href="/ramganjmandi/article"
      className="text-dark text-decoration-none"
    >
      Today’s City News
    </a> | 
    <a
      href="/kota/article"
      className="text-dark text-decoration-none"
    >
      Local Jobs & Admit Cards
    </a> | 
    <a
      href="/city/kota"
      className="text-dark text-decoration-none"
    >
      Nearby Events & Alerts 🚨
    </a>
  </marquee>
</Alert> */}


      {/* Header with toggleSidebar passed down */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Sidebar (Offcanvas inside component) */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content container */}
      <Container fluid className="mt-3">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <main>
              <Toaster position="top-right" />
              {children}
            </main>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Layout;
