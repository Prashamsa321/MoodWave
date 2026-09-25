import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
  
      // Find logged-in user
      const user = await User.findById(req.user._id);
  
      // Check current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
  
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const updateUser = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name.trim();
    await user.save();

    // Return user without password
    const userSafe = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json({
      success: true,
      message: "Profile updated",
      user: userSafe,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};