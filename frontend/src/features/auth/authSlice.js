import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const signupUser = createAsyncThunk('auth/signupUser', async ({ username, password, role }, { rejectWithValue }) => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/signup', { username, password, role });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.msg || 'Signup failed');
  }
});
export const loginUser = createAsyncThunk('auth/loginUser', async ({ username, password }, { rejectWithValue }) => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.msg || 'Login failed');
  }
});
const initialState = {
  user: localStorage.getItem('user') || null,
  role: localStorage.getItem('role') || 'Employee',
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.role = 'Employee';
      state.token = null;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signupUser.pending, state => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled, state => { state.loading = false; state.error = null; })
      .addCase(signupUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(loginUser.pending, state => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.username;
        state.role = action.payload.role;
        state.token = action.payload.token;
        localStorage.setItem('user', action.payload.username);
        localStorage.setItem('role', action.payload.role);
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
