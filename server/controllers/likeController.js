import postModel from "../models/postmodel.js"; // or your actual post model
import userNotification from "../models/userNotification.js";
import { broadcastPush } from "../helper/pushService.js";
import { getIO } from "../utils/socket.js";

// export const toggleLikePost = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { postId } = req.params;

//     const post = await postModel.findById(postId).populate("author", "_id name");

//     if (!post) {
//       return res.status(404).json({ success: false, message: "Post not found" });
//     }

//     const alreadyLiked = post.likes.includes(userId);

//     if (alreadyLiked) {
//       // UNLIKE
//       post.likes.pull(userId);
//       post.likesCount -= 1;

//       await post.save();

//       return res.json({
//         success: true,
//         liked: false,
//         likesCount: post.likesCount,
//       });
//     }

//     // LIKE
//     post.likes.push(userId);
//     post.likesCount += 1;

//     await post.save();

//     // 🔔 Push Notification (do not notify self)
//  if (post.author.toString() !== req.user._id.toString()) {
//   await userNotification.create({
//     user: post.author,
//     sender: req.user._id,
//     type: "LIKE",
//     post: post._id,
//     message: `${req.user.name} liked your post`,
//   });

//   // Push notification (FCM)
//   await broadcastPush({
//     userId: post.author,
//     title: "New Like",
//     body: `${req.user.name} liked your post`,
//     link: `/post/${post._id}`,
//   });
// }

//     return res.json({
//       success: true,
//       liked: true,
//       likesCount: post.likesCount,
//     });
//   } catch (error) {
//     console.error("Like error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };



// export const toggleLikePost = async (req, res) => {
//   try {
//     const io = getIO();
//     const userId = req.user._id;
//     const { postId } = req.params;

//     const post = await postModel.findById(postId);

//     if (!post) {
//       return res.status(404).json({ success: false, message: "Post not found" });
//     }

//     const alreadyLiked = post.likes.includes(userId);

//     if (alreadyLiked) {
//       post.likes.pull(userId);
//     } else {
//       post.likes.push(userId);
//     }

//     post.likesCount = post.likes.length;
//     await post.save();

//     // 🔴 LIVE LIKE UPDATE
//     io.to(`post:${postId}`).emit("post-like-updated", {
//       postId,
//       likesCount: post.likesCount,
//     });

//     // 🔔 NOTIFICATION (NOT SELF)
//     if (!alreadyLiked && post.author.toString() !== userId.toString()) {
//       await userNotification.create({
//         user: post.author,
//         sender: userId,
//         type: "LIKE",
//         post: postId,
//         message: `${req.user.name} liked your post`,
//       });

//       io.to(`user:${post.author}`).emit("notification", {
//         type: "LIKE",
//         postId,
//         message: `${req.user.name} liked your post`,
//       });
//     }

//     return res.json({
//       success: true,
//       liked: !alreadyLiked,
//       likesCount: post.likesCount,
//     });

//   } catch (err) {
//     console.error("Like error:", err);
//     res.status(500).json({ success: false });
//   }
// };



export const toggleLikePost = async (req, res) => {
  try {
    const io = getIO();
    const userId = req.user._id;
    const { postId } = req.params;

    const post = await postModel
      .findById(postId)
      .populate("author", "_id name pushToken");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.includes(userId);

    // 🔁 LIKE / UNLIKE
    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    post.likesCount = post.likes.length;
    await post.save();

    // 🔴 LIVE LIKE UPDATE (post room)
    io.to(`post:${postId}`).emit("post-like-updated", {
      postId,
      likesCount: post.likesCount,
      liked: !alreadyLiked,
    });

    // 🔔 NOTIFY ONLY ON LIKE (NOT UNLIKE, NOT SELF)
    if (
      !alreadyLiked &&
      post.author._id.toString() !== userId.toString()
    ) {
      const message = `${req.user.name} liked your post`;

      // 1️⃣ Save notification in DB
      await userNotification.create({
        user: post.author._id,
        sender: userId,
        type: "LIKE",
        post: postId,
        message,
      });

      // 2️⃣ Socket notification (online users)
      io.to(`user:${post.author._id}`).emit("notification", {
        type: "LIKE",
        postId,
        message,
      });

      // 3️⃣ PUSH notification (offline users)
      if (post.author.pushToken) {
        await broadcastPush({
          token: post.author.pushToken,
          title: "New Like ❤️",
          body: message,
          data: {
            postId: postId.toString(),
            type: "LIKE",
          },
        });
      }
    }

    return res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likesCount,
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};