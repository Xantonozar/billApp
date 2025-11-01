import { create } from 'zustand';
import { Member, Bill, Meal, Deposit, Shopping } from '../types';

interface AppState {
  members: Member[];
  bills: Bill[];
  meals: Meal[];
  deposits: Deposit[];
  shopping: Shopping[];
  selectedDate: Date;
  refreshTrigger: number;
  
  setMembers: (members: Member[]) => void;
  setBills: (bills: Bill[]) => void;
  setMeals: (meals: Meal[]) => void;
  setDeposits: (deposits: Deposit[]) => void;
  setShopping: (shopping: Shopping[]) => void;
  setSelectedDate: (date: Date) => void;
  triggerRefresh: () => void;
}

export const useStore = create<AppState>((set) => ({
  members: [],
  bills: [],
  meals: [],
  deposits: [],
  shopping: [],
  selectedDate: new Date(),
  refreshTrigger: 0,
  
  setMembers: (members) => set({ members }),
  setBills: (bills) => set({ bills }),
  setMeals: (meals) => set({ meals }),
  setDeposits: (deposits) => set({ deposits }),
  setShopping: (shopping) => set({ shopping }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
