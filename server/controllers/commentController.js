import sanitizeHtml from "sanitize-html";
import Comment from "../models/commentmodel.js";
import Post from "../models/postmodel.js"; 
//import user from "../models/userModel.js";
import { getIO } from "../utils/socket.js";
import UserNotification from "../models/userNotification.js";
import { broadcastPush } from "../helper/pushService.js";






// helper to find post by slug once
async function findPostBySlug(slug) {
  const post = await Post.findOne({ slug }).select("_id author title slug");
  if (!post) throw new Error("Post not found");
  return post;
}

// POST /api/v1/posts/:slug/comments




// Find post by slug with author info
async function findPostWithAuthor(slug) {
  return await Post.findOne({ slug })
    .populate("author", "_id name pushToken")
    .lean();
}

export const createComment = async (req, res) => {
  try {
    const { slug } = req.params;
    const { content, parentId } = req.body;

    // Validate content
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    // Find post with author populated
    const post = await findPostWithAuthor(slug);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Sanitize comment
    const cleanContent = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: "discard",
    }).trim();

    // Create comment
    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      content: cleanContent,
      parent: parentId || null,
    });

    // Populate author for response
    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name avatar")
      .lean();

    // 🔔 Notify post author (skip if commenter is author)
    if (post.author._id.toString() !== req.user._id.toString()) {
      const message = `${req.user.name} commented on your post`;

      // 1️⃣ Save notification in DB
      await UserNotification.create({
        user: post.author._id,
        sender: req.user._id,
        type: "COMMENT",
        PostId: post._id,
        message,
      });

      // 2️⃣ Socket.io notification
      const io = getIO();
      io.to(`user:${post.author._id}`).emit("notification", {
        type: "COMMENT",
        postId: post._id,
        message,
      });

      // 3️⃣ Push notification if pushToken exists
      if (post.author.pushToken) {
        await broadcastPush({
          token: post.author.pushToken,
          title: "New Comment 💬",
          body: message,
          data: {
            postId: post._id.toString(),
            slug,
            type: "COMMENT",
          },
        });
      }
    }

    return res.status(201).json({ ok: true, comment: populatedComment });
  } catch (err) {
    console.error("createComment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET /api/v1/posts/:slug/comments?limit=20&cursor=commentId
export const listComments = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 20, cursor } = req.query;

    const post = await findPostBySlug(slug);

    const query = { post: post._id, status: "published" };
    if (cursor) query._id = { $lt: cursor }; // keyset pagination

    const docs = await Comment.find(query)
      .sort({ _id: -1 })
      .limit(Number(limit))
      .populate("author", "name avatar")
      .lean();

    const nextCursor = docs.length ? docs[docs.length - 1]._id : null;

    return res.json({ ok: true, items: docs, nextCursor });
  } catch (err) {
    console.error("listComments error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// DELETE /api/v1/comments/:id  (author or admin only)
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const c = await Comment.findById(id);
    if (!c) return res.status(404).json({ error: "Comment not found" });

    const isOwner = c.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin"; // adjust to your app
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    c.status = "deleted";
    c.content = "[deleted]";
    await c.save();

    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteComment error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// PATCH /api/v1/comments/:id (edit own comment)
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const c = await Comment.findById(id);
    if (!c) return res.status(404).json({ error: "Comment not found" });

    const isOwner = c.author.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ error: "Forbidden" });

    const clean = sanitizeHtml(content || "", {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: "discard"
    }).trim();

    if (!clean) return res.status(400).json({ error: "Comment cannot be empty" });

    c.content = clean;
    await c.save();

    const populated = await Comment.findById(c._id).populate("author", "name avatar").lean();
    return res.json({ ok: true, comment: populated });
  } catch (err) {
    console.error("updateComment error:", err);
    return res.status(400).json({ error: err.message });
  }
};



// LIKE / UNLIKE POST

