import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaGoogle, FaEnvelope, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const JoinModal = ({ show, onHide }) => {
  const BACKEND_URL = "https://trendkari.onrender.com/api/v1";

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Body className="text-center p-5 position-relative rounded">
        <button 
          onClick={onHide}
          className="position-absolute top-0 end-0 m-3 bg-transparent border-0"
          aria-label="Close"
        >
          <FaTimes className="text-muted" />
        </button>

        <h4 className="mb-4 fw-semibold">Join TrendKari.</h4>

        <Button onClick={handleGoogleLogin} variant="outline-dark" className="w-100 mb-3 rounded-pill d-flex align-items-center justify-content-center gap-2">
          <FaGoogle /> Sign up with Google
        </Button>

        <Link to="/register" className="btn btn-outline-dark w-100 mb-4 rounded-pill d-flex align-items-center justify-content-center gap-2 text-decoration-none text-dark">
          <FaEnvelope /> Sign up with Email
        </Link>

        <p className="mb-1">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <p className="small text-muted mt-3">
          Click "Sign up" to agree to TrendKari's <Link to="/terms">Terms of Service</Link> and acknowledge our <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default JoinModal;
