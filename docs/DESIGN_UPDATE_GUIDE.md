# Design Update Guide: "What Could You Do?" App

## Visual Polish — Screen-by-Screen Tasks

**Priority order:** Welcome → Home → Prompt Display → then remaining screens

---

## Global Issues (Fix These First)

These issues affect every screen and should be tackled before screen-specific work.

### G1. Add the Road Rage Font

**Problem:** The CLAUDE.md design system specifies Road Rage for all body text, buttons, labels, and navigation — but the font isn't in `assets/fonts/` and isn't loaded in the app. Everything currently renders in the system font, which strips away the bold, street-art personality that makes this app distinctive.

**Tasks:**
- Download `RoadRage-Regular.ttf` from Google Fonts
- Place it in `assets/fonts/`
- Add `'RoadRage-Regular'` to the `Font.loadAsync` call in `WireframeApp.tsx` (line ~82)
- Apply `fontFamily: 'RoadRage-Regular'` to all body text, buttons, labels, descriptions, navigation text, and subtitles
- Keep `fontFamily: 'Barrio-Regular'` only on major headings (screen titles, app name)
- Test that both fonts render correctly before moving on; if Road Rage doesn't load, the app will look broken

### G2. Add Shadows and Elevation to Cards

**Problem:** Every card in the app is completely flat. There's no visual depth, which makes the interface feel like a wireframe rather than a polished product.

**Tasks:**
- Create a shared shadow style object to reuse across screens:
  ```
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,  // Android
  }
  ```
- Create a second, subtler variant for nested/secondary elements:
  ```
  subtleShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  }
  ```
- Apply `cardShadow` to: `homeCard`, `continueCard`, `communityPostCard`, `statsCard`, `contentFilterCard`, `settingsCard`, `promptCard`, `instructionCard`, `communityHeaderCard`, `profileHeaderCard`
- Apply `subtleShadow` to: `ageGroupButton`, `statItem`, `tipsCard`, `tipsBox`, `filterButtonActive`
- Remove `borderWidth: 1` from cards that get shadows — the shadow replaces the border as the visual boundary. Exception: keep the `#49297e` deep purple border on the homeCard and contentFilterCard as an intentional brand accent

### G3. Replace Off-Palette Colors

**Problem:** Many elements use generic Tailwind gray values (#4f46e5, #16a34a, #9333ea, #ea580c) and indigo tones instead of the app's 5-color palette. This dilutes the brand identity.

**Tasks:**
- HowToUse instruction card backgrounds: Replace the pastel blues/greens/purples/oranges with lighter tints of the app palette:
  - Step 1 card: `#90dcff` at 20% opacity (or `#e8f6ff`) — Sky Blue tint
  - Step 2 card: `#00db96` at 20% opacity (or `#d6f9ed`) — Teal tint
  - Step 3 card: `#49297e` at 10% opacity (or `#ece6f4`) — Deep Purple tint
  - Step 4 card: `#e10086` at 10% opacity (or `#fce0f0`) — Hot Pink tint
- Instruction number circles: Replace #4f46e5, #16a34a, #9333ea, #ea580c with:
  - Step 1: `#90dcff` (circle) with `#49297e` (number text)
  - Step 2: `#00db96` (circle) with `#49297e` (number text)
  - Step 3: `#49297e` (circle) with `#fff` (number text) — keep as-is
  - Step 4: `#e10086` (circle) with `#fff` (number text)
- Tip bullets on Home screen (lines 488-489): Some use `#4f46e5` instead of the palette — change to `#49297e`. The first bullet already uses `#e10086` which is on-palette, keep it
- Switch track active colors in Settings (lines 969, 995): Replace `#4f46e5` (TTS and Dark Mode switch track color) with `#49297e`

### G4. Improve Contrast for Accessibility (WCAG AA)

**Problem:** Several color combinations don't meet the 4.5:1 contrast ratio required for WCAG AA compliance.

**Tasks:**
- `#6b7280` text on `#fff` background: Ratio is ~4.6:1 — barely passes but consider darkening to `#4b5563` (6.4:1) for subtitles and descriptions
- `#fdfb76` (Bright Yellow) as a background: Text on yellow needs to be `#49297e` or `#111827`, never a lighter color. Check the age group button for 13-15+ — the `#111827` label passes, but verify `#6b7280` count text does not. Change count text color to `#49297e` on the yellow button
- `#fdfb76` stat item on Profile screen: The `#6b7280` stat label fails. Change to `#49297e`
- Age badge text (`#111827` on `#00db96`): Passes at 5.8:1 — keep
- `#fdfb76` on `#49297e` (upgrade card description text): Ratio is ~5.2:1 — passes, keep

### G5. Use Responsive Typography and Spacing Everywhere

**Problem:** Many styles use hardcoded pixel values instead of the `useDeviceStyles` hook and `Typography`/`Spacing` constants from `deviceHelpers`. This causes the app to look cramped on iPhone SE and wasteful on Pro Max.

**Tasks:**
- In every screen component that doesn't already import `useDeviceStyles`, add the import and destructure `{ device, selectValue }`
- Replace hardcoded `fontSize` values in the styles with `device.fontSize.*` equivalents:
  - `48` → `device.fontSize.display` (welcome title)
  - `24` → `device.fontSize.title1` (header titles, prompt text)
  - `18` → `device.fontSize.title2` (subtitles, card titles)
  - `16` → `device.fontSize.body` (body text, button text, instruction titles)
  - `14` → `device.fontSize.callout` or keep as-is for secondary text
  - `12` → `device.fontSize.caption` (meta text, badges)
- Replace hardcoded `padding`/`margin` values with `device.spacing.*`:
  - `32` → `device.spacing.xl`
  - `24` → `device.spacing.lg`
  - `16` → `device.spacing.md`
  - `12` → `device.spacing.sm` + 4 (or keep 12)
  - `8` → `device.spacing.sm`
- Note: The Prompt screen and Home screen already use the hook. Extend this to Welcome, HowToUse, Community, Profile, and Settings screens

---

## Screen 1: Welcome Screen

The first thing users see. It needs to feel inviting, polished, and establish the brand personality immediately.

### W1. Strengthen the Background

**Current:** Flat `#f8f4ff` (very light purple)
**Target:** A subtle gradient that feels warm and inviting

**Tasks:**
- Install `expo-linear-gradient` if not already available
- Replace the flat backgroundColor with a `LinearGradient` going from `#f8f4ff` (top) through `#ece6f4` (middle) to `#fce0f0` (bottom) — a soft purple-to-pink warmth
- The gradient should be very subtle; the goal is warmth, not distraction

### W2. Polish the Question Mark Watermark

**Current:** Uses `#c7d2fe` (off-palette indigo)
**Target:** On-brand and slightly more prominent

**Tasks:**
- Change the question mark color from `#c7d2fe` to `#49297e` with opacity 0.06
- Apply Barrio font to the question mark: `fontFamily: 'Barrio-Regular'`
- This makes the watermark feel intentional rather than generic

### W3. Apply Typography System

**Tasks:**
- Welcome title "WHAT COULD YOU DO?": Already uses Barrio — keep. Ensure `fontSize` uses responsive value via `device.fontSize.display`
- Subtitle text: Apply Road Rage font. Increase from 18 to `device.fontSize.title2`. Change color from `#6b7280` to `#4b5563` for better contrast
- Footer "For Parents, Educators & Therapists": Apply Road Rage font. Change from `#6b7280` to `#49297e` for brand consistency
- "Get Started" button text: Apply Road Rage font

### W4. Polish the Get Started Button

**Current:** Solid #e10086 rectangle with 12px border radius
**Target:** More prominent and inviting

**Tasks:**
- Add a subtle shadow: `shadowColor: '#e10086', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8`
- Increase border radius to 16 for a slightly softer pill shape
- Add `activeOpacity={0.85}` to the TouchableOpacity for a visible press state
- Consider adding a subtle scale animation on press using `Animated` or `react-native-reanimated` (optional polish)

---

## Screen 2: How to Use (Onboarding)

This is a one-time screen for new users. It should feel clear, friendly, and quick to get through.

### H1. Fix the Instruction Card Colors (see G3 above)

Apply the palette-based tint colors specified in G3.

### H2. Apply Road Rage Font to All Text

**Tasks:**
- "HOW TO USE THIS APP" header: Keep Barrio
- "A guide to meaningful conversations" subtitle: Road Rage
- Instruction titles ("Choose an Age Group", etc.): Road Rage, weight 600
- Instruction descriptions: Road Rage
- "Let's Get Started" button text: Road Rage
- Back button text: Road Rage

### H3. Add Subtle Card Entrance Feel

**Tasks:**
- Add the `cardShadow` style from G2 to each instruction card
- Consider staggered `opacity` on cards — first card fully opaque, each subsequent slightly delayed (optional, only if using Reanimated)

### H4. Polish the Back Button

**Current:** Plain text "← Back" in hot pink
**Target:** Standard iOS-style back navigation

**Tasks:**
- Replace the text arrow "←" with a Feather `chevron-left` icon
- Style as: `flexDirection: 'row', alignItems: 'center', gap: 4`
- Icon size: 20, color: `#e10086`
- Text: "Back", fontSize 16, color: `#e10086`, Road Rage font
- This pattern should be reused on the Prompt screen's "← Home" button as well

---

## Screen 3: Home Screen

The main hub. Users return here every session. It needs to feel alive and purposeful.

### HO1. Make Age Group Buttons More Vibrant

**Current:** Flat colored rectangles with a 1px purple border
**Target:** Distinct, tactile buttons that invite tapping

**Tasks:**
- Remove `borderWidth: 1` and `borderColor: '#49297e'` from `ageGroupButton`
- Add `subtleShadow` (from G2)
- Increase `borderRadius` from 12 to 16 for a friendlier shape
- Add a darker accent at the bottom of each button for depth: `borderBottomWidth: 3, borderBottomColor:` a 20% darker version of each age color:
  - Sky Blue: `#5cb8e6`
  - Teal: `#00b87e`
  - Hot Pink: `#b8006e`
  - Bright Yellow: `#d4d260`
- Apply Road Rage font to the age label text
- Change `ageGroupCount` color to match the accent (darker shade) instead of generic gray for buttons where gray doesn't have enough contrast

### HO2. Elevate the "Ready to Explore?" Card

**Tasks:**
- Apply `cardShadow` from G2
- Change the title "READY TO EXPLORE?" to Barrio font
- Change the description to Road Rage font
- Add a small decorative "?" in the top-right corner of the card using Barrio font, color `#49297e` at opacity 0.1, fontSize 48 — echoes the welcome screen watermark

### HO3. Polish the Continue Card

**Tasks:**
- Apply `cardShadow` from G2
- Remove `borderWidth: 1` — the shadow is enough
- Change "Continue where you left off" to Road Rage font, weight 600
- Add a small colored dot before the age text that matches the selected age group's color (visual continuity cue)

### HO4. Refine the Quick Tips Card

**Current:** Light gray background, generic bullets
**Target:** Warm, on-brand, feels like helpful guidance

**Tasks:**
- Change background from `#f9fafb` to `#ece6f4` (light purple tint) for brand warmth
- Apply `subtleShadow` from G2
- Change "Quick Tips" title to Road Rage font
- Replace the bullet "•" characters with small Feather icons for visual interest:
  - "No right or wrong answers" → `check-circle` icon in Teal
  - "Focus on the thinking process" → `compass` icon in Sky Blue
  - "Listen without judgment" → `heart` icon in Hot Pink
  - "Share your thoughts too" → `message-circle` icon in Deep Purple
- Icon size: 16, placed where the bullet currently is

---

## Screen 4: Prompt Display Screen

The heart of the app. This screen is where the actual conversation happens. It needs to feel calm, focused, and emotionally engaging.

### P1. Make the Prompt Card Color-Adaptive

**Current:** Always `#90dcff` (Sky Blue) regardless of which age group is selected
**Target:** Card background matches the selected age group's color

**Tasks:**
- Pass the selected age group data to the Prompt screen (currently hardcoded to '3-5')
- Set `promptCard` backgroundColor dynamically based on age group:
  - 3-5: `#90dcff` (Sky Blue)
  - 6-8: `#00db96` (Teal)
  - 9-12: `#e10086` (Hot Pink) — use white text
  - 13-15+: `#fdfb76` (Bright Yellow) — use `#49297e` text
- Adjust `promptText` color for contrast: dark text on light backgrounds, white or deep purple on dark backgrounds

### P2. Elevate the Prompt Card

**Tasks:**
- Add a stronger shadow than the standard `cardShadow`:
  ```
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 5,
  ```
- Increase `borderRadius` from 12 to 20 for a friendlier, more distinctive shape
- Increase padding from 32 to 40 for more breathing room
- Apply Road Rage font to prompt text
- This is the single most important visual element in the app — it should feel special

### P3. Add a Prompt Transition

**Tasks (optional but high-impact):**
- When the user taps "Next Prompt", animate the prompt card:
  - Fade out the current prompt (opacity 1 → 0, slight slide left)
  - Fade in the new prompt (opacity 0 → 1, slight slide from right)
- Use `react-native-reanimated` `FadeIn` / `FadeOut` layout animations, or a simple `Animated.timing` with translateX and opacity
- Duration: 250ms, easing: `Easing.out(Easing.cubic)`
- This gives the experience a "card deck" feel that matches the app's concept

### P4. Polish the Header

**Tasks:**
- Apply Road Rage font to "Ages [X]" label and prompt counter
- Apply the Feather `chevron-left` + "Home" back button pattern from H4
- Add a thin colored bar under the header that matches the current age group's color (height: 3px, full width)
  - This creates a subtle visual thread connecting the header to the colored prompt card below

### P5. Refine the Discussion Tips Box

**Tasks:**
- Apply `subtleShadow` from G2
- Apply Road Rage font to title and items
- Change the border from `#e5e7eb` to `#49297e` at 20% opacity for brand consistency
- Replace bullet "•" with small Feather icons (same pattern as HO4)

### P6. Polish the Bottom "Next Prompt" Button

**Tasks:**
- Apply Road Rage font to button text
- Add the pink shadow from W4 (matching the button color)
- Ensure `bottomButtonContainer` uses `device.bottomPadding` from `useDeviceStyles` for proper home indicator spacing

---

## Remaining Screens (Lower Priority)

These screens still deserve polish, but tackle them after the core flow feels great.

### Community Screen

- **C1.** Apply Barrio to "COMMUNITY" header, Road Rage to subtitle and all body text
- **C2.** Apply `cardShadow` to `communityHeaderCard` and each `communityPostCard`
- **C3.** Change community header card background from `#90dcff` to a gradient (`#90dcff` to `#00db96`) for more visual energy
- **C4.** Polish the filter pills: Add `subtleShadow` to the active filter. Increase pill padding to `paddingVertical: 10, paddingHorizontal: 20` for better touch targets (current vertical padding of 8 is tight)
- **C5.** Post action buttons (heart, comment, share): Increase touch target to 44x44 with `minWidth: 44, minHeight: 44` while keeping the visual icon at 18px
- **C6.** Apply Road Rage font to all post text, user names, meta text, and button labels

### Profile Screen

- **PR1.** Apply Barrio to "PROFILE" header and "WELCOME BACK!", Road Rage to everything else
- **PR2.** Apply `cardShadow` to all cards
- **PR3.** Stat items: Add `subtleShadow`. Apply Road Rage font to values and labels. Ensure contrast on yellow stat item (see G4)
- **PR4.** Upgrade card: Add a subtle gradient background from `#49297e` to `#3a1d66` for more visual richness. Apply Road Rage font to text. Add `cardShadow`
- **PR5.** Quality & Safety radio buttons: Increase radio button size from 20x20 to 24x24 (and inner from 12 to 16) for better tap targets. Apply Road Rage to labels and descriptions

### Settings Screen

- **S1.** Apply Barrio to "SETTINGS" header, Road Rage to section titles and all item text
- **S2.** Settings cards: Apply `cardShadow`. Remove border — the shadow is sufficient
- **S3.** Section titles: Change from generic gray uppercase to Road Rage font, color `#49297e`, letter-spacing 1.5
- **S4.** Upgrade card: Same treatment as PR4
- **S5.** Delete Account row: Ensure the red color (#dc2626) is clearly distinct and the touch target meets 44px minimum height (currently set, just verify)

---

## Loading Screen

The loading screen appears briefly on every app launch. It should feel consistent with the brand.

### L1. Apply Brand Typography and Colors

**Tasks:**
- Apply Barrio font to "WHAT COULD YOU DO?" title (may already be set — verify it renders after font load)
- Change the question mark color from `#c7d2fe` (off-palette indigo) to `#49297e` at opacity 0.15
- Apply the same subtle gradient background from W1 (`#f8f4ff` → `#ece6f4` → `#fce0f0`) to match the Welcome screen
- This ensures the loading screen feels like a seamless lead-in to the Welcome screen rather than a jarring flash

---

## Implementation Order Checklist

Work through these in order. Each step builds on the previous one.

**Phase 1: Foundation (do first)**
- [ ] G1 — Add Road Rage font
- [ ] G2 — Create shared shadow styles
- [ ] G3 — Fix off-palette colors
- [ ] G4 — Fix contrast issues

**Phase 2: Loading + Welcome Flow**
- [ ] L1 — Loading screen brand alignment
- [ ] W1 — Welcome background gradient
- [ ] W2 — Question mark watermark
- [ ] W3 — Welcome typography
- [ ] W4 — Get Started button polish

**Phase 3: Onboarding**
- [ ] H1 — Instruction card colors
- [ ] H2 — Onboarding typography
- [ ] H3 — Card shadows
- [ ] H4 — Back button polish

**Phase 4: Home Screen**
- [ ] HO1 — Age group buttons
- [ ] HO2 — Ready to Explore card
- [ ] HO3 — Continue card
- [ ] HO4 — Quick Tips card

**Phase 5: Prompt Display**
- [ ] P1 — Color-adaptive prompt card
- [ ] P2 — Prompt card elevation
- [ ] P3 — Prompt transition animation (optional)
- [ ] P4 — Header polish
- [ ] P5 — Discussion tips box
- [ ] P6 — Next Prompt button

**Phase 6: Remaining Screens**
- [ ] C1–C6 — Community screen
- [ ] PR1–PR5 — Profile screen
- [ ] S1–S5 — Settings screen

**Phase 7: Final Verification**
- [ ] G5 — Responsive typography/spacing audit across all screens
- [ ] Test on iPhone SE simulator (small screen)
- [ ] Test on iPhone 15 Pro Max simulator (large screen)
- [ ] Run a WCAG contrast check on all text/background combinations
- [ ] Verify both fonts load correctly on a fresh install (clear AsyncStorage, test onboarding)
