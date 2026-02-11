/**
 * Babel Configuration
 *
 * Configures the Babel JavaScript compiler for the React Native/Expo project.
 * Babel transpiles modern JavaScript and JSX into code compatible with
 * various JavaScript environments.
 *
 * @see https://docs.expo.dev/guides/customizing-metro/#customizing-the-babel-transformer
 */

module.exports = function(api) {
  // Enable Babel configuration caching for better build performance
  api.cache(true);

  return {
    // Use Expo's default Babel preset which includes:
    // - React Native transformations
    // - JSX support
    // - Modern JavaScript features (ES6+)
    // - TypeScript support
    presets: ['babel-preset-expo'],
  };
};
