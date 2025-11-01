import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto navigate to main app after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="receipt" size={80} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>BillKhata Manager</Text>
      <Text style={styles.subtitle}>ব্যবস্থাপনা সহজ করুন</Text>
      <Text style={styles.subtitleEng}>(Make Management Easy)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  subtitleEng: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
