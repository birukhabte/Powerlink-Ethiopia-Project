import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Zap,
  Move,
  UserCheck,
  CreditCard,
  Split,
  ChevronRight,
  MapPin,
  Building,
  Phone,
  Upload,
} from 'lucide-react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { getAuthHeaders } from '../../hooks/useAuth';

const SERVICES = [
  { id: 'new_service', title: 'New Service', icon: Zap, color: '#2563eb', bg: '#eff6ff' },
  { id: 'relocation', title: 'Relocation', icon: Move, color: '#7c3aed', bg: '#f5f3ff' },
  { id: 'name_change', title: 'Name Change', icon: UserCheck, color: '#db2777', bg: '#fdf2f8' },
  { id: 'tariff_change', title: 'Tariff Change', icon: CreditCard, color: '#059669', bg: '#ecfdf5' },
  { id: 'meter_separation', title: 'Meter Separation', icon: Split, color: '#d97706', bg: '#fffbeb' },
];

export default function RequestService() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: '',
    woreda: '',
    kebele: '',
    houseNumber: '',
    landmark: '',
    phone: '',
  });

  const handleSubmit = async () => {
    if (!formData.city || !formData.woreda || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const payload = {
        type: selectedService.id,
        address: `${formData.city}, ${formData.woreda}, ${formData.kebele}, ${formData.houseNumber}`,
        landmark: formData.landmark,
        phone: formData.phone,
        // Document handling would go here
      };

      const response = await axios.post(API_ENDPOINTS.serviceRequests.base, payload, { headers });
      
      if (response.data.success) {
        Alert.alert('Success', 'Your request has been submitted successfully!', [
          { text: 'View Tickets', onPress: () => router.push('/(customer)/ticket' as any) }
        ]);
      }
    } catch (error) {
      console.error('Submit request error:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Service</Text>
          <Text style={styles.subtitle}>What kind of service do you need today?</Text>
        </View>

        <View style={styles.serviceList}>
          {SERVICES.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => {
                setSelectedService(service);
                setStep(2);
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: service.bg }]}>
                <service.icon color={service.color} size={24} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDesc}>Apply for a {service.title.toLowerCase()}</Text>
              </View>
              <ChevronRight color="#9ca3af" size={20} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backLink} onPress={() => setStep(1)}>
          <Text style={styles.backText}>← Back to Select Service</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{selectedService?.title} Application</Text>
        <Text style={styles.subtitle}>Fill in your location details</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City *</Text>
          <View style={styles.inputWrapper}>
            <MapPin size={20} color="#9ca3af" />
            <TextInput
              style={styles.input}
              placeholder="e.g. Addis Ababa"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Woreda *</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. 05"
              value={formData.woreda}
              onChangeText={(text) => setFormData({ ...formData, woreda: text })}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Kebele</Text>
            <TextInput
              style={styles.inputSimple}
              placeholder="e.g. 12"
              value={formData.kebele}
              onChangeText={(text) => setFormData({ ...formData, kebele: text })}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>House Number</Text>
          <TextInput
            style={styles.inputSimple}
            placeholder="e.g. 456"
            value={formData.houseNumber}
            onChangeText={(text) => setFormData({ ...formData, houseNumber: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <View style={styles.inputWrapper}>
            <Phone size={20} color="#9ca3af" />
            <TextInput
              style={styles.input}
              placeholder="+251..."
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.uploadSection}>
          <Text style={styles.label}>Required Documents</Text>
          <TouchableOpacity style={styles.uploadBox}>
            <Upload size={24} color="#2563eb" />
            <Text style={styles.uploadTitle}>Tap to upload documents</Text>
            <Text style={styles.uploadSubtitle}>ID Copy, Site Plan, etc. (Max 5MB)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  backLink: {
    marginBottom: 16,
  },
  backText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  serviceList: {
    paddingHorizontal: 24,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  serviceDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  form: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  inputSimple: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 12,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
