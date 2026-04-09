import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: 'customer' | 'special' | 'technician' | 'supervisor' | 'admin';
}

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem('token');
};

export const getUser = async (): Promise<User | null> => {
  const raw = await AsyncStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export const saveAuth = async (token: string, user: User): Promise<void> => {
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};

export const getAuthHeaders = async (): Promise<{ Authorization: string }> => {
  const token = await getToken();
  return { Authorization: `Bearer ${token}` };
};

export const redirectByRole = (role: string): void => {
  const routes: Record<string, string> = {
    customer: '/(customer)/dashboard',
    special: '/(customer)/dashboard',
    technician: '/(technician)/dashboard',
    supervisor: '/(supervisor)/dashboard',
    admin: '/(admin)/dashboard',
  };
  router.replace((routes[role] || '/(customer)/dashboard') as any);
};

export const logout = async (): Promise<void> => {
  await clearAuth();
  router.replace('/(auth)/login');
};
