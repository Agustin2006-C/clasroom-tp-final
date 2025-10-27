import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    teachers: [],
    students: [],
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    // ===== USER MANAGEMENT ACTIONS =====
    
    // Fetch users by role
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTeachersSuccess: (state, action) => {
      state.loading = false;
      state.teachers = action.payload;
      state.error = null;
    },
    fetchStudentsSuccess: (state, action) => {
      state.loading = false;
      state.students = action.payload;
      state.error = null;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set current user (for director viewing teacher details)
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },

    // Update user
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      const updatedUser = action.payload;
      
      // Update in teachers array if exists
      const teacherIndex = state.teachers.findIndex(
        teacher => teacher._id === updatedUser._id
      );
      if (teacherIndex !== -1) {
        state.teachers[teacherIndex] = updatedUser;
      }
      
      // Update in students array if exists
      const studentIndex = state.students.findIndex(
        student => student._id === updatedUser._id
      );
      if (studentIndex !== -1) {
        state.students[studentIndex] = updatedUser;
      }
      
      // Update current user if it's the same
      if (state.currentUser && state.currentUser._id === updatedUser._id) {
        state.currentUser = updatedUser;
      }
      
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Deactivate user
    deactivateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deactivateUserSuccess: (state, action) => {
      state.loading = false;
      const deactivatedUserId = action.payload;
      
      // Remove from teachers array
      state.teachers = state.teachers.filter(
        teacher => teacher._id !== deactivatedUserId
      );
      
      // Remove from students array
      state.students = state.students.filter(
        student => student._id !== deactivatedUserId
      );
      
      // Clear current user if it's the same
      if (state.currentUser && state.currentUser._id === deactivatedUserId) {
        state.currentUser = null;
      }
      
      state.error = null;
    },
    deactivateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Add user (for when new users register)
    addUser: (state, action) => {
      const newUser = action.payload;
      if (newUser.role === 'teacher') {
        state.teachers.push(newUser);
      } else if (newUser.role === 'student') {
        state.students.push(newUser);
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset state
    resetUsers: (state) => {
      state.teachers = [];
      state.students = [];
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  // User fetching
  fetchUsersStart,
  fetchTeachersSuccess,
  fetchStudentsSuccess,
  fetchUsersFailure,

  // Current user management
  setCurrentUser,
  clearCurrentUser,

  // User updates
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,

  // User deactivation
  deactivateUserStart,
  deactivateUserSuccess,
  deactivateUserFailure,

  // Add user
  addUser,

  // Utility actions
  clearError,
  resetUsers,
} = userSlice.actions;

// Selectors
export const selectTeachers = (state) => state.users.teachers;
export const selectStudents = (state) => state.users.students;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;

// Helper selectors
export const selectUserById = (state, userId) => {
  const allUsers = [...state.users.teachers, ...state.users.students];
  return allUsers.find(user => user._id === userId);
};

export const selectUsersByRole = (state, role) => {
  if (role === 'teacher') {
    return state.users.teachers;
  } else if (role === 'student') {
    return state.users.students;
  }
  return [];
};

export default userSlice.reducer;