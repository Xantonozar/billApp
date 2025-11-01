export interface Member {
  id: number;
  name: string;
  phone?: string;
  whatsapp?: string;
  facebook?: string;
  room_info?: string;
  avatar_base64?: string;
  rent_amount: number;
  joined_date: string;
  is_active: number;
  created_at: string;
}

export interface Bill {
  id: number;
  category: string;
  total_amount: number;
  bill_month: string;
  due_date?: string;
  bill_date: string;
  meter_reading?: string;
  notes?: string;
  photo_base64?: string;
  split_type: 'equal' | 'custom';
  created_at: string;
}

export interface BillAssignment {
  id: number;
  bill_id: number;
  member_id: number;
  assigned_amount: number;
  is_paid: number;
  paid_date?: string;
  payment_method?: string;
}

export interface Meal {
  id: number;
  member_id: number;
  meal_date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  total_quantity: number;
  meal_rate?: number;
  total_cost?: number;
  is_finalized: number;
  notes?: string;
}

export interface Deposit {
  id: number;
  member_id: number;
  amount: number;
  deposit_date: string;
  payment_method: string;
  transaction_id?: string;
  screenshot_base64?: string;
  notes?: string;
}

export interface Shopping {
  id: number;
  shopping_date: string;
  amount: number;
  items: string;
  receipt_base64?: string;
  notes?: string;
  shopper_name: string;
}

export interface Settings {
  key: string;
  value: string;
}

export type BillCategory = 'rent' | 'electricity' | 'water' | 'gas' | 'wifi' | 'maid' | 'other';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'cash' | 'bank';
