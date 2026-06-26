import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { styles } from '../styles/sharedStyles';
import { PreReleaseBanner } from '../components/PreReleaseBanner';
import { ResourceRepo, Resource } from '../db/repositories/faq';
import { Typography, Spacing } from '../utils/deviceHelpers';

type Signal = 'disclosure' | 'mood' | 'safety' | 'just-checking';

const SIGNALS: Array<{ id: Signal; label: string; description: string; icon: keyof typeof Feather.glyphMap }> = [
  {
    id: 'disclosure',
    label: 'They said something worrying',
    description: 'A disclosure about safety, abuse, or harm.',
    icon: 'message-circle',
  },
  {
    id: 'mood',
    label: 'Their mood has shifted',
    description: 'Sad, withdrawn, anxious, or angry beyond normal.',
    icon: 'cloud-rain',
  },
  {
    id: 'safety',
    label: 'I\'m worried about their safety',
    description: 'Thoughts of self-harm, suicide, or danger from others.',
    icon: 'alert-octagon',
  },
  {
    id: 'just-checking',
    label: 'Just checking in',
    description: 'No specific signal — I want context on what\'s typical.',
    icon: 'help-circle',
  },
];

export const ImConcernedScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    if (signal) ResourceRepo.forSignal(signal).then(setResources);
  }, [signal]);

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonRow}>
          <Feather name="chevron-left" size={20} color="#e10086" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <PreReleaseBanner />

        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>I'M CONCERNED</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          What's coming up for you right now? We'll point you to relevant resources.
        </Text>

        {!signal ? (
          SIGNALS.map(s => (
            <TouchableOpacity
              key={s.id}
              style={[
                localStyles.signalCard,
                { backgroundColor: colors.cardBg, borderColor: colors.border },
              ]}
              onPress={() => setSignal(s.id)}
            >
              <Feather name={s.icon} size={22} color="#49297e" />
              <View style={{ flex: 1 }}>
                <Text style={[localStyles.signalLabel, { color: colors.textPrimary }]}>
                  {s.label}
                </Text>
                <Text style={[localStyles.signalDescription, { color: colors.textSecondary }]}>
                  {s.description}
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.iconInactive} />
            </TouchableOpacity>
          ))
        ) : (
          <>
            <TouchableOpacity onPress={() => setSignal(null)} style={localStyles.changeRow}>
              <Feather name="rotate-ccw" size={14} color="#e10086" />
              <Text style={[localStyles.changeText]}>Change what's coming up</Text>
            </TouchableOpacity>

            {resources.length === 0 ? (
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                No resources tagged yet — see the full resource library.
              </Text>
            ) : (
              resources.map(r => (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    localStyles.resourceCard,
                    { backgroundColor: colors.cardBg, borderColor: colors.border },
                  ]}
                  onPress={() => r.url && Linking.openURL(r.url).catch(() => {})}
                  disabled={!r.url}
                >
                  <Text style={[localStyles.resourceKind, { color: colors.textSecondary }]}>
                    {r.kind.toUpperCase()} • {r.region}
                  </Text>
                  <Text style={[localStyles.resourceTitle, { color: colors.textPrimary }]}>
                    {r.title}
                  </Text>
                  {r.description && (
                    <Text style={[localStyles.resourceDescription, { color: colors.textSecondary }]}>
                      {r.description}
                    </Text>
                  )}
                </TouchableOpacity>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  signalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: Spacing.md,
  },
  signalLabel: {
    fontSize: Typography.body,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    marginBottom: 2,
  },
  signalDescription: {
    fontSize: Typography.caption,
    fontFamily: 'Inter-Medium',
    lineHeight: 16,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: Spacing.md,
  },
  changeText: {
    color: '#e10086',
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  resourceCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  resourceKind: {
    fontSize: Typography.caption,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  resourceTitle: {
    fontSize: Typography.body,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    lineHeight: 20,
  },
});
