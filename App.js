import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const STORAGE_KEY = 'saved-spots-v1';

function formatDate(isoString) {
  return new Date(isoString).toLocaleString();
}

export default function App() {
  const [spots, setSpots] = useState([]);
  const [spotName, setSpotName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSpots();
  }, []);

  const hasSpots = useMemo(() => spots.length > 0, [spots]);

  async function loadSpots() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setSpots([]);
        return;
      }

      const parsed = JSON.parse(raw);
      setSpots(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      Alert.alert('Load failed', 'Could not load saved spots.');
    } finally {
      setLoading(false);
    }
  }

  async function persistSpots(nextSpots) {
    setSpots(nextSpots);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSpots));
  }

  async function saveCurrentLocation() {
    if (saving) {
      return;
    }

    setSaving(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Enable location access to save your spot.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const trimmedName = spotName.trim();
      const nextSpot = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: trimmedName || `Spot ${spots.length + 1}`,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        createdAt: new Date().toISOString(),
      };

      const nextSpots = [nextSpot, ...spots];
      await persistSpots(nextSpots);
      setSpotName('');
    } catch (error) {
      Alert.alert('Save failed', 'Could not fetch your current location.');
    } finally {
      setSaving(false);
    }
  }

  async function removeSpot(id) {
    const nextSpots = spots.filter((spot) => spot.id !== id);
    await persistSpots(nextSpots);
  }

  function openInGoogleMaps(spot) {
    const latLng = `${spot.latitude},${spot.longitude}`;
    const appUrl = `comgooglemaps://?daddr=${latLng}&directionsmode=driving`;
    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}&travelmode=driving`;

    Linking.canOpenURL(appUrl)
      .then((supported) => Linking.openURL(supported ? appUrl : webUrl))
      .catch(() => Linking.openURL(webUrl));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Save My Spot</Text>
      <Text style={styles.subtitle}>Save your current location and navigate there with Google Maps.</Text>

      <View style={styles.inputRow}>
        <TextInput
          value={spotName}
          onChangeText={setSpotName}
          placeholder="Spot name (optional)"
          style={styles.input}
          placeholderTextColor="#8D95A5"
        />
        <TouchableOpacity
          style={[styles.primaryButton, saving && styles.buttonDisabled]}
          onPress={saveCurrentLocation}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#1940C8" />
        </View>
      ) : (
        <FlatList
          data={spots}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, !hasSpots && styles.emptyList]}
          ListEmptyComponent={<Text style={styles.emptyText}>No spots yet. Save one from your current location.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeSpot(item.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.coordinates}>{item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}</Text>
              <Text style={styles.dateText}>Saved {formatDate(item.createdAt)}</Text>
              <TouchableOpacity style={styles.navigateButton} onPress={() => openInGoogleMaps(item)}>
                <Text style={styles.navigateText}>Navigate in Google Maps</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    color: '#4B5563',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#DBE3F1',
  },
  primaryButton: {
    backgroundColor: '#1940C8',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 12,
    gap: 10,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5EAF4',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  deleteText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  coordinates: {
    marginTop: 8,
    color: '#374151',
  },
  dateText: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 12,
  },
  navigateButton: {
    marginTop: 12,
    backgroundColor: '#E8EEFF',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  navigateText: {
    color: '#1940C8',
    fontWeight: '700',
  },
});
