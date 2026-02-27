/**
 * useDeviceStyles Hook
 *
 * Custom hook for device-aware styling in React Native components
 * Automatically applies responsive styles based on iPhone model
 */

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DeviceSize,
  Typography,
  Spacing,
  hasNotch,
  getTabBarHeight,
  getBottomPadding,
  responsiveValue,
} from '../utils/deviceHelpers';

/**
 * Hook that provides device-aware styling utilities
 */
export const useDeviceStyles = () => {
  const insets = useSafeAreaInsets();

  const deviceInfo = useMemo(
    () => ({
      // Device characteristics
      isSmall: DeviceSize.isSmall,
      isStandard: DeviceSize.isStandard,
      isLarge: DeviceSize.isLarge,
      isXLarge: DeviceSize.isXLarge,
      hasNotch: hasNotch(),
      isSE: DeviceSize.isSE || DeviceSize.isSE2,
      isProMax: DeviceSize.isProMax,
      isMini: DeviceSize.isMini,

      // Safe area insets
      insets: {
        top: insets.top,
        bottom: insets.bottom,
        left: insets.left,
        right: insets.right,
      },

      // Computed values
      tabBarHeight: getTabBarHeight(),
      bottomPadding: getBottomPadding(),

      // Typography scale
      fontSize: Typography,

      // Spacing scale
      spacing: Spacing,
    }),
    [insets]
  );

  /**
   * Create responsive styles based on device size
   */
  const createResponsiveStyle = <T extends StyleSheet.NamedStyles<T>>(
    stylesFunc: (device: typeof deviceInfo) => T
  ): T => {
    return StyleSheet.create(stylesFunc(deviceInfo));
  };

  /**
   * Select value based on device size
   */
  const selectValue = <T,>(values: {
    small?: T;
    standard?: T;
    large?: T;
    xlarge?: T;
    default: T;
  }): T => {
    return responsiveValue(values);
  };

  return {
    device: deviceInfo,
    createResponsiveStyle,
    selectValue,
  };
};

/**
 * Example usage in a component:
 *
 * const MyComponent = () => {
 *   const { device, createResponsiveStyle } = useDeviceStyles();
 *
 *   const styles = createResponsiveStyle((device) => ({
 *     container: {
 *       padding: device.spacing.md,
 *       paddingBottom: device.bottomPadding,
 *     },
 *     title: {
 *       fontSize: device.fontSize.title1,
 *       marginBottom: device.spacing.sm,
 *     },
 *     button: {
 *       height: device.isSmall ? 40 : 44,
 *     }
 *   }));
 *
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.title}>Hello</Text>
 *     </View>
 *   );
 * };
 */

export default useDeviceStyles;
