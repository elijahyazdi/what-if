# iOS Device-Specific Styling Guide

Complete guide for implementing responsive, device-aware styling across different iPhone models.

---

## 📱 **Supported iPhone Models**

### **Device Categories**

| Category | Models | Screen Width |
|----------|--------|--------------|
| **Small** | iPhone SE (1st gen) | 320pt |
| **Standard** | iPhone SE (2/3), 6/7/8, X/XS/11 Pro, 12/13 mini | 375pt |
| **Large** | iPhone 12/13/14/15, XR/11, 14/15 Pro | 390-393pt |
| **XLarge** | iPhone 12/13/14/15 Pro Max/Plus | 428-430pt |

### **Notch/Dynamic Island Detection**

- **Has Notch/Island**: iPhone X and newer (except SE models)
- **No Notch**: iPhone SE (all), 6/7/8 and earlier

---

## 🎨 **Implementation Examples**

### **1. Basic Usage with Hook**

```typescript
import { useDeviceStyles } from '../hooks/useDeviceStyles';

const MyScreen = () => {
  const { device } = useDeviceStyles();

  return (
    <View style={{ padding: device.spacing.md }}>
      <Text style={{ fontSize: device.fontSize.title1 }}>
        Hello iPhone!
      </Text>

      {device.hasNotch && (
        <Text>This iPhone has a notch or Dynamic Island</Text>
      )}

      {device.isSE && (
        <Text>Optimized for iPhone SE</Text>
      )}
    </View>
  );
};
```

### **2. Responsive Styles**

```typescript
import { useDeviceStyles } from '../hooks/useDeviceStyles';

const MyScreen = () => {
  const { device, createResponsiveStyle } = useDeviceStyles();

  const styles = createResponsiveStyle((device) => ({
    container: {
      padding: device.spacing.md,
      // Extra padding for notched devices
      paddingTop: device.hasNotch ? device.spacing.xl : device.spacing.md,
    },
    title: {
      fontSize: device.fontSize.title1,
      marginBottom: device.spacing.sm,
    },
    card: {
      // Smaller cards on SE devices
      padding: device.isSE ? device.spacing.sm : device.spacing.md,
      borderRadius: 12,
    },
    button: {
      // Ensure minimum touch target of 44pt
      height: Math.max(44, device.isSmall ? 40 : 48),
      paddingHorizontal: device.spacing.lg,
    }
  }));

  return <View style={styles.container}>...</View>;
};
```

### **3. Conditional Rendering by Device**

```typescript
import { useDeviceStyles } from '../hooks/useDeviceStyles';

const MyScreen = () => {
  const { device, selectValue } = useDeviceStyles();

  // Select different values based on device size
  const buttonSize = selectValue({
    small: 'small',
    standard: 'medium',
    large: 'large',
    xlarge: 'large',
    default: 'medium',
  });

  const gridColumns = selectValue({
    small: 1,      // Single column on SE
    standard: 2,   // Two columns on standard iPhones
    large: 2,      // Two columns on large iPhones
    xlarge: 3,     // Three columns on Pro Max
    default: 2,
  });

  return (
    <View>
      {/* Different layouts for different devices */}
      {device.isProMax && (
        <Text>Large screen layout with 3 columns</Text>
      )}

      {device.isSE && (
        <Text>Compact layout for smaller screen</Text>
      )}
    </View>
  );
};
```

### **4. Safe Area Handling**

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDeviceStyles } from '../hooks/useDeviceStyles';

const MyScreen = () => {
  const { device } = useDeviceStyles();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        {/* Content */}
      </View>

      {/* Bottom button with proper padding */}
      <View style={{
        padding: device.spacing.md,
        paddingBottom: device.bottomPadding, // Adapts to home indicator
      }}>
        <TouchableOpacity style={styles.button}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
```

### **5. Typography Scale**

```typescript
import { Typography } from '../utils/deviceHelpers';

const styles = StyleSheet.create({
  // Automatically scales based on device
  hero: {
    fontSize: Typography.display, // 36-52pt depending on device
  },
  pageTitle: {
    fontSize: Typography.largeTitle, // 28-36pt
  },
  sectionTitle: {
    fontSize: Typography.title1, // 24-30pt
  },
  subtitle: {
    fontSize: Typography.title2, // 20-24pt
  },
  body: {
    fontSize: Typography.body, // 15-18pt
  },
  caption: {
    fontSize: Typography.caption, // 11-12pt
  },
});
```

---

## 🔧 **Advanced Techniques**

### **1. Detect Specific iPhone Models**

```typescript
import { DeviceSize, Screen } from '../utils/deviceHelpers';

// Check for specific models
if (DeviceSize.isSE) {
  console.log('iPhone SE (any generation)');
}

if (DeviceSize.isMini) {
  console.log('iPhone 12/13 mini');
}

if (DeviceSize.isProMax) {
  console.log('iPhone Pro Max model');
}

if (Screen.width === 428) {
  console.log('iPhone 14/15 Plus or 12/13/14 Pro Max');
}
```

### **2. Dynamic Grid Layouts**

```typescript
import { responsiveValue, Screen } from '../utils/deviceHelpers';

const gridColumns = responsiveValue({
  small: 1,
  standard: 2,
  large: 2,
  xlarge: 3,
  default: 2,
});

const itemWidth = (Screen.width - (gridColumns + 1) * 16) / gridColumns;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  gridItem: {
    width: itemWidth,
    margin: 8,
  },
});
```

### **3. Adaptive Button Sizes**

```typescript
import { useDeviceStyles } from '../hooks/useDeviceStyles';

const MyButton = ({ title, onPress }) => {
  const { device } = useDeviceStyles();

  const buttonHeight = device.selectValue({
    small: 40,     // Smaller buttons on SE
    standard: 44,  // Standard iOS touch target
    large: 48,     // Larger on bigger devices
    xlarge: 50,    // Even larger on Pro Max
    default: 44,
  });

  return (
    <TouchableOpacity
      style={{
        height: buttonHeight,
        paddingHorizontal: device.spacing.lg,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <Text style={{ fontSize: device.fontSize.body }}>{title}</Text>
    </TouchableOpacity>
  );
};
```

---

## 📊 **Reference: Device Specifications**

### **iPhone Models & Dimensions**

| Model | Screen Size | Width (pt) | Height (pt) | Has Notch |
|-------|-------------|------------|-------------|-----------|
| iPhone SE (1st) | 4" | 320 | 568 | ❌ |
| iPhone SE (2/3) | 4.7" | 375 | 667 | ❌ |
| iPhone 6/7/8 | 4.7" | 375 | 667 | ❌ |
| iPhone 6/7/8 Plus | 5.5" | 414 | 736 | ❌ |
| iPhone X/XS/11 Pro | 5.8" | 375 | 812 | ✅ |
| iPhone XR/11 | 6.1" | 414 | 896 | ✅ |
| iPhone 12/13 mini | 5.4" | 375 | 812 | ✅ |
| iPhone 12/13/14 | 6.1" | 390 | 844 | ✅ |
| iPhone 12/13 Pro Max | 6.7" | 428 | 926 | ✅ |
| iPhone 14 Plus | 6.7" | 428 | 926 | ✅ |
| iPhone 14 Pro | 6.1" | 393 | 852 | ✅ (Island) |
| iPhone 14 Pro Max | 6.7" | 430 | 932 | ✅ (Island) |
| iPhone 15/15 Plus | 6.1"/6.7" | 393/430 | 852/932 | ✅ (Island) |
| iPhone 15 Pro/Max | 6.1"/6.7" | 393/430 | 852/932 | ✅ (Island) |

### **Safe Area Insets**

| Device Type | Top | Bottom | Notes |
|-------------|-----|--------|-------|
| Devices without notch | 20pt | 0pt | Standard status bar |
| iPhone X - 11 Pro Max | 44pt | 34pt | Notch + home indicator |
| iPhone 12+ (standard) | 47pt | 34pt | Notch/Island + home indicator |
| iPhone 14 Pro+ | 59pt | 34pt | Dynamic Island + indicator |

---

## ✅ **Best Practices**

1. **Always use SafeAreaView** for top-level screens
2. **Use responsive values** instead of hardcoded dimensions
3. **Test on multiple simulators** (SE, standard, Pro Max)
4. **Respect minimum touch targets** (44×44pt on iOS)
5. **Use Typography constants** for consistent text sizing
6. **Consider landscape mode** for larger devices
7. **Use Spacing constants** for consistent margins/padding
8. **Adapt grid layouts** to device width (1-3 columns)

---

## 🎯 **Quick Reference**

```typescript
// Import utilities
import { useDeviceStyles } from '../hooks/useDeviceStyles';
import { Typography, Spacing, DeviceSize } from '../utils/deviceHelpers';

// Use in component
const { device, selectValue } = useDeviceStyles();

// Check device type
device.isSmall      // iPhone SE
device.isStandard   // iPhone 12 mini, X/XS
device.isLarge      // iPhone 12/13/14/15
device.isXLarge     // iPhone Pro Max

// Check features
device.hasNotch     // Has notch or Dynamic Island
device.isSE         // Any iPhone SE model
device.isProMax     // Pro Max models
device.isMini       // 12/13 mini

// Typography
Typography.display      // 36-52pt
Typography.largeTitle   // 28-36pt
Typography.title1       // 24-30pt
Typography.body         // 15-18pt
Typography.caption      // 11-12pt

// Spacing
Spacing.xs    // 4pt
Spacing.sm    // 8pt
Spacing.md    // 16pt
Spacing.lg    // 24pt
Spacing.xl    // 32pt

// Safe areas
device.insets.top      // Top safe area
device.insets.bottom   // Bottom safe area
device.bottomPadding   // Extra padding for home indicator
```

---

## 🚀 **Migration Guide**

### Before (Hardcoded):
```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    marginBottom: 16,
  },
  container: {
    padding: 20,
    paddingBottom: 80,
  },
});
```

### After (Responsive):
```typescript
import { useDeviceStyles } from '../hooks/useDeviceStyles';

const { device } = useDeviceStyles();

const styles = StyleSheet.create({
  title: {
    fontSize: device.fontSize.title1, // Adapts to device
    marginBottom: device.spacing.md,
  },
  container: {
    padding: device.spacing.lg,
    paddingBottom: device.bottomPadding, // Handles home indicator
  },
});
```

---

**Need help?** Check the example implementations in `/hooks/useDeviceStyles.ts` and `/utils/deviceHelpers.ts`
