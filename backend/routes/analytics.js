const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { authenticate } = require('../middleware/authMiddleware');

// List projects for selection
router.get('/projects', authenticate, async (req, res) => {
  const projects = await Project.find({}, 'name');
  res.json(projects);
});

// Full analytics for a single project
router.get('/project/:projectId', authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ msg: "Invalid project id" });
    }

    // Tasks by status
    const statusCounts = await Task.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Completion percentage
    const totalCount = await Task.countDocuments({ project: projectId }) || 0;
    const doneCount = await Task.countDocuments({ project: projectId, status: "Done" }) || 0;
    const completion = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

    // Overdue tasks (skip if no dueDate in schema)
    let overdue = [];
    const today = new Date();
    try {
      overdue = await Task.find({
        project: projectId,
        dueDate: { $lt: today },
        status: { $ne: "Done" }
      }).select('title assignedTo dueDate').populate('assignedTo', 'username');
    } catch {
      overdue = [];
    }

    // Trend: Done per day (last 14 days)
    let trend = [];
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 13);
    try {
      trend = await Task.aggregate([
        { $match: {
          project: new mongoose.Types.ObjectId(projectId),
          status: "Done",
          updatedAt: { $gte: twoWeeksAgo }
        }},
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }},
          done: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ]);
    } catch {
      trend = [];
    }

    res.json({
      statusCounts,
      completion,
      overdue,
      trend
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error (analytics)" });
  }
});

module.exports = router;
