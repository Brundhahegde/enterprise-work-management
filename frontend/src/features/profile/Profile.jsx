import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile, changePassword, clearProfileStatus } from "./profileSlice";
import {
  Box, Typography, TextField, Button, Paper, Snackbar, Alert, Divider
} from "@mui/material";

export default function Profile() {
  const dispatch = useDispatch();
  const { profile, loading, error, success } = useSelector(s => s.profile);
  const [form, setForm] = useState({ username: "" });

  const [passwords, setPasswords] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });
  const [pwError, setPwError] = useState("");

  useEffect(() => { dispatch(fetchProfile()); }, [dispatch]);
  useEffect(() => { if (profile) setForm({ username: profile.username }); }, [profile]);

  const handleUpdate = e => {
    e.preventDefault();
    if (!form.username) return;
    dispatch(updateProfile({ username: form.username }));
  };

  const handleChangePassword = e => {
    e.preventDefault();
    setPwError("");
    const { currentPassword, newPassword, confirmPassword } = passwords;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("All fields required"); return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match"); return;
    }
    dispatch(changePassword({ currentPassword, newPassword }));
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>Profile</Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Account Info</Typography>
        <form onSubmit={handleUpdate}>
          <TextField
            label="Username"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            sx={{ mt: 2, mb: 2 }}
            fullWidth
          />
          <TextField
            label="Role"
            value={profile?.role || ""}
            sx={{ mb: 2 }}
            fullWidth
            disabled
          />
          <Button type="submit" variant="contained" disabled={loading}>Update Profile</Button>
        </form>
      </Paper>

      <Divider sx={{ my: 4 }} />
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Change Password</Typography>
        <form onSubmit={handleChangePassword}>
          <TextField
            label="Current Password"
            type="password"
            value={passwords.currentPassword}
            onChange={e => setPasswords(f => ({ ...f, currentPassword: e.target.value }))}
            sx={{ mt: 2, mb: 2 }}
            fullWidth
          />
          <TextField
            label="New Password"
            type="password"
            value={passwords.newPassword}
            onChange={e => setPasswords(f => ({ ...f, newPassword: e.target.value }))}
            sx={{ mb: 2 }}
            fullWidth
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={passwords.confirmPassword}
            onChange={e => setPasswords(f => ({ ...f, confirmPassword: e.target.value }))}
            sx={{ mb: 2 }}
            fullWidth
          />
          {pwError && <Alert severity="error" sx={{ mb: 2 }}>{pwError}</Alert>}
          <Button type="submit" variant="contained" disabled={loading}>Change Password</Button>
        </form>
      </Paper>

      {success && (
        <Snackbar open autoHideDuration={3000} onClose={() => dispatch(clearProfileStatus())}>
          <Alert severity="success">{success}</Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar open autoHideDuration={3000} onClose={() => dispatch(clearProfileStatus())}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}
