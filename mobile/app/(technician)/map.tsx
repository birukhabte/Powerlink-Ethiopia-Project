import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { MapPin, Navigation, Info } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const MOCK_TASKS = [
  { id: '1', latitude: 9.0238, longitude: 38.7460, title: 'Bole Transformer', priority: 'high' },
  { id: '2', latitude: 9.0125, longitude: 38.7523, title: 'Kazanchis Connection', priority: 'medium' },
];

export default function TechMap() {
  const [region, setRegion] = useState({
    latitude: 9.0192,
    longitude: 38.7525,
    latitudeDelta: 0.0522,
    longitudeDelta: 0.0421,
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
      >
        {MOCK_TASKS.map((task) => (
          <Marker
            key={task.id}
            coordinate={{ latitude: task.latitude, longitude: task.longitude }}
            pinColor={task.priority === 'high' ? '#ef4444' : '#f59e0b'}
          >
            <Callout style={styles.callout}>
              <View>
                <Text style={styles.calloutTitle}>{task.title}</Text>
                <Text style={styles.calloutPriority}>{task.priority.toUpperCase()} PRIORITY</Text>
                <TouchableOpacity style={styles.calloutBtn}>
                  <Text style={styles.calloutBtnText}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>High Priority</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>Medium Priority</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.navFab}>
          <Navigation color="#fff" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  legend: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  navFab: {
    backgroundColor: '#2563eb',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  callout: {
    width: 160,
    padding: 10,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  calloutPriority: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
    marginTop: 4,
  },
  calloutBtn: {
    marginTop: 8,
    backgroundColor: '#2563eb',
    padding: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  calloutBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
