// src/components/JoinModal.jsx
import { Modal, Button } from "react-bootstrap";
import { FaGoogle, FaFacebookF, FaEnvelope, FaTimes } from "react-icons/fa";

const JoinModal = ({ show, onHide }) => {
    


  const handleGoogleLogin = async (response) => {
    try {
      // Optional: decode to preview user info (not mandatory)
      const decoded = jwt_decode(response.credential);
      console.log("Google user", decoded);

      // Send credential token to backend
      const res = await axios.post("/auth/google-login", {
        token: response.credential,
      });

      // Save to localStorage & context
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setAuth({
          token: res.data.token,
          user: res.data.user,
        });

        navigate("/"); // ✅ Redirect after login
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Body className="text-center p-5 position-relative rounded">
        {/* Close Button */}
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

        <Button variant="outline-dark" className="w-100 mb-3 rounded-pill d-flex align-items-center justify-content-center gap-2">
          <FaFacebookF /> Sign up with Facebook
        </Button>

        <Button variant="outline-dark" className="w-100 mb-4 rounded-pill d-flex align-items-center justify-content-center gap-2">
          <FaEnvelope /> Sign up with Email
        </Button>

        <p className="mb-1">
          Already have an account? <a href="/login">Sign in</a>
        </p>

        <p className="small text-muted mt-3">
          Click "Sign up" to agree to TrendKari's <a href="/terms">Terms of Service</a> and acknowledge our <a href="/privacy">Privacy Policy</a>.
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default JoinModal;