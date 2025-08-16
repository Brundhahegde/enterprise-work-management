const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authenticate, permit } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/addUser', authenticate, permit('Admin'), async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  // Prevent multiple Admins
  if (role === "Admin") {
    const existingAdmin = await User.findOne({ role: "Admin" });
    if (existingAdmin) {
      return res.status(403).json({ msg: "Only one Admin allowed in the system." });
    }
  }

  // Enforce unique username
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(409).json({ msg: "Username already exists." });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash, role });
  await user.save();

  res.status(201).json({ msg: "User created!", user: { username: user.username, role: user.role } });
});
router.get('/users', authenticate, permit('Admin'), async (req, res) => {
  const users = await User.find({}, 'username role _id');  // Only send needed fields
  res.json(users);
});
module.exports = router;
