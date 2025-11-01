import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { format, addDays, subDays } from 'date-fns';
import { getMealsByDate, getAllMembers, finalizeMeals, getCurrentMealRate } from '../../database/services';
import { Meal, Member } from '../../types';

export default function MealsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isFinalized, setIsFinalized] = useState(false);
  const [mealRate, setMealRate] = useState(0);

  const loadMeals = async () => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const mealsData = await getMealsByDate(dateStr);
      const membersData = await getAllMembers();
      const rate = await getCurrentMealRate();
      
      setMeals(mealsData);
      setMembers(membersData);
      setMealRate(rate);
      
      if (mealsData.length > 0) {
        setIsFinalized(mealsData.every(m => m.is_finalized === 1));
      } else {
        setIsFinalized(false);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  useEffect(() => {
    loadMeals();
  }, [selectedDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMeals();
    setRefreshing(false);
  };

  const handlePreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const getMealForMember = (memberId: number) => {
    return meals.find(m => m.member_id === memberId);
  };

  const totalQuantities = meals.reduce((sum, meal) => sum + (meal.total_quantity || 0), 0);
  const estimatedCost = totalQuantities * mealRate;

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={handlePreviousDay} style={styles.dateButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <View style={styles.dateInfo}>
            <Text style={styles.dateText}>{format(selectedDate, 'EEEE')}</Text>
            <Text style={styles.dateMainText}>{format(selectedDate, 'MMM d, yyyy')}</Text>
            {format(selectedDate, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd') && (
              <TouchableOpacity onPress={handleToday}>
                <Text style={styles.todayButton}>Go to Today</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={handleNextDay} style={styles.dateButton}>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            {isFinalized ? (
              <Ionicons name="checkmark-circle" size={32} color={theme.colors.success} />
            ) : (
              <Ionicons name="time" size={32} color={theme.colors.accent} />
            )}
            <Text style={styles.statusTitle}>
              {isFinalized ? 'Meals Finalized' : 'Not Finalized Yet'}
            </Text>
          </View>
          <View style={styles.statusStats}>
            <View style={styles.statusStat}>
              <Text style={styles.statusLabel}>Total Quantities</Text>
              <Text style={styles.statusValue}>{totalQuantities.toFixed(1)}</Text>
            </View>
            <View style={styles.statusStat}>
              <Text style={styles.statusLabel}>Meal Rate</Text>
              <Text style={styles.statusValue}>৳{mealRate.toFixed(2)}</Text>
            </View>
            <View style={styles.statusStat}>
              <Text style={styles.statusLabel}>Estimated Cost</Text>
              <Text style={styles.statusValue}>৳{estimatedCost.toFixed(0)}</Text>
            </View>
          </View>
          {!isFinalized && totalQuantities > 0 && (
            <TouchableOpacity style={styles.finalizeButton}>
              <Text style={styles.finalizeButtonText}>Finalize Today's Meals</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Members Meal List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Members' Meals</Text>
          {members.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color={theme.colors.textSecondary} />
              <Text style={styles.emptyText}>No members added yet</Text>
              <Text style={styles.emptySubtext}>Add members first to log their meals</Text>
            </View>
          ) : (
            members.map((member) => {
              const meal = getMealForMember(member.id);
              const breakfast = meal?.breakfast || 0;
              const lunch = meal?.lunch || 0;
              const dinner = meal?.dinner || 0;
              const total = breakfast + lunch + dinner;
              
              return (
                <TouchableOpacity key={member.id} style={styles.memberCard}>
                  <View style={styles.memberHeader}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>
                        {member.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <View style={styles.mealTags}>
                        <View style={styles.mealTag}>
                          <Ionicons name="sunny" size={14} color={theme.colors.accent} />
                          <Text style={styles.mealTagText}>{breakfast}</Text>
                        </View>
                        <View style={styles.mealTag}>
                          <Ionicons name="partly-sunny" size={14} color={theme.colors.primary} />
                          <Text style={styles.mealTagText}>{lunch}</Text>
                        </View>
                        <View style={styles.mealTag}>
                          <Ionicons name="moon" size={14} color={theme.colors.textSecondary} />
                          <Text style={styles.mealTagText}>{dinner}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.memberTotal}>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Text style={styles.totalValue}>{total.toFixed(1)}</Text>
                      {meal?.is_finalized === 1 && (
                        <Text style={styles.costValue}>৳{(meal.total_cost || 0).toFixed(0)}</Text>
                      )}
                    </View>
                  </View>
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: theme.colors.card,
  },
  dateButton: {
    padding: 8,
  },
  dateInfo: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  dateMainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  todayButton: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 4,
  },
  statusCard: {
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
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  statusStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statusStat: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  finalizeButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  finalizeButtonText: {
    color: 'white',
    fontSize: 16,
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
  memberCard: {
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
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  mealTags: {
    flexDirection: 'row',
    gap: 8,
  },
  mealTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  mealTagText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
  },
  memberTotal: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  costValue: {
    fontSize: 14,
    color: theme.colors.success,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
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
