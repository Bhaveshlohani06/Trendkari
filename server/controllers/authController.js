import express from 'express';
import usermodel from '../models/usermodel.js';
import { hashPassword, comparePassword    } from '../helper/authHelper.js';
import JWT from 'jsonwebtoken';
import { sendEmail } from '../utils/emailService.js';
import crypto from 'crypto';
import { imagekit } from "../config/imaegkit.js";
import fs from "fs";


//registerController
export const registerController = async (req, res) => {
  const { name, email, password, role, avatar, bio} = req.body;

  // Basic validation
  if (!name || !email || !password ) {
    return res.status(422).json({ error: 'Please fill all required fields' });
  }

  try {
    // Check if user exists
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashed = await hashPassword(password);

    // Create new user
    const user = new usermodel({
      name,
      email,
      password: hashed,
      role: role || 'user', // default role
        avatar: avatar || '', // default to empty string if not provided
        bio: bio || '', // default to empty string if not provided
    });

    await user.save();

        // Send welcome email
    const subject = '🎉 Welcome to Trendkari!';
    const html = `
      <h2>Hello ${name},</h2>
      <p>Welcome to <strong>Trendkari</strong> – Your daily dose of viral trends 🚀</p>
      <p>We’re thrilled to have you on board!</p>
      <p>Explore trends, share what you love, and stay ahead in pop culture.</p>
      <br>
      <p>Cheers,</p>
      <p><strong>Team Trendkari</strong></p>
    `;

    await sendEmail(email, subject, html);

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
};



//loginController
export const loginController = async (req, res) => {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
        return res.status(422).json({ error: 'Please fill all required fields' });
    }
    
    try {
        // Check if user exists
        const user = await usermodel.findOne({ email });
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
    
        // Compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
        }
    
        // Generate JWT token (if needed)
        const token = JWT.sign({ id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '10d' });
            // console.log(token);
    
        return res.status(200).json({
        message: 'Login successful',
        user: {
            _id: user._id,       // ✅ add this
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar || '',
            author: user.name || 'Trendkari',
            createdAt: user.createdAt,
            token, // Uncomment if using JWT
        },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error. Please try again.' });

    }
    }   


    //Test Controller
export const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch(error) {
        console.log(error);
        res.send({ error });
    }
};



//Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await usermodel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');

   user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();


    // user.resetPasswordToken = token;
    // user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    // await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const html = `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`;

    await sendEmail(user.email, 'Reset Password', html);

    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPasswordController = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const user = await usermodel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // user.password = password;
    // user.resetPasswordToken = undefined;
    // user.resetPasswordExpires = undefined;
    // await user.save();

    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();


    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//Get user by Id
export const getUserById = async (req, res) => {
  try {
    const user = await usermodel.findById(req.params.id)
    .select("-password")
    .populate("followers", "name avatar")
    .populate("following", "name avatar");  
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
 res.json({ success: true, user});  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};



export const followUnfollowUser = async (req, res) => {
  try {
    const currentUser = await usermodel.findById(req.user._id);
    const targetUser = await usermodel.findById(req.params.id);

    if (!targetUser) return res.status(404).json({ error: "User not found" });

    if (currentUser.following.includes(targetUser._id)) {
      // unfollow
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      // follow
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};



//Update About Section
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id;

    console.log("Raw req.body:", req.body);
    console.log("Raw req.file:", req.file);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updates = {};

    // Top-level
    if (req.body?.name) updates.name = req.body.name;
    if (req.body?.bio) updates.bio = req.body.bio;

    // Preferences
    if (req.body?.language) updates["preferences.language"] = req.body.language;
    if (req.body?.tone) updates["preferences.tone"] = req.body.tone;
    if (req.body?.categories) updates["preferences.categories"] = req.body.categories;
    if (req.body?.wordCount) updates["preferences.wordCount"] = req.body.wordCount;
    if (req.body?.timezone) updates["preferences.timezone"] = req.body.timezone;
    if (req.body?.frequency) updates["preferences.frequency"] = req.body.frequency;
    if (req.body?.dob) updates["preferences.dob"] = req.body.dob;
    if (req.body?.zodiacSign) updates["preferences.zodiacSign"] = req.body.zodiacSign;

    // Avatar
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: req.file.originalname || `avatar_${Date.now()}.jpg`,
        folder: "/avatars",
      });

      updates.avatar = imagekit.url({
        path: response.filePath,
        transformation: [{ quality: "auto" }, { format: "webp" }, { width: "400" }],
      });
    }

    console.log("Final Update Payload:", updates);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    const updatedUser = await usermodel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};