import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.user.role;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;
    },

    // Logout action
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;
      state.loading = false;
    },

    // Update user profile
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Refresh token
    refreshToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  clearError,
  setLoading,
  refreshToken,
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;