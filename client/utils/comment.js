import API from "./api"; // your axios instance

export const fetchComments = (slug, params = {}) =>
  API.get(`/posts/${slug}/comments`, { params });

export const addComment = (slug, content, parentId = null) =>
  API.post(
    `/posts/${slug}/comments`,
    { content, parentId },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );

export const deleteComment = (id) =>
  API.delete(`/comments/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const updateComment = (id, content) =>
  API.patch(
    `/comments/${id}`,
    { content },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
