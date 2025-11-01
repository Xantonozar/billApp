import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { theme, billCategories } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { getAllBills, getAllMembers, getBillAssignments } from '../../database/services';
import { Bill } from '../../types';

export default function BillsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM yyyy'));
  const [memberCount, setMemberCount] = useState(0);

  const loadBills = async () => {
    try {
      const allBills = await getAllBills(selectedMonth);
      const members = await getAllMembers();
      setBills(allBills);
      setMemberCount(members.length);
    } catch (error) {
      console.error('Error loading bills:', error);
    }
  };

  useEffect(() => {
    loadBills();
  }, [selectedMonth]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBills();
    setRefreshing(false);
  };

  const totalBillAmount = bills.reduce((sum, bill) => sum + bill.total_amount, 0);

  const getBillsByCategory = (category: string) => {
    return bills.filter(bill => bill.category === category);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Month Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{selectedMonth} Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Bills:</Text>
            <Text style={styles.summaryValue}>৳{totalBillAmount.toFixed(0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{bills.length} bills • {memberCount} members</Text>
          </View>
        </View>

        {/* Bill Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Categories</Text>
          <View style={styles.categoriesGrid}>
            {billCategories.map((category) => {
              const categoryBills = getBillsByCategory(category.value);
              const categoryTotal = categoryBills.reduce((sum, bill) => sum + bill.total_amount, 0);
              
              return (
                <TouchableOpacity
                  key={category.value}
                  style={styles.categoryCard}
                  onPress={() => {}}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <Ionicons name={category.icon as any} size={28} color={category.color} />
                  </View>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                  <Text style={styles.categoryAmount}>৳{categoryTotal.toFixed(0)}</Text>
                  <Text style={styles.categoryCount}>{categoryBills.length} bills</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recent Bills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Bills</Text>
          {bills.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color={theme.colors.textSecondary} />
              <Text style={styles.emptyText}>No bills for this month</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Your First Bill</Text>
              </TouchableOpacity>
            </View>
          ) : (
            bills.map((bill) => {
              const category = billCategories.find(c => c.value === bill.category);
              return (
                <TouchableOpacity key={bill.id} style={styles.billCard}>
                  <View style={styles.billHeader}>
                    <View style={[styles.billIcon, { backgroundColor: category?.color + '20' }]}>
                      <Ionicons name={category?.icon as any} size={24} color={category?.color} />
                    </View>
                    <View style={styles.billInfo}>
                      <Text style={styles.billCategory}>{category?.label}</Text>
                      <Text style={styles.billDate}>{bill.bill_date}</Text>
                    </View>
                    <Text style={styles.billAmount}>৳{bill.total_amount.toFixed(0)}</Text>
                  </View>
                  {bill.notes && (
                    <Text style={styles.billNotes}>{bill.notes}</Text>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  summaryCard: {
    margin: 16,
    padding: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  categoryCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  billCard: {
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  billIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billInfo: {
    flex: 1,
  },
  billCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  billDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  billAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  billNotes: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
