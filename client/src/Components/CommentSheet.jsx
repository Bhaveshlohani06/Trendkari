import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-hot-toast";
import API from "../../utils/api";

// Local copy of the same Hindi relative-time formatter used elsewhere in
// the feed (SwipeFeed.jsx) — kept as a small standalone copy here rather
// than a cross-import so this sheet has no dependency on the feed module
// (avoids a circular import between the two files).
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " साल पहले";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " महीने पहले";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " दिन पहले";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " घंटे पहले";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " मिनट पहले";
  return Math.floor(seconds) + " सेकंड पहले";
};

const SafeAvatar = ({ src, name, size = 36 }) => {
  const [broken, setBroken] = useState(false);
  const showImage = src && src.startsWith("http") && !broken;
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  return showImage ? (
    <img
      src={src}
      alt={name || "User"}
      className="csheet-avatar"
      style={{ width: size, height: size }}
      onError={() => setBroken(true)}
    />
  ) : (
    <div className="csheet-avatar csheet-avatar--fallback" style={{ width: size, height: size }}>
      {initial}
    </div>
  );
};

const CommentRow = ({ comment }) => {
  const author = comment.author;
  return (
    <div className="csheet-comment">
      <SafeAvatar src={author?.avatar} name={author?.name || author?.username} size={34} />
      <div className="csheet-comment-body">
        <div className="csheet-comment-meta">
          <Link to={`/dashboard/user/profile/${author?._id}`} className="csheet-comment-author">
            {author?.name || author?.username || "Anonymous User"}
          </Link>
          {comment.createdAt && (
            <span className="csheet-comment-time">{timeAgo(comment.createdAt)}</span>
          )}
        </div>
        <p className="csheet-comment-text">{comment.content}</p>

        {/* Only rendered when the backend actually sends these fields —
            nothing here is invented if likes/replies aren't supported. */}
        {typeof comment.likeCount === "number" && comment.likeCount > 0 && (
          <span className="csheet-comment-likes">{comment.likeCount} likes</span>
        )}
        {Array.isArray(comment.replies) && comment.replies.length > 0 && (
          <div className="csheet-replies">
            {comment.replies.map((reply) => (
              <div className="csheet-comment csheet-comment--reply" key={reply._id || reply.id}>
                <SafeAvatar
                  src={reply.author?.avatar}
                  name={reply.author?.name || reply.author?.username}
                  size={26}
                />
                <div className="csheet-comment-body">
                  <div className="csheet-comment-meta">
                    <span className="csheet-comment-author">
                      {reply.author?.name || reply.author?.username || "Anonymous User"}
                    </span>
                    {reply.createdAt && (
                      <span className="csheet-comment-time">{timeAgo(reply.createdAt)}</span>
                    )}
                  </div>
                  <p className="csheet-comment-text">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DRAG_CLOSE_THRESHOLD = 110;

const CommentSheet = ({ isOpen, post, auth, onClose, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | loaded | error
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [keyboardInset, setKeyboardInset] = useState(0);

  const sheetRef = useRef(null);
  const inputRef = useRef(null);
  const dragState = useRef({ startY: 0, dragging: false });
  const loadedForSlug = useRef(null);

  const postSlug = post?.slug;
  const postId = post?._id;

  // Fetch comments only when the sheet actually opens for a given post —
  // never prefetched per-card in the feed. Re-fetches if the sheet is
  // reopened on a different post.
  const fetchComments = useCallback(async () => {
    if (!postSlug) return;
    setStatus("loading");
    try {
      const { data } = await API.get(`/comment/posts/${postSlug}/comments`);
      const list = data?.comments || data?.items || [];
      setComments(Array.isArray(list) ? list : []);
      setStatus("loaded");
      if (Array.isArray(list)) {
        onCommentCountChange?.(postId, list.length);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setStatus("error");
    }
  }, [postSlug, postId, onCommentCountChange]);

  useEffect(() => {
    if (!isOpen || !postSlug) return;
    if (loadedForSlug.current === postSlug) return;
    loadedForSlug.current = postSlug;
    fetchComments();
  }, [isOpen, postSlug, fetchComments]);

  useEffect(() => {
    if (!isOpen) {
      loadedForSlug.current = null;
      setComments([]);
      setStatus("idle");
      setCommentText("");
      setDragY(0);
    }
  }, [isOpen]);

  // Focus the composer once the sheet has finished animating in.
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Keep the composer above the mobile keyboard using the visual viewport,
  // rather than guessing a fixed offset.
  useEffect(() => {
    if (!isOpen || !window.visualViewport) return;
    const vv = window.visualViewport;
    const handleResize = () => {
      const inset = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardInset(inset > 0 ? inset : 0);
    };
    vv.addEventListener("resize", handleResize);
    vv.addEventListener("scroll", handleResize);
    handleResize();
    return () => {
      vv.removeEventListener("resize", handleResize);
      vv.removeEventListener("scroll", handleResize);
    };
  }, [isOpen]);

  // Drag-down-to-dismiss on the handle.
  const onDragStart = useCallback((e) => {
    dragState.current = { startY: e.touches ? e.touches[0].clientY : e.clientY, dragging: true };
  }, []);

  const onDragMove = useCallback((e) => {
    if (!dragState.current.dragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = clientY - dragState.current.startY;
    if (delta > 0) setDragY(delta);
  }, []);

  const onDragEnd = useCallback(() => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    if (dragY > DRAG_CLOSE_THRESHOLD) {
      onClose();
    } else {
      setDragY(0);
    }
  }, [dragY, onClose]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!auth?.user) {
      toast.error("Login to comment");
      return;
    }
    const text = commentText.trim();
    if (!text || posting) return;

    setPosting(true);
    try {
      const { data } = await API.post(`/comment/posts/${postSlug}/comments`, { content: text });
      if (data?.success !== false) {
        const newComment = data?.comment || data;
        setCommentText("");
        setComments((prev) => {
          const next = [newComment, ...prev];
          onCommentCountChange?.(postId, next.length);
          return next;
        });
        inputRef.current?.focus();
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error("Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  if (!isOpen) return null;

  const sheetStyle = {
    transform: `translateY(${dragY}px)`,
    transition: dragState.current.dragging ? "none" : "transform 0.25s ease",
  };

  return (
    <>
      <div className="csheet-backdrop" onClick={onClose} />
      <div className="csheet" ref={sheetRef} style={sheetStyle} role="dialog" aria-label="Comments">
        <div
          className="csheet-drag-handle"
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
        >
          <span className="csheet-drag-bar" />
        </div>

        <div className="csheet-header">
          <strong>{comments.length > 0 ? `${comments.length} Comments` : "Comments"}</strong>
          <button type="button" className="csheet-close-btn" onClick={onClose} aria-label="Close comments">
            <FaTimes />
          </button>
        </div>

        <div className="csheet-list">
          {status === "loading" && (
            <div className="csheet-state">
              <div className="spinner-small" />
              <p>लोड हो रहा है...</p>
            </div>
          )}

          {status === "error" && (
            <div className="csheet-state">
              <p>Unable to load comments</p>
              <button type="button" className="csheet-retry-btn" onClick={fetchComments}>
                Retry
              </button>
            </div>
          )}

          {status === "loaded" && comments.length === 0 && (
            <div className="csheet-state">
              <p>No comments yet</p>
              <span className="csheet-state-sub">Be the first to share your thoughts!</span>
            </div>
          )}

          {status === "loaded" &&
            comments.map((comment) => (
              <CommentRow key={comment._id || comment.id} comment={comment} />
            ))}
        </div>

        <form
          className="csheet-input-bar"
          style={{ paddingBottom: keyboardInset ? 8 : undefined, marginBottom: keyboardInset }}
          onSubmit={submitComment}
        >
          {auth?.user ? (
            <>
              <SafeAvatar src={auth.user.avatar} name={auth.user.name} size={32} />
              <input
                ref={inputRef}
                type="text"
                className="csheet-text-input"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={posting}
              />
              <button
                type="submit"
                className="csheet-send-btn"
                disabled={posting || !commentText.trim()}
                aria-label="Post comment"
              >
                <FaPaperPlane />
              </button>
            </>
          ) : (
            <Link to="/login" className="csheet-login-prompt">
              Login to join the discussion
            </Link>
          )}
        </form>
      </div>
    </>
  );
};

export default CommentSheet;
