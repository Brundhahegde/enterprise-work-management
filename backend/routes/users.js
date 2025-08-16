const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authenticate, permit } = require('../middleware/authMiddleware');
const router = express.Router();

// List all users (Admin only)
router.get('/', authenticate, permit('Admin'), async (req, res) => {
  const users = await User.find({}, "username role");
  res.json(users);
});

// Add a user (Admin only)
// in backend/routes/users.js, your add user POST endpoint:
// router.post('/', authenticate, permit('Admin'), async (req, res) => {
//   try {
//     const { username, password, role } = req.body;
//     if (!username || !password || !role) return res.status(400).json({ msg: 'All fields required' });
//     if (await User.findOne({ username })) return res.status(400).json({ msg: 'Username exists' });
//     const hash = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hash, role });
//     await user.save();
//     // THIS MUST SEND THE USER OBJECT!
//     res.status(201).json({ user: { _id: user._id, username: user.username, role: user.role } });
//   } catch {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// Change user role (Admin only)
router.patch('/:id/role', authenticate, permit('Admin'), async (req, res) => {
  const { role } = req.body;
  if (!['Admin', 'Manager', 'Employee'].includes(role)) return res.status(400).json({ msg: 'Invalid role' });
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ msg: 'Role updated' });
});

// Delete a user (Admin only, can't delete yourself)
router.delete('/:id', authenticate, permit('Admin'), async (req, res) => {
  if (req.user.username === req.params.username) return res.status(400).json({ msg: "Can't delete yourself" });
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'User deleted' });
});

module.exports = router;
