// import React, { useEffect, useState } from "react";
// import { Form, Button, Container, Row, Col, Card, Spinner } from "react-bootstrap";
// import { BsXCircle } from "react-icons/bs";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import Layout from "../../Layout/Layout";
// import API from "../../../utils/api";

// const EditProfile = () => {
//   const navigate = useNavigate();
//   const { userId } = useParams(); // ✅ get userId from URL /user/:id
//   const token = localStorage.getItem("token");

//   const [loading, setLoading] = useState(false);
//   const [previewAvatar, setPreviewAvatar] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
//     bio: "",
//     language: "english",
//     tone: "friendly",
//     categories: "general",
//     wordCount: 350,
//     timezone: "Asia/Kolkata",
//     frequency: "daily",
//     dob: "",
//     avatar: null,
//   });

//   // ✅ Fetch current user profile
//   const fetchProfile = async () => {
//   try {
//     const { data } = await API.get(`/auth/user/${userId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const user = data.user; 

//     if (user) {
//       setFormData({
//         name: user.name || "",
//         bio: user.bio || "",
//         language: user.preferences?.language || "english",
//         tone: user.preferences?.tone || "friendly",
//         categories: user.preferences?.categories?.join(", ") || "general",
//         wordCount: user.preferences?.wordCount || 350,
//         timezone: user.preferences?.timezone || "Asia/Kolkata",
//         frequency: user.preferences?.frequency || "daily",
//         dob: user.preferences?.dob
//           ? new Date(user.preferences.dob).toISOString().split("T")[0]
//           : "",
//         avatar: null,
//       });
//       setPreviewAvatar(user.avatar || "");
//     }
//   } catch (error) {
//     console.error("Fetch Profile Error:", error);
//     toast.error("Failed to load profile");
//   }
// };

// useEffect(() => {
//   if (userId) fetchProfile();
// }, [userId]);

//   // ✅ Handle input changes
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "avatar") {
//       setFormData({ ...formData, avatar: files[0] });
//       setPreviewAvatar(files[0] ? URL.createObjectURL(files[0]) : "");
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // ✅ Submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = new FormData();
//       for (let key in formData) {
//         if (formData[key] !== null) payload.append(key, formData[key]);
//       }

//       const { data } = await API.put(`/auth/update-profile/${userId}`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (data.success) {
//         toast.success("Profile updated successfully!");
//         navigate("/dashboard");
//       } else {
//         toast.error(data.message || "Update failed");
//       }
//     } catch (error) {
//       console.error("Update Profile Error:", error);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <Container className="py-4">
//         <Row className="justify-content-center">
//           <Col md={10} lg={8}>
//             <Card className="shadow-sm">
//               <Card.Body>
//                 <Card.Title className="mb-4">Update Profile</Card.Title>
//                 <Form onSubmit={handleSubmit}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Bio</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       name="bio"
//                       value={formData.bio}
//                       onChange={handleChange}
//                       rows={3}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Date of Birth</Form.Label>
//                     <Form.Control
//                       type="date"
//                       name="dob"
//                       value={formData.dob}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Language</Form.Label>
//                     <Form.Select
//                       name="language"
//                       value={formData.language}
//                       onChange={handleChange}
//                     >
//                       <option value="english">English</option>
//                       <option value="hindi">Hindi</option>
//                     </Form.Select>
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Profile Picture</Form.Label>
//                     <Form.Control
//                       type="file"
//                       name="avatar"
//                       accept="image/*"
//                       onChange={handleChange}
//                     />
//                     {previewAvatar && (
//                       <img
//                         src={previewAvatar}
//                         alt="Preview"
//                         className="mt-3 img-fluid rounded"
//                         style={{ maxHeight: "150px" }}
//                       />
//                     )}
//                   </Form.Group>

//                   <div className="d-flex gap-2">
//                     <Button variant="primary" type="submit" disabled={loading}>
//                       {loading ? <Spinner size="sm" /> : "Update Profile"}
//                     </Button>

//                     <Button
//                       variant="secondary"
//                       onClick={() => navigate(-1)}
//                       className="d-flex align-items-center"
//                     >
//                       <BsXCircle className="me-2" />
//                       Cancel
//                     </Button>
//                   </div>
//                 </Form>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </Layout>
//   );
// };

// export default EditProfile;






import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { toast } from "react-toastify";
import Layout from "../../Layout/Layout";
import API from "../../../utils/api";

const categoryOptions = ["general", "tech", "business", "sports", "local", "politics"];

const EditProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [email, setEmail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: null,
    preferences: {
      language: "english",
      tone: "friendly",
      categories: [],
      wordCount: 350,
      timezone: "Asia/Kolkata",
      frequency: "daily",
      dob: "",
      zodiacSign: "",
    },
  });

  /** ---------------- Fetch Profile ---------------- */
  const fetchProfile = async () => {
    try {
      const { data } = await API.get(`/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = data.user;
      setEmail(user.email);

      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        avatar: null,
        preferences: {
          language: user.preferences?.language,
          tone: user.preferences?.tone,
          categories: user.preferences?.categories || [],
          wordCount: user.preferences?.wordCount,
          timezone: user.preferences?.timezone,
          frequency: user.preferences?.frequency,
          dob: user.preferences?.dob
            ? user.preferences.dob.split("T")[0]
            : "",
          zodiacSign: user.preferences?.zodiacSign || "",
        },
      });

      setPreviewAvatar(user.avatar || "");
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  /** ---------------- Handlers ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      preferences: { ...formData.preferences, [name]: value },
    });
  };

  const handleCategoryToggle = (category) => {
    const exists = formData.preferences.categories.includes(category);
    const updated = exists
      ? formData.preferences.categories.filter((c) => c !== category)
      : [...formData.preferences.categories, category];

    setFormData({
      ...formData,
      preferences: { ...formData.preferences, categories: updated },
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avatar: file });
    setPreviewAvatar(URL.createObjectURL(file));
  };

  /** ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("bio", formData.bio);
      payload.append("preferences", JSON.stringify(formData.preferences));
      if (formData.avatar) payload.append("avatar", formData.avatar);

      const { data } = await API.put(
        `/auth/update-profile/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Profile updated");
        navigate("/dashboard");
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /** ---------------- UI ---------------- */
  return (
    <Layout>
      <Container className="py-4">
        <Button variant="link" onClick={() => navigate(-1)}>
          <BsArrowLeft /> Back
        </Button>

        <Card className="shadow-sm mt-3">
          <Card.Body>
            <Row className="align-items-center mb-4">
              <Col md={3} className="text-center">
                <img
                  src={previewAvatar || "/avatar.png"}
                  alt="avatar"
                  className="rounded-circle mb-2"
                  style={{ width: 120, height: 120, objectFit: "cover" }}
                />
                <Form.Control type="file" onChange={handleAvatarChange} />
              </Col>

              <Col md={9}>
                <h4>{formData.name}</h4>
                <p className="text-muted">{email}</p>
              </Col>
            </Row>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      value={formData.name}
                      onChange={handleChange}
                      name="name"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.preferences.dob}
                      onChange={handlePreferenceChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </Form.Group>

              <hr />

              <h6 className="mb-3">Content Preferences</h6>

              <div className="mb-3">
                {categoryOptions.map((cat) => (
                  <Badge
                    key={cat}
                    pill
                    bg={
                      formData.preferences.categories.includes(cat)
                        ? "primary"
                        : "secondary"
                    }
                    className="me-2 cursor-pointer"
                    onClick={() => handleCategoryToggle(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Word Count: {formData.preferences.wordCount}</Form.Label>
                <Form.Range
                  min={100}
                  max={1000}
                  step={50}
                  name="wordCount"
                  value={formData.preferences.wordCount}
                  onChange={handlePreferenceChange}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Save Changes"}
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

export default EditProfile;
