import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`https://your-api-url.com/api/v1/post/${id}`);
      const data = await res.json();
      if (res.ok) {
        setFormData({ title: data.post.title, content: data.post.content });
      } else {
        alert("Error fetching post");
        navigate("/");
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`https://your-api-url.com/api/v1/post/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Post updated!");
      navigate(`/blog/${id}`);
    } else {
      alert(data.message || "Error updating post");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Title"
        required
      />
      <textarea
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        placeholder="Content"
        rows={6}
        required
      ></textarea>
      <button type="submit">Update Post</button>
    </form>
  );
};

export default EditPost;
