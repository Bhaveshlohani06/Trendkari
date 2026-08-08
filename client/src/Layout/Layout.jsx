import React, { useState, useEffect } from "react";
import { useLocation as useRouterLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { Container, Row, Col } from "react-bootstrap";

import { shouldShowWhatsappPopup } from "../Components/HelperFunction";
import WhatsappPopup from "../Components/WhatsappPopup";
import StickyFooterNav from "./StickyFooternav";

const Layout = ({
  children,
  title = "",
  description = "",
  keywords = "",
  author = ""
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWhatsappPopup, setShowWhatsappPopup] = useState(false);
    const [location, setLocation] = useState(
    localStorage.getItem("preferredLocation") || "kota"
  );

  // The swipe feed wants to be an edge-to-edge app screen, not a
  // centered/padded website column. Every other page keeps the
  // existing Bootstrap Container/Row/Col behavior untouched.
  const routerLocation = useRouterLocation();
  const isFeedRoute = routerLocation.pathname.startsWith("/feed");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);


  
  const handleLocationChange = (value) => {
    setLocation(value);
    localStorage.setItem("preferredLocation", value);
  };

useEffect(() => {
  if (!shouldShowWhatsappPopup()) return;

  const onScroll = () => {
    if (window.scrollY > 300) {
      setShowWhatsappPopup(true);
      window.removeEventListener("scroll", onScroll);
    }
  };

  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);


const handleClosePopup = () => {
  setShowWhatsappPopup(false);
  localStorage.setItem(
    "whatsapp_popup_last_shown",
    new Date().toISOString().split("T")[0]
  );
};


  return (
    <>
      {/* SEO Meta */}
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title ? `${title} | Trendkari` : "Trendkari"}</title>
      </Helmet>

          {/* WhatsApp Popup */}
      {showWhatsappPopup && (
        <WhatsappPopup onClose={handleClosePopup} />
      )}

      {/* Header */}
      <Header toggleSidebar={toggleSidebar}
       selectedLocation={location}
        onLocationChange={handleLocationChange}
      />



      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <Toaster position="top-right" />

      {isFeedRoute ? (
        // Full-bleed: the feed manages its own viewport height and
        // scroll snapping, so it must not be constrained by a
        // centered/padded Bootstrap column.
        <main>{children}</main>
      ) : (
        <Container fluid className="mt-3">
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <main style={{ minHeight: "70vh" }}>{children}</main>
            </Col>
          </Row>
        </Container>
      )}

      {/* Footer */}

      {/* <Footer /> */}

      

      <StickyFooterNav
  onCreatePost={() => setShowModal(true)}
  onOpenSearch={() => setShowSearchModal(true)}
/>




  
    </>
  );
};

export default Layout;
