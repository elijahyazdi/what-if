import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/sharedStyles';

export const LoadingScreen = () => (
  <LinearGradient colors={['#f8f4ff', '#ece6f4', '#fce0f0']} style={styles.loadingGradient}>
    <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
      <View style={styles.loadingQuestionMark}>
        <Text style={styles.loadingQuestionMarkText}>?</Text>
      </View>
      <Text style={styles.loadingTitle}>WHAT COULD YOU DO?</Text>
    </SafeAreaView>
  </LinearGradient>
);
