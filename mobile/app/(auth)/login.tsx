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
} from 'react-native';
import { LogIn, Mail, Key, AlertCircle } from 'lucide-react-native';
import axios from 'axios';
import { router } from 'expo-router';
import { API_ENDPOINTS } from '../../config/api';
import { saveAuth, redirectByRole } from '../../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrors({});

    try {
      if (!email || !password) {
        setErrors({ general: 'Email and password are required' });
        setLoading(false);
        return;
      }

      const response = await axios.post(API_ENDPOINTS.auth.login, { email, password });

      if (response.data.success) {
        await saveAuth(response.data.token, response.data.user);
        redirectByRole(response.data.user.role);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        setErrors({ general: error.response.data.error || 'Login failed' });
      } else {
        setErrors({ general: 'Cannot connect to server. Check your connection.' });
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
          <LogIn color="#2563eb" size={48} />
          <Text style={styles.title}>PowerLink Login</Text>
          <Text style={styles.subtitle}>Access your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Mail size={14} color="#374151" /> Email or BP Number
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Email or BP Number"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Key size={14} color="#374151" /> Password
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {errors.general && (
            <View style={styles.errorContainer}>
              <AlertCircle color="#ef4444" size={18} />
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password' as any)}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text
                style={styles.boldLink}
                onPress={() => router.push('/(auth)/register' as any)}
              >
                Register
              </Text>
            </Text>
          </View>
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
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontBold: 'bold',
    fontWeight: '800',
    color: '#1f2937',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
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
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
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
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
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
