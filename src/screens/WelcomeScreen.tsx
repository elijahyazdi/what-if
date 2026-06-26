import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { styles } from '../styles/sharedStyles';
import { OnboardingStackParamList } from '../navigation/types';

const wiBackground = require('../../assets/images/wi-background.png');

export const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp<OnboardingStackParamList>>();
  const { colors } = useTheme();

  return (
    <ImageBackground source={wiBackground} style={styles.welcomeContainer} resizeMode="cover">
      <SafeAreaView
        style={[styles.welcomeOverlay, { backgroundColor: colors.bgOverlay }]}
        edges={['top', 'bottom']}
      >
        <View style={styles.welcomeContent}>
          <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>WHAT COULD YOU DO?</Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
            Foster meaningful conversations with children through age-appropriate prompts that spark
            critical thinking and ethical reasoning
          </Text>
        </View>

        <View style={styles.welcomeButtonContainer}>
          <TouchableOpacity
            style={styles.getStartedButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('HowToUse')}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
            <Feather name="chevron-right" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeFooter}>
          <Text style={[styles.welcomeFooterText, { color: colors.textSecondary }]}>
            For Parents, Educators & Therapists
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};
