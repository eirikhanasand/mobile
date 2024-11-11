// Imports default configuration function from '@react-native/metro-config'
const { getDefaultConfig } = require('metro-config');

// Imports the Expo Metro configuration function
const { getDefaultConfig: getExpoDefaultConfig } = require('expo/metro-config');

/** @type {import('metro-config').MetroConfig} */
// Merges the configurations from both '@react-native/metro-config' and Expo
const config = getExpoDefaultConfig(__dirname);

// Enables css support
config.resolver.sourceExts.push('css');

// Add SVG support to the resolver
const { resolver: { sourceExts, assetExts } } = getDefaultConfig.getDefaultValues();
config.resolver.assetExts = assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');

// Export the merged configuration
module.exports = config;
