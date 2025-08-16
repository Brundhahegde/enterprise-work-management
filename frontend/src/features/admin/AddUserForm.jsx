import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField, MenuItem, Select, Box, Typography, Alert, Snackbar } from "@mui/material";
import { addUser, clearAdminStatus } from "./adminSlice";

const roles = ["Admin", "Manager", "Employee"];

export default function AddUserForm() {
  const dispatch = useDispatch();
  const users = useSelector(s => s.admin.users);
  const error = useSelector(s => s.admin.addUserError);
  const success = useSelector(s => s.admin.addUserSuccess);
  const adminExists = users.some(u => u.role === "Admin");
  const allowedRoles = adminExists ? roles.filter(r => r !== "Admin") : roles;

  const [form, setForm] = useState({ username: "", password: "", role: allowedRoles[0] || "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.username || !form.password || !form.role) {
      dispatch(clearAdminStatus());
      return;
    }
    dispatch(addUser(form));
    setForm({ username: "", password: "", role: allowedRoles[0] || "" });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>Add User</Typography>
      <TextField
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        fullWidth sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        fullWidth sx={{ mb: 2 }}
      />
      <Select
        label="Role"
        name="role"
        value={form.role}
        onChange={handleChange}
        fullWidth sx={{ mb: 2 }}
      >
        {allowedRoles.map(role => (
          <MenuItem key={role} value={role}>{role}</MenuItem>
        ))}
      </Select>
      {adminExists &&
        <Alert severity="info" sx={{ mb: 2 }}>
          Only one Admin is allowed. You can add Managers or Employees.
        </Alert>
      }
      <Button variant="contained" type="submit">Add User</Button>
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => dispatch(clearAdminStatus())}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="error" variant="filled">{error}</Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => dispatch(clearAdminStatus())}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="success" variant="filled">{success}</Alert>
      </Snackbar>
    </Box>
  );
}
