# Guest Access Strategy & Monetization Plan

## 🎯 Overview
Allow users to test and experience the platform while encouraging sign-up for permanent use.

---

## ✅ Implemented: 1-Hour Session Limit

### **Session Configuration**
- **Session Lifetime:** 60 minutes (1 hour)
- **Tracked Metrics:**
  - Session start time
  - Workflows created
  - Executions run
  - IP address
  - User agent

### **How It Works**
```
1. User visits site (no login)
   ↓
2. Guest session starts (1-hour timer)
   ↓
3. User can create workflows, test nodes, execute
   ↓
4. After 1 hour → Session expires
   ↓
5. Data cleared, must sign up to continue
```

---

## 🛡️ Additional Measures Recommended

### **1. Guest Limitations (Soft Limits)**

#### **A. Workflow Limits**
```php
✅ Implemented:
- Guest sessions expire after 1 hour
- Workflows NOT saved to database for guests

🔄 Recommended Addition:
- Max 3 workflows in session
- Max 10 nodes per workflow
- No workflow templates saved
```

**Implementation:**
```php
// In WorkflowController.php
if (!auth()->check()) {
    $guestWorkflows = session('guest_workflows', []);
    
    if (count($guestWorkflows) >= 3) {
        return response()->json([
            'message' => 'Guest limit: 3 workflows. Sign up for unlimited!',
            'action' => 'signup_required'
        ], 403);
    }
}
```

#### **B. Execution Limits**
```php
🔄 Recommended:
- Max 10 executions per guest session
- Max 5 nodes per execution
- No scheduled workflows for guests
- Execution history cleared after session
```

**Implementation:**
```php
// In WorkflowController::execute()
if (!auth()->check()) {
    $execCount = session('guest_execution_count', 0);
    
    if ($execCount >= 10) {
        return response()->json([
            'message' => 'Guest limit: 10 executions. Sign up for unlimited!',
            'action' => 'signup_required'
        ], 403);
    }
    
    session()->increment('guest_execution_count');
}
```

#### **C. Feature Restrictions**
```php
✅ Already Planned:
- No credential storage (requires signup)
- No workflow saving (requires signup)

🔄 Additional Restrictions:
- No AI workflow generation for guests
- No webhook triggers for guests
- No integrations requiring OAuth
- No access to workflow history beyond current session
```

---

### **2. Data & Storage Limits**

#### **A. Temporary Storage Only**
```php
✅ Implemented:
- Guest data stored in SESSION only
- No database records for guest workflows

🔄 Recommended:
- Session data cleared on expiry
- No file uploads for guests
- Execution results limited to last 5
```

#### **B. Rate Limiting**
```php
🔄 Recommended:
- API calls: 100 per hour per IP
- Executions: 10 per session
- AI generations: 0 for guests
```

**Implementation:**
```php
// In routes/web.php or middleware
Route::middleware(['throttle:100,60'])->group(function () {
    // Guest routes
});
```

---

### **3. Visual Indicators & CTAs**

#### **A. Session Timer Display**
```jsx
🔄 Recommended Frontend Addition:
- Countdown timer showing remaining session time
- "Sign up to save your work" banner
- Warning at 10 minutes remaining
```

**Example React Component:**
```jsx
function SessionTimer() {
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour
  
  return (
    <div className="session-warning">
      ⏱️ {Math.floor(timeRemaining / 60)} minutes remaining
      <button>Sign Up to Save</button>
    </div>
  );
}
```

#### **B. Sign-Up Prompts**
```
Show modal/banner when:
- ✅ Trying to save workflow → "Sign up to save"
- ✅ Trying to add credentials → "Sign up to add credentials"
- 🔄 Creating 3rd workflow → "Upgrade to create more"
- 🔄 10th execution → "Sign up for unlimited"
- 🔄 15 minutes remaining → "Sign up to keep your work"
```

---

### **4. Progressive Disclosure**

#### **What Guests CAN Do (Try Before Buy)**
✅ **Allowed:**
- Create up to 3 workflows per session
- Add nodes to canvas
- Connect nodes visually
- Execute workflows (up to 10 times)
- See real-time execution feedback
- Test Manual Trigger nodes
- View execution results
- Use all visual features

❌ **Requires Sign-Up:**
- Save workflows permanently
- Add credentials/API keys
- Use scheduled workflows
- Access workflow history
- Generate workflows with AI
- Use OAuth integrations
- Create webhook endpoints
- Share workflows
- Export workflows

---

### **5. Conversion Optimization**

#### **A. Strategic CTA Placement**
```
Where to prompt signup:
1. After first successful execution → "Great! Sign up to save this"
2. When reaching any limit → "Upgrade to continue"
3. Session timer warning → "Don't lose your work"
4. Trying restricted feature → "Sign up to unlock"
5. On page exit → "Save your progress?"
```

#### **B. Value Proposition**
```
Sign-up Benefits to Highlight:
✨ Save unlimited workflows
✨ Schedule automated runs
✨ Add API credentials
✨ Generate workflows with AI
✨ Access workflow history
✨ Share with team
✨ Never lose your work
```

---

### **6. Analytics & Tracking**

#### **Track Guest Behavior:**
```php
🔄 Recommended Metrics:
- Guest session duration
- Workflows created per session
- Executions per session
- Features attempted (for conversion insights)
- Drop-off points
- Sign-up conversion rate
- Which limit triggered most sign-ups
```

**Implementation:**
```php
// Log guest activity for analytics
Log::info('Guest activity', [
    'action' => 'workflow_created',
    'session_age' => session_age_minutes,
    'workflow_count' => guest_workflow_count,
    'ip' => request()->ip()
]);
```

---

### **7. Security Measures**

#### **A. Prevent Abuse**
```php
✅ Already Have:
- 1-hour session expiry
- Session-based storage

🔄 Add:
- IP-based rate limiting
- Captcha on sign-up
- Max 3 guest sessions per IP per day
- Block known VPN/proxy IPs
- Prevent session extension tricks
```

#### **B. Resource Protection**
```php
🔄 Recommended:
- Limit execution time per workflow
- Queue depth limits for guests
- Memory limits per execution
- No parallel executions for guests
```

---

## 📊 Recommended Tier Structure

### **Free Tier (No Sign-Up)**
- ⏱️ 1-hour session
- 🔢 3 workflows max
- ⚡ 10 executions per session
- 📋 Basic nodes only
- 🚫 No saving
- 🚫 No credentials
- 🚫 No scheduling

### **Registered Free Tier**
- ⏱️ Unlimited time
- 🔢 10 workflows
- ⚡ 100 executions/month
- 📋 All nodes
- ✅ Save workflows
- ✅ Basic credentials
- 🚫 No scheduling
- 🚫 No AI generation

### **Pro Tier (Paid)**
- ⏱️ Unlimited
- 🔢 Unlimited workflows
- ⚡ Unlimited executions
- 📋 All features
- ✅ Everything
- ✅ Scheduling
- ✅ AI generation
- ✅ Priority support

---

## 🎯 Implementation Priority

### **Phase 1: Already Done ✅**
1. 1-hour session limit
2. Session tracking middleware
3. Save/credential restrictions

### **Phase 2: Quick Wins 🔄**
1. Execution counter (10 max)
2. Workflow counter (3 max)
3. Session timer UI
4. Sign-up CTAs on limits

### **Phase 3: Enhanced 🔄**
1. Rate limiting by IP
2. Feature flags per tier
3. Analytics tracking
4. Conversion funnels

### **Phase 4: Advanced 🔄**
1. Node count limits
2. Execution time limits
3. A/B testing CTAs
4. Premium features

---

## 💡 Pro Tips

### **Balance is Key:**
- ✅ Allow enough to see value
- ✅ Restrict enough to encourage sign-up
- ✅ Make limits clear and fair
- ✅ Show what they're missing

### **Convert with Value, Not Frustration:**
- ❌ Don't block too early
- ❌ Don't hide functionality
- ✅ Let them succeed first
- ✅ Then show how to succeed more

### **Test & Iterate:**
- Track conversion rates
- A/B test limits
- Survey guest users
- Adjust based on data

---

## 🚀 Quick Implementation Code

### **Add to WorkflowController.php:**
```php
// Before execute()
private function enforceGuestLimits()
{
    if (auth()->check()) return;
    
    $execCount = session('guest_execution_count', 0);
    if ($execCount >= 10) {
        abort(403, 'Guest limit reached. Sign up for unlimited executions!');
    }
    
    session()->increment('guest_execution_count');
}

// In execute method
public function execute(Workflow $workflow)
{
    $this->enforceGuestLimits();
    // ... rest of execution
}
```

### **Add to Frontend (App.jsx):**
```jsx
// Check session expiry
useEffect(() => {
    const checkSession = async () => {
        const { data } = await axios.get('/api/session-status');
        
        if (data.session_expired) {
            setShowSignUpModal(true);
        }
        
        setSessionTimeRemaining(data.time_remaining);
    };
    
    const interval = setInterval(checkSession, 60000); // Every minute
    return () => clearInterval(interval);
}, []);
```

---

## 📈 Expected Outcomes

### **Conversion Rates:**
- 5-10% of guests sign up during session
- 15-20% sign up when hitting limits
- 25-30% sign up at session expiry warning

### **Usage Patterns:**
- Average session: 15-20 minutes
- Workflows created: 1-2 per guest
- Executions: 3-5 per guest
- Most common conversion trigger: Save attempt

---

**This strategy balances free trial value with conversion incentives!** 🎯✨

