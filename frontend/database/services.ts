import { getDatabase } from './init';
import { Member, Bill, BillAssignment, Meal, Deposit, Shopping } from '../types';
import { format } from 'date-fns';

// MEMBER SERVICES
export const getAllMembers = async (activeOnly: boolean = true): Promise<Member[]> => {
  const db = await getDatabase();
  const query = activeOnly 
    ? 'SELECT * FROM members WHERE is_active = 1 ORDER BY name'
    : 'SELECT * FROM members ORDER BY name';
  const result = await db.getAllAsync<Member>(query);
  return result;
};

export const getMemberById = async (id: number): Promise<Member | null> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<Member>(
    'SELECT * FROM members WHERE id = ?',
    [id]
  );
  return result;
};

export const createMember = async (member: Omit<Member, 'id' | 'created_at'>): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO members (name, phone, whatsapp, facebook, room_info, avatar_base64, rent_amount, joined_date, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      member.name,
      member.phone || null,
      member.whatsapp || null,
      member.facebook || null,
      member.room_info || null,
      member.avatar_base64 || null,
      member.rent_amount,
      member.joined_date,
      member.is_active
    ]
  );
  return result.lastInsertRowId;
};

export const updateMember = async (id: number, member: Partial<Member>): Promise<void> => {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];
  
  Object.entries(member).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'created_at') {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });
  
  if (fields.length > 0) {
    values.push(id);
    await db.runAsync(
      `UPDATE members SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
};

export const deleteMember = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('UPDATE members SET is_active = 0 WHERE id = ?', [id]);
};

// BILL SERVICES
export const getAllBills = async (month?: string): Promise<Bill[]> => {
  const db = await getDatabase();
  let query = 'SELECT * FROM bills ORDER BY bill_date DESC';
  const params: any[] = [];
  
  if (month) {
    query = 'SELECT * FROM bills WHERE bill_month = ? ORDER BY bill_date DESC';
    params.push(month);
  }
  
  const result = await db.getAllAsync<Bill>(query, params);
  return result;
};

export const getBillById = async (id: number): Promise<Bill | null> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<Bill>(
    'SELECT * FROM bills WHERE id = ?',
    [id]
  );
  return result;
};

export const createBill = async (bill: Omit<Bill, 'id' | 'created_at'>): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO bills (category, total_amount, bill_month, due_date, bill_date, meter_reading, notes, photo_base64, split_type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      bill.category,
      bill.total_amount,
      bill.bill_month,
      bill.due_date || null,
      bill.bill_date,
      bill.meter_reading || null,
      bill.notes || null,
      bill.photo_base64 || null,
      bill.split_type
    ]
  );
  return result.lastInsertRowId;
};

export const createBillAssignment = async (assignment: Omit<BillAssignment, 'id'>): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO bill_assignments (bill_id, member_id, assigned_amount, is_paid, paid_date, payment_method)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      assignment.bill_id,
      assignment.member_id,
      assignment.assigned_amount,
      assignment.is_paid,
      assignment.paid_date || null,
      assignment.payment_method || null
    ]
  );
  return result.lastInsertRowId;
};

export const getBillAssignments = async (billId: number): Promise<BillAssignment[]> => {
  const db = await getDatabase();
  const result = await db.getAllAsync<BillAssignment>(
    'SELECT * FROM bill_assignments WHERE bill_id = ?',
    [billId]
  );
  return result;
};

export const updateBillAssignment = async (id: number, data: Partial<BillAssignment>): Promise<void> => {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];
  
  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'id') {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });
  
  if (fields.length > 0) {
    values.push(id);
    await db.runAsync(
      `UPDATE bill_assignments SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
};

// MEAL SERVICES
export const getMealsByDate = async (date: string): Promise<Meal[]> => {
  const db = await getDatabase();
  const result = await db.getAllAsync<Meal>(
    'SELECT * FROM meals WHERE meal_date = ?',
    [date]
  );
  return result;
};

export const getMealsByMonth = async (month: string): Promise<Meal[]> => {
  const db = await getDatabase();
  const result = await db.getAllAsync<Meal>(
    `SELECT * FROM meals WHERE strftime('%Y-%m', meal_date) = ? ORDER BY meal_date DESC`,
    [month]
  );
  return result;
};

export const createOrUpdateMeal = async (meal: Omit<Meal, 'id'>): Promise<number> => {
  const db = await getDatabase();
  
  // Check if meal exists
  const existing = await db.getFirstAsync<{id: number}>(
    'SELECT id FROM meals WHERE member_id = ? AND meal_date = ?',
    [meal.member_id, meal.meal_date]
  );
  
  if (existing) {
    await db.runAsync(
      `UPDATE meals SET breakfast = ?, lunch = ?, dinner = ?, total_quantity = ?, meal_rate = ?, total_cost = ?, is_finalized = ?, notes = ? WHERE id = ?`,
      [meal.breakfast, meal.lunch, meal.dinner, meal.total_quantity, meal.meal_rate || null, meal.total_cost || null, meal.is_finalized, meal.notes || null, existing.id]
    );
    return existing.id;
  } else {
    const result = await db.runAsync(
      `INSERT INTO meals (member_id, meal_date, breakfast, lunch, dinner, total_quantity, meal_rate, total_cost, is_finalized, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [meal.member_id, meal.meal_date, meal.breakfast, meal.lunch, meal.dinner, meal.total_quantity, meal.meal_rate || null, meal.total_cost || null, meal.is_finalized, meal.notes || null]
    );
    return result.lastInsertRowId;
  }
};

export const finalizeMeals = async (date: string, mealRate: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE meals SET is_finalized = 1, meal_rate = ?, total_cost = total_quantity * ? WHERE meal_date = ?`,
    [mealRate, mealRate, date]
  );
};

// DEPOSIT SERVICES
export const getAllDeposits = async (memberId?: number): Promise<Deposit[]> => {
  const db = await getDatabase();
  let query = 'SELECT * FROM deposits ORDER BY deposit_date DESC';
  const params: any[] = [];
  
  if (memberId) {
    query = 'SELECT * FROM deposits WHERE member_id = ? ORDER BY deposit_date DESC';
    params.push(memberId);
  }
  
  const result = await db.getAllAsync<Deposit>(query, params);
  return result;
};

export const createDeposit = async (deposit: Omit<Deposit, 'id'>): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO deposits (member_id, amount, deposit_date, payment_method, transaction_id, screenshot_base64, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      deposit.member_id,
      deposit.amount,
      deposit.deposit_date,
      deposit.payment_method,
      deposit.transaction_id || null,
      deposit.screenshot_base64 || null,
      deposit.notes || null
    ]
  );
  return result.lastInsertRowId;
};

// SHOPPING SERVICES
export const getAllShopping = async (month?: string): Promise<Shopping[]> => {
  const db = await getDatabase();
  let query = 'SELECT * FROM shopping ORDER BY shopping_date DESC';
  const params: any[] = [];
  
  if (month) {
    query = `SELECT * FROM shopping WHERE strftime('%Y-%m', shopping_date) = ? ORDER BY shopping_date DESC`;
    params.push(month);
  }
  
  const result = await db.getAllAsync<Shopping>(query, params);
  return result;
};

export const createShopping = async (shopping: Omit<Shopping, 'id'>): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO shopping (shopping_date, amount, items, receipt_base64, notes, shopper_name)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      shopping.shopping_date,
      shopping.amount,
      shopping.items,
      shopping.receipt_base64 || null,
      shopping.notes || null,
      shopping.shopper_name
    ]
  );
  return result.lastInsertRowId;
};

// ANALYTICS
export const getCurrentMealRate = async (): Promise<number> => {
  const db = await getDatabase();
  const currentMonth = format(new Date(), 'yyyy-MM');
  
  const shoppingResult = await db.getFirstAsync<{total: number}>(
    `SELECT COALESCE(SUM(amount), 0) as total FROM shopping WHERE strftime('%Y-%m', shopping_date) = ?`,
    [currentMonth]
  );
  
  const mealsResult = await db.getFirstAsync<{total: number}>(
    `SELECT COALESCE(SUM(total_quantity), 0) as total FROM meals WHERE strftime('%Y-%m', meal_date) = ? AND is_finalized = 1`,
    [currentMonth]
  );
  
  const totalShopping = shoppingResult?.total || 0;
  const totalMeals = mealsResult?.total || 0;
  
  if (totalMeals === 0) return 0;
  return totalShopping / totalMeals;
};

export const getMemberMonthSummary = async (memberId: number, month: string) => {
  const db = await getDatabase();
  
  // Get bills
  const billsResult = await db.getFirstAsync<{total: number, paid: number}>(
    `SELECT 
      COALESCE(SUM(ba.assigned_amount), 0) as total,
      COALESCE(SUM(CASE WHEN ba.is_paid = 1 THEN ba.assigned_amount ELSE 0 END), 0) as paid
     FROM bill_assignments ba
     JOIN bills b ON ba.bill_id = b.id
     WHERE ba.member_id = ? AND b.bill_month = ?`,
    [memberId, month]
  );
  
  // Get meals
  const mealsResult = await db.getFirstAsync<{total_qty: number, total_cost: number}>(
    `SELECT 
      COALESCE(SUM(total_quantity), 0) as total_qty,
      COALESCE(SUM(total_cost), 0) as total_cost
     FROM meals
     WHERE member_id = ? AND strftime('%Y-%m', meal_date) = ? AND is_finalized = 1`,
    [memberId, month]
  );
  
  // Get deposits
  const depositsResult = await db.getFirstAsync<{total: number}>(
    `SELECT COALESCE(SUM(amount), 0) as total
     FROM deposits
     WHERE member_id = ? AND strftime('%Y-%m', deposit_date) = ?`,
    [memberId, month]
  );
  
  return {
    bills: {
      total: billsResult?.total || 0,
      paid: billsResult?.paid || 0,
      pending: (billsResult?.total || 0) - (billsResult?.paid || 0)
    },
    meals: {
      quantity: mealsResult?.total_qty || 0,
      cost: mealsResult?.total_cost || 0
    },
    deposits: {
      total: depositsResult?.total || 0
    },
    refundable: (depositsResult?.total || 0) - (mealsResult?.total_cost || 0)
  };
};
