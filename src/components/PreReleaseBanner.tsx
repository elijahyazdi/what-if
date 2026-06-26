import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Typography, Spacing } from '../utils/deviceHelpers';

// Banner for safety-sensitive screens that haven't been reviewed by a clinician.
// Defined in PROTOTYPE_INTEGRATION_PLAN.md §7 as a hard release gate — these
// screens cannot ship to end users until removed.
export const PreReleaseBanner = () => (
  <View style={styles.banner}>
    <Feather name="alert-triangle" size={14} color="#49297e" />
    <Text style={styles.text}>PRE-RELEASE: Pending clinical review</Text>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#fdfb76',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: Spacing.md,
  },
  text: {
    fontSize: Typography.caption,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '700',
    color: '#49297e',
    letterSpacing: 0.8,
  },
});
