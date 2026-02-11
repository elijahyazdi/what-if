/**
 * App.tsx - Application Entry Point
 *
 * This is the root component of the "What Could You Do?" application.
 * It serves as a simple wrapper that renders the main WireframeApp component
 * and configures the status bar for the app.
 *
 * @module App
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import WireframeApp from './WireframeApp';

/**
 * Root application component
 *
 * Renders the main application and sets up the status bar with automatic
 * light/dark mode styling based on the device's appearance settings.
 *
 * @returns {JSX.Element} The root application component
 */
export default function App() {
  return (
    <>
      {/* Main application component containing all screens and logic */}
      <WireframeApp />

      {/* Status bar with automatic styling (light/dark) based on device theme */}
      <StatusBar style="auto" />
    </>
  );
}
