import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser } from "./authSlice";
import {
  Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Paper
} from "@mui/material";

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", role: "Employee" });
  const dispatch = useDispatch();
  const { loading, error } = useSelector(s => s.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(signupUser(form));
    } else {
      dispatch(loginUser(form));
    }
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 8,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
        {isSignup ? "Sign Up" : "Login"}
      </Typography>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <TextField
          name="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        {isSignup && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              label="Role"
              labelId="role-label"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mb: 1, mt: 1 }}
        >
          {isSignup ? "Sign Up" : "Log In"}
        </Button>
        <Button
          type="button"
          onClick={() => setIsSignup((s) => !s)}
          color="secondary"
          fullWidth
          variant="outlined"
        >
          {isSignup ? "Already have an account? Log In" : "No account? Sign Up"}
        </Button>
        {error && (
          <Typography color="error" textAlign="center" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </form>
    </Box>
  );
}
