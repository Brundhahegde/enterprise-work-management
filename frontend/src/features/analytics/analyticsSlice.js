import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// All projects for dropdown (in Analytics UI)
export const fetchAllProjects = createAsyncThunk('analytics/allProjects', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  try {
    const res = await axios.get('http://localhost:5000/api/analytics/projects', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch {
    return rejectWithValue('Failed to fetch projects');
  }
});

// Analytics for a specific project by _id
export const fetchProjectAnalytics = createAsyncThunk('analytics/projectAnalytics', async (projectId, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  try {
    const res = await axios.get(`http://localhost:5000/api/analytics/project/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch {
    return rejectWithValue('Failed to fetch analytics');
  }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    projects: [],
    statusCounts: [],
    completion: 0,
    overdue: [],
    trend: [],
    loading: false,
    error: null,
    selectedProjectId: ""
  },
  reducers: {
    setSelectedProject(state, action) {
      state.selectedProjectId = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllProjects.fulfilled, (state, action) => { state.projects = action.payload; })
      .addCase(fetchProjectAnalytics.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchProjectAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.statusCounts = action.payload.statusCounts;
        state.completion = action.payload.completion;
        state.overdue = action.payload.overdue;
        state.trend = action.payload.trend;
      })
      .addCase(fetchProjectAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});
export const { setSelectedProject } = analyticsSlice.actions;
export default analyticsSlice.reducer;
