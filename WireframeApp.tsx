/**
 * WireframeApp.tsx - Main Application Component with React Navigation
 *
 * This is the primary component for the "What Could You Do?" application.
 * It implements React Navigation with proper iOS design patterns including:
 * - Stack navigation for onboarding flow
 * - Tab navigation for main app
 * - SafeAreaView for notch/home indicator handling
 * - iOS-compliant spacing, borders, and components
 *
 * @module WireframeApp
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Platform,
  KeyboardAvoidingView,
  ActionSheetIOS,
  Alert,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography, Spacing, getBottomPadding } from './utils/deviceHelpers';
const wiBackground = require('./assets/images/wi-background.png');

// ==================== THEME SYSTEM ====================

const themes = {
  light: {
    bg: '#fff',
    bgSubtle: '#f9fafb',
    bgMuted: '#f3f4f6',
    bgOverlay: 'rgba(248, 244, 255, 0.75)',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    border: '#e5e7eb',
    iconDefault: '#6b7280',
    iconInactive: '#9ca3af',
    cardBg: '#fff',
    tintBlue: '#e8f6ff',
    tintGreen: '#d6f9ed',
    tintPurple: '#ece6f4',
    tintPink: '#fce0f0',
    tipsBg: '#ece6f4',
    tipsBoxBg: '#f9fafb',
    tipsBoxBorder: 'rgba(73, 41, 126, 0.2)',
    switchTrackFalse: '#d1d5db',
    tabBarBg: '#fff',
    tabBarBorder: '#e5e7eb',
    filterInactiveBg: '#f3f4f6',
    gradientStops: ['#f8f4ff', '#ece6f4', '#fce0f0'] as string[],
  },
  dark: {
    bg: '#121212',
    bgSubtle: '#1e1e1e',
    bgMuted: '#2a2a2a',
    bgOverlay: 'rgba(18, 18, 18, 0.85)',
    textPrimary: '#f3f4f6',
    textSecondary: '#9ca3af',
    border: '#333333',
    iconDefault: '#9ca3af',
    iconInactive: '#6b7280',
    cardBg: '#1e1e1e',
    tintBlue: '#1a2a3a',
    tintGreen: '#1a2e28',
    tintPurple: '#2a1e3a',
    tintPink: '#3a1a2a',
    tipsBg: '#2a1e3a',
    tipsBoxBg: '#1e1e1e',
    tipsBoxBorder: 'rgba(73, 41, 126, 0.4)',
    switchTrackFalse: '#444444',
    tabBarBg: '#121212',
    tabBarBorder: '#333333',
    filterInactiveBg: '#2a2a2a',
    gradientStops: ['#1a1025', '#2a1e3a', '#3a1a2a'] as string[],
  },
} as const;

type ThemeColors = Omit<{ [K in keyof typeof themes.light]: string }, 'gradientStops'> & {
  gradientStops: string[];
};

type ThemeContextType = {
  isDark: boolean;
  colors: ThemeColors;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: themes.light,
  toggleDarkMode: () => {},
});

const useTheme = () => useContext(ThemeContext);

// Navigation type definitions
type RootStackParamList = {
  Onboarding: undefined;
  MainApp: undefined;
};

type OnboardingStackParamList = {
  Welcome: undefined;
  HowToUse: undefined;
};

type MainTabParamList = {
  Home: undefined;
  Community: undefined;
  Profile: undefined;
  Settings: undefined;
  Prompt: undefined;
  Developer: undefined;
  Loading: undefined;
};

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const OnboardingStack = createStackNavigator<OnboardingStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createStackNavigator();
const CommunityStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const SettingsStack = createStackNavigator();

/**
 * Main application component
 * Sets up root navigation structure
 */
const WireframeApp = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    AsyncStorage.getItem('darkMode').then(val => {
      if (val === 'true') setIsDark(true);
    });
  }, []);

  const toggleDarkMode = () => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem('darkMode', String(next));
      return next;
    });
  };

  const colors = isDark ? themes.dark : themes.light;

  // Load custom fonts on component mount
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Barrio-Regular': require('./assets/fonts/Barrio-Regular.ttf'),
          'RoadRage-Regular': require('./assets/fonts/RoadRage-Regular.ttf'),
          'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
          'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  // Check if this is the user's first time launching the app
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunchedBefore');
        setIsFirstLaunch(hasLaunched === null);
      } catch (error) {
        console.error('Error checking first launch:', error);
        setIsFirstLaunch(true);
      }
    };

    checkFirstLaunch();
  }, []);

  // Function to complete onboarding
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasLaunchedBefore', 'true');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error setting launch flag:', error);
    }
  };

  // Show loading screen during initialization
  if (isFirstLaunch === null || !fontsLoaded) {
    return <LoadingScreenComponent />;
  }

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleDarkMode }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen name="Onboarding">
            {() => <OnboardingNavigator onComplete={completeOnboarding} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </ThemeContext.Provider>
  );
};

/**
 * Onboarding Stack Navigator
 * Handles welcome flow for first-time users
 */
const OnboardingNavigator = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="HowToUse">
        {() => <HowToUseScreen onComplete={onComplete} />}
      </OnboardingStack.Screen>
    </OnboardingStack.Navigator>
  );
};

/**
 * Home Stack Navigator
 * Handles navigation within the Home tab (Home -> Prompt)
 */
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Prompt" component={PromptScreen} />
    </HomeStack.Navigator>
  );
};

/**
 * Community Stack Navigator
 */
const CommunityStackNavigator = () => {
  return (
    <CommunityStack.Navigator screenOptions={{ headerShown: false }}>
      <CommunityStack.Screen name="CommunityMain" component={CommunityScreen} />
    </CommunityStack.Navigator>
  );
};

/**
 * Profile Stack Navigator
 */
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};

/**
 * Settings Stack Navigator
 */
const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
};

/**
 * Main Tab Navigator
 * Bottom tab navigation for main app screens
 */
const MainTabNavigator = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Community') iconName = 'users';
          else if (route.name === 'Profile') iconName = 'user';
          else if (route.name === 'Settings') iconName = 'settings';

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e10086',
        tabBarInactiveTintColor: colors.iconInactive,
        tabBarStyle: {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.tabBarBorder,
          backgroundColor: colors.tabBarBg,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          height: Platform.OS === 'ios' ? 88 : 60,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Community" component={CommunityStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
};

// ==================== LOADING SCREEN ====================

const LoadingScreenComponent = () => (
  <LinearGradient colors={['#f8f4ff', '#ece6f4', '#fce0f0']} style={styles.loadingGradient}>
    <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
      <View style={styles.loadingQuestionMark}>
        <Text style={styles.loadingQuestionMarkText}>?</Text>
      </View>
      <Text style={styles.loadingTitle}>WHAT COULD YOU DO?</Text>
    </SafeAreaView>
  </LinearGradient>
);

// ==================== WELCOME SCREEN ====================

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp<OnboardingStackParamList>>();
  const { colors } = useTheme();

  return (
    <ImageBackground
      source={wiBackground}
      style={styles.welcomeContainer}
      resizeMode="cover"
    >
      <SafeAreaView style={[styles.welcomeOverlay, { backgroundColor: colors.bgOverlay }]} edges={['top', 'bottom']}>
        <View style={styles.welcomeContent}>
          <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>WHAT COULD YOU DO?</Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
            Foster meaningful conversations with children through age-appropriate prompts that spark critical thinking and ethical reasoning
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
          <Text style={[styles.welcomeFooterText, { color: colors.textSecondary }]}>For Parents, Educators & Therapists</Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

// ==================== HOW TO USE SCREEN ====================

const HowToUseScreen = ({ onComplete }: { onComplete: () => void }) => {
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
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>A guide to meaningful conversations</Text>

          <View style={[styles.instructionCard, { backgroundColor: colors.tintBlue }]}>
            <View style={styles.instructionRow}>
              <View style={[styles.instructionNumber, { backgroundColor: '#90dcff' }]}>
                <Text style={[styles.instructionNumberText, { color: '#49297e' }]}>1</Text>
              </View>
              <View style={styles.instructionText}>
                <Text style={[styles.instructionTitle, { color: colors.textPrimary }]}>Choose an Age Group</Text>
                <Text style={[styles.instructionDescription, { color: colors.textSecondary }]}>
                  Select the age range that best matches the child you're talking with. Prompts are designed to be developmentally appropriate.
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
                  Share the "What if..." scenario with the child. Use the audio button if helpful. Take your time—there's no rush.
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
                <Text style={[styles.instructionTitle, { color: colors.textPrimary }]}>Listen and Explore Together</Text>
                <Text style={[styles.instructionDescription, { color: colors.textSecondary }]}>
                  Ask open-ended questions. There are no right or wrong answers. Focus on their thinking process, not finding the "correct" solution.
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
                <Text style={[styles.instructionTitle, { color: colors.textPrimary }]}>Discuss Multiple Possibilities</Text>
                <Text style={[styles.instructionDescription, { color: colors.textSecondary }]}>
                  Encourage thinking about different options. What might happen with each choice? How might others feel? What values matter here?
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.primaryButtonText}>Let's Get Started</Text>
            <Feather name="chevron-right" size={20} color="#fff" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ==================== HOME SCREEN ====================

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const { colors } = useTheme();
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const ageGroups = [
    { id: '3-5', label: '3-5 years', bgColor: '#90dcff', labelColor: '#111827', countColor: '#4b5563', accentColor: '#5cb8e6' },
    { id: '6-8', label: '6-8 years', bgColor: '#00db96', labelColor: '#111827', countColor: '#4b5563', accentColor: '#00b87e' },
    { id: '9-12', label: '9-12 years', bgColor: '#e10086', labelColor: '#fff', countColor: 'rgba(255,255,255,0.85)', accentColor: '#b8006e' },
    { id: '13-15', label: '13-15+ years', bgColor: '#fdfb76', labelColor: '#49297e', countColor: '#49297e', accentColor: '#d4d260' }
  ];

  const prompts: { [key: string]: string[] } = {
    '3-5': [
      "What if you really want a toy that another kid is playing with? What could you do?",
      "What if you accidentally spill your juice on the floor? What could you do?",
      "What if you feel scared at bedtime? What could you do?"
    ],
    '6-8': [
      "What if you see someone being mean to the new student? What could you do?",
      "What if you break something that belongs to a friend? What could you do?",
      "What if you're feeling left out at recess? What could you do?"
    ],
    '9-12': [
      "What if your friend asks you to lie to their parents? What could you do?",
      "What if you see someone cheating on a test? What could you do?",
      "What if you're struggling with homework but afraid to ask for help? What could you do?"
    ],
    '13-15': [
      "What if your friends pressure you to do something you're uncomfortable with? What could you do?",
      "What if you discover a friend is being bullied online? What could you do?",
      "What if you disagree strongly with something your parents decided? What could you do?"
    ]
  };

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Start a meaningful conversation</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <View style={[styles.homeCard, { backgroundColor: colors.cardBg }]}>
          <Text style={styles.homeCardWatermark}>?</Text>
          <Text style={[styles.homeCardTitle, { color: colors.textPrimary }]}>READY TO EXPLORE?</Text>
          <Text style={[styles.homeCardDescription, { color: colors.textSecondary }]}>
            Choose an age group to begin your conversation journey
          </Text>
          <View style={styles.ageGroupGrid}>
            {ageGroups.map(group => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.ageGroupButton,
                  {
                    backgroundColor: group.bgColor,
                    borderBottomWidth: 3,
                    borderBottomColor: group.accentColor,
                  }
                ]}
                onPress={() => {
                  setSelectedAge(group.id);
                  setCurrentPromptIndex(0);
                  navigation.navigate('Prompt' as never);
                }}
              >
                <Text style={[styles.ageGroupLabel, { color: group.labelColor }]}>{group.label}</Text>
                <Text style={[styles.ageGroupCount, { color: group.countColor }]}>{prompts[group.id].length} prompts</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedAge && (
          <View style={[styles.continueCard, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.continueTitle, { color: colors.textPrimary }]}>Continue where you left off</Text>
            <View style={styles.continueDescriptionRow}>
              <View style={[styles.continueColorDot, { backgroundColor: ageGroups.find(g => g.id === selectedAge)?.bgColor }]} />
              <Text style={[styles.continueDescription, { color: colors.textSecondary }]}>
                Ages {ageGroups.find(g => g.id === selectedAge)?.label} • Prompt {currentPromptIndex + 1} of {prompts[selectedAge].length}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Prompt' as never)}
            >
              <Text style={styles.primaryButtonText}>Resume</Text>
              <Feather name="chevron-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.tipsCard, { backgroundColor: colors.tipsBg }]}>
          <Text style={[styles.tipsTitle, { color: colors.textPrimary }]}>Quick Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Feather name="check-circle" size={16} color="#00db96" />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>There are no right or wrong answers</Text>
            </View>
            <View style={styles.tipItem}>
              <Feather name="compass" size={16} color="#90dcff" />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>Focus on the thinking process</Text>
            </View>
            <View style={styles.tipItem}>
              <Feather name="heart" size={16} color="#e10086" />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>Listen without judgment</Text>
            </View>
            <View style={styles.tipItem}>
              <Feather name="message-circle" size={16} color="#49297e" />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>Share your thoughts too</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ==================== COMMUNITY SCREEN ====================

const CommunityScreen = () => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Share and discover prompts</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <LinearGradient
          colors={['#90dcff', '#00db96']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.communityHeaderCard}
        >
          <Text style={styles.communityHeaderTitle}>SHARE YOUR IDEAS</Text>
          <Text style={styles.communityHeaderDescription}>
            Share prompts you've created or favorites you've discovered. Help other parents, educators, and therapists spark meaningful conversations.
          </Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Create New Prompt</Text>
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
          <TouchableOpacity style={styles.filterButtonActive}>
            <Text style={styles.filterButtonActiveText}>All Prompts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.filterInactiveBg }]}>
            <Text style={[styles.filterButtonText, { color: colors.textSecondary }]}>My Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.filterInactiveBg }]}>
            <Text style={[styles.filterButtonText, { color: colors.textSecondary }]}>My Submissions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.filterInactiveBg }]}>
            <Text style={[styles.filterButtonText, { color: colors.textSecondary }]}>Trending</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={[styles.communityPostCard, { backgroundColor: colors.cardBg }]}>
          <View style={styles.postHeader}>
            <View style={styles.postUserInfo}>
              <View style={[styles.avatar, { backgroundColor: '#90dcff' }]}>
                <Feather name="user" size={20} color="#49297e" />
              </View>
              <View>
                <Text style={[styles.postUserName, { color: colors.textPrimary }]}>Sarah M.</Text>
                <Text style={[styles.postMeta, { color: colors.textSecondary }]}>Parent • 2 days ago</Text>
              </View>
            </View>
            <View style={[styles.ageBadge, { backgroundColor: '#00db96' }]}>
              <Text style={styles.ageBadgeText}>Ages 6-8</Text>
            </View>
          </View>
          <Text style={[styles.postContent, { color: colors.textPrimary }]}>
            What if you found a lost wallet with money in it? What could you do?
          </Text>
          <View style={[styles.postActions, { borderTopColor: colors.border }]}>
            <TouchableOpacity style={styles.postAction}>
              <Feather name="heart" size={18} color={colors.iconDefault} />
              <Text style={[styles.postActionText, { color: colors.textSecondary }]}>24</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Feather name="message-circle" size={18} color={colors.iconDefault} />
              <Text style={[styles.postActionText, { color: colors.textSecondary }]}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Feather name="share-2" size={18} color={colors.iconDefault} />
              <Text style={[styles.postActionText, { color: colors.textSecondary }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.communityPostCard, { backgroundColor: colors.cardBg }]}>
          <View style={styles.postHeader}>
            <View style={styles.postUserInfo}>
              <View style={[styles.avatar, { backgroundColor: '#e10086' }]}>
                <Feather name="user" size={20} color="#fff" />
              </View>
              <View>
                <Text style={[styles.postUserName, { color: colors.textPrimary }]}>Michael T.</Text>
                <Text style={[styles.postMeta, { color: colors.textSecondary }]}>Educator • 5 days ago</Text>
              </View>
            </View>
            <View style={[styles.ageBadge, { backgroundColor: '#e10086' }]}>
              <Text style={[styles.ageBadgeText, { color: '#fff' }]}>Ages 9-12</Text>
            </View>
          </View>
          <Text style={[styles.postContent, { color: colors.textPrimary }]}>
            What if you noticed a classmate was always alone at lunch? What could you do?
          </Text>
          <View style={[styles.postActions, { borderTopColor: colors.border }]}>
            <TouchableOpacity style={styles.postAction}>
              <Feather name="heart" size={18} color="#e10086" />
              <Text style={[styles.postActionText, { color: colors.textSecondary }]}>42</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Feather name="message-circle" size={18} color={colors.iconDefault} />
              <Text style={[styles.postActionText, { color: colors.textSecondary }]}>15</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Feather name="share-2" size={18} color={colors.iconDefault} />
              <Text style={[styles.postActionText, { color: colors.textSecondary }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ==================== PROFILE SCREEN ====================

const ProfileScreen = () => {
  const { colors, isDark } = useTheme();
  const [contentFilter, setContentFilter] = useState('vetted');

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Your conversation journey</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.profileHeaderCard}>
          <View style={styles.profileInfo}>
            <View style={[styles.profileAvatar, { backgroundColor: '#49297e' }]}>
              <Feather name="user" size={32} color="#fff" />
            </View>
            <View>
              <Text style={styles.profileName}>WELCOME BACK!</Text>
              <Text style={styles.profileRole}>Parent & Educator</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.statsCard, { backgroundColor: colors.cardBg }]}>
          <Text style={[styles.statsTitle, { color: colors.textPrimary }]}>Your Activity</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { backgroundColor: '#90dcff' }]}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Prompts Explored</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: '#00db96' }]}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: '#e10086' }]}>
              <Text style={[styles.statValue, { color: '#fff' }]}>4</Text>
              <Text style={[styles.statLabel, { color: '#fff' }]}>Age Groups Used</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: '#fdfb76' }]}>
              <Text style={[styles.statValue, { color: '#49297e' }]}>2</Text>
              <Text style={[styles.statLabel, { color: '#49297e' }]}>Prompts Submitted</Text>
            </View>
          </View>
        </View>

        <View style={[styles.contentFilterCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.contentFilterHeader}>
            <Feather name="shield" size={20} color="#49297e" />
            <Text style={[styles.contentFilterTitle, { color: colors.textPrimary }]}>QUALITY & SAFETY</Text>
          </View>
          <Text style={[styles.contentFilterDescription, { color: colors.textSecondary }]}>
            Control what user-created content appears in your feed
          </Text>

          <TouchableOpacity style={styles.radioOption} onPress={() => setContentFilter('all')}>
            <View style={styles.radioButton}>
              {contentFilter === 'all' && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.radioContent}>
              <Text style={[styles.radioLabel, { color: colors.textPrimary }]}>Display All User Created Content</Text>
              <Text style={[styles.radioDescription, { color: colors.textSecondary }]}>Show all community prompts without filtering</Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.radioDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.radioOption} onPress={() => setContentFilter('vetted')}>
            <View style={styles.radioButton}>
              {contentFilter === 'vetted' && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.radioContent}>
              <View style={styles.radioLabelRow}>
                <Text style={[styles.radioLabel, { color: colors.textPrimary }]}>Display User Created Content After Vetting</Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedBadgeText}>Recommended</Text>
                </View>
              </View>
              <Text style={[styles.radioDescription, { color: colors.textSecondary }]}>Only show prompts reviewed by our moderation team</Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.radioDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.radioOption} onPress={() => setContentFilter('friends')}>
            <View style={styles.radioButton}>
              {contentFilter === 'friends' && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.radioContent}>
              <Text style={[styles.radioLabel, { color: colors.textPrimary }]}>Display Only User Created Content from Friends</Text>
              <Text style={[styles.radioDescription, { color: colors.textSecondary }]}>Most restrictive - only see prompts from your connections</Text>
            </View>
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={['#49297e', '#3a1d66']}
          style={styles.upgradeCard}
        >
          <Text style={styles.upgradeTitle}>UPGRADE TO PROFESSIONAL</Text>
          <Text style={styles.upgradeDescription}>
            Access case management, analytics, and specialized prompt libraries
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Learn More</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

// ==================== PROMPT SCREEN ====================

const PromptScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [selectedAge] = useState('3-5'); // Default age group
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const ageGroups = [
    { id: '3-5', label: '3-5 years', bgColor: '#90dcff', textColor: '#111827' },
    { id: '6-8', label: '6-8 years', bgColor: '#00db96', textColor: '#111827' },
    { id: '9-12', label: '9-12 years', bgColor: '#e10086', textColor: '#fff' },
    { id: '13-15', label: '13-15+ years', bgColor: '#fdfb76', textColor: '#49297e' }
  ];

  const prompts: { [key: string]: string[] } = {
    '3-5': [
      "What if you really want a toy that another kid is playing with? What could you do?",
      "What if you accidentally spill your juice on the floor? What could you do?",
      "What if you feel scared at bedtime? What could you do?"
    ],
    '6-8': [
      "What if you see someone being mean to the new student? What could you do?",
      "What if you break something that belongs to a friend? What could you do?",
      "What if you're feeling left out at recess? What could you do?"
    ],
    '9-12': [
      "What if your friend asks you to lie to their parents? What could you do?",
      "What if you see someone cheating on a test? What could you do?",
      "What if you're struggling with homework but afraid to ask for help? What could you do?"
    ],
    '13-15': [
      "What if your friends pressure you to do something you're uncomfortable with? What could you do?",
      "What if you discover a friend is being bullied online? What could you do?",
      "What if you disagree strongly with something your parents decided? What could you do?"
    ]
  };

  const currentPrompt = prompts[selectedAge][currentPromptIndex];
  const totalPrompts = prompts[selectedAge].length;
  const currentAgeGroup = ageGroups.find(g => g.id === selectedAge);
  const ageLabel = currentAgeGroup?.label;
  const promptId = `${selectedAge}-${currentPromptIndex}`;
  const isFavorited = favorites.includes(promptId);

  const toggleFavorite = () => {
    if (isFavorited) {
      setFavorites(favorites.filter(id => id !== promptId));
    } else {
      setFavorites([...favorites, promptId]);
    }
  };

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={[styles.promptHeader, { backgroundColor: colors.bg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonRow}>
          <Feather name="chevron-left" size={20} color="#e10086" />
          <Text style={styles.backButtonText}>Home</Text>
        </TouchableOpacity>
        <View style={styles.promptHeaderRow}>
          <View>
            <Text style={[styles.promptAgeLabel, { color: colors.textPrimary }]}>Ages {ageLabel}</Text>
            <Text style={[styles.promptCounter, { color: colors.textSecondary }]}>Prompt {currentPromptIndex + 1} of {totalPrompts}</Text>
          </View>
          <View style={styles.promptActions}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: isFavorited ? '#fdfb76' : colors.bgMuted }]}
              onPress={toggleFavorite}
            >
              <Feather
                name="star"
                size={24}
                color={isFavorited ? '#ca8a04' : colors.iconDefault}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#49297e' }]}>
              <Feather name="volume-2" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={[styles.promptHeaderBar, { backgroundColor: currentAgeGroup?.bgColor }]} />

      <View style={styles.promptContentContainer}>
        <View style={[styles.promptCard, { backgroundColor: currentAgeGroup?.bgColor }]}>
          <Text style={[styles.promptText, { color: currentAgeGroup?.textColor }]}>{currentPrompt}</Text>
        </View>

        <View style={[styles.tipsBox, { backgroundColor: colors.tipsBoxBg, borderColor: colors.tipsBoxBorder }]}>
          <Text style={[styles.tipsBoxTitle, { color: colors.textPrimary }]}>Discussion Tips:</Text>
          <View style={styles.tipsBoxList}>
            <View style={styles.tipsBoxRow}>
              <Feather name="heart" size={14} color="#e10086" />
              <Text style={[styles.tipsBoxItem, { color: colors.textSecondary }]}>Listen without judgment</Text>
            </View>
            <View style={styles.tipsBoxRow}>
              <Feather name="help-circle" size={14} color="#90dcff" />
              <Text style={[styles.tipsBoxItem, { color: colors.textSecondary }]}>Ask follow-up questions</Text>
            </View>
            <View style={styles.tipsBoxRow}>
              <Feather name="compass" size={14} color="#00db96" />
              <Text style={[styles.tipsBoxItem, { color: colors.textSecondary }]}>Explore multiple solutions</Text>
            </View>
            <View style={styles.tipsBoxRow}>
              <Feather name="message-circle" size={14} color="#49297e" />
              <Text style={[styles.tipsBoxItem, { color: colors.textSecondary }]}>Share your own thoughts too</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.bottomButtonContainer, { backgroundColor: colors.bg, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.primaryButton, styles.nextPromptButton]}
          activeOpacity={0.85}
          onPress={() => {
            const next = (currentPromptIndex + 1) % totalPrompts;
            setCurrentPromptIndex(next);
          }}
        >
          <Text style={styles.primaryButtonText}>Next Prompt</Text>
          <Feather name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ==================== SETTINGS SCREEN ====================

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { isDark, colors, toggleDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  /**
   * Show iOS ActionSheet for destructive actions
   * Implements iOS-native action sheet for Log Out
   */
  const showLogOutActionSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Log Out'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          title: 'Are you sure you want to log out?',
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            // Handle log out
            Alert.alert('Logged Out', 'You have been logged out successfully.');
          }
        }
      );
    } else {
      // Fallback for Android
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log Out', style: 'destructive', onPress: () => {} },
        ]
      );
    }
  };

  /**
   * Show iOS ActionSheet for account deletion
   * Implements iOS-native action sheet with strong destructive styling
   */
  const showDeleteAccountActionSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Delete Account'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          title: 'Delete Account?',
          message: 'This action cannot be undone. All your data will be permanently deleted.',
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            // Show confirmation
            Alert.alert(
              'Confirm Deletion',
              'Type DELETE to confirm account deletion',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => {} },
              ]
            );
          }
        }
      );
    } else {
      // Fallback for Android
      Alert.alert(
        'Delete Account',
        'This action cannot be undone. All your data will be permanently deleted.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete Account', style: 'destructive', onPress: () => {} },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Customize your experience</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>ACCOUNT</Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.cardBg }]}>
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="user" size={20} color={colors.iconDefault} />
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Edit Profile</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
            <View style={[styles.settingsDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="mail" size={20} color={colors.iconDefault} />
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Email Preferences</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
            <View style={[styles.settingsDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="lock" size={20} color={colors.iconDefault} />
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Privacy & Security</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>PREFERENCES</Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.cardBg }]}>
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="bell" size={20} color={colors.iconDefault} />
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.switchTrackFalse, true: '#e10086' }}
                thumbColor="#fff"
              />
            </View>
            <View style={[styles.settingsDivider, { backgroundColor: colors.border }]} />
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="volume-2" size={20} color={colors.iconDefault} />
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Text-to-Speech</Text>
              </View>
              <Switch
                value={ttsEnabled}
                onValueChange={setTtsEnabled}
                trackColor={{ false: colors.switchTrackFalse, true: '#49297e' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingsDivider} />
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="moon" size={20} color={colors.iconDefault} />
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.switchTrackFalse, true: '#49297e' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingsDivider} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="globe" size={20} color={colors.iconDefault} />
                <View>
                  <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Language</Text>
                  <Text style={[styles.settingsItemSubtext, { color: colors.textSecondary }]}>English</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>SUPPORT & INFO</Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.cardBg }]}>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => (navigation as any).navigate('Welcome')}
            >
              <View style={styles.settingsItemLeft}>
                <Feather name="book-open" size={20} color={colors.iconDefault} />
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>View Welcome Guide</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
            <View style={[styles.settingsDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="help-circle" size={20} color={colors.iconDefault} />
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Help & FAQ</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
            <View style={[styles.settingsDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="mail" size={20} color={colors.iconDefault} />
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Contact Support</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
            <View style={[styles.settingsDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="file-text" size={20} color={colors.iconDefault} />
                <View>
                  <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>About</Text>
                  <Text style={[styles.settingsItemSubtext, { color: colors.textSecondary }]}>Version 1.0.0</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
          </View>
        </View>

        <LinearGradient
          colors={['#49297e', '#3a1d66']}
          style={styles.upgradeCard}
        >
          <Text style={styles.upgradeTitle}>GO PROFESSIONAL</Text>
          <Text style={styles.upgradeDescription}>
            Unlock advanced features for educators and therapists
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={[styles.settingsCard, { backgroundColor: colors.cardBg }]}>
          <TouchableOpacity style={styles.settingsItem} onPress={showLogOutActionSheet}>
            <View style={styles.settingsItemLeft}>
              <Feather name="log-out" size={20} color={colors.iconDefault} />
              <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Log Out</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.iconInactive} />
          </TouchableOpacity>
          <View style={[styles.settingsDivider, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.settingsItem} onPress={showDeleteAccountActionSheet}>
            <View style={styles.settingsItemLeft}>
              <Feather name="trash-2" size={20} color="#dc2626" />
              <Text style={[styles.settingsItemText, { color: '#dc2626' }]}>Delete Account</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#fca5a5" />
          </TouchableOpacity>
        </View>

        <View style={[styles.settingsCard, { backgroundColor: colors.cardBg, marginTop: Spacing.lg }]}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={async () => {
              await AsyncStorage.multiRemove(['hasLaunchedBefore', 'darkMode']);
              Alert.alert('Reset Complete', 'Restart the app to see the welcome screen.');
            }}
          >
            <View style={styles.settingsItemLeft}>
              <Feather name="refresh-cw" size={20} color="#ca8a04" />
              <View>
                <Text style={[styles.settingsItemText, { color: '#ca8a04' }]}>Reset Onboarding (Dev)</Text>
                <Text style={[styles.settingsItemSubtext, { color: colors.textSecondary }]}>Clears first-launch flag & dark mode</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ==================== SHARED SHADOW STYLES ====================

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};

const subtleShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 1,
};

// ==================== STYLES ====================

const styles = StyleSheet.create({
  // Loading Screen
  loadingGradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingQuestionMark: {
    marginBottom: Spacing.lg,
  },
  loadingQuestionMarkText: {
    fontSize: 120,
    fontWeight: 'bold',
    fontFamily: 'Barrio-Regular',
    color: '#49297e',
    opacity: 0.15,
  },
  loadingTitle: {
    fontSize: Typography.largeTitle,
    fontFamily: 'Barrio-Regular',
    color: '#111827',
    textAlign: 'center',
  },

  // Welcome Screen
  welcomeContainer: {
    flex: 1,
  },
  welcomeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(248, 244, 255, 0.75)',
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    zIndex: 10,
  },
  welcomeTitle: {
    fontSize: Typography.display * 1.4,
    fontFamily: 'Barrio-Regular',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: Typography.title2,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
    textAlign: 'center',
    maxWidth: 400,
  },
  welcomeButtonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    zIndex: 10,
  },
  getStartedButton: {
    backgroundColor: '#e10086',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '100%',
    maxWidth: 400,
    justifyContent: 'center',
    shadowColor: '#e10086',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: Typography.title3,
    fontWeight: '600',
    fontFamily: 'Inter-Medium',
  },
  welcomeFooter: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    zIndex: 10,
  },
  welcomeFooterText: {
    fontSize: Typography.body,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
  },

  // Common
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth, // iOS standard hairline
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: Typography.title1,
    fontWeight: 'bold',
    fontFamily: 'Barrio-Regular',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: Typography.title2,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
    marginTop: Spacing.xs,
  },
  backButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.md,
  },
  backButtonText: {
    color: '#e10086',
    fontSize: Typography.body,
    fontFamily: 'Inter-Medium',
  },

  // Scroll Content
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl, // Proper safe area handling
  },

  // Instruction Cards
  instructionCard: {
    padding: Spacing.lg,
    borderRadius: 12, // iOS standard
    marginBottom: Spacing.lg,
    ...cardShadow,
  },
  instructionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  instructionNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionNumberText: {
    color: '#fff',
    fontSize: Typography.title2,
    fontWeight: 'bold',
    fontFamily: 'Inter-SemiBold',
  },
  instructionText: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: Typography.body,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  instructionDescription: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
    lineHeight: 20,
  },

  // Buttons
  primaryButton: {
    backgroundColor: '#e10086',
    paddingVertical: Spacing.md,
    borderRadius: 12, // Reduced from 24 to iOS standard
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: 24,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: Typography.title2,
    fontWeight: '600',
    fontFamily: 'Inter-Medium',
  },

  // Home Screen
  homeCard: {
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...cardShadow,
  },
  homeCardWatermark: {
    position: 'absolute',
    top: -10,
    right: 10,
    fontSize: 48,
    fontFamily: 'Barrio-Regular',
    color: '#49297e',
    opacity: 0.1,
  },
  homeCardTitle: {
    fontSize: Typography.title2,
    fontWeight: '600',
    fontFamily: 'Barrio-Regular',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  homeCardDescription: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
    marginBottom: Spacing.md,
  },
  ageGroupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ageGroupButton: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: Spacing.md,
    borderRadius: 16,
    ...subtleShadow,
  },
  ageGroupLabel: {
    fontSize: Typography.body,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  ageGroupCount: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
  },
  continueCard: {
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: 12, // iOS standard
    marginBottom: Spacing.md,
    ...cardShadow,
  },
  continueTitle: {
    fontSize: Typography.title2,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  continueDescriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  continueColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  continueDescription: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
  },
  tipsCard: {
    backgroundColor: '#ece6f4',
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
    ...subtleShadow,
  },
  tipsTitle: {
    fontSize: Typography.title2,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  tipsList: {
    gap: Spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tipText: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
    flex: 1,
  },

  // Community Screen
  communityHeaderCard: {
    padding: Spacing.lg,
    borderRadius: 12, // iOS standard
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...cardShadow,
  },
  communityHeaderTitle: {
    fontSize: Typography.title2,
    fontWeight: '600',
    fontFamily: 'Barrio-Regular',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  communityHeaderDescription: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
    marginBottom: Spacing.md,
  },
  filterScrollView: {
    marginBottom: Spacing.md,
  },
  filterButtonActive: {
    backgroundColor: '#e10086',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    ...subtleShadow,
  },
  filterButtonActiveText: {
    color: '#fff',
    fontSize: Typography.subheadline,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  filterButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonText: {
    color: '#4b5563',
    fontSize: Typography.subheadline,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  communityPostCard: {
    backgroundColor: '#fff',
    borderRadius: 12, // iOS standard
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...cardShadow,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postUserInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postUserName: {
    fontSize: Typography.subheadline,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  postMeta: {
    fontSize: Typography.caption,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
  },
  ageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  ageBadgeText: {
    fontSize: Typography.caption,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  postContent: {
    fontSize: Typography.callout,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  postActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth, // iOS hairline
    borderTopColor: '#e5e7eb',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    minWidth: 44,
    minHeight: 44,
  },
  postActionText: {
    fontSize: Typography.subheadline,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
  },

  // Profile Screen
  profileHeaderCard: {
    padding: Spacing.lg,
    borderRadius: 12, // iOS standard
    backgroundColor: '#90dcff',
    marginBottom: Spacing.lg,
    ...cardShadow,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: Typography.title3,
    fontWeight: 'bold',
    fontFamily: 'Barrio-Regular',
    color: '#111827',
  },
  profileRole: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
  },
  editProfileButton: {
    backgroundColor: '#fff',
    paddingVertical: Spacing.sm,
    borderRadius: 8, // iOS standard
    alignItems: 'center',
  },
  editProfileButtonText: {
    color: '#e10086',
    fontSize: Typography.subheadline,
    fontWeight: '600',
    fontFamily: 'Inter-Medium',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12, // iOS standard
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...cardShadow,
  },
  statsTitle: {
    fontSize: Typography.title2,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statItem: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: Spacing.md,
    borderRadius: 12, // iOS standard
    ...subtleShadow,
  },
  statValue: {
    fontSize: Typography.title1,
    fontWeight: 'bold',
    fontFamily: 'Inter-SemiBold',
    color: '#49297e',
  },
  statLabel: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
    marginTop: Spacing.xs,
  },

  // Content Filter
  contentFilterCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#49297e',
    borderRadius: 12, // iOS standard
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...cardShadow,
  },
  contentFilterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  contentFilterTitle: {
    fontSize: Typography.title2,
    fontWeight: '600',
    fontFamily: 'Barrio-Regular',
    color: '#111827',
  },
  contentFilterDescription: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
    marginBottom: Spacing.md,
  },
  radioOption: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e10086',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  radioButtonInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e10086',
  },
  radioContent: {
    flex: 1,
  },
  radioLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  radioLabel: {
    fontSize: Typography.subheadline,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  radioDescription: {
    fontSize: Typography.caption,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
  },
  recommendedBadge: {
    backgroundColor: '#49297e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recommendedBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  radioDivider: {
    height: StyleSheet.hairlineWidth, // iOS hairline
    backgroundColor: '#e5e7eb',
    marginVertical: Spacing.sm,
  },

  // Upgrade Card
  upgradeCard: {
    padding: Spacing.lg,
    borderRadius: 12, // iOS standard
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...cardShadow,
  },
  upgradeTitle: {
    fontSize: Typography.title2,
    fontWeight: '600',
    fontFamily: 'Barrio-Regular',
    color: '#fff',
    marginBottom: Spacing.sm,
  },
  upgradeDescription: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    color: '#fdfb76',
    marginBottom: Spacing.md,
  },
  upgradeButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10, // iOS standard
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#e10086',
    fontSize: Typography.body,
    fontWeight: '600',
    fontFamily: 'Inter-Medium',
  },

  // Settings Screen
  settingsSection: {
    marginBottom: Spacing.lg,
  },
  settingsSectionTitle: {
    fontSize: Typography.caption,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#49297e',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 12, // iOS standard
    overflow: 'hidden',
    ...cardShadow,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    minHeight: 44, // iOS minimum touch target
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingsItemText: {
    fontSize: Typography.body,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  settingsItemSubtext: {
    fontSize: Typography.caption,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
    marginTop: 2,
  },
  settingsDivider: {
    height: StyleSheet.hairlineWidth, // iOS hairline
    backgroundColor: '#e5e7eb',
  },

  // Prompt Screen
  promptHeader: {
    padding: Spacing.lg,
  },
  promptHeaderBar: {
    height: 3,
    width: '100%',
  },
  promptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptAgeLabel: {
    fontSize: Typography.title2,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  promptCounter: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
  },
  promptActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptContentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  promptCard: {
    backgroundColor: '#90dcff',
    padding: 40,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  promptText: {
    fontSize: Typography.title1,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    lineHeight: 36,
    fontWeight: '500',
  },
  tipsBox: {
    backgroundColor: '#f9fafb',
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(73, 41, 126, 0.2)',
    ...subtleShadow,
  },
  tipsBoxTitle: {
    fontSize: Typography.body,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  tipsBoxList: {
    gap: 6,
  },
  tipsBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipsBoxItem: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    color: '#4b5563',
  },
  nextPromptButton: {
    shadowColor: '#e10086',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomButtonContainer: {
    padding: Spacing.lg,
    paddingBottom: getBottomPadding(),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
});

export default WireframeApp;
