import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { styles } from '../styles/sharedStyles';
import { MadLibsRepo, MadLibsTemplate, applyTemplate } from '../db/repositories/madLibs';
import { FeatureFlags } from '../data/featureFlags';
import { Typography, Spacing } from '../utils/deviceHelpers';

export const MadLibsScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [templates, setTemplates] = useState<MadLibsTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fills, setFills] = useState<string[]>([]);

  useEffect(() => {
    MadLibsRepo.list().then(setTemplates);
  }, []);

  const selected = templates.find(t => t.id === selectedId);

  useEffect(() => {
    if (selected) setFills(new Array(selected.slots.length).fill(''));
  }, [selected]);

  if (!FeatureFlags.isPremium) {
    return (
      <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.bg }]} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonRow}>
            <Feather name="chevron-left" size={20} color="#e10086" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>MAD LIBS BUILDER</Text>
          <View style={[localStyles.paywall, { backgroundColor: '#49297e' }]}>
            <Feather name="lock" size={32} color="#fdfb76" />
            <Text style={localStyles.paywallTitle}>PREMIUM FEATURE</Text>
            <Text style={localStyles.paywallText}>
              The Mad Libs builder lets you craft custom prompts from age-appropriate templates.
              Available with Premium.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    if (!selected) return;
    const preview = applyTemplate(selected.templateText, fills);
    const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    await MadLibsRepo.saveAsUserPrompt({ id, ageGroup: selected.ageGroup, text: preview });
    Alert.alert('Saved!', 'Your custom prompt is now in your library.');
    setSelectedId(null);
    setFills([]);
  };

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonRow}>
          <Feather name="chevron-left" size={20} color="#e10086" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>MAD LIBS BUILDER</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Pick a template, fill the slots, save it as a custom prompt.
        </Text>

        {!selected ? (
          templates.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[localStyles.templateCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              onPress={() => setSelectedId(t.id)}
            >
              <Text style={[localStyles.ageLabel, { color: colors.textSecondary }]}>
                AGES {t.ageGroup}
              </Text>
              <Text style={[localStyles.templateText, { color: colors.textPrimary }]}>
                {applyTemplate(
                  t.templateText,
                  t.slots.map(s => `___ (${s.label})`)
                )}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View>
            <Text style={[localStyles.previewText, { color: colors.textPrimary }]}>
              {applyTemplate(selected.templateText, fills.map(f => f || '___'))}
            </Text>
            {selected.slots.map((slot, i) => (
              <View key={i} style={localStyles.slotGroup}>
                <Text style={[localStyles.slotLabel, { color: colors.textSecondary }]}>
                  {slot.label.toUpperCase()}
                </Text>
                <TextInput
                  style={[
                    localStyles.slotInput,
                    {
                      color: colors.textPrimary,
                      backgroundColor: colors.bgMuted,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Type your own…"
                  placeholderTextColor={colors.iconInactive}
                  value={fills[i] ?? ''}
                  onChangeText={v => {
                    const next = [...fills];
                    next[i] = v;
                    setFills(next);
                  }}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: Spacing.sm, paddingVertical: Spacing.sm }}
                >
                  {slot.suggestions.map(s => (
                    <TouchableOpacity
                      key={s}
                      style={[
                        localStyles.suggestionChip,
                        { backgroundColor: colors.filterInactiveBg, borderColor: colors.border },
                      ]}
                      onPress={() => {
                        const next = [...fills];
                        next[i] = s;
                        setFills(next);
                      }}
                    >
                      <Text style={[localStyles.suggestionText, { color: colors.textSecondary }]}>
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))}
            <View style={localStyles.actionRow}>
              <TouchableOpacity
                style={[localStyles.actionButton, { backgroundColor: colors.bgMuted }]}
                onPress={() => setSelectedId(null)}
              >
                <Text style={[localStyles.actionText, { color: colors.textPrimary }]}>Pick another</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[localStyles.actionButton, { backgroundColor: '#e10086' }]}
                onPress={handleSave}
              >
                <Text style={[localStyles.actionText, { color: '#fff' }]}>Save prompt</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  paywall: {
    marginTop: Spacing.xl,
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  paywallTitle: {
    fontSize: Typography.title2,
    fontFamily: 'Barrio-Regular',
    color: '#fdfb76',
    letterSpacing: 1.4,
  },
  paywallText: {
    fontSize: Typography.body,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
  },
  templateCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  ageLabel: {
    fontSize: Typography.caption,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  templateText: {
    fontSize: Typography.body,
    fontFamily: 'Inter-Medium',
    lineHeight: 22,
  },
  previewText: {
    fontSize: Typography.title3,
    fontFamily: 'Inter-Medium',
    lineHeight: 28,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
  },
  slotGroup: {
    marginTop: Spacing.lg,
  },
  slotLabel: {
    fontSize: Typography.caption,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  slotInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: Typography.body,
    fontFamily: 'Inter-Medium',
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    fontSize: Typography.body,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
});
