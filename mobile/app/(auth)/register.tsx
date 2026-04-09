import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { UserPlus, User, Building2, Mail, Key, Phone, MapPin, Hash } from 'lucide-react-native';
import axios from 'axios';
import { router } from 'expo-router';
import { API_ENDPOINTS } from '../../config/api';

export default function Register() {
  const [activeTab, setActiveTab] = useState<'customer' | 'special'>('customer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bpNumber: '',
    hasBp: false,
    businessType: '',
    specificType: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleRegister = async () => {
    setLoading(true);
    setErrors({});

    // Basic Validation
    const newErrors: any = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: activeTab,
        bpNumber: formData.bpNumber || null,
        businessType: activeTab === 'special' ? formData.businessType : null,
      };

      const response = await axios.post(API_ENDPOINTS.auth.register, payload);

      if (response.data.success) {
        Alert.alert('Success', 'Registration successful! Please login.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') },
        ]);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response) {
        setErrors({ general: error.response.data.error || 'Registration failed' });
      } else {
        setErrors({ general: 'Network error. Try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <UserPlus color="#2563eb" size={48} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join PowerLink Ethiopia</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'customer' && styles.activeTab]}
            onPress={() => setActiveTab('customer')}
          >
            <User size={18} color={activeTab === 'customer' ? '#fff' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'customer' && styles.activeTabText]}>
              Residential
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'special' && styles.activeTab]}
            onPress={() => setActiveTab('special')}
          >
            <Building2 size={18} color={activeTab === 'special' ? '#fff' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'special' && styles.activeTabText]}>
              Business
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <User size={14} color="#374151" /> Full Name
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />
            {errors.fullName && <Text style={styles.errorTextSmall}>{errors.fullName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Mail size={14} color="#374151" /> Email Address
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {errors.email && <Text style={styles.errorTextSmall}>{errors.email}</Text>}
          </View>

          {activeTab === 'special' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Building2 size={14} color="#374151" /> Business Type
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Factory, School, Hotel"
                value={formData.businessType}
                onChangeText={(text) => setFormData({ ...formData, businessType: text })}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Hash size={14} color="#374151" /> BP Number (Optional)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter BP Number if you have one"
              value={formData.bpNumber}
              onChangeText={(text) => setFormData({ ...formData, bpNumber: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Key size={14} color="#374151" /> Password
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorTextSmall}>{errors.password}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Key size={14} color="#374151" /> Confirm Password
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry
            />
            {errors.confirmPassword && (
              <Text style={styles.errorTextSmall}>{errors.confirmPassword}</Text>
            )}
          </View>

          {errors.general && (
            <View style={styles.errorContainer}>
              <AlertCircle color="#ef4444" size={18} />
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.footer} onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.boldLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#fff',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  errorTextSmall: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  boldLink: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
