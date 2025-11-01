import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { getAllMembers, getAllBills, getMealsByDate, getAllShopping, getAllDeposits, getCurrentMealRate } from '../../database/services';
import { useStore } from '../../store/useStore';

export default function Dashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalBills: 0,
    totalBillAmount: 0,
    collectedAmount: 0,
    mealFundBalance: 0,
    todayMealsFinalized: false,
    currentMealRate: 0,
  });

  const loadDashboardData = async () => {
    try {
      const members = await getAllMembers();
      const currentMonth = format(new Date(), 'MMMM yyyy');
      const bills = await getAllBills(currentMonth);
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayMeals = await getMealsByDate(today);
      const shopping = await getAllShopping(format(new Date(), 'yyyy-MM'));
      const deposits = await getAllDeposits();
      const mealRate = await getCurrentMealRate();

      // Calculate bill stats
      let totalBillAmount = 0;
      let collectedAmount = 0;
      
      // Simple calculation - would need bill assignments in real app
      bills.forEach(bill => {
        totalBillAmount += bill.total_amount;
      });

      // Calculate meal fund
      const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);
      const totalShopping = shopping.reduce((sum, s) => sum + s.amount, 0);
      const mealFundBalance = totalDeposits - totalShopping;

      const todayFinalized = todayMeals.length > 0 && todayMeals.every(m => m.is_finalized === 1);

      setStats({
        totalMembers: members.length,
        totalBills: bills.length,
        totalBillAmount,
        collectedAmount,
        mealFundBalance,
        todayMealsFinalized: todayFinalized,
        currentMealRate: mealRate,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const today = format(new Date(), 'EEEE, MMM d, yyyy');

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>আসসালামু আলাইকুম 👋</Text>
        <Text style={styles.date}>{today}</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="receipt" size={32} color="white" />
          <Text style={styles.statValue}>৳{stats.totalBillAmount.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Total Bills This Month</Text>
          <Text style={styles.statSubtext}>{stats.totalBills} bills • {stats.totalMembers} members</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.colors.secondary }]}>
          <Ionicons name="wallet" size={32} color="white" />
          <Text style={styles.statValue}>৳{stats.mealFundBalance.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Meal Fund Balance</Text>
          <Text style={styles.statSubtext}>Rate: ৳{stats.currentMealRate.toFixed(2)}/qty</Text>
        </View>
      </View>

      {/* Today's Meal Status */}
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push('/meals')}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="restaurant" size={24} color={theme.colors.accent} />
          <Text style={styles.cardTitle}>Today's Meal Status</Text>
        </View>
        <View style={styles.cardContent}>
          {stats.todayMealsFinalized ? (
            <>
              <Ionicons name="checkmark-circle" size={48} color={theme.colors.success} />
              <Text style={styles.statusText}>Meals Finalized</Text>
            </>
          ) : (
            <>
              <Ionicons name="time" size={48} color={theme.colors.accent} />
              <Text style={styles.statusText}>Not Finalized Yet</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Log & Finalize Meals →</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/bills')}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="receipt" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionLabel}>Add Bill</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/meals')}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.accent + '20' }]}>
              <Ionicons name="restaurant" size={32} color={theme.colors.accent} />
            </View>
            <Text style={styles.actionLabel}>Log Meals</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/members')}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
              <Ionicons name="person-add" size={32} color={theme.colors.secondary} />
            </View>
            <Text style={styles.actionLabel}>Add Member</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/more')}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.accent + '20' }]}>
              <Ionicons name="cart" size={32} color={theme.colors.accent} />
            </View>
            <Text style={styles.actionLabel}>Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.card,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statsGrid: {
    padding: 16,
    gap: 16,
  },
  statCard: {
    padding: 20,
    borderRadius: 16,
    gap: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  statSubtext: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  card: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  cardContent: {
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  actionButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: theme.colors.accent,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
});
