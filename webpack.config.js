/**
 * Webpack Configuration for Expo Web
 *
 * Customizes webpack bundling for the web version of the app.
 * Based on Expo's default webpack config with custom modifications for:
 * - Node.js module polyfills (crypto, stream, buffer) for browser compatibility
 * - Vector icons transpilation for proper rendering on web
 *
 * @see https://docs.expo.dev/guides/customizing-webpack/
 */

const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  // Start with Expo's default webpack configuration
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        // Ensure @expo/vector-icons is transpiled for web compatibility
        // This allows icons to render correctly in the browser
        dangerouslyAddModulePathsToTranspile: ['@expo/vector-icons']
      }
    },
    argv
  );

  /**
   * Add Node.js polyfills for browser environment
   *
   * React Native code may use Node.js modules (crypto, stream, buffer)
   * that don't exist in browsers. These polyfills provide browser-compatible
   * implementations of these modules.
   */
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
  };

  return config;
};
