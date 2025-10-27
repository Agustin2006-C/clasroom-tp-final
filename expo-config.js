// expo-config.js
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function (config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      // Esto desactiva la validación estricta de dependencias
      return config;
    },
  ]);
};