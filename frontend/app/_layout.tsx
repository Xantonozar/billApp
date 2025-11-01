import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { getDatabase } from '../database/init';

export default function RootLayout() {
  useEffect(() => {
    // Initialize database on app start
    getDatabase().then(() => {
      console.log('Database ready');
    }).catch((error) => {
      console.error('Database initialization failed:', error);
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
