import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export default function WebNotice() {
  return (
    <View style={styles.container}>
      <Ionicons name="phone-portrait" size={80} color={theme.colors.primary} />
      <Text style={styles.title}>Mobile App Only</Text>
      <Text style={styles.message}>
        BillKhata Manager is designed for mobile devices.
      </Text>
      <Text style={styles.instructions}>
        To use this app:
      </Text>
      <View style={styles.steps}>
        <Text style={styles.step}>1. Install Expo Go on your Android/iOS device</Text>
        <Text style={styles.step}>2. Scan the QR code shown in terminal</Text>
        <Text style={styles.step}>3. The app will open on your phone</Text>
      </View>
      <Text style={styles.note}>
        Note: This app uses SQLite which only works on native mobile platforms.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginTop: 24,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  instructions: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  steps: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  step: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    paddingLeft: 16,
  },
  note: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
