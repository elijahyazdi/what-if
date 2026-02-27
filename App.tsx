/**
 * App.tsx - Application Entry Point
 *
 * This is the root component of the "What Could You Do?" application.
 * It sets up the navigation container and safe area provider for proper iOS integration.
 *
 * @module App
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import WireframeApp from './WireframeApp';

/**
 * Root application component
 *
 * Wraps the app with NavigationContainer for React Navigation and
 * SafeAreaProvider for proper handling of notches, home indicators, etc.
 *
 * @returns {JSX.Element} The root application component
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* Main application component containing all screens and navigation */}
        <WireframeApp />

        {/* Status bar with automatic styling (light/dark) based on device theme */}
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
