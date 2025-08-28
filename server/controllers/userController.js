// controllers/userController.js
import User from "../models/usermodel.js";

// Get users to follow (excluding current user and already followed users)
export const getUsersToFollow = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get current user to check who they're already following
    const currentUser = await User.findById(currentUserId).select('following');
    
    // Add current user to exclude them from the list
    const excludedUsers = [...currentUser.following, currentUserId];

    // Get suggested users (excluding already followed users and current user)
    const suggestedUsers = await User.find({
      _id: { $nin: excludedUsers }
    })
    .select('name username avatar bio followers following')
    .sort({ 
      // Sort by number of followers (popularity)
      followers: -1 
    })
    .skip(skip)
    .limit(limit);

    // Format the response
    const usersWithStats = suggestedUsers.map(user => ({
      _id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      followersCount: user.followers.length,
      followingCount: user.following.length
    }));

    res.status(200).json({
      success: true,
      users: usersWithStats,
      page,
      limit,
      hasMore: suggestedUsers.length === limit
    });
  } catch (error) {
    console.error('Error fetching users to follow:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users to follow'
    });
  }
};

