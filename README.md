# Save My Spot

A simple Expo React Native app to:

1. Save your current location with an optional name.
2. Persist spots on-device.
3. Open driving directions to any saved spot in Google Maps.

## Publish and use on your phone (quick start)

If you just want this running on your phone with the least setup, use **Expo Go**.

1. Install **Expo Go** on your phone:
   - Android: Google Play Store
   - iPhone: App Store
2. In this project, install dependencies and start the Expo server:

```bash
npm install
npx expo start
```

3. Connect your phone and computer to the same Wi-Fi.
4. Scan the QR code from the terminal/browser:
   - Android: scan directly from Expo Go
   - iPhone: scan with Camera, then open in Expo Go

Your app opens on your phone immediately (development mode).

## Publish a shareable production build

For something you can share/install without keeping your computer running, build with EAS.

### 1) One-time setup

```bash
npm install -g eas-cli
eas login
eas build:configure
```

### 2) Android installable APK (best for direct phone install)

```bash
eas build -p android --profile preview
```

When the build finishes, open the build URL on your phone and install the APK.

### 3) iPhone distribution options

iOS builds require Apple Developer setup.

```bash
eas build -p ios --profile production
```

Then distribute through TestFlight/App Store Connect.

## Publish app updates (without rebuilding each time)

After your first install via EAS build, you can ship JS/content updates with EAS Update:

```bash
eas update --branch production --message "Update app content"
```

Users with that build installed receive the update over-the-air.

## Run locally

```bash
npm install
npm run start
```

Then press:

- `a` for Android emulator/device
- `i` for iOS simulator/device
- `w` for web preview

## Local Android APK (install on your phone)

You have two practical options.

### Option A: Cloud build APK with EAS (recommended)

1. Install EAS CLI and log in:

```bash
npm install -g eas-cli
eas login
```

2. Configure EAS in this project:

```bash
eas build:configure
```

3. Build an APK (internal distribution / preview profile):

```bash
eas build -p android --profile preview
```

4. Open the build URL shown in terminal, download the APK on your phone, and install it.
   - You may need to enable **Install unknown apps** on Android.

### Option B: Build directly from Android Studio/SDK on your machine

1. Connect your phone with USB debugging enabled.
2. Run:

```bash
npm install
npm run android
```

This installs a debug build directly to your connected Android device.

## Web support

Yes — this app is web-supported through Expo web.

### Run web locally

```bash
npm run web
```

### Create a production web build

```bash
npx expo export --platform web
```

This generates static files in `dist/` that you can deploy to:

- Vercel
- Netlify
- GitHub Pages (with a static hosting workflow)
- Any static file host

## Notes

- On native mobile, location permission is requested when saving a spot.
- On web, browser location permissions are used.
- Google Maps navigation uses app deep links on native and web URL fallback everywhere.

## How it works

- Taps **Save** to capture your current latitude/longitude using `expo-location`.
- Stores spots in `AsyncStorage`.
- Taps **Navigate in Google Maps** to open either:
  - `comgooglemaps://` (if Google Maps app is installed), or
  - Google Maps web directions URL fallback.
