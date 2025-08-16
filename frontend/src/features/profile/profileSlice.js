import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to load profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.put('http://localhost:5000/api/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to update profile');
    }
  }
);

export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (data, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.put('http://localhost:5000/api/profile/password', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to change password');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null, loading: false, error: null, success: null
  },
  reducers: {
    clearProfileStatus(state) {
      state.error = null; state.success = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProfile.pending, s => { s.loading = true; s.error = null; })
      .addCase(fetchProfile.fulfilled, (s, a) => { s.loading = false; s.profile = a.payload; })
      .addCase(fetchProfile.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(updateProfile.fulfilled, (s, a) => { s.profile = a.payload; s.success = "Profile updated!"; })
      .addCase(updateProfile.rejected, (s, a) => { s.error = a.payload; })
      .addCase(changePassword.fulfilled, (s, a) => { s.success = a.payload.msg || 'Password changed!'; })
      .addCase(changePassword.rejected, (s, a) => { s.error = a.payload; });
  }
});

export const { clearProfileStatus } = profileSlice.actions;
export default profileSlice.reducer;
