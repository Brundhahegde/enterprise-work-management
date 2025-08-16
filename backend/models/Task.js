const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: Date // optional; add if you want "overdue" analytics
}, { timestamps: true });

// Prevent OverwriteModelError on hot reloads
module.exports = mongoose.models.Task || mongoose.model('Task', TaskSchema);
