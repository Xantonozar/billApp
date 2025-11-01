import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { getAllMembers, getMemberMonthSummary, deleteMember } from '../../database/services';
import { Member } from '../../types';

export default function MembersScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberSummaries, setMemberSummaries] = useState<Map<number, any>>(new Map());

  const loadMembers = async () => {
    try {
      const membersData = await getAllMembers();
      setMembers(membersData);

      // Load summaries for each member
      const currentMonth = format(new Date(), 'yyyy-MM');
      const summaries = new Map();
      
      for (const member of membersData) {
        const summary = await getMemberMonthSummary(member.id, currentMonth);
        summaries.set(member.id, summary);
      }
      
      setMemberSummaries(summaries);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMembers();
    setRefreshing(false);
  };

  const handleDeleteMember = (member: Member) => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to remove ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteMember(member.id);
            loadMembers();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{members.length} Active Members</Text>
        </View>

        {/* Members List */}
        {members.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={80} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>No members yet</Text>
            <Text style={styles.emptySubtext}>Add your first member to get started</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Member</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.membersList}>
            {members.map((member) => {
              const summary = memberSummaries.get(member.id) || {
                bills: { total: 0, paid: 0, pending: 0 },
                meals: { quantity: 0, cost: 0 },
                deposits: { total: 0 },
                refundable: 0
              };

              return (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberHeader}>
                    <View style={styles.memberAvatar}>
                      {member.avatar_base64 ? (
                        <Text>IMG</Text>
                      ) : (
                        <Text style={styles.memberAvatarText}>
                          {member.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      {member.phone && (
                        <View style={styles.contactRow}>
                          <Ionicons name="call" size={14} color={theme.colors.textSecondary} />
                          <Text style={styles.contactText}>{member.phone}</Text>
                        </View>
                      )}
                      {member.room_info && (
                        <View style={styles.contactRow}>
                          <Ionicons name="home" size={14} color={theme.colors.textSecondary} />
                          <Text style={styles.contactText}>{member.room_info}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Member Stats */}
                  <View style={styles.memberStats}>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Monthly Rent:</Text>
                      <Text style={styles.statValue}>৳{member.rent_amount.toFixed(0)}</Text>
                    </View>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Bills This Month:</Text>
                      <Text style={styles.statValue}>৳{summary.bills.total.toFixed(0)}</Text>
                    </View>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Meals Cost:</Text>
                      <Text style={styles.statValue}>৳{summary.meals.cost.toFixed(0)}</Text>
                    </View>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Meal Refund:</Text>
                      <Text style={[styles.statValue, { color: summary.refundable >= 0 ? theme.colors.success : theme.colors.danger }]}>
                        {summary.refundable >= 0 ? '+' : ''}৳{summary.refundable.toFixed(0)}
                      </Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={styles.memberActions}>
                    {member.whatsapp && (
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="logo-whatsapp" size={20} color={theme.colors.success} />
                      </TouchableOpacity>
                    )}
                    {member.phone && (
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="call" size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="create" size={20} color={theme.colors.accent} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteMember(member)}
                    >
                      <Ionicons name="trash" size={20} color={theme.colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="person-add" size={28} color="white" />
      </TouchableOpacity>
    </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  membersList: {
    padding: 16,
    gap: 16,
  },
  memberCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberHeader: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  memberAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  memberInfo: {
    flex: 1,
    gap: 4,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  memberStats: {
    gap: 8,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  memberActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
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
