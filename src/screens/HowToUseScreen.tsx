import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { styles } from '../styles/sharedStyles';

export const HowToUseScreen = ({ onComplete }: { onComplete: () => void }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleGetStarted = () => {
    onComplete();
  };

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.bg }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          contentInsetAdjustmentBehavior="automatic"
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonRow}>
            <Feather name="chevron-left" size={20} color="#e10086" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>HOW TO USE THIS APP</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            A guide to meaningful conversations
          </Text>

          <View style={[styles.instructionCard, { backgroundColor: colors.tintBlue }]}>
            <View style={styles.instructionRow}>
              <View style={[styles.instructionNumber, { backgroundColor: '#90dcff' }]}>
                <Text style={[styles.instructionNumberText, { color: '#49297e' }]}>1</Text>
              </View>
              <View style={styles.instructionText}>
                <Text style={[styles.instructionTitle, { color: colors.textPrimary }]}>Choose an Age Group</Text>
                <Text style={[styles.instructionDescription, { color: colors.textSecondary }]}>
                  Select the age range that best matches the child you're talking with. Prompts are
                  designed to be developmentally appropriate.
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.instructionCard, { backgroundColor: colors.tintGreen }]}>
            <View style={styles.instructionRow}>
              <View style={[styles.instructionNumber, { backgroundColor: '#00db96' }]}>
                <Text style={[styles.instructionNumberText, { color: '#49297e' }]}>2</Text>
              </View>
              <View style={styles.instructionText}>
                <Text style={[styles.instructionTitle, { color: colors.textPrimary }]}>Read the Prompt Together</Text>
                <Text style={[styles.instructionDescription, { color: colors.textSecondary }]}>
                  Share the "What if..." scenario with the child. Use the audio button if helpful.
                  Take your time—there's no rush.
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.instructionCard, { backgroundColor: colors.tintPurple }]}>
            <View style={styles.instructionRow}>
              <View style={[styles.instructionNumber, { backgroundColor: '#49297e' }]}>
                <Text style={styles.instructionNumberText}>3</Text>
              </View>
              <View style={styles.instructionText}>
                <Text style={[styles.instructionTitle, { color: colors.textPrimary }]}>
                  Listen and Explore Together
                </Text>
                <Text style={[styles.instructionDescription, { color: colors.textSecondary }]}>
                  Ask open-ended questions. There are no right or wrong answers. Focus on their
                  thinking process, not finding the "correct" solution.
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.instructionCard, { backgroundColor: colors.tintPink }]}>
            <View style={styles.instructionRow}>
              <View style={[styles.instructionNumber, { backgroundColor: '#e10086' }]}>
                <Text style={styles.instructionNumberText}>4</Text>
              </View>
              <View style={styles.instructionText}>
                <Text style={[styles.instructionTitle, { color: colors.textPrimary }]}>
                  Discuss Multiple Possibilities
                </Text>
                <Text style={[styles.instructionDescription, { color: colors.textSecondary }]}>
                  Encourage thinking about different options. What might happen with each choice?
                  How might others feel? What values matter here?
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
            <Text style={styles.primaryButtonText}>Let's Get Started</Text>
            <Feather name="chevron-right" size={20} color="#fff" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
