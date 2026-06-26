import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Platform, ActionSheetIOS, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeProvider';
import { styles } from '../styles/sharedStyles';
import { Spacing } from '../utils/deviceHelpers';

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const { isDark, colors, toggleDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const showLogOutActionSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Log Out'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          title: 'Are you sure you want to log out?',
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            Alert.alert('Logged Out', 'You have been logged out successfully.');
          }
        }
      );
    } else {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => {} },
      ]);
    }
  };

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
        buttonIndex => {
          if (buttonIndex === 1) {
            Alert.alert('Confirm Deletion', 'Type DELETE to confirm account deletion', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => {} },
            ]);
          }
        }
      );
    } else {
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
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Customize your experience
        </Text>
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
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>
                  Email Preferences
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
            <View style={[styles.settingsDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="lock" size={20} color={colors.iconDefault} />
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>
                  Privacy & Security
                </Text>
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
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>
                  View Welcome Guide
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
            <View style={[styles.settingsDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => (navigation as any).navigate('FAQ')}
            >
              <View style={styles.settingsItemLeft}>
                <Feather name="help-circle" size={20} color={colors.iconDefault} />
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>Help & FAQ</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
            <View style={[styles.settingsDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => (navigation as any).navigate('ImConcerned')}
            >
              <View style={styles.settingsItemLeft}>
                <Feather name="life-buoy" size={20} color="#49297e" />
                <Text style={[styles.settingsItemText, { color: colors.textPrimary }]}>I'm concerned</Text>
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
                  <Text style={[styles.settingsItemSubtext, { color: colors.textSecondary }]}>
                    Version 1.0.0
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
          </View>
        </View>

        <LinearGradient colors={['#49297e', '#3a1d66']} style={styles.upgradeCard}>
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
              await AsyncStorage.removeItem('hasLaunchedBefore');
              Alert.alert('Reset Complete', 'Restart the app to see the welcome screen.');
            }}
          >
            <View style={styles.settingsItemLeft}>
              <Feather name="refresh-cw" size={20} color="#ca8a04" />
              <View>
                <Text style={[styles.settingsItemText, { color: '#ca8a04' }]}>Replay First Launch (Dev)</Text>
                <Text style={[styles.settingsItemSubtext, { color: colors.textSecondary }]}>
                  Shows the welcome flow on next launch. Theme & data preserved.
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
