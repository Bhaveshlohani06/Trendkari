import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const ProfileMenuModal = ({ show, onHide }) => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const user = auth?.user;

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.clear();
    onHide();
    navigate("/login");
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{user?.name || "Profile"}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="d-grid gap-2">
        <Button
          variant="outline-primary"
          onClick={() => {
            onHide();
            navigate(`/dashboard/user/profile/${user._id}`);
          }}
        >
          My Profile
        </Button>

        {user?.role === "admin" && (
          <Button
            variant="outline-dark"
            onClick={() => {
              onHide();
              navigate("/dashboard/admin");
            }}
          >
            Admin Dashboard
          </Button>
        )}

        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileMenuModal;
