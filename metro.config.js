const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Reduce file watching to help with iCloud Drive
config.watchFolders = [__dirname];

// Reduce the number of workers
config.maxWorkers = 2;

module.exports = config;
