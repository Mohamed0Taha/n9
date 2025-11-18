# Credit-Based System Implementation Guide

## 🎯 Overview

Your N8N-style workflow platform now has a comprehensive credit-based monetization system with Google OAuth authentication and admin controls.

---

## ✅ What's Been Implemented

### **1. Database Structure**

#### **Users Table (Updated)**
- `credit_balance` - Decimal field tracking user credits
- `google_id` - Unique Google OAuth ID
- `avatar` - User's Google profile picture
- `is_admin` - Admin flag for accessing admin panel

#### **Pricing Configs Table**
Stores configurable pricing for all actions:
```
- save_workflow: 10 credits
- ai_generation: 50 credits
- workflow_execution: 1 credit
- schedule_workflow: 20 credits
- add_credential: 5 credits
```

#### **Credit Transactions Table**
Complete audit trail of all credit movements:
- Purchase, spend, refund, bonus, admin adjustment types
- Links to related resources (workflows, AI generations, etc.)
- Balance after each transaction

### **2. Authentication System**

#### **Google OAuth Integration**
- Sign in with Google button
- Automatic account creation
- **100 credits welcome bonus** for new users
- Profile picture from Google account

### **3. Credit Management**

#### **User Methods**
```php
$user->hasCredits('save_workflow')    // Check if enough credits
$user->spendCredits('save_workflow')  // Deduct credits
$user->addCredits(100, 'Purchase')    // Add credits
$user->getCreditCost('save_workflow') // Get action cost
```

#### **Pricing System**
- Cached pricing configs (1 hour TTL)
- Easy admin updates
- Toggle active/inactive
- Automatic cache clearing

### **4. Admin Panel**

#### **Pricing Management**
- View all pricing configurations
- Update credit costs
- Enable/disable features
- Real-time updates

#### **Credit Management**
- View all users and balances
- Add/remove credits
- View transaction history
- Audit trail of all changes

---

## 🔧 Setup Instructions

### **Step 1: Install Laravel Socialite**

Run on your server:
```bash
composer require laravel/socialite
```

### **Step 2: Set Up Google OAuth**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Create **OAuth 2.0 credentials**:
   - Application type: Web application
   - Authorized redirect URIs: 
     - Local: `http://localhost:8000/auth/google/callback`
     - Heroku: `https://pure-inlet-35276-c4fd929e7b3a.herokuapp.com/auth/google/callback`

5. Copy Client ID and Client Secret

### **Step 3: Configure Environment Variables**

Add to Heroku config vars:
```bash
heroku config:set GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com" --app=pure-inlet-35276
heroku config:set GOOGLE_CLIENT_SECRET="your-client-secret" --app=pure-inlet-35276
heroku config:set GOOGLE_REDIRECT_URI="https://pure-inlet-35276-c4fd929e7b3a.herokuapp.com/auth/google/callback" --app=pure-inlet-35276
```

For local development (.env):
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

### **Step 4: Run Migrations**

```bash
# On Heroku
heroku run php artisan migrate --app=pure-inlet-35276

# Locally
php artisan migrate
```

### **Step 5: Create First Admin User**

```bash
# On Heroku
heroku run php artisan tinker --app=pure-inlet-35276

# Then in tinker:
$user = User::where('email', 'your-email@gmail.com')->first();
$user->is_admin = true;
$user->save();
```

---

## 💡 How It Works

### **User Journey**

#### **1. Guest User (Not Logged In)**
```
1. Visits site
2. Can create workflows (in session only)
3. Can test nodes
4. Can execute workflows (no credit charge)
5. Clicks "Save"
   ↓
6. System detects: Not logged in
7. Shows Google Sign-In modal
8. User clicks "Sign in with Google"
```

#### **2. Google Authentication**
```
1. Redirected to Google
2. Selects/logs into Google account
3. Grants permissions
4. Redirected back to app
5. Account created automatically
6. **Receives 100 welcome credits**
7. Logged in automatically
```

#### **3. Authenticated User**
```
1. Can save workflows (costs 10 credits)
2. Can add credentials (costs 5 credits)
3. Can use AI generation (costs 50 credits)
4. Can schedule workflows (costs 20 credits)
5. Credit balance shown in UI
6. Transaction history available
```

#### **4. Insufficient Credits**
```
1. User tries to save workflow
2. System checks credit balance
3. If insufficient:
   - Shows error message
   - Displays required amount
   - Shows current balance
   - Prompts to purchase credits
```

---

## 🎨 Frontend Integration

### **Required Components**

#### **1. Google Login Modal**

Create `/resources/js/components/GoogleLoginModal.jsx`:
```jsx
import { useState } from 'react';

function GoogleLoginModal({ isOpen, onClose, reason }) {
  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
        <p className="mb-6">
          {reason === 'save_workflow' 
            ? 'Please sign in to save your workflows'
            : 'Please sign in to continue'}
        </p>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border-2 border-gray-300 rounded-lg py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          <span className="font-medium">Continue with Google</span>
        </button>
        
        <button onClick={onClose} className="mt-4 text-gray-600 w-full">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default GoogleLoginModal;
```

#### **2. Credit Balance Display**

Add to header/navbar:
```jsx
function CreditBalance({ balance }) {
  return (
    <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
      <span className="text-2xl">💰</span>
      <span className="font-bold">{balance} Credits</span>
    </div>
  );
}
```

#### **3. Insufficient Credits Modal**

```jsx
function InsufficientCreditsModal({ isOpen, required, current }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Insufficient Credits</h2>
        <p className="mb-4">
          You need <strong>{required} credits</strong> for this action.
        </p>
        <p className="mb-6">
          Your current balance: <strong>{current} credits</strong>
        </p>
        
        <button className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700">
          Purchase Credits
        </button>
      </div>
    </div>
  );
}
```

#### **4. Update App.jsx**

Add credit checking to save handler:
```jsx
const handleSave = async () => {
  try {
    await axios.patch(`/app/workflows/${workflowId}`, data);
    // Success
  } catch (error) {
    if (error.response?.status === 401) {
      // Not logged in - show Google login modal
      setShowLoginModal(true);
      setLoginReason('save_workflow');
    } else if (error.response?.status === 402) {
      // Insufficient credits
      setShowCreditsModal(true);
      setRequiredCredits(error.response.data.required_credits);
    }
  }
};
```

---

## 🔐 Admin Panel

### **Access Admin Panel**

URL: `/admin/pricing`

**Features:**
- View all pricing configurations
- Update credit costs in real-time
- Toggle features on/off
- View all users and their balances
- Add credits to user accounts
- View transaction history

### **API Endpoints**

#### **Pricing Management**
```
GET    /admin/pricing                  - List all pricing
PATCH  /admin/pricing/{id}             - Update pricing
POST   /admin/pricing/{id}/toggle      - Toggle active status
```

#### **Credit Management**
```
GET    /admin/users                         - List all users
POST   /admin/users/{id}/credits            - Add credits to user
GET    /admin/users/{id}/credit-history     - View transaction history
```

---

## 💰 Default Pricing

| Action | Cost | Description |
|--------|------|-------------|
| **Save Workflow** | 10 credits | Permanently save a workflow |
| **AI Generation** | 50 credits | Generate workflow with AI |
| **Workflow Execution** | 1 credit | Run a workflow once |
| **Schedule Workflow** | 20 credits | Enable scheduling |
| **Add Credential** | 5 credits | Store API credentials |

**All pricing is configurable by admin!**

---

## 🎁 Credit Bonuses

### **Welcome Bonus**
- **100 credits** for new signups
- Automatically applied on first Google login

### **Admin Can Add**
Admins can add credits to any user:
- Promotions
- Refunds
- Bonuses
- Adjustments

---

## 📊 Analytics & Tracking

### **Transaction Types**
- `purchase` - User bought credits
- `spend` - User spent credits
- `refund` - Credit refund
- `bonus` - Promotional credits
- `admin_adjustment` - Admin added/removed

### **All Transactions Include**
- User ID
- Amount (+ or -)
- Balance after transaction
- Description
- Reference type (workflow, ai_generation, etc.)
- Reference ID
- Metadata (JSON for additional info)
- Timestamp

---

## 🚀 Testing

### **Test User Flow**

1. **Visit site as guest**
   ```
   - Create a workflow
   - Add some nodes
   - Click "Save"
   ```

2. **Should see login modal**
   ```
   - Message: "Please sign in to save workflows"
   - Google sign-in button
   ```

3. **Click Google sign-in**
   ```
   - Redirected to Google
   - Select account
   - Redirected back
   - Logged in automatically
   - Receives 100 welcome credits
   ```

4. **Now click save again**
   ```
   - If balance >= 10: Saves successfully, deducts 10 credits
   - If balance < 10: Shows insufficient credits modal
   ```

### **Test Admin Panel**

1. **Make yourself admin**
   ```bash
   heroku run php artisan tinker --app=pure-inlet-35276
   
   $user = User::where('email', 'your@email.com')->first();
   $user->is_admin = true;
   $user->save();
   ```

2. **Access admin routes**
   ```
   GET /admin/pricing
   GET /admin/users
   ```

3. **Update pricing**
   ```
   PATCH /admin/pricing/1
   {
     "credit_cost": 20
   }
   ```

---

## 🔄 Migration Path

### **For Existing Users**

Run this to give existing users credits:
```php
// In tinker
$users = User::all();
foreach ($users as $user) {
    if ($user->credit_balance == 0) {
        $user->addCredits(100, 'Migration bonus');
    }
}
```

---

## 🛠️ Customization

### **Change Welcome Bonus**

In `GoogleAuthController.php`:
```php
'credit_balance' => 100, // Change this value
```

### **Add New Pricing**

In migration or via admin:
```php
PricingConfig::create([
    'key' => 'export_workflow',
    'name' => 'Export Workflow',
    'description' => 'Export workflow as JSON',
    'credit_cost' => 15.00,
    'is_active' => true,
]);
```

### **Apply to Controller**

```php
public function export(Workflow $workflow) {
    $user = auth()->user();
    
    if (!$user->hasCredits('export_workflow')) {
        return response()->json(['message' => 'Insufficient credits'], 402);
    }
    
    $user->spendCredits('export_workflow', $workflow->id);
    
    // Export logic
}
```

---

## 🎯 Next Steps

### **Immediate**
1. ✅ Set up Google OAuth credentials
2. ✅ Add environment variables
3. ✅ Run migrations
4. ✅ Create admin user

### **Frontend Integration**
5. Create Google Login Modal component
6. Add credit balance display
7. Update save handler
8. Add insufficient credits modal
9. Add purchase credits page

### **Payment Integration**
10. Integrate Stripe/PayPal for credit purchases
11. Set credit packages (100 credits for $10, etc.)
12. Add purchase history

### **Advanced Features**
13. Subscription plans (unlimited credits)
14. Team/organization billing
15. Usage analytics
16. Credit expiration
17. Referral bonuses

---

## 📖 API Reference

### **Check Auth Status**
```
GET /auth/user

Response:
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "credit_balance": 85.00,
    "is_admin": false
  }
}
```

### **Save Workflow (With Credits)**
```
PATCH /app/workflows/{id}

Response (Success):
{
  "workflow": {...},
  "credits_spent": 10,
  "balance_remaining": 75
}

Response (Insufficient):
{
  "message": "Insufficient credits. You need 10 credits to save workflows.",
  "action": "insufficient_credits",
  "required_credits": 10,
  "current_balance": 5
}
```

---

**Your credit-based system is now ready!** 🎯💰✨

