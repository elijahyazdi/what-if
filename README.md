# What Could You Do - React Native App

An app for fostering meaningful conversations with children through age-appropriate prompts.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

### Running the App

After running `npm start`, you'll see options to:

- **Press `w`** - Open in web browser (localhost)
- **Press `i`** - Open in iOS Simulator (requires macOS with Xcode)
- **Press `a`** - Open in Android Emulator (requires Android Studio)
- **Scan QR code** - Use Expo Go app on your phone to preview on device

### Development

- The app supports hot reloading - changes will appear automatically
- Edit `WireframeApp.tsx` to make changes to the main app
- Styles are in the StyleSheet at the bottom of `WireframeApp.tsx`

### Web Preview

To run in web browser specifically:
```bash
npm run web
```

This will start a local server at `http://localhost:8081` (or similar port).

## Project Structure

```
├── App.tsx              # Entry point
├── WireframeApp.tsx     # Main app component
├── package.json         # Dependencies
├── app.json            # Expo configuration
└── tsconfig.json       # TypeScript configuration
```
