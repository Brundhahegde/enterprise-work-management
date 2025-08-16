const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticate } = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();

// Get current user's profile
router.get('/', authenticate, async (req, res) => {
  // req.user.id is set by authenticate middleware
  const user = await User.findById(req.user.id).select('username role'); // add other fields as needed
  res.json(user);
});

// Update profile info (e.g., username)
router.put('/', authenticate, async (req, res) => {
  const { username } = req.body;
  if (!username || !username.trim()) return res.status(400).json({ msg: "Username is required" });
  const exists = await User.findOne({ username, _id: { $ne: req.user.id } });
  if (exists) return res.status(409).json({ msg: "Username already taken" });
  const user = await User.findByIdAndUpdate(req.user.id, { username }, { new: true }).select('username role');
  res.json(user);
});

// Change password
router.put('/password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ msg: "Fill all fields" });
  const user = await User.findById(req.user.id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(403).json({ msg: "Current password is incorrect" });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ msg: "Password changed successfully!" });
});

module.exports = router;
