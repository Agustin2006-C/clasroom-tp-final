import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import assignmentReducer from './slices/assignmentSlice';
import userReducer from './slices/userSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    assignments: assignmentReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});