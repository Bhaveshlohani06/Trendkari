import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import Layout from "../../Layout/Layout";
import API from "../../../utils/api";

const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [postId, setPostId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    tags: "",
    status: "draft",
    isFeatured: false,
    image: null,
  });
  const [previewImage, setPreviewImage] = useState("");

  // Fetch all categories
  const getAllCategories = async () => {
    try {
      const { data } = await API.get("/category/categories");
      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while loading categories");
    }
  };

  // Fetch single post by slug
  const fetchPost = async () => {
    try {
      const { data } = await API.get(`/post/get-post/${slug}`);
      console.log("Fetched Post Data:", data);

      if (data?.success && data.post) {
        const post = data.post;
        setPostId(post._id); // Store ID for update

        setFormData({
          title: post.title || "",
          description: post.description || "",
          content: post.content || "",
          category: post.category?._id || "",
          tags: post.tags?.join(", ") || "",
          status: post.status || "draft",
          isFeatured: post.isFeatured || false,
          image: null,
        });

        setPreviewImage(post.image || "");
      } else {
        toast.error("Post not found");
      }
    } catch (err) {
      console.error("Error fetching post:", err);
      toast.error("Error fetching post");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postId) {
      toast.error("Post ID not found");
      return;
    }

    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formPayload.append(key, formData[key]);
        }
      });

      const { data } = await API.put(
        `/post/${postId}`,
        formPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data?.success) {
        toast.success("Post updated successfully!");
        navigate(`/blog/${slug}`);
      } else {
        toast.error(data?.message || "Failed to update post");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating post");
    }
  };

  useEffect(() => {
    getAllCategories();
    fetchPost();
  }, [slug]);

  return (
    <Layout>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-4">Edit Post</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={2}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={6}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tags (comma separated)</Form.Label>
                    <Form.Control
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                    />
                  </Form.Group>

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

                  <Form.Group className="mb-3" controlId="isFeatured">
                    <Form.Check
                      type="checkbox"
                      label="Feature this post"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mt-3 img-fluid rounded"
                        style={{ maxHeight: "200px" }}
                      />
                    )}
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Update Post
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
