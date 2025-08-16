


import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppBar, Toolbar, Typography, Button, Box, Paper, Tabs, Tab, Divider } from "@mui/material";
import { logout } from "../auth/authSlice";
import AdminPanel from "../admin/AdminPanel";
import ProjectList from "../projects/ProjectList";
import TaskBoard from "../tasks/TaskBoard";
import Analytics from "../analytics/Analytics";
import Profile from "../profile/Profile";

// Project selection for TaskBoard
import { useSelector as useReduxSelector } from "react-redux";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user, role } = useSelector((s) => s.auth);
  const [tabValue, setTabValue] = useState(0);
  // For displaying tasks of a selected project in Tasks tab
  const projects = useReduxSelector(s => s.projects.projects) || [];
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Tabs by role
  const adminTabs = ["User Management", "Projects", "Tasks", "Analytics", "Profile"];
  const managerTabs = ["Projects", "Tasks", "Analytics", "Profile"];
  const employeeTabs = ["Projects", "Tasks", "Profile"];
  const tabs = role === "Admin" ? adminTabs : role === "Manager" ? managerTabs : employeeTabs;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar position="static" color="primary" elevation={3}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Enterprise Work Management
          </Typography>
          <Typography sx={{ mr: 2 }}>
            {user} ({role})
          </Typography>
          <Button color="inherit" onClick={() => dispatch(logout())}>LOGOUT</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxWidth: 900, mx: "auto", p: 3, mt: 6 }}>
        <Paper elevation={4} sx={{ width: "100%", p: 4 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Welcome, <b>{user}</b>!
          </Typography>
          <Typography sx={{ mb: 3 }}>
            You are logged in as <b>{role}</b>.
            {role === "Admin" && <><br />You have full management access.</>}
            {role === "Manager" && <><br />You can manage projects and team tasks.</>}
            {role === "Employee" && <><br />You can manage your tasks and profile.</>}
          </Typography>

          <Tabs
            value={tabValue}
            onChange={(_e, v) => setTabValue(v)}
            centered
            sx={{ mb: 3 }}
          >
            {tabs.map((tab, idx) => (
              <Tab key={tab} label={tab} />
            ))}
          </Tabs>
          <Divider sx={{ mb: 3 }} />

          {/* TAB CONTENTS */}
          {(role === "Admin" && tabValue === 0) && <AdminPanel />}
          {(role === "Admin" && tabValue === 1 || role === "Manager" && tabValue === 0 || role === "Employee" && tabValue === 0) && (
            <ProjectList />
          )}
          {/* Tasks Tab */}
         {(
  (role === "Admin" && tabValue === 2) ||
  (role === "Manager" && tabValue === 1) ||
  (role === "Employee" && tabValue === 1)
) && (
  <>
    {/* Project selection for Manager/Employee/Admin */}
    <Box sx={{ mb: 2 }}>
      <Typography>Select Project for Tasks:</Typography>
      <select
        value={selectedProjectId}
        onChange={e => setSelectedProjectId(e.target.value)}
      >
        <option value="">-- Select Project --</option>
        {projects.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>
    </Box>
    {selectedProjectId
      ? <TaskBoard
          projectId={selectedProjectId}
          canDrag={role !== "Admin"}  // <-- Admin can't drag, others can
        />
      : <Typography variant="body2" sx={{ color: "gray" }}>
          Select a project to view tasks.
        </Typography>
    }
  </>
)}

   {((role === "Admin" && tabValue === 3) || (role === "Manager" && tabValue === 2)) && <Analytics />}
          

          {tabValue === tabs.length - 1 && <Profile />}
          
        </Paper>
      </Box>
    </Box>
  );
}
