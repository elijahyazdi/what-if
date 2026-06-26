# Expo + iOS Simulator — Start / Stop Guide

Quick reference for running the What Could You Do? app in the iOS Simulator via Expo Go.

---

## Start

### 1. Recommended: localhost mode (avoids LAN/firewall issues)

```bash
REACT_NATIVE_PACKAGER_HOSTNAME=localhost npx expo start --ios
```

`REACT_NATIVE_PACKAGER_HOSTNAME=localhost` makes Expo Go connect via `localhost:8081` instead of your Mac's LAN IP. Use this if you ever see *"Could not connect to development server"* in Expo Go.

### 2. Standard

```bash
npx expo start --ios
```

After it starts you can also press:

| Key | Action |
| --- | --- |
| `i` | Open / reload on iOS simulator |
| `a` | Open on Android emulator |
| `w` | Open in web browser |
| `r` | Reload the app on connected device |
| `j` | Open debugger |
| `?` | Show all shortcut keys |

### 3. Force a clean rebuild

```bash
npx expo start --ios --clear
```

Use `--clear` whenever:
- You change `babel.config.js`
- You change `metro.config.js`
- You change `app.json`
- You install/upgrade native dependencies
- The app shows a stale screen after a known-good fix

### 4. Boot a specific simulator

If no simulator is booted, Expo will pick one. To pick yours:

```bash
# List available devices
xcrun simctl list devices available | grep -E "iPhone|iPad"

# Boot one explicitly
xcrun simctl boot "iPhone 16e"
open -a Simulator
```

---

## Stop

### Stop Expo / Metro

In the terminal running `expo start`, press `Ctrl+C` (twice if needed).

If it's running in the background or detached:

```bash
# Kill anything bound to Metro's port
lsof -ti :8081 | xargs kill -9

# Or kill by name
pkill -f "expo start"
```

### Quit the app on the simulator (without quitting the simulator)

```bash
xcrun simctl terminate booted host.exp.Exponent
```

### Re-open the app on the simulator

```bash
xcrun simctl openurl booted "exp://localhost:8081"
```

### Shut down the simulator

```bash
# Shut down currently booted devices
xcrun simctl shutdown booted

# Or quit the Simulator.app entirely
osascript -e 'quit app "Simulator"'
```

---

## Common issues & fixes

| Symptom | Fix |
| --- | --- |
| *"Could not connect to development server"* | Use `REACT_NATIVE_PACKAGER_HOSTNAME=localhost npx expo start --ios`, or check macOS firewall isn't blocking node. |
| *"App entry not found — main was not registered"* | A top-level error during bundle load. Check the simulator's red error screen for the JS stack trace. Common cause: a corrupted `node_modules` package (do `rm -rf node_modules package-lock.json && npm install`). |
| *"[runtime not ready]: ..."* | A library failed during top-level module evaluation. Same fix path — read the JS stack on the red screen. |
| Port 8081 already in use | `lsof -ti :8081 \| xargs kill -9` then restart. |
| Stale UI after a fix | Restart with `--clear`. |
| Bundling hangs at 0% | Terminate Expo Go on the simulator, then `xcrun simctl openurl booted "exp://localhost:8081"`. |

---

## Diagnostics

### Take a screenshot of the simulator

```bash
xcrun simctl io booted screenshot /tmp/sim.png
open /tmp/sim.png
```

### Read JS errors from the simulator

```bash
xcrun simctl spawn booted log show --predicate 'process == "Expo Go"' --last 30s --style compact \
  | grep -iE "\[error\]|TypeError|Cannot convert|runtime not ready"
```

### Check if Metro is reachable

```bash
curl -s http://localhost:8081/status
# Should return: packager-status:running
```
