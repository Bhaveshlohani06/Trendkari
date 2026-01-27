import postModel from "../models/postmodel.js"; // or your actual post model
import userNotification from "../models/userNotification.js";
import { broadcastPush } from "../helper/pushService.js";


export const toggleLikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    const post = await postModel.findById(postId).populate("author", "_id name");

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // UNLIKE
      post.likes.pull(userId);
      post.likesCount -= 1;

      await post.save();

      return res.json({
        success: true,
        liked: false,
        likesCount: post.likesCount,
      });
    }

    // LIKE
    post.likes.push(userId);
    post.likesCount += 1;

    await post.save();

    // 🔔 Push Notification (do not notify self)
 if (post.author.toString() !== req.user._id.toString()) {
  await userNotification.create({
    user: post.author,
    sender: req.user._id,
    type: "LIKE",
    post: post._id,
    message: `${req.user.name} liked your post`,
  });

  // Push notification (FCM)
  await broadcastPush({
    userId: post.author,
    title: "New Like",
    body: `${req.user.name} liked your post`,
    link: `/post/${post._id}`,
  });
}

    return res.json({
      success: true,
      liked: true,
      likesCount: post.likesCount,
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



