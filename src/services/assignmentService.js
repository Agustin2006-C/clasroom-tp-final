import { assignmentAPI, submissionAPI } from './api';

export const assignmentService = {
  // Obtener tareas para estudiantes
  async getStudentAssignments() {
    try {
      const response = await assignmentAPI.getAssignments();
      return { success: true, assignments: response.data.assignments };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener tareas para profesores
  async getTeacherAssignments() {
    try {
      const response = await assignmentAPI.getTeacherAssignments();
      return { success: true, assignments: response.data.assignments };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Crear tarea
  async createAssignment(assignmentData) {
    try {
      const response = await assignmentAPI.createAssignment(assignmentData);
      return { success: true, assignment: response.data.assignment };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Actualizar tarea
  async updateAssignment(id, assignmentData) {
    try {
      const response = await assignmentAPI.updateAssignment(id, assignmentData);
      return { success: true, assignment: response.data.assignment };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Eliminar tarea
  async deleteAssignment(id) {
    try {
      await assignmentAPI.deleteAssignment(id);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener tarea por ID
  async getAssignmentById(id) {
    try {
      const response = await assignmentAPI.getAssignmentById(id);
      return { success: true, assignment: response.data.assignment };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Entregar tarea
  async submitAssignment(submissionData) {
    try {
      const response = await submissionAPI.submitAssignment(submissionData);
      return { success: true, submission: response.data.submission };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener entregas del estudiante
  async getStudentSubmissions() {
    try {
      const response = await submissionAPI.getSubmissions();
      return { success: true, submissions: response.data.submissions };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener entregas de una tarea específica
  async getAssignmentSubmissions(assignmentId) {
    try {
      const response = await submissionAPI.getAssignmentSubmissions(assignmentId);
      return { success: true, submissions: response.data.submissions };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Calificar entrega
  async gradeSubmission(submissionId, gradeData) {
    try {
      const response = await submissionAPI.gradeSubmission(submissionId, gradeData);
      return { success: true, submission: response.data.submission };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Obtener entrega por ID
  async getSubmissionById(id) {
    try {
      const response = await submissionAPI.getSubmissionById(id);
      return { success: true, submission: response.data.submission };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};