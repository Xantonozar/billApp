import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useRouter } from 'expo-router';

export default function MoreScreen() {
  const router = useRouter();

  const menuItems = [
    {
      section: 'Financial',
      items: [
        { icon: 'wallet', label: 'Deposits', subtitle: 'Meal fund deposits', route: '/deposits' },
        { icon: 'cart', label: 'Shopping', subtitle: 'Meal shopping expenses', route: '/shopping' },
        { icon: 'stats-chart', label: 'Reports', subtitle: 'Analytics & reports', route: '/reports' },
      ]
    },
    {
      section: 'Settings',
      items: [
        { icon: 'home', label: 'Room Settings', subtitle: 'Room name, address', route: '/settings' },
        { icon: 'restaurant', label: 'Meal Settings', subtitle: 'Meal rate, defaults', route: '/settings' },
        { icon: 'save', label: 'Backup & Restore', subtitle: 'Export/import data', route: '/settings' },
      ]
    },
    {
      section: 'About',
      items: [
        { icon: 'information-circle', label: 'About App', subtitle: 'Version 1.0.0', route: '/about' },
        { icon: 'help-circle', label: 'Help & Support', subtitle: 'FAQs and guides', route: '/help' },
      ]
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {menuItems.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          <View style={styles.menuCard}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.menuItem,
                  itemIndex < section.items.length - 1 && styles.menuItemBorder
                ]}
                onPress={() => {}}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon as any} size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>BillKhata Manager</Text>
        <Text style={styles.footerSubtext}>Version 1.0.0</Text>
        <Text style={styles.footerSubtext}>ব্যবস্থাপনা সহজ করুন</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginLeft: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  menuCard: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    padding: 40,
    gap: 4,
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  footerSubtext: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
});
