import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddUserForm from "./AddUserForm";
import { fetchUsers, deleteUser, clearAdminStatus } from "./adminSlice";

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { users, addUserError, addUserSuccess } = useSelector((s) => s.admin);
  const { user: loggedInUser } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1 }}>User Management</Typography>
      <Paper sx={{ mb: 3, p: 2 }}>
        <AddUserForm />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.username}>
                <TableCell>{u.username}</TableCell>
                <TableCell>
                  <Select value={u.role} disabled size="small">
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Employee">Employee</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {/* Cannot delete admin or own account */}
                  {u.role === "Admin" || u.username === loggedInUser ? (
                    <IconButton color="default" disabled>
                      <DeleteIcon />
                    </IconButton>
                  ) : (
                    <IconButton color="error" onClick={() => handleDelete(u._id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Show Snackbar for Add User errors/success */}
      <Snackbar
        open={!!addUserError}
        autoHideDuration={4000}
        onClose={() => dispatch(clearAdminStatus())}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert severity="error" variant="filled">{addUserError}</Alert>
      </Snackbar>
      <Snackbar
        open={!!addUserSuccess}
        autoHideDuration={2500}
        onClose={() => dispatch(clearAdminStatus())}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert severity="success" variant="filled">{addUserSuccess}</Alert>
      </Snackbar>
    </Box>
  );
}
