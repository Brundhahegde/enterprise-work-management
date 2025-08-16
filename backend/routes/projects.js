const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const { authenticate, permit } = require('../middleware/authMiddleware');
const router = express.Router();

// Get projects: Admin gets all, Manager gets owned, Employee gets assigned
router.get('/', authenticate, async (req, res) => {
  let projects;
  if (req.user.role === "Admin") {
    projects = await Project.find({}).populate('owner', 'username').populate('members', 'username');
  } else if (req.user.role === "Manager") {
    projects = await Project.find({ owner: req.user.id }).populate('owner', 'username').populate('members', 'username');
  } else {
    projects = await Project.find({ members: req.user.id }).populate('owner', 'username').populate('members', 'username');
  }
  res.json(projects);
});

// Add project: Admin + Manager
router.post('/', authenticate, permit('Admin', 'Manager'), async (req, res) => {
  const { name, description, memberUsernames } = req.body;
  if (!name) return res.status(400).json({ msg: 'Project name required' });
  const members = await User.find({ username: { $in: memberUsernames || [] } });
  const memberIds = members.map(u => u._id);
  const project = new Project({ name, description, owner: req.user.id, members: memberIds });
  await project.save();
  // Populate to match what GET returns!
  await project.populate('owner', 'username');
  await project.populate('members', 'username');
  res.status(201).json(project);  // Return the full project object, not just a message
});

// Edit project (name/description/members): Admin + Manager
router.put('/:id', authenticate, permit('Admin', 'Manager'), async (req, res) => {
  const { name, description, memberUsernames } = req.body;
  const members = await User.find({ username: { $in: memberUsernames || [] } });
  const memberIds = members.map(u => u._id);
  const update = { name, description, members: memberIds };
  const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(project);
});

// Delete project: Admin only
router.delete('/:id', authenticate, permit('Admin'), async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Project deleted' });
});

module.exports = router;
