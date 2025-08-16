import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/projects/projectSlice';
import taskReducer from '../features/tasks/taskSlice';
import adminReducer from "../features/admin/adminSlice";
import analyticsReducer from '../features/analytics/analyticsSlice';
import profileReducer from '../features/profile/profileSlice';



export default configureStore({
  reducer: {
    auth: authReducer,
     admin: adminReducer,
    projects: projectReducer,
     analytics: analyticsReducer,
     profile: profileReducer,
    tasks: taskReducer,
 
  },
});
