# Responsive Grid Update - Home Screen

## Changes Made

### 1. **Added Device Styles Hook**
   - Imported `useDeviceStyles` hook into WireframeApp.tsx
   - Provides access to device detection and responsive utilities

### 2. **Implemented Dynamic Grid Columns**

   The Home Screen age group grid now adapts to different iPhone models:

   ```typescript
   const gridColumns = selectValue({
     small: 1,      // Single column on iPhone SE
     standard: 2,   // Two columns on standard iPhones
     large: 2,      // Two columns on larger iPhones
     xlarge: 3,     // Three columns on Pro Max
     default: 2,
   });
   ```

### 3. **Responsive Button Width Calculation**

   Button widths are calculated dynamically based on:
   - Device width
   - Number of grid columns
   - Device-specific spacing values

   ```typescript
   const buttonWidth = (width - device.spacing.lg * 2 - device.spacing.md * (gridColumns - 1)) / gridColumns;
   ```

### 4. **Updated Age Group Button Rendering**

   Each button now receives dynamic width:
   ```typescript
   style={[
     styles.ageGroupButton,
     {
       backgroundColor: group.bgColor,
       width: buttonWidth,
     }
   ]}
   ```

## Device-Specific Behavior

| Device Category | Models | Grid Columns | Example |
|----------------|---------|--------------|---------|
| **Small** | iPhone SE (1st gen) | 1 column | Full width buttons |
| **Standard** | iPhone SE (2/3), 6/7/8, X/XS, 12/13 mini | 2 columns | Standard grid |
| **Large** | iPhone 12/13/14/15, XR/11 | 2 columns | Standard grid |
| **XLarge** | iPhone Pro Max/Plus models | 3 columns | Wider grid |

## Benefits

1. **Optimized for Small Screens**: iPhone SE users get full-width buttons that are easier to tap
2. **Better Use of Space**: Pro Max users get 3 columns, showing more content at once
3. **Consistent Experience**: Standard and large iPhones maintain familiar 2-column layout
4. **Dynamic Spacing**: Uses device-aware spacing constants for consistent margins

## Testing

To test the responsive grid:

1. **iPhone SE Simulator**: Should show 1 column (single vertical list)
2. **iPhone 15 Simulator**: Should show 2 columns (2×2 grid)
3. **iPhone 15 Pro Max Simulator**: Should show 3 columns (first row has 3, last row has 1)

## Code Location

- **Component**: `HomeScreen` in WireframeApp.tsx (lines 378-458)
- **Styles**: `ageGroupGrid`, `ageGroupButton` (lines 1300-1310)
- **Hook**: `useDeviceStyles` from hooks/useDeviceStyles.ts
- **Utilities**: Device detection in utils/deviceHelpers.ts

## Future Enhancements

Consider applying responsive typography to:
- `ageGroupLabel` font size
- `ageGroupCount` font size
- Card padding values
- Title and description text

These can use the `Typography` scale from the device helpers for fully adaptive text sizing.
