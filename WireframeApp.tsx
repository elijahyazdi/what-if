/**
 * WireframeApp.tsx - Main Application Component
 *
 * This is the primary component for the "What Could You Do?" application.
 * It manages all app screens, navigation, state, and user interactions.
 *
 * Key Features:
 * - Age-appropriate conversation prompts for 4 age groups (3-5, 6-8, 9-12, 13-15+)
 * - Favorites system for saving preferred prompts
 * - Settings and customization (dark mode, notifications, TTS)
 * - First-time user onboarding flow
 * - Persistent state using AsyncStorage
 *
 * Architecture:
 * - Single-component architecture with multiple screen views
 * - State-driven navigation between screens
 * - React hooks for state management and side effects
 * - StyleSheet-based styling with responsive design
 *
 * @module WireframeApp
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Switch,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import * as Font from 'expo-font';

// Get device width for responsive design calculations
const { width } = Dimensions.get('window');

/**
 * Main application component containing all screens and logic
 *
 * @returns {JSX.Element | null} The current screen or null if fonts are loading
 */
const WireframeApp = () => {
  // ==================== STATE MANAGEMENT ====================

  /**
   * Current active screen
   * Possible values: null, 'welcome', 'howToUse', 'home', 'prompt', 'favorites',
   * 'community', 'settings', 'developer', 'loading'
   */
  const [screen, setScreen] = useState<string | null>(null);

  /** Whether custom fonts have been loaded */
  const [fontsLoaded, setFontsLoaded] = useState(false);

  /** Currently selected age group (e.g., '3-5', '6-8', '9-12', '13-15') */
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  /** Index of the current prompt being displayed within the selected age group */
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  /** Array of favorited prompt IDs in format 'ageGroup-promptIndex' (e.g., '3-5-0') */
  const [favorites, setFavorites] = useState<string[]>([]);

  /** Content filtering mode: 'vetted', 'community', or 'all' */
  const [contentFilter, setContentFilter] = useState('vetted');

  /** Whether push notifications are enabled */
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  /** Whether text-to-speech is enabled */
  const [ttsEnabled, setTtsEnabled] = useState(true);

  /** Whether dark mode is enabled */
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // ==================== INITIALIZATION EFFECTS ====================

  /**
   * Load custom fonts on component mount
   *
   * Loads the Barrio font used for the app's main title and branding.
   * If font loading fails, the app continues with fallback fonts.
   */
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Barrio-Regular': require('./assets/fonts/Barrio-Regular.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Continue even if fonts fail to load
      }
    }

    loadFonts();
  }, []);

  /**
   * Check if this is the user's first time launching the app
   *
   * Determines initial screen based on whether the app has been launched before:
   * - First launch: Show welcome/onboarding screen
   * - Returning user: Go directly to home screen
   *
   * Uses AsyncStorage to persist the launch status.
   */
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunchedBefore');

        if (hasLaunched === null) {
          // First launch - show welcome screen
          setScreen('welcome');
        } else {
          // Not first launch - go directly to home
          setScreen('home');
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        // Default to welcome screen on error
        setScreen('welcome');
      }
    };

    checkFirstLaunch();
  }, []);

  // ==================== DATA CONFIGURATION ====================

  /**
   * Age group definitions with visual styling
   *
   * Each age group has:
   * - id: Unique identifier and key for prompts object
   * - label: Display name shown to users
   * - bgColor: Background color for the age group button
   */
  const ageGroups = [
    { id: '3-5', label: '3-5 years', bgColor: '#90dcff' },
    { id: '6-8', label: '6-8 years', bgColor: '#00db96' },
    { id: '9-12', label: '9-12 years', bgColor: '#e10086' },
    { id: '13-15', label: '13-15+ years', bgColor: '#fdfb76' }
  ];

  // ==================== SCREEN COMPONENTS ====================

  /**
   * Loading Screen Component
   *
   * Displays the app's branding with an animated question mark.
   * Used during initialization and as a placeholder screen.
   *
   * @param {Object} props - Component props
   * @param {boolean} [props.showBackButton=false] - Whether to show back button (for developer tools)
   * @returns {JSX.Element} Loading screen UI
   */
  const LoadingScreen = ({ showBackButton = false }: { showBackButton?: boolean }) => (
    <View style={styles.loadingContainer}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.loadingBackButton}
          onPress={() => setScreen('developer')}
        >
          <Feather name="arrow-left" size={24} color="#4f46e5" />
          <Text style={styles.loadingBackButtonText}>Back to Dev Tools</Text>
        </TouchableOpacity>
      )}
      <View style={styles.loadingQuestionMark}>
        <Text style={styles.loadingQuestionMarkText}>?</Text>
      </View>
      {/* Only use custom font once it's loaded to prevent warning */}
      <Text style={[styles.loadingTitle, fontsLoaded && { fontFamily: 'Barrio-Regular' }]}>
        WHAT COULD YOU DO?
      </Text>
    </View>
  );

  /**
   * Conversation prompts organized by age group
   *
   * Each age group contains an array of "What if?" scenario prompts designed
   * to be developmentally appropriate and encourage critical thinking.
   *
   * Format: { 'age-range': ['prompt1', 'prompt2', ...] }
   */
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

  /**
   * Welcome Screen - First-Time User Onboarding
   *
   * Shown on the user's first launch of the app. Introduces the app's purpose
   * and provides a call-to-action to begin the onboarding flow.
   *
   * @returns {JSX.Element} Welcome screen UI
   */
  const WelcomeScreen = () => (
    <View style={styles.welcomeContainer}>
      {/* Large question mark icon - app branding */}
      <View style={styles.welcomeQuestionMark}>
        <Text style={styles.welcomeQuestionMarkText}>?</Text>
      </View>

      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeTitle}>WHAT COULD YOU DO?</Text>
        <Text style={styles.welcomeSubtitle}>
          Foster meaningful conversations with children through age-appropriate prompts that spark critical thinking and ethical reasoning
        </Text>

        {/* Navigate to the "How to Use" tutorial screen */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => setScreen('howToUse')}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
          <Feather name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeFooter}>
        <Text style={styles.welcomeFooterText}>For Parents, Educators & Therapists</Text>
      </View>
    </View>
  );

  /**
   * How to Use Screen - Onboarding Tutorial
   *
   * Provides step-by-step instructions for using the app effectively.
   * Shows best practices for having meaningful conversations with children.
   * After completion, marks the app as "launched" and proceeds to home screen.
   *
   * @returns {JSX.Element} How to use tutorial screen
   */
  const HowToUseScreen = () => (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('welcome')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HOW TO USE THIS APP</Text>
        <Text style={styles.headerSubtitle}>A guide to meaningful conversations</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <View style={[styles.instructionCard, { backgroundColor: '#e8f4f8' }]}>
          <View style={styles.instructionRow}>
            <View style={[styles.instructionNumber, { backgroundColor: '#4f46e5' }]}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Choose an Age Group</Text>
              <Text style={styles.instructionDescription}>
                Select the age range that best matches the child you're talking with. Prompts are designed to be developmentally appropriate.
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.instructionCard, { backgroundColor: '#dcfce7' }]}>
          <View style={styles.instructionRow}>
            <View style={[styles.instructionNumber, { backgroundColor: '#16a34a' }]}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Read the Prompt Together</Text>
              <Text style={styles.instructionDescription}>
                Share the "What if..." scenario with the child. Use the audio button if helpful. Take your time—there's no rush.
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.instructionCard, { backgroundColor: '#f3e8ff' }]}>
          <View style={styles.instructionRow}>
            <View style={[styles.instructionNumber, { backgroundColor: '#9333ea' }]}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Listen and Explore Together</Text>
              <Text style={styles.instructionDescription}>
                Ask open-ended questions. There are no right or wrong answers. Focus on their thinking process, not finding the "correct" solution.
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.instructionCard, { backgroundColor: '#ffedd5' }]}>
          <View style={styles.instructionRow}>
            <View style={[styles.instructionNumber, { backgroundColor: '#ea580c' }]}>
              <Text style={styles.instructionNumberText}>4</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Discuss Multiple Possibilities</Text>
              <Text style={styles.instructionDescription}>
                Encourage thinking about different options. What might happen with each choice? How might others feel? What values matter here?
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={async () => {
            try {
              await AsyncStorage.setItem('hasLaunchedBefore', 'true');
            } catch (error) {
              console.error('Error setting launch flag:', error);
            }
            setScreen('home');
          }}
        >
          <Text style={styles.primaryButtonText}>Let's Get Started</Text>
          <Feather name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  /**
   * Home Screen - Main Navigation Hub
   *
   * The primary screen where users select an age group to begin.
   * Shows:
   * - Age group selection grid with prompt counts
   * - Resume option if a previous session exists
   * - Quick tips for effective conversations
   *
   * @returns {JSX.Element} Home screen UI
   */
  const HomeScreen = () => (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HOME</Text>
        <Text style={styles.headerSubtitle}>Start a meaningful conversation</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.homeCard}>
          <Text style={styles.homeCardTitle}>READY TO EXPLORE?</Text>
          <Text style={styles.homeCardDescription}>
            Choose an age group to begin your conversation journey
          </Text>
          <View style={styles.ageGroupGrid}>
            {ageGroups.map(group => (
              <TouchableOpacity
                key={group.id}
                style={[styles.ageGroupButton, { backgroundColor: group.bgColor }]}
                onPress={() => {
                  setSelectedAge(group.id);
                  setCurrentPromptIndex(0);
                  setScreen('prompt');
                }}
              >
                <Text style={styles.ageGroupLabel}>{group.label}</Text>
                <Text style={styles.ageGroupCount}>{prompts[group.id].length} prompts</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedAge && (
          <View style={styles.continueCard}>
            <Text style={styles.continueTitle}>Continue where you left off</Text>
            <Text style={styles.continueDescription}>
              Ages {ageGroups.find(g => g.id === selectedAge)?.label} • Prompt {currentPromptIndex + 1} of {prompts[selectedAge].length}
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setScreen('prompt')}
            >
              <Text style={styles.primaryButtonText}>Resume</Text>
              <Feather name="chevron-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Quick Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>There are no right or wrong answers</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={[styles.tipBullet, { color: '#4f46e5' }]}>•</Text>
              <Text style={styles.tipText}>Focus on the thinking process</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={[styles.tipBullet, { color: '#4f46e5' }]}>•</Text>
              <Text style={styles.tipText}>Listen without judgment</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={[styles.tipBullet, { color: '#4f46e5' }]}>•</Text>
              <Text style={styles.tipText}>Share your thoughts too</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  /**
   * Prompt Screen - Display Conversation Scenarios
   *
   * Shows the current "What if?" prompt for the selected age group.
   * Features:
   * - Current prompt text display
   * - Favorite/unfavorite toggle
   * - Text-to-speech audio button
   * - Navigation to next prompt
   * - Discussion tips
   *
   * @returns {JSX.Element | null} Prompt screen UI or null if no age group selected
   */
  const PromptScreen = () => {
    // Guard: Return null if no age group has been selected
    if (!selectedAge) return null;

    // Get current prompt and metadata
    const currentPrompt = prompts[selectedAge][currentPromptIndex];
    const totalPrompts = prompts[selectedAge].length;
    const ageLabel = ageGroups.find(g => g.id === selectedAge)?.label;

    // Create unique ID for this specific prompt (format: 'ageGroup-index')
    const promptId = `${selectedAge}-${currentPromptIndex}`;
    const isFavorited = favorites.includes(promptId);

    /**
     * Toggle favorite status for the current prompt
     *
     * Adds or removes the prompt from the favorites array based on current state.
     * Favorite IDs are stored in format 'ageGroup-promptIndex' (e.g., '3-5-2')
     */
    const toggleFavorite = () => {
      if (isFavorited) {
        // Remove from favorites
        setFavorites(favorites.filter(id => id !== promptId));
      } else {
        // Add to favorites
        setFavorites([...favorites, promptId]);
      }
    };

    return (
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.promptHeader}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Home</Text>
          </TouchableOpacity>
          <View style={styles.promptHeaderRow}>
            <View>
              <Text style={styles.promptAgeLabel}>Ages {ageLabel}</Text>
              <Text style={styles.promptCounter}>Prompt {currentPromptIndex + 1} of {totalPrompts}</Text>
            </View>
            <View style={styles.promptActions}>
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: isFavorited ? '#fdfb76' : '#f3f4f6' }]}
                onPress={toggleFavorite}
              >
                <Feather
                  name="star"
                  size={24}
                  color={isFavorited ? '#ca8a04' : '#6b7280'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#49297e' }]}>
                <Feather name="volume-2" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.promptContentContainer}>
          <View style={styles.promptCard}>
            <Text style={styles.promptText}>{currentPrompt}</Text>
          </View>

          <View style={styles.tipsBox}>
            <Text style={styles.tipsBoxTitle}>Discussion Tips:</Text>
            <Text style={styles.tipsBoxItem}>• Listen without judgment</Text>
            <Text style={styles.tipsBoxItem}>• Ask follow-up questions</Text>
            <Text style={styles.tipsBoxItem}>• Explore multiple solutions</Text>
            <Text style={styles.tipsBoxItem}>• Share your own thoughts too</Text>
          </View>
        </View>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
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

  /**
   * Community Screen - User-Generated Content (Placeholder)
   *
   * Future feature: Allows users to share and discover community-created prompts.
   * Currently displays a placeholder UI showing the intended functionality.
   *
   * @returns {JSX.Element} Community screen UI
   */
  const CommunityScreen = () => (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>COMMUNITY</Text>
        <Text style={styles.headerSubtitle}>Share and discover prompts</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.communityHeaderCard}>
          <Text style={styles.communityHeaderTitle}>SHARE YOUR IDEAS</Text>
          <Text style={styles.communityHeaderDescription}>
            Share prompts you've created or favorites you've discovered. Help other parents, educators, and therapists spark meaningful conversations.
          </Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Create New Prompt</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
          <TouchableOpacity style={styles.filterButtonActive}>
            <Text style={styles.filterButtonActiveText}>All Prompts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>My Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>My Submissions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Trending</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.communityPostCard}>
          <View style={styles.postHeader}>
            <View style={styles.postUserInfo}>
              <View style={[styles.avatar, { backgroundColor: '#90dcff' }]}>
                <Feather name="user" size={20} color="#49297e" />
              </View>
              <View>
                <Text style={styles.postUserName}>Sarah M.</Text>
                <Text style={styles.postMeta}>Parent • 2 days ago</Text>
              </View>
            </View>
            <View style={[styles.ageBadge, { backgroundColor: '#00db96' }]}>
              <Text style={styles.ageBadgeText}>Ages 6-8</Text>
            </View>
          </View>
          <Text style={styles.postContent}>
            What if you found a lost wallet with money in it? What could you do?
          </Text>
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.postAction}>
              <Feather name="heart" size={18} color="#6b7280" />
              <Text style={styles.postActionText}>24</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Feather name="message-circle" size={18} color="#6b7280" />
              <Text style={styles.postActionText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Feather name="share-2" size={18} color="#6b7280" />
              <Text style={styles.postActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.communityPostCard}>
          <View style={styles.postHeader}>
            <View style={styles.postUserInfo}>
              <View style={[styles.avatar, { backgroundColor: '#e10086' }]}>
                <Feather name="user" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.postUserName}>Michael T.</Text>
                <Text style={styles.postMeta}>Educator • 5 days ago</Text>
              </View>
            </View>
            <View style={[styles.ageBadge, { backgroundColor: '#e10086' }]}>
              <Text style={[styles.ageBadgeText, { color: '#fff' }]}>Ages 9-12</Text>
            </View>
          </View>
          <Text style={styles.postContent}>
            What if you noticed a classmate was always alone at lunch? What could you do?
          </Text>
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.postAction}>
              <Feather name="heart" size={18} color="#e10086" />
              <Text style={styles.postActionText}>42</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Feather name="message-circle" size={18} color="#6b7280" />
              <Text style={styles.postActionText}>15</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Feather name="share-2" size={18} color="#6b7280" />
              <Text style={styles.postActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const ProfileScreen = () => (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PROFILE</Text>
        <Text style={styles.headerSubtitle}>Your conversation journey</Text>
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
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Activity</Text>
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
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Prompts Submitted</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentFilterCard}>
          <View style={styles.contentFilterHeader}>
            <Feather name="shield" size={20} color="#49297e" />
            <Text style={styles.contentFilterTitle}>QUALITY & SAFETY</Text>
          </View>
          <Text style={styles.contentFilterDescription}>
            Control what user-created content appears in your feed
          </Text>

          <TouchableOpacity style={styles.radioOption} onPress={() => setContentFilter('all')}>
            <View style={styles.radioButton}>
              {contentFilter === 'all' && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.radioContent}>
              <Text style={styles.radioLabel}>Display All User Created Content</Text>
              <Text style={styles.radioDescription}>Show all community prompts without filtering</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.radioDivider} />

          <TouchableOpacity style={styles.radioOption} onPress={() => setContentFilter('vetted')}>
            <View style={styles.radioButton}>
              {contentFilter === 'vetted' && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.radioContent}>
              <View style={styles.radioLabelRow}>
                <Text style={styles.radioLabel}>Display User Created Content After Vetting</Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedBadgeText}>Recommended</Text>
                </View>
              </View>
              <Text style={styles.radioDescription}>Only show prompts reviewed by our moderation team</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.radioDivider} />

          <TouchableOpacity style={styles.radioOption} onPress={() => setContentFilter('friends')}>
            <View style={styles.radioButton}>
              {contentFilter === 'friends' && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.radioContent}>
              <Text style={styles.radioLabel}>Display Only User Created Content from Friends</Text>
              <Text style={styles.radioDescription}>Most restrictive - only see prompts from your connections</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>UPGRADE TO PROFESSIONAL</Text>
          <Text style={styles.upgradeDescription}>
            Access case management, analytics, and specialized prompt libraries
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const DeveloperScreen = () => (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('settings')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Settings</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DEVELOPER TOOLS</Text>
        <Text style={styles.headerSubtitle}>Quick navigation for testing</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.devSection}>
          <Text style={styles.devSectionTitle}>SCREENS</Text>
          <View style={styles.devGrid}>
            <TouchableOpacity
              style={[styles.devButton, { backgroundColor: '#f8f4ff' }]}
              onPress={() => setScreen('loading')}
            >
              <Feather name="loader" size={24} color="#4f46e5" />
              <Text style={styles.devButtonText}>Loading</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.devButton, { backgroundColor: '#f8f4ff' }]}
              onPress={() => setScreen('welcome')}
            >
              <Feather name="star" size={24} color="#4f46e5" />
              <Text style={styles.devButtonText}>Welcome</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.devButton, { backgroundColor: '#e8f4f8' }]}
              onPress={() => setScreen('howToUse')}
            >
              <Feather name="book" size={24} color="#0ea5e9" />
              <Text style={styles.devButtonText}>How To Use</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.devButton, { backgroundColor: '#dcfce7' }]}
              onPress={() => setScreen('home')}
            >
              <Feather name="home" size={24} color="#16a34a" />
              <Text style={styles.devButtonText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.devButton, { backgroundColor: '#dbeafe' }]}
              onPress={() => setScreen('prompt')}
            >
              <Feather name="message-square" size={24} color="#2563eb" />
              <Text style={styles.devButtonText}>Prompt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.devButton, { backgroundColor: '#fce7f3' }]}
              onPress={() => setScreen('community')}
            >
              <Feather name="users" size={24} color="#db2777" />
              <Text style={styles.devButtonText}>Community</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.devButton, { backgroundColor: '#fef3c7' }]}
              onPress={() => setScreen('profile')}
            >
              <Feather name="user" size={24} color="#d97706" />
              <Text style={styles.devButtonText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.devButton, { backgroundColor: '#f3f4f6' }]}
              onPress={() => setScreen('settings')}
            >
              <Feather name="settings" size={24} color="#6b7280" />
              <Text style={styles.devButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.devSection}>
          <Text style={styles.devSectionTitle}>ACTIONS</Text>
          <View style={styles.devActionsCard}>
            <TouchableOpacity
              style={styles.devActionItem}
              onPress={async () => {
                await AsyncStorage.removeItem('hasLaunchedBefore');
                alert('First launch flag cleared! App will show welcome screen on next restart.');
              }}
            >
              <View style={styles.devActionLeft}>
                <Feather name="refresh-cw" size={20} color="#e10086" />
                <Text style={styles.devActionText}>Reset First Launch</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <View style={styles.settingsDivider} />

            <TouchableOpacity
              style={styles.devActionItem}
              onPress={async () => {
                const keys = await AsyncStorage.getAllKeys();
                const items = await AsyncStorage.multiGet(keys);
                console.log('AsyncStorage contents:', items);
                alert('AsyncStorage logged to console');
              }}
            >
              <View style={styles.devActionLeft}>
                <Feather name="database" size={20} color="#4f46e5" />
                <Text style={styles.devActionText}>View AsyncStorage</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <View style={styles.settingsDivider} />

            <TouchableOpacity
              style={styles.devActionItem}
              onPress={() => {
                console.log('Current State:', {
                  screen,
                  selectedAge,
                  currentPromptIndex,
                  favorites,
                  contentFilter,
                });
                alert('Current state logged to console');
              }}
            >
              <View style={styles.devActionLeft}>
                <Feather name="info" size={20} color="#16a34a" />
                <Text style={styles.devActionText}>Log Current State</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.devWarning}>
          <Feather name="alert-triangle" size={20} color="#d97706" />
          <Text style={styles.devWarningText}>
            This developer menu is for testing purposes only. Remove before production release.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  /**
   * Settings Screen - App Configuration
   *
   * Allows users to customize app behavior and preferences:
   * - Account settings (profile, password, data management)
   * - Preferences (dark mode, notifications, TTS, content filter)
   * - Help & Support options
   *
   * @returns {JSX.Element} Settings screen UI
   */
  const SettingsScreen = () => (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>ACCOUNT</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="user" size={20} color="#6b7280" />
                <Text style={styles.settingsItemText}>Edit Profile</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <View style={styles.settingsDivider} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="mail" size={20} color="#6b7280" />
                <Text style={styles.settingsItemText}>Email Preferences</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <View style={styles.settingsDivider} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="lock" size={20} color="#6b7280" />
                <Text style={styles.settingsItemText}>Privacy & Security</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>PREFERENCES</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="bell" size={20} color="#6b7280" />
                <Text style={styles.settingsItemText}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#d1d5db', true: '#e10086' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingsDivider} />
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="volume-2" size={20} color="#6b7280" />
                <Text style={styles.settingsItemText}>Text-to-Speech</Text>
              </View>
              <Switch
                value={ttsEnabled}
                onValueChange={setTtsEnabled}
                trackColor={{ false: '#d1d5db', true: '#4f46e5' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingsDivider} />
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="moon" size={20} color="#6b7280" />
                <Text style={styles.settingsItemText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#d1d5db', true: '#4f46e5' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingsDivider} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="globe" size={20} color="#6b7280" />
                <View>
                  <Text style={styles.settingsItemText}>Language</Text>
                  <Text style={styles.settingsItemSubtext}>English</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>SUPPORT & INFO</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => setScreen('welcome')}
            >
              <View style={styles.settingsItemLeft}>
                <Feather name="book-open" size={20} color="#6b7280" />
                <Text style={styles.settingsItemText}>View Welcome Guide</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <View style={styles.settingsDivider} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="help-circle" size={20} color="#6b7280" />
                <Text style={styles.settingsItemText}>Help & FAQ</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <View style={styles.settingsDivider} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="mail" size={20} color="#6b7280" />
                <Text style={styles.settingsItemText}>Contact Support</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <View style={styles.settingsDivider} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="file-text" size={20} color="#6b7280" />
                <View>
                  <Text style={styles.settingsItemText}>About</Text>
                  <Text style={styles.settingsItemSubtext}>Version 1.0.0</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>GO PROFESSIONAL</Text>
          <Text style={styles.upgradeDescription}>
            Unlock advanced features for educators and therapists
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>DEVELOPER</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => setScreen('developer')}
            >
              <View style={styles.settingsItemLeft}>
                <Feather name="code" size={20} color="#4f46e5" />
                <Text style={styles.settingsItemText}>Developer Tools</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Feather name="log-out" size={20} color="#6b7280" />
              <Text style={styles.settingsItemText}>Log Out</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Feather name="trash-2" size={20} color="#dc2626" />
              <Text style={[styles.settingsItemText, { color: '#dc2626' }]}>Delete Account</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#fca5a5" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const BottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.bottomNavItem}
        onPress={() => setScreen('home')}
      >
        <Feather name="home" size={24} color={screen === 'home' ? '#e10086' : '#9ca3af'} />
        <Text style={[styles.bottomNavText, { color: screen === 'home' ? '#e10086' : '#9ca3af' }]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomNavItem}
        onPress={() => setScreen('community')}
      >
        <Feather name="users" size={24} color={screen === 'community' ? '#e10086' : '#9ca3af'} />
        <Text style={[styles.bottomNavText, { color: screen === 'community' ? '#e10086' : '#9ca3af' }]}>
          Community
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomNavItem}
        onPress={() => setScreen('profile')}
      >
        <Feather name="user" size={24} color={screen === 'profile' ? '#e10086' : '#9ca3af'} />
        <Text style={[styles.bottomNavText, { color: screen === 'profile' ? '#e10086' : '#9ca3af' }]}>
          Profile
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomNavItem}
        onPress={() => setScreen('settings')}
      >
        <Feather name="settings" size={24} color={screen === 'settings' ? '#e10086' : '#9ca3af'} />
        <Text style={[styles.bottomNavText, { color: screen === 'settings' ? '#e10086' : '#9ca3af' }]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ==================== MAIN RENDER LOGIC ====================

  /**
   * Show loading screen during initialization
   *
   * Display loading state while:
   * 1. Checking if this is the first app launch
   * 2. Loading custom fonts
   *
   * This prevents showing the main UI with missing data or styling
   */
  if (screen === null || !fontsLoaded) {
    return <LoadingScreen />;
  }

  /**
   * Main component render
   *
   * Renders the appropriate screen based on the current state.
   * Navigation is controlled by the `screen` state variable.
   *
   * Bottom navigation bar is shown on main app screens but hidden
   * during onboarding (welcome, howToUse) and developer tools.
   */
  return (
    <View style={styles.container}>
      {/* Conditional screen rendering based on current navigation state */}
      {screen === 'loading' && <LoadingScreen showBackButton={true} />}
      {screen === 'welcome' && <WelcomeScreen />}
      {screen === 'howToUse' && <HowToUseScreen />}
      {screen === 'home' && <HomeScreen />}
      {screen === 'community' && <CommunityScreen />}
      {screen === 'profile' && <ProfileScreen />}
      {screen === 'settings' && <SettingsScreen />}
      {screen === 'developer' && <DeveloperScreen />}
      {screen === 'prompt' && <PromptScreen />}

      {/* Bottom navigation bar - shown on main screens only */}
      {['home', 'community', 'profile', 'settings', 'prompt'].includes(screen) && <BottomNav />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Loading Screen
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBackButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  loadingBackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f46e5',
  },
  loadingQuestionMark: {
    marginBottom: 24,
  },
  loadingQuestionMarkText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#c7d2fe',
  },
  loadingTitle: {
    fontSize: 32,
    // fontFamily is applied conditionally in component to avoid loading warning
    color: '#111827',
    textAlign: 'center',
  },

  // Welcome Screen
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#f8f4ff',
  },
  welcomeQuestionMark: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -width * 0.3 }, { translateY: -width * 0.3 }],
    opacity: 0.1,
  },
  welcomeQuestionMarkText: {
    fontSize: width * 0.6,
    fontWeight: 'bold',
    color: '#c7d2fe',
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  welcomeTitle: {
    fontSize: 48,
    fontFamily: 'Barrio-Regular',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 400,
  },
  getStartedButton: {
    backgroundColor: '#e10086',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 400,
    justifyContent: 'center',
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  welcomeFooter: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 10,
  },
  welcomeFooterText: {
    fontSize: 16,
    color: '#6b7280',
  },

  // Header
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 4,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#e10086',
    fontSize: 16,
  },

  // Scroll Content
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 24,
    paddingBottom: 100,
  },

  // Instruction Cards
  instructionCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  instructionRow: {
    flexDirection: 'row',
    gap: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  instructionDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },

  // Buttons
  bottomButtonContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginBottom: 80,
  },
  primaryButton: {
    backgroundColor: '#e10086',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  // Home Screen
  homeCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#49297e',
    marginBottom: 16,
  },
  homeCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  homeCardDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
  },
  ageGroupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ageGroupButton: {
    width: (width - 48 - 24 - 12) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#49297e',
  },
  ageGroupLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  ageGroupCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  continueCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#49297e',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  continueTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  continueDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  tipsCard: {
    backgroundColor: '#f9fafb',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 8,
  },
  tipBullet: {
    color: '#e10086',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },

  // Prompt Screen
  promptHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  promptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptAgeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  promptCounter: {
    fontSize: 14,
    color: '#6b7280',
  },
  promptActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptContentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  promptCard: {
    backgroundColor: '#90dcff',
    padding: 32,
    borderRadius: 16,
    marginBottom: 32,
  },
  promptText: {
    fontSize: 24,
    color: '#111827',
    lineHeight: 36,
    fontWeight: '500',
  },
  tipsBox: {
    backgroundColor: '#f9fafb',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tipsBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  tipsBoxItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },

  // Community Screen
  communityHeaderCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#49297e',
    backgroundColor: '#90dcff',
    marginBottom: 16,
  },
  communityHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  communityHeaderDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
  },
  filterScrollView: {
    marginBottom: 16,
  },
  filterButtonActive: {
    backgroundColor: '#e10086',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActiveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '500',
  },
  communityPostCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  postMeta: {
    fontSize: 12,
    color: '#6b7280',
  },
  ageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ageBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  postContent: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 24,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },

  // Profile Screen
  profileHeaderCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#90dcff',
    marginBottom: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileRole: {
    fontSize: 14,
    color: '#6b7280',
  },
  editProfileButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editProfileButtonText: {
    color: '#e10086',
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    width: (width - 48 - 24 - 16) / 2,
    padding: 16,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#49297e',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },

  // Content Filter
  contentFilterCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#49297e',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  contentFilterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contentFilterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  contentFilterDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e10086',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e10086',
  },
  radioContent: {
    flex: 1,
  },
  radioLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  radioDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  recommendedBadge: {
    backgroundColor: '#49297e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendedBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  radioDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },

  // Upgrade Card
  upgradeCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#49297e',
    marginBottom: 24,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  upgradeDescription: {
    fontSize: 14,
    color: '#fdfb76',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#e10086',
    fontSize: 16,
    fontWeight: '600',
  },

  // Settings Screen
  settingsSection: {
    marginBottom: 24,
  },
  settingsSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 1,
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingsItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  settingsItemSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  bottomNavItem: {
    alignItems: 'center',
    gap: 4,
  },
  bottomNavText: {
    fontSize: 14,
  },

  // Developer Screen
  devSection: {
    marginBottom: 24,
  },
  devSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 1,
    marginBottom: 12,
  },
  devGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  devButton: {
    width: (width - 48 - 24 - 12) / 2,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#49297e',
    alignItems: 'center',
    gap: 8,
  },
  devButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  devActionsCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  devActionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  devActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  devActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  devWarning: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#d97706',
  },
  devWarningText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
});

export default WireframeApp;
