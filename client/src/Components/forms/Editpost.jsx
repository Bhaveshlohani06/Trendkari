import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { BsXCircle } from "react-icons/bs";
import { toast } from "react-toastify";
import Layout from "../../Layout/Layout";
import API from "../../../utils/api";

const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const auth = JSON.parse(localStorage.getItem("auth"));
  const isAdmin = auth?.user?.role === "admin";

  const [categories, setCategories] = useState([]);
  const [postId, setPostId] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    tags: "",
    language: "",
    location: "",
    status: "draft",
    isFeatured: false,
    image: null,
  });

  /* ================= FETCH CATEGORIES ================= */
  const getAllCategories = async () => {
    try {
      const { data } = await API.get("/category/categories");
      if (data?.success) setCategories(data.categories);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  /* ================= FETCH POST ================= */
  const fetchPost = async () => {
    try {
      const { data } = await API.get(`/post/get-post/${slug}`);

      if (!data?.success) return toast.error("Post not found");

      const post = data.post;

      setPostId(post._id);

      setFormData({
        title: post.title || "",
        description: post.description || "",
        content: post.content || "",
        category: post.category?._id || "",
        tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
        language: post.language || "",
        location: post.location || "",
        status: post.status || "draft",
        isFeatured: post.isFeatured || false,
        image: null,
      });

      setPreviewImage(post.image || "");
    } catch {
      toast.error("Error fetching post");
    }
  };

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
      setPreviewImage(files[0] ? URL.createObjectURL(files[0]) : "");
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postId) return toast.error("Post ID missing");

    setLoading(true);

    try {
      const payload = new FormData();

      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("content", formData.content);
      payload.append("category", formData.category);
      payload.append("language", formData.language);
      payload.append("location", formData.location);

      if (formData.tags) {
        payload.append(
          "tags",
          JSON.stringify(
            formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          )
        );
      }

      // 🔒 ADMIN ONLY
      if (isAdmin) {
        payload.append("status", formData.status);
        payload.append("isFeatured", formData.isFeatured);
      }

      if (formData.image) {
        payload.append("image", formData.image);
      }

      const { data } = await API.put(
        `/post/update-post/${postId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.success) {
        toast.success("Post updated successfully");
        navigate(`/${post.location}/article/${data.post.slug}`);
      } else {
        toast.error(data?.message || "Update failed");
      }
    } catch {
      toast.error("Error updating post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
    fetchPost();
  }, [slug]);

  /* ================= UI ================= */
  return (
    <Layout>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Edit Post</Card.Title>

                <Form onSubmit={handleSubmit}>
                  {/* TITLE */}
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* DESCRIPTION */}
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {/* CONTENT */}
                  <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={8}
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="यहाँ अपनी बात लिखें..."
                      required
                    />
                  </Form.Group>

                  {/* CATEGORY */}
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* LANGUAGE */}
                  <Form.Group className="mb-3">
                    <Form.Label>Language</Form.Label>
                    <Form.Select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="hi">Hindi</option>
                      <option value="en">English</option>
                    </Form.Select>
                  </Form.Group>

                  {/* LOCATION */}
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Kota"
                      required
                    />
                  </Form.Group>

                  {/* TAGS */}
                  <Form.Group className="mb-3">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="news, local, update"
                    />
                  </Form.Group>

                  {/* ADMIN ONLY */}
                  {isAdmin && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Check
                        className="mb-3"
                        type="checkbox"
                        label="Feature this post"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                      />
                    </>
                  )}

                  {/* IMAGE */}
                  <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="preview"
                        className="img-fluid rounded mt-2"
                        style={{ maxHeight: "200px" }}
                      />
                    )}
                  </Form.Group>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Post"}
                  </Button>

                  <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => navigate(-1)}
                  >
                    <BsXCircle /> Cancel
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default EditPost;
