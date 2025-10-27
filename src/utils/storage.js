import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from './constants';

export const storage = {
  /**
   * Guardar item en almacenamiento seguro
   */
  async setItem(key, value) {
    try {
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      await SecureStore.setItemAsync(key, value);
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      return false;
    }
  },

  /**
   * Obtener item del almacenamiento seguro
   */
  async getItem(key) {
    try {
      let value = await SecureStore.getItemAsync(key);
      
      if (!value) return null;
      
      // Intentar parsear como JSON
      try {
        return JSON.parse(value);
      } catch {
        // Si no es JSON, devolver como string
        return value;
      }
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  /**
   * Eliminar item del almacenamiento
   */
  async removeItem(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error('Error removing from storage:', error);
      return false;
    }
  },

  /**
   * Limpiar todo el almacenamiento
   */
  async clear() {
    try {
      // Eliminar todas las keys conocidas
      const keys = Object.values(STORAGE_KEYS);
      
      for (const key of keys) {
        await SecureStore.deleteItemAsync(key);
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },

  /**
   * Obtener múltiples items
   */
  async multiGet(keys) {
    try {
      const results = {};
      
      for (const key of keys) {
        results[key] = await this.getItem(key);
      }
      
      return results;
    } catch (error) {
      console.error('Error in multiGet:', error);
      return {};
    }
  },

  /**
   * Guardar múltiples items
   */
  async multiSet(keyValuePairs) {
    try {
      for (const [key, value] of keyValuePairs) {
        await this.setItem(key, value);
      }
      return true;
    } catch (error) {
      console.error('Error in multiSet:', error);
      return false;
    }
  },
};

// Alias para métodos comunes
export const SecureStorage = {
  set: storage.setItem,
  get: storage.getItem,
  remove: storage.removeItem,
  clear: storage.clear,
};

export default storage;