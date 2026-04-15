import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { getUser, redirectByRole } from '../hooks/useAuth';

export default function Index() {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await getUser();
      if (user && user.role) {
        redirectByRole(user.role);
      } else {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}
