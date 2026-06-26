import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { styles } from '../styles/sharedStyles';
import { FAQRepo, FAQEntry } from '../db/repositories/faq';
import { Typography, Spacing } from '../utils/deviceHelpers';

export const FAQScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [entries, setEntries] = useState<FAQEntry[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    FAQRepo.list().then(setEntries);
  }, []);

  const grouped = useMemo(() => {
    const m: Record<string, FAQEntry[]> = {};
    for (const e of entries) {
      if (!m[e.category]) m[e.category] = [];
      m[e.category].push(e);
    }
    return m;
  }, [entries]);

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonRow}>
          <Feather name="chevron-left" size={20} color="#e10086" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>HELP & FAQ</Text>

        {Object.entries(grouped).map(([category, items]) => (
          <View key={category} style={localStyles.group}>
            <Text style={[localStyles.categoryHeader, { color: colors.textSecondary }]}>
              {category.toUpperCase()}
            </Text>
            {items.map(e => {
              const open = expanded.has(e.id);
              return (
                <TouchableOpacity
                  key={e.id}
                  onPress={() => toggle(e.id)}
                  style={[
                    localStyles.entry,
                    { backgroundColor: colors.cardBg, borderColor: colors.border },
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={localStyles.entryHeader}>
                    <Text style={[localStyles.question, { color: colors.textPrimary }]}>
                      {e.question}
                    </Text>
                    <Feather
                      name={open ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={colors.iconDefault}
                    />
                  </View>
                  {open && (
                    <Text style={[localStyles.answer, { color: colors.textSecondary }]}>
                      {e.answer}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  group: { marginTop: Spacing.lg },
  categoryHeader: {
    fontSize: Typography.caption,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    letterSpacing: 1.4,
    marginBottom: Spacing.sm,
  },
  entry: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  question: {
    fontSize: Typography.body,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    flex: 1,
  },
  answer: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    lineHeight: 20,
    marginTop: Spacing.sm,
  },
});
