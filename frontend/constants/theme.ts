export const theme = {
  colors: {
    primary: '#2563EB',
    primaryDark: '#1E40AF',
    secondary: '#10B981',
    accent: '#F59E0B',
    danger: '#EF4444',
    background: '#F9FAFB',
    card: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
};

export const billCategories = [
  { value: 'rent', label: 'Rent', icon: 'home', color: '#2563EB' },
  { value: 'electricity', label: 'Electricity', icon: 'flash', color: '#F59E0B' },
  { value: 'water', label: 'Water', icon: 'water', color: '#3B82F6' },
  { value: 'gas', label: 'Gas', icon: 'flame', color: '#EF4444' },
  { value: 'wifi', label: 'Wi-Fi', icon: 'wifi', color: '#8B5CF6' },
  { value: 'maid', label: 'Maid', icon: 'person', color: '#EC4899' },
  { value: 'other', label: 'Other', icon: 'ellipsis-horizontal', color: '#6B7280' },
];

export const paymentMethods = [
  { value: 'bkash', label: 'bKash' },
  { value: 'nagad', label: 'Nagad' },
  { value: 'rocket', label: 'Rocket' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank Transfer' },
];
