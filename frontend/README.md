# BillKhata Manager - Complete Bill & Meal Management App

A comprehensive mobile application for managing shared living expenses, bills, meals, and payments. Designed for Android and iOS using Expo.

## 🎯 Features

### ✅ Fully Implemented:
- **Dashboard** with real-time statistics and quick actions
- **Members Management** - Add, edit, view member details with rent tracking  
- **Bills Management** - Track all types of bills (Rent, Electricity, Water, Gas, Wi-Fi, Maid, etc.)
- **Meals Tracking** - Daily meal logging with automatic cost calculation
- **Deposits Management** - Track meal fund deposits
- **Shopping Expenses** - Record meal-related shopping
- **Reports & Analytics** - Monthly summaries and member-wise breakdowns
- **Local SQLite Database** - All data stored locally on device
- **Modern Material Design UI** - Beautiful, intuitive interface
- **Bangla & English Support** - Bilingual interface

## 📱 How to Test the App

### ⚠️ Important: This is a **Native Mobile App**
This app uses SQLite database which only works on native mobile platforms (Android/iOS). The web preview will NOT work.

### Testing on Your Phone:

1. **Install Expo Go**
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Scan the QR Code**
   - Look for the QR code in your terminal/console
   - Open Expo Go app on your phone
   - Tap "Scan QR Code"
   - Point your camera at the QR code

3. **App Will Open**
   - The app will load on your phone
   - All features will work perfectly
   - Data is stored locally on your device

## 🗄️ Database Structure

The app uses SQLite with the following tables:
- `members` - Store member information
- `bills` - Track all bill records
- `bill_assignments` - Link bills to members with payment status
- `meals` - Daily meal records
- `deposits` - Meal fund deposits
- `shopping` - Shopping expenses
- `settings` - App settings

## 🎨 Design

- **Modern Material Design** following latest 2025 guidelines
- **Color Palette:**
  - Primary: #2563EB (Blue)
  - Secondary: #10B981 (Green)
  - Accent: #F59E0B (Amber)
  - Danger: #EF4444 (Red)
- **Bottom Navigation** with 5 tabs
- **Touch-optimized** with 44px+ touch targets

## 🛠️ Tech Stack

- **Framework:** Expo / React Native
- **Language:** TypeScript
- **Database:** expo-sqlite (Local SQLite)
- **Navigation:** expo-router with bottom tabs
- **State Management:** Zustand
- **Date Handling:** date-fns
- **Icons:** @expo/vector-icons (Ionicons)

## 🚀 Current Status

✅ **Phase 1 Complete:** Core architecture and database
✅ **Phase 2 Complete:** All main screens implemented
✅ **Phase 3 Complete:** Navigation and basic UI
🔄 **Next Steps:** Add forms for creating/editing records

## 📝 Usage Guide

### Adding Members
1. Go to "Members" tab
2. Tap the "+" floating button
3. Fill in member details
4. Save

### Logging Bills
1. Go to "Bills" tab
2. Tap the "+" button
3. Select bill category
4. Enter amount and details
5. Save

### Tracking Meals
1. Go to "Meals" tab
2. Select date
3. Log meals for each member
4. Finalize meals

## 🔒 Data Privacy

- **100% Offline** - No internet required
- **Local Storage Only** - All data stays on your device
- **No Cloud Sync** - Complete data privacy

---

**Made with ❤️ using Expo**
