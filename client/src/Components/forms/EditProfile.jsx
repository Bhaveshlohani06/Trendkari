import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { BsXCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../Layout/Layout";
import API from "../../../utils/api";

const EditProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // ✅ get userId from URL /user/:id
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    language: "english",
    tone: "friendly",
    categories: "general",
    wordCount: 350,
    timezone: "Asia/Kolkata",
    frequency: "daily",
    dob: "",
    avatar: null,
  });

  // ✅ Fetch current user profile
  const fetchProfile = async () => {
  try {
    const { data } = await API.get(`/auth/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = data.user; 

    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        language: user.preferences?.language || "english",
        tone: user.preferences?.tone || "friendly",
        categories: user.preferences?.categories?.join(", ") || "general",
        wordCount: user.preferences?.wordCount || 350,
        timezone: user.preferences?.timezone || "Asia/Kolkata",
        frequency: user.preferences?.frequency || "daily",
        dob: user.preferences?.dob
          ? new Date(user.preferences.dob).toISOString().split("T")[0]
          : "",
        avatar: null,
      });
      setPreviewAvatar(user.avatar || "");
    }
  } catch (error) {
    console.error("Fetch Profile Error:", error);
    toast.error("Failed to load profile");
  }
};

useEffect(() => {
  if (userId) fetchProfile();
}, [userId]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
      setPreviewAvatar(files[0] ? URL.createObjectURL(files[0]) : "");
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      for (let key in formData) {
        if (formData[key] !== null) payload.append(key, formData[key]);
      }

      const { data } = await API.put(`/auth/update-profile/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Profile updated successfully!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update Profile Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-4">Edit Profile</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Language</Form.Label>
                    <Form.Select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    {previewAvatar && (
                      <img
                        src={previewAvatar}
                        alt="Preview"
                        className="mt-3 img-fluid rounded"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? <Spinner size="sm" /> : "Update Profile"}
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => navigate(-1)}
                      className="d-flex align-items-center"
                    >
                      <BsXCircle className="me-2" />
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default EditProfile;
