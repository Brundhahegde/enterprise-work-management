import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProjects,
  fetchProjectAnalytics,
  setSelectedProject
} from "./analyticsSlice";
import {
  Box, Typography, Paper, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, LinearProgress, Select, MenuItem, Alert
} from "@mui/material";

export default function Analytics() {
  const dispatch = useDispatch();
  const { projects, statusCounts, completion, overdue, trend, loading, error, selectedProjectId } = useSelector(s => s.analytics);

  useEffect(() => { dispatch(fetchAllProjects()); }, [dispatch]);
  useEffect(() => {
    if (selectedProjectId) dispatch(fetchProjectAnalytics(selectedProjectId));
  }, [dispatch, selectedProjectId]);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>Analytics & Reporting</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography>Select Project to View Report:</Typography>
        <Select
          size="small"
          value={selectedProjectId}
          onChange={e => dispatch(setSelectedProject(e.target.value))}
          sx={{ minWidth: 250, my: 1 }}
        >
          <MenuItem value="">-- Select --</MenuItem>
          {projects.map(p => (
            <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
          ))}
        </Select>
      </Box>
      {!selectedProjectId && <Alert severity="info">Please select a project to view analytics.</Alert>}
      {loading && <CircularProgress sx={{ display: "block", my: 5 }} />}
      {error && <Alert severity="error">{error}</Alert>}

      {selectedProjectId && !loading && (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6">Status Counts</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statusCounts.map(s => (
                  <TableRow key={s._id}>
                    <TableCell>{s._id}</TableCell>
                    <TableCell>{s.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6">Completion Rate</Typography>
            <LinearProgress
              variant="determinate"
              value={completion}
              sx={{ height: 12, borderRadius: 1, my: 1 }}
            />
            <Typography>{completion}% Complete</Typography>
          </Paper>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6">Overdue Tasks</Typography>
            {(!overdue || overdue.length === 0) ? (
              <Typography sx={{ color: "grey" }}>No overdue tasks 🎉</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Due Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {overdue.map((t, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{t.title}</TableCell>
                      <TableCell>{t.assignedTo?.username || "Unassigned"}</TableCell>
                      <TableCell>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ""}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Completion Trend (last 14 days)</Typography>
            {(trend.length === 0) ? (
              <Typography sx={{ color: "grey" }}>No completed tasks in the last 2 weeks.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trend.map(day => (
                    <TableRow key={day._id}>
                      <TableCell>{day._id}</TableCell>
                      <TableCell>{day.done}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}
