import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (projectId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async ({ projectId, title, description, status, assignedToUsername }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.post(`http://localhost:5000/api/tasks/${projectId}`,
        { title, description, status, assignedToUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to add task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, ...updateFields }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, updateFields, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { tasks: [], loading: false, error: null, success: null },
  reducers: {
    clearStatus: (state) => { state.error = null; state.success = null; }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, s => { s.loading = true; s.error = null; })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.tasks = a.payload; })
      .addCase(fetchTasks.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(addTask.fulfilled, (s, a) => {
        s.tasks.push(a.payload);
        s.success = 'Task added';
      })
      .addCase(addTask.rejected, (s, a) => { s.error = a.payload; })
      .addCase(updateTask.fulfilled, (s, a) => {
        const idx = s.tasks.findIndex(t => t._id === a.payload._id);
        if (idx !== -1) s.tasks[idx] = a.payload;
        s.success = 'Task updated';
      })
      .addCase(updateTask.rejected, (s, a) => { s.error = a.payload; })
      .addCase(deleteTask.fulfilled, (s, a) => {
        s.tasks = s.tasks.filter(t => t._id !== a.payload);
        s.success = 'Task deleted';
      })
      .addCase(deleteTask.rejected, (s, a) => { s.error = a.payload; });
  }
});
export const { clearStatus } = taskSlice.actions;
export default taskSlice.reducer;
