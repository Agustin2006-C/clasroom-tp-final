// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

// User Roles
export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  DIRECTOR: 'director',
};

// Assignment Status
export const ASSIGNMENT_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  LATE: 'late',
};

// Colors
export const COLORS = {
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA3FF',
  secondary: '#5856D6',
  success: '#34C759',
  successDark: '#2A9C46',
  warning: '#FF9500',
  warningDark: '#CC7700',
  danger: '#FF3B30',
  dangerDark: '#CC2E25',
  light: '#8E8E93',
  dark: '#1C1C1E',
  background: '#F2F2F7',
  card: '#FFFFFF',
  border: '#E5E5EA',
  text: '#000000',
  textSecondary: '#8E8E93',
  white: '#FFFFFF',
  black: '#000000',
};

// Grading Scale
export const GRADING_SCALE = {
  MIN: 0,
  MAX: 10,
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD MMMM YYYY',
  WITH_TIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
  ],
  MAX_FILES: 5,
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  APP_SETTINGS: 'app_settings',
};

// Navigation Routes
export const ROUTES = {
  LOGIN: 'Login',
  STUDENT_DASHBOARD: 'StudentDashboard',
  TEACHER_DASHBOARD: 'TeacherDashboard',
  DIRECTOR_DASHBOARD: 'DirectorDashboard',
  ASSIGNMENTS: 'Assignments',
  SUBMISSIONS: 'Submissions',
  CREATE_ASSIGNMENT: 'CreateAssignment',
  GRADE_SUBMISSIONS: 'GradeSubmissions',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'Sesión expirada. Por favor inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'Recurso no encontrado.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  VALIDATION_ERROR: 'Por favor completa todos los campos correctamente.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Inicio de sesión exitoso.',
  REGISTER: 'Usuario registrado exitosamente.',
  ASSIGNMENT_CREATED: 'Tarea creada exitosamente.',
  ASSIGNMENT_UPDATED: 'Tarea actualizada exitosamente.',
  ASSIGNMENT_DELETED: 'Tarea eliminada exitosamente.',
  SUBMISSION_CREATED: 'Tarea entregada exitosamente.',
  SUBMISSION_GRADED: 'Entrega calificada exitosamente.',
};

export default {
  API_BASE_URL,
  ROLES,
  ASSIGNMENT_STATUS,
  COLORS,
  GRADING_SCALE,
  DATE_FORMATS,
  FILE_UPLOAD,
  STORAGE_KEYS,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};