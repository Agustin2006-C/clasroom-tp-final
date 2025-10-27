import * as SecureStore from 'expo-secure-store';
import { authAPI } from './api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      await this.setAuthData(token, user);
      return { success: true, user, token };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Error al iniciar sesión' 
      };
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      await this.setAuthData(token, user);
      return { success: true, user, token };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Error al registrar usuario' 
      };
    }
  },

  // Store authentication data
  async setAuthData(token, user) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error storing auth data:', error);
      return false;
    }
  },

  // Get stored token
  async getToken() {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Get stored user data
  async getUserData() {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Clear authentication data (logout)
  async logout() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  },

  // Get user profile from server
  async getProfile() {
    try {
      const response = await authAPI.getProfile();
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Validate token and get fresh user data
  async validateSession() {
    try {
      const token = await this.getToken();
      if (!token) {
        return { success: false, message: 'No token found' };
      }

      const response = await authAPI.getProfile();
      const user = response.data.user;
      
      // Update stored user data
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error) {
      // If token is invalid, logout
      if (error.status === 401) {
        await this.logout();
      }
      return { success: false, message: error.message };
    }
  },
};