import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    // Only initialize database on native platforms
    if (Platform.OS !== 'web') {
      import('../database/init').then(({ getDatabase }) => {
        getDatabase().then(() => {
          console.log('Database ready');
        }).catch((error) => {
          console.error('Database initialization failed:', error);
        });
      });
    }
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="web-notice" />
    </Stack>
  );
}
