import React from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useLiminalSpaces } from '../hooks/useLiminalSpaces';
import { Typography, Spacing } from '../utils/deviceHelpers';

export const LiminalSpaceChips = ({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string | null) => void;
}) => {
  const { colors } = useTheme();
  const spaces = useLiminalSpaces();
  if (spaces.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>RIGHT NOW WE'RE…</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        <Chip
          label="Anywhere"
          icon="globe"
          active={selected === null}
          onPress={() => onSelect(null)}
        />
        {spaces.map(s => (
          <Chip
            key={s.id}
            label={s.name}
            icon={(s.icon as keyof typeof Feather.glyphMap) ?? 'circle'}
            active={selected === s.id}
            onPress={() => onSelect(s.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const Chip = ({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  active: boolean;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? '#e10086' : colors.filterInactiveBg,
          borderColor: active ? '#e10086' : colors.border,
        },
      ]}
      activeOpacity={0.85}
    >
      <Feather name={icon} size={14} color={active ? '#fff' : colors.iconDefault} />
      <Text style={[styles.chipText, { color: active ? '#fff' : colors.textSecondary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.caption,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    letterSpacing: 1.4,
    marginBottom: Spacing.sm,
  },
  row: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: Typography.subheadline,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
  },
});
