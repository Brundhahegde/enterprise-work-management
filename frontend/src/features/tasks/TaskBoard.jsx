import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, TextField, Paper, Snackbar, Alert, Grid, Card, CardContent
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, addTask, updateTask, deleteTask, clearStatus } from "./taskSlice";
import { fetchProjectAnalytics } from "../analytics/analyticsSlice"; // <-- import
import DeleteIcon from "@mui/icons-material/Delete";

const statuses = ["To Do", "In Progress", "Done"];

export default function TaskBoard({ projectId,canDrag=true }) {
  const dispatch = useDispatch();
  const { tasks, loading, error, success } = useSelector((s) => s.tasks) || {};
  const { role } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ title: "", description: "", assignedToUsername: "", status: "To Do" });
  const analyticsProjectId = useSelector(s => s.analytics.selectedProjectId);

  useEffect(() => {
    if (projectId) dispatch(fetchTasks(projectId));
  }, [dispatch, projectId]);

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const tasksByStatus = {};
  statuses.forEach(st => { tasksByStatus[st] = []; });
  safeTasks.forEach(task => tasksByStatus[task.status || "To Do"].push(task));

  // Helper for analytics sync if needed
  const syncAnalytics = () => {
    if (analyticsProjectId === projectId) {
      dispatch(fetchProjectAnalytics(projectId));
    }
  };

  const handleAdd = e => {
    e.preventDefault();
    if (!form.title) return;
    dispatch(addTask({ ...form, projectId })).then(action => {
      if (action.meta.requestStatus === "fulfilled") {
        setForm({ title: "", description: "", assignedToUsername: "", status: "To Do" });
        syncAnalytics(); // <-- update analytics
      }
    });
  };

  const handleDelete = id => {
    dispatch(deleteTask(id)).then(action => {
      if (action.meta.requestStatus === "fulfilled") {
        syncAnalytics(); // <-- update analytics
      }
    });
  };

const onDragEnd = result => {
    if (!canDrag) return;
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    // The rest as usual for permitted users...
    const task = safeTasks.find(t => t._id === draggableId);
    if (!task) return;
    dispatch(updateTask({ id: draggableId, ...task, status: destination.droppableId })).then(action => {
      if (action.meta.requestStatus === "fulfilled") {
        syncAnalytics();
      }
    });
  };


  if (!projectId) return <Typography color="grey">Please select a project to view tasks.</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>Tasks</Typography>
      {(role === "Admin" || role === "Manager") && (
        <Box component="form" onSubmit={handleAdd} sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField label="Title *" size="small" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          <TextField label="Desc" size="small" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <TextField label="Assign To (email)" size="small" value={form.assignedToUsername} onChange={e => setForm(f => ({ ...f, assignedToUsername: e.target.value }))} />
          <Button type="submit" variant="contained">Add Task</Button>
        </Box>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          {statuses.map(st => (
            <Grid key={st} size={4}>
              <Droppable droppableId={st}>
                {provided => (
                  <Paper ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 200, p: 1, width: 220 }}>
                    <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>{st}</Typography>
                    {(tasksByStatus[st] || []).map((task, idx) => (
                      <Draggable key={task._id} draggableId={task._id} index={idx}>
                        {prov => (
                          <Card ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} sx={{ mb: 1 }}>
                            <CardContent sx={{ p: 1 }}>
                              <Typography fontWeight="bold">{task.title}</Typography>
                              <Typography variant="body2">{task.description}</Typography>
                              <Typography variant="caption">
                                Assigned: {task.assignedTo?.username || "Unassigned"}
                              </Typography>
                              {(role === "Admin" || role === "Manager") && (
                                <Button
                                  size="small"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => handleDelete(task._id)}
                                  sx={{ float: "right" }}
                                >
                                  Delete
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Paper>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
      {success && (
        <Snackbar open={!!success} autoHideDuration={3000} onClose={() => dispatch(clearStatus())}>
          <Alert severity="success" variant="filled">{success}</Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar open={!!error} autoHideDuration={3000} onClose={() => dispatch(clearStatus())}>
          <Alert severity="error" variant="filled">{error}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}
