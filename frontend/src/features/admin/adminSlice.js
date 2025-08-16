import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Add User
export const addUser = createAsyncThunk(
  'admin/addUser',
  async (userData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const resp = await axios.post('http://localhost:5000/api/admin/addUser', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return resp.data.user;
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to add user');
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      await axios.delete(`http://localhost:5000/api/admin/deleteUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return userId;
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to delete user');
    }
  }
);

// (optional) Fetch All Users
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const resp = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return resp.data;
    } catch (e) {
      return rejectWithValue('Failed to fetch users');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    addUserError: null,
    addUserSuccess: null,
    deleteUserError: null,
    loading: false,
  },
  reducers: {
    clearAdminStatus(state) {
      state.addUserError = null;
      state.addUserSuccess = null;
      state.deleteUserError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.rejected, (state, action) => {
        state.addUserError = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.addUserSuccess = "User created!";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteUserError = action.payload;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  }
});

export const { clearAdminStatus } = adminSlice.actions;
export default adminSlice.reducer;
