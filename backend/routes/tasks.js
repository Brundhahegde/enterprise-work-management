const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { authenticate, permit } = require('../middleware/authMiddleware');

// GET all tasks for a project
router.get('/:projectId', authenticate, async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ msg: "Project not found" });
  const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'username');
  res.json(tasks);
});

// CREATE a task for a project
router.post('/:projectId', authenticate, permit('Admin', 'Manager'), async (req, res) => {
  const { title, description, status, assignedToUsername } = req.body;
  if (!title) return res.status(400).json({ msg: "Title required" });
  let assignedToUser = null;
  if (assignedToUsername && assignedToUsername.trim()) {
    assignedToUser = await User.findOne({ username: assignedToUsername.trim() });
  }
  const task = new Task({
    title,
    description,
    status: status || "To Do",
    project: req.params.projectId,
    assignedTo: assignedToUser ? assignedToUser._id : undefined,
  });
  await task.save();
  await task.populate('assignedTo', 'username');
  res.status(201).json(task);
});

// UPDATE a task (drag, reassign, etc)
router.put('/:taskId', authenticate, async (req, res) => {
  const { status } = req.body;
  const { role, id: userId } = req.user;
  const task = await Task.findById(req.params.taskId);

  if (!task) return res.status(404).json({ msg: "Task not found" });

  // Managers can always move any task, Employees only their own.
  if (
    role !== 'Manager' &&
    !(role === 'Employee' && String(task.assignedTo) === String(userId))
  ) {
    return res.status(403).json({ msg: "Forbidden: Access denied" });
  }

  task.status = status;
  await task.save();

  res.json(task);
});


// DELETE a task
router.delete('/:id', authenticate, permit('Admin', 'Manager'), async (req, res) => {
  const deleted = await Task.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ msg: 'Task not found' });
  res.json({ msg: 'Task deleted' });
});

module.exports = router;
