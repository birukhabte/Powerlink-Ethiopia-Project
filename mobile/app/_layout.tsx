import { Slot } from 'expo-router';
import { View, StyleSheet, StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
