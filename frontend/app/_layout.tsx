import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
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
    <GluestackUIProvider config={config}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GluestackUIProvider>
  );
}
