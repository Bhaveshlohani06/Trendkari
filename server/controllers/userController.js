import mongoose from "mongoose";
import User from "../models/usermodel.js";
import UserNotification from "../models/userNotification.js";
import { getIO } from "../utils/socket.js";
import { broadcastPush } from "../helper/pushService.js";


/* =====================================================
   GET SUGGESTED USERS
   GET /api/user/suggested
   ===================================================== */
// export const getSuggestedUsers = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 5;
//     const excludeCurrentUser = req.query.excludeCurrentUser !== "false";
//     const currentUserId = req.user?._id;

//     let query = {};

//     if (excludeCurrentUser && currentUserId) {
//       query._id = { $ne: currentUserId };
//     }

//     const users = await User.find(query)
//       .limit(limit)
//       .select("name avatar bio followers preferences.categories")
//       .sort({ followers: -1 });

//     res.status(200).json({
//       success: true,
//       users,
//     });
//   } catch (error) {
//     console.error("getSuggestedUsers error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

export const getSuggestedUsers = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const currentUserId = req.user?._id;

    const currentUser = await User.findById(currentUserId).select("following");

    const excludeIds = [
      currentUserId,
      ...(currentUser?.following || []),
    ];

    const users = await User.aggregate([
      {
        $match: {
          _id: { $nin: excludeIds },
        },
      },
      { $sample: { size: limit } }, 
      {
        $project: {
          name: 1,
          avatar: 1,
          bio: 1,
          followersCount: {
            $size: { $ifNull: ["$followers", []] },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("getSuggestedUsers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



/* =====================================================
   GET ALL USERS (FILTER + PAGINATION)
   GET /api/user
   ===================================================== */
// export const getAllUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page);
//     const limit = parseInt(req.query.limit);
//     const search = req.query.search || "";
//     const category = req.query.category || "all";

//     const skip = (page - 1) * limit;
//     const currentUserId = req.user?._id;

//     let query = {};

//     // Exclude current user
//     if (currentUserId) {
//       query._id = { $ne: currentUserId };
//     }

//     // Search filter
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { bio: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Category filter (from preferences.categories)
//     if (category !== "all") {
//       query["preferences.categories"] = category;
//     }

//     const users = await User.find(query)
//       .skip(skip)
//       .limit(limit)
//       .select(
//         "name avatar bio followers following preferences.categories createdAt"
//       )
//       .sort({ followers: -1 });

//     const total = await User.countDocuments(query);
//     const hasMore = total > skip + users.length;

//     res.status(200).json({
//       success: true,
//       users,
//       total,
//       hasMore,
//       page,
//     });
//   } catch (error) {
//     console.error("getAllUsers error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


export const getAllUsers = async (req, res) => {
  try {
    // ✅ SAFE DEFAULTS
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const search = req.query.search?.trim() || "";
    const category = req.query.category || "all";

    const skip = (page - 1) * limit;
    const currentUserId = req.user?._id;

    const query = {};

    // 🚫 Exclude current user
    if (currentUserId) {
      query._id = { $ne: currentUserId };
    }

    // 🔍 Search (name + bio)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
      ];
    }

    // 🏷 Category filter (array-safe)
    if (category !== "all") {
      query["preferences.categories"] = { $in: [category] };
    }

    // 📦 MAIN QUERY
    const users = await User.find(query)
      .select(
        "name avatar bio followers following preferences.categories createdAt"
      )
      .sort({ createdAt: -1 }) // stable & predictable
      .skip(skip)
      .limit(limit)
      .lean();

    // 🔢 Counts
    const total = await User.countDocuments(query);
    const hasMore = skip + users.length < total;

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        hasMore,
      },
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =====================================================
   FOLLOW USER
   POST /api/user/:userId/follow
   ===================================================== */
// export const followUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const currentUserId = req.user._id;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid user ID",
//       });
//     }

//     if (userId === String(currentUserId)) {
//       return res.status(400).json({
//         success: false,
//         message: "You cannot follow yourself",
//       });
//     }

//     // Add to following
//     await User.findByIdAndUpdate(currentUserId, {
//       $addToSet: { following: userId },
//     });

//     // Add to followers
//     await User.findByIdAndUpdate(userId, {
//       $addToSet: { followers: currentUserId },
//     });

//     res.status(200).json({
//       success: true,
//       message: "User followed successfully",
//     });
//   } catch (error) {
//     console.error("followUser error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Follow failed",
//     });
//   }
// };


export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === String(currentUserId)) {
      return res.status(400).json({ success: false });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: currentUserId },
    });

    // 🔔 Notification
    await UserNotification.create({
      recipient: userId,
      sender: currentUserId,
      type: "FOLLOW",
      message: `${req.user.name} started following you`,
    });

    // 🔌 Socket
    const io = getIO();
    io.to(`user:${userId}`).emit("notification", {
      type: "FOLLOW",
      message: `${req.user.name} started following you`,
    });

    // 📲 Push
    const receiver = await User.findById(userId).select("pushToken");

    await broadcastPush({
      token: receiver?.pushToken,
      title: "New Follower 👤",
      body: `${req.user.name} started following you`,
      data: { userId: currentUserId.toString() },
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   UNFOLLOW USER
   POST /api/user/:userId/unfollow
   ===================================================== */
// export const unfollowUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const currentUserId = req.user._id;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid user ID",
//       });
//     }

//     // Remove from following
//     await User.findByIdAndUpdate(currentUserId, {
//       $pull: { following: userId },
//     });

//     // Remove from followers
//     await User.findByIdAndUpdate(userId, {
//       $pull: { followers: currentUserId },
//     });

//     res.status(200).json({
//       success: true,
//       message: "User unfollowed successfully",
//     });
//   } catch (error) {
//     console.error("unfollowUser error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Unfollow failed",
//     });
//   }
// };



export const unfollowUser = async (req, res) => {
  const { userId } = req.params;

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { following: userId },
  });

  await User.findByIdAndUpdate(userId, {
    $pull: { followers: req.user._id },
  });

  res.json({ success: true });
};
