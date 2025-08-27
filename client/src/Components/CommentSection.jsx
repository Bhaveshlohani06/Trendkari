import React, { useEffect, useState } from "react";
import { Form, Button, ListGroup, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { fetchComments, addComment, deleteComment, updateComment } from "../../utils/apiComments";
import { FaTrash, FaEdit, FaReply } from "react-icons/fa";

const CommentItem = ({ c, canEdit, onDelete, onEdit }) => (
  <ListGroup.Item className="border-0 border-bottom">
    <div className="d-flex justify-content-between">
      <div>
        <strong>{c.author?.name || "User"}</strong>{" "}
        <small className="text-muted">
          · {new Date(c.createdAt).toLocaleString()}
        </small>
        <div className="mt-1">{c.content}</div>
      </div>
      <div className="d-flex align-items-start gap-2">
        {/* Reply placeholder; wire if you implement threaded replies */}
        <OverlayTrigger placement="top" overlay={<Tooltip>Reply (coming soon)</Tooltip>}>
          <span className="text-muted" style={{ cursor: "not-allowed" }}><FaReply/></span>
        </OverlayTrigger>
        {canEdit && (
          <>
            <FaEdit
              style={{ cursor: "pointer" }}
              onClick={() => onEdit(c)}
              title="Edit"
            />
            <FaTrash
              style={{ cursor: "pointer" }}
              onClick={() => onDelete(c._id)}
              title="Delete"
            />
          </>
        )}
      </div>
    </div>
  </ListGroup.Item>
);

const CommentsSection = ({ slug, currentUser }) => {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null); // comment object when editing

  const load = async (cursor) => {
    setLoading(true);
    try {
      const { data } = await fetchComments(slug, { cursor, limit: 20 });
      setItems((prev) => (cursor ? [...prev, ...data.items] : data.items));
      setNextCursor(data.nextCursor);
    } catch (e) {
      console.error("fetch comments error", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to comment.");
      return;
    }

    setPosting(true);
    try {
      if (editing) {
        const { data } = await updateComment(editing._id, text.trim());
        setItems((prev) => prev.map((c) => (c._id === editing._id ? data.comment : c)));
        setEditing(null);
      } else {
        // optimistic add
        const optimistic = {
          _id: `tmp-${Date.now()}`,
          post: "tmp",
          author: { name: currentUser?.name || "You" },
          content: text.trim(),
          createdAt: new Date().toISOString(),
          status: "published"
        };
        setItems((prev) => [optimistic, ...prev]);

        const { data } = await addComment(slug, text.trim());
        // replace optimistic with real
        setItems((prev) => prev.map((c) => (c._id === optimistic._id ? data.comment : c)));
      }
      setText("");
    } catch (e) {
      console.error("add/edit comment error", e?.response?.data || e.message);
      alert(e?.response?.data?.error || "Failed to submit comment");
      // rollback optimistic if needed
      setItems((prev) => prev.filter((c) => !String(c._id).startsWith("tmp-")));
    } finally {
      setPosting(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    const prev = items;
    setItems((p) => p.filter((c) => c._id !== id));
    try {
      await deleteComment(id);
    } catch (e) {
      console.error("delete comment error", e?.response?.data || e.message);
      alert(e?.response?.data?.error || "Failed to delete");
      setItems(prev); // rollback
    }
  };

  const onEdit = (c) => {
    setEditing(c);
    setText(c.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-4">
      <h5 className="mb-3">Comments</h5>

      {/* Compose */}
      <Form onSubmit={onSubmit} className="mb-3">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder={currentUser ? "Write a comment…" : "Sign in to write a comment"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!currentUser}
        />
        <div className="d-flex gap-2 mt-2">
          <Button type="submit" disabled={!currentUser || posting || !text.trim()}>
            {editing ? "Save Changes" : posting ? "Posting…" : "Post"}
          </Button>
          {editing && (
            <Button variant="outline-secondary" onClick={() => { setEditing(null); setText(""); }}>
              Cancel
            </Button>
          )}
        </div>
      </Form>

      {/* List */}
      {loading && !items.length ? (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" /> Loading comments…
        </div>
      ) : (
        <ListGroup variant="flush">
          {items.map((c) => (
            <CommentItem
              key={c._id}
              c={c}
              canEdit={currentUser && (currentUser.role === "admin" || currentUser._id === c.author?._id)}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ListGroup>
      )}

      {/* Load more */}
      {nextCursor && (
        <div className="text-center mt-3">
          <Button variant="outline-secondary" onClick={() => load(nextCursor)}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
