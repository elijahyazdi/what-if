---
name: expo-dev
description: Start the Expo development server for local testing and development
argument-hint: [options]
---

# Start Expo Dev Server

Start the Expo dev server for the What Could You Do? app.

Instruct the user to open a VS Code terminal (Ctrl+`) and run:

```bash
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on a physical device

## Options

Pass options as arguments:
- `--clear` — Clear Metro cache before starting
- `--tunnel` — Use tunnel mode for remote device testing
- `--port <number>` — Use a custom port (default: 8081)

## Troubleshooting

**Port already in use:**
```bash
lsof -i :8081
kill -9 <PID>
```

**Metro bundler stuck:**
```bash
npx expo start --clear
```

**Dependencies missing:**
```bash
npm install
npx expo install
```
