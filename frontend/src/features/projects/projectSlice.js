import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to fetch projects');
    }
  }
);

export const addProject = createAsyncThunk(
  'projects/addProject',
  async ({ name, description, memberUsernames }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.post('http://localhost:5000/api/projects', { name, description, memberUsernames }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;   // backend must .json(project pop...)
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to add project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, name, description, memberUsernames }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.put(`http://localhost:5000/api/projects/${id}`, { name, description, memberUsernames }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to delete project');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: { projects: [], loading: false, error: null, success: null },
  reducers: {
    clearStatus: (state) => { state.error = null; state.success = null; }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProjects.pending, s => { s.loading = true; s.error = null; })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.projects = a.payload; })
      .addCase(fetchProjects.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(addProject.fulfilled, (s, a) => {
        if (a.payload) {
          s.projects.push(a.payload);
          s.success = 'Project added';
        }
      })
      .addCase(addProject.rejected, (s, a) => { s.error = a.payload; })
      .addCase(updateProject.fulfilled, (s, a) => {
        const idx = s.projects.findIndex(p => p._id === a.payload._id);
        if (idx !== -1) s.projects[idx] = a.payload;
        s.success = 'Project updated';
      })
      .addCase(updateProject.rejected, (s, a) => { s.error = a.payload; })
      .addCase(deleteProject.fulfilled, (s, a) => {
        s.projects = s.projects.filter(p => p._id !== a.payload);
        s.success = 'Project deleted';
      })
      .addCase(deleteProject.rejected, (s, a) => { s.error = a.payload; });
  }
});
export const { clearStatus } = projectSlice.actions;
export default projectSlice.reducer;
