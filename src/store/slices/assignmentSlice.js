import { createSlice } from '@reduxjs/toolkit';

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState: {
    assignments: [],
    currentAssignment: null,
    submissions: [],
    teacherAssignments: [],
    loading: false,
    error: null,
  },
  reducers: {
    // ===== ASSIGNMENT ACTIONS =====
    
    // Fetch assignments
    fetchAssignmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAssignmentsSuccess: (state, action) => {
      state.loading = false;
      state.assignments = action.payload;
      state.error = null;
    },
    fetchAssignmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch teacher assignments
    fetchTeacherAssignmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTeacherAssignmentsSuccess: (state, action) => {
      state.loading = false;
      state.teacherAssignments = action.payload;
      state.error = null;
    },
    fetchTeacherAssignmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create assignment
    createAssignmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createAssignmentSuccess: (state, action) => {
      state.loading = false;
      state.teacherAssignments.push(action.payload);
      state.error = null;
    },
    createAssignmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update assignment
    updateAssignmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateAssignmentSuccess: (state, action) => {
      state.loading = false;
      const index = state.teacherAssignments.findIndex(
        assignment => assignment._id === action.payload._id
      );
      if (index !== -1) {
        state.teacherAssignments[index] = action.payload;
      }
      state.error = null;
    },
    updateAssignmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete assignment
    deleteAssignmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteAssignmentSuccess: (state, action) => {
      state.loading = false;
      state.teacherAssignments = state.teacherAssignments.filter(
        assignment => assignment._id !== action.payload
      );
      state.error = null;
    },
    deleteAssignmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set current assignment
    setCurrentAssignment: (state, action) => {
      state.currentAssignment = action.payload;
    },
    clearCurrentAssignment: (state) => {
      state.currentAssignment = null;
    },

    // ===== SUBMISSION ACTIONS =====
    
    // Fetch submissions
    fetchSubmissionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSubmissionsSuccess: (state, action) => {
      state.loading = false;
      state.submissions = action.payload;
      state.error = null;
    },
    fetchSubmissionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Submit assignment
    submitAssignmentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    submitAssignmentSuccess: (state, action) => {
      state.loading = false;
      state.submissions.push(action.payload);
      // Update assignment status
      const assignmentIndex = state.assignments.findIndex(
        assignment => assignment._id === action.payload.assignment
      );
      if (assignmentIndex !== -1) {
        state.assignments[assignmentIndex].submitted = true;
        state.assignments[assignmentIndex].submission = action.payload;
      }
      state.error = null;
    },
    submitAssignmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Grade submission
    gradeSubmissionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    gradeSubmissionSuccess: (state, action) => {
      state.loading = false;
      const submissionIndex = state.submissions.findIndex(
        submission => submission._id === action.payload._id
      );
      if (submissionIndex !== -1) {
        state.submissions[submissionIndex] = action.payload;
      }
      state.error = null;
    },
    gradeSubmissionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset state
    resetAssignments: (state) => {
      state.assignments = [];
      state.submissions = [];
      state.teacherAssignments = [];
      state.currentAssignment = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  // Assignment actions
  fetchAssignmentsStart,
  fetchAssignmentsSuccess,
  fetchAssignmentsFailure,
  fetchTeacherAssignmentsStart,
  fetchTeacherAssignmentsSuccess,
  fetchTeacherAssignmentsFailure,
  createAssignmentStart,
  createAssignmentSuccess,
  createAssignmentFailure,
  updateAssignmentStart,
  updateAssignmentSuccess,
  updateAssignmentFailure,
  deleteAssignmentStart,
  deleteAssignmentSuccess,
  deleteAssignmentFailure,
  setCurrentAssignment,
  clearCurrentAssignment,

  // Submission actions
  fetchSubmissionsStart,
  fetchSubmissionsSuccess,
  fetchSubmissionsFailure,
  submitAssignmentStart,
  submitAssignmentSuccess,
  submitAssignmentFailure,
  gradeSubmissionStart,
  gradeSubmissionSuccess,
  gradeSubmissionFailure,

  // Utility actions
  clearError,
  resetAssignments,
} = assignmentSlice.actions;

// Selectors
export const selectAssignments = (state) => state.assignments.assignments;
export const selectTeacherAssignments = (state) => state.assignments.teacherAssignments;
export const selectCurrentAssignment = (state) => state.assignments.currentAssignment;
export const selectSubmissions = (state) => state.assignments.submissions;
export const selectAssignmentsLoading = (state) => state.assignments.loading;
export const selectAssignmentsError = (state) => state.assignments.error;

export default assignmentSlice.reducer;