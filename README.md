# Save My Spot

A simple Expo React Native app to:

1. Save your current location with an optional name.
2. Persist spots on-device.
3. Open driving directions to any saved spot in Google Maps.

## Run locally

```bash
npm install
npm run start
```

Then press:

- `a` for Android emulator/device
- `i` for iOS simulator/device
- `w` for web preview

## How it works

- Taps **Save** to capture your current latitude/longitude using `expo-location`.
- Stores spots in `AsyncStorage`.
- Taps **Navigate in Google Maps** to open either:
  - `comgooglemaps://` (if Google Maps app is installed), or
  - Google Maps web directions URL fallback.
