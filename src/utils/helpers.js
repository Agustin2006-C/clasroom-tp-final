import { ASSIGNMENT_STATUS, COLORS } from './constants';

/**
 * Formatea una fecha a string legible
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error en fecha';
  }
};

/**
 * Formatea fecha en formato corto
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  } catch (error) {
    return 'Fecha inválida';
  }
};

/**
 * Verifica si una fecha está vencida
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  
  try {
    return new Date() > new Date(dueDate);
  } catch (error) {
    return false;
  }
};

/**
 * Obtiene el estado de una tarea
 */
export const getAssignmentStatus = (assignment, submission) => {
  if (!assignment) return ASSIGNMENT_STATUS.PENDING;
  
  if (submission) {
    if (submission.grade !== undefined && submission.grade !== null) {
      return ASSIGNMENT_STATUS.GRADED;
    }
    if (submission.submittedAt && assignment.dueDate) {
      try {
        if (new Date(submission.submittedAt) > new Date(assignment.dueDate)) {
          return ASSIGNMENT_STATUS.LATE;
        }
      } catch (error) {
        console.error('Error comparing dates:', error);
      }
    }
    return ASSIGNMENT_STATUS.SUBMITTED;
  }
  
  if (isOverdue(assignment.dueDate)) {
    return ASSIGNMENT_STATUS.LATE;
  }
  
  return ASSIGNMENT_STATUS.PENDING;
};

/**
 * Obtiene el color según el estado
 */
export const getStatusColor = (status) => {
  switch (status) {
    case ASSIGNMENT_STATUS.PENDING:
      return COLORS.warning;
    case ASSIGNMENT_STATUS.SUBMITTED:
      return COLORS.primary;
    case ASSIGNMENT_STATUS.GRADED:
      return COLORS.success;
    case ASSIGNMENT_STATUS.LATE:
      return COLORS.danger;
    default:
      return COLORS.light;
  }
};

/**
 * Obtiene el texto del estado
 */
export const getStatusText = (status) => {
  switch (status) {
    case ASSIGNMENT_STATUS.PENDING:
      return 'Pendiente';
    case ASSIGNMENT_STATUS.SUBMITTED:
      return 'Entregado';
    case ASSIGNMENT_STATUS.GRADED:
      return 'Calificado';
    case ASSIGNMENT_STATUS.LATE:
      return 'Atrasado';
    default:
      return 'Desconocido';
  }
};

/**
 * Valida formato de email
 */
export const validateEmail = (email) => {
  if (!email) return false;
  
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Trunca texto muy largo
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substr(0, maxLength) + '...';
};

/**
 * Calcula el promedio de calificaciones
 */
export const calculateAverageGrade = (submissions) => {
  if (!submissions || !Array.isArray(submissions)) return 0;
  
  const gradedSubmissions = submissions.filter(
    s => s.grade !== undefined && s.grade !== null && !isNaN(s.grade)
  );
  
  if (gradedSubmissions.length === 0) return 0;
  
  const sum = gradedSubmissions.reduce((total, submission) => total + parseFloat(submission.grade), 0);
  return (sum / gradedSubmissions.length).toFixed(1);
};

/**
 * Calcula el porcentaje de completado
 */
export const calculateCompletionRate = (total, completed) => {
  if (!total || total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Formatea el tiempo transcurrido
 */
export const getTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
    if (diffInSeconds < 31536000) return `hace ${Math.floor(diffInSeconds / 2592000)} meses`;
    
    return `hace ${Math.floor(diffInSeconds / 31536000)} años`;
  } catch (error) {
    return 'fecha desconocida';
  }
};

/**
 * Capitaliza la primera letra
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Valida contraseña
 */
export const validatePassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

/**
 * Genera ID único simple
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function para optimizar llamadas
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default {
  formatDate,
  formatDateShort,
  isOverdue,
  getAssignmentStatus,
  getStatusColor,
  getStatusText,
  validateEmail,
  truncateText,
  calculateAverageGrade,
  calculateCompletionRate,
  getTimeAgo,
  capitalizeFirst,
  validatePassword,
  generateId,
  debounce,
};