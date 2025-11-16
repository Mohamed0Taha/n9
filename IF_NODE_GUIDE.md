# IF Node - Conditional Routing Guide

## ✅ IF Node Now Has 2 Outputs!

The IF node now properly routes data based on conditions with **2 separate outputs**:
- 🟢 **Output 0 (TRUE)** - When condition is met
- 🔴 **Output 1 (FALSE)** - When condition fails

---

## 🎯 How It Works

### Visual Layout:
```
          ┌─────────────┐
          │     IF      │
  INPUT → │  condition  │
          └──────┬──────┘
                 │
         ┌───────┴───────┐
         │               │
    ┌────▼────┐     ┌───▼────┐
    │ TRUE    │     │ FALSE  │
    │ Output 0│     │Output 1│
    └─────────┘     └────────┘
         │               │
    Connect to      Connect to
    next node       different node
```

---

## 🧪 Example Workflows

### Example 1: Simple TRUE/FALSE Routing
```
Start 
  → HTTP Request (get user data)
    → IF (check if age > 18)
      ├─ TRUE → Slack (send "Adult user")
      └─ FALSE → Gmail (send "Minor user notification")
```

### Example 2: Value Comparison
```
Start
  → HTTP Request (get product)
    → IF (price > 100)
      ├─ TRUE → Slack ("Expensive product alert")
      └─ FALSE → Code (process normal item)
```

### Example 3: Multiple Conditions
```
Start
  → HTTP Request
    → IF (status === "success")
      ├─ TRUE → Code (process data)
      └─ FALSE → Slack (error notification)
```

---

## ⚙️ Configuration

### Condition Fields:

**Value 1**
- The first value to compare
- Can be a static value or reference input data
- Example: `10`, `{{ $json.age }}`, `{{ $json.status }}`

**Operation**
- Equal
- Not Equal
- Greater Than
- Less Than
- Greater Than or Equal
- Less Than or Equal
- Contains
- Does Not Contain
- Starts With
- Ends With
- Is Empty
- Is Not Empty

**Value 2**
- The second value to compare against
- Example: `18`, `"active"`, `100`

---

## 📊 How Routing Works

### Backend (RunWorkflow.php):
```php
// IF node returns output_index
return [
    'result' => $result,
    'output_index' => $result ? 0 : 1,  // 0=TRUE, 1=FALSE
];
```

### Routing Logic:
1. IF node evaluates condition
2. Sets `output_index`:
   - `0` if TRUE
   - `1` if FALSE
3. Data only flows through matching output
4. Other output receives NO data

### Edge Matching:
```javascript
// TRUE output
{
  source: 'if-node-id',
  sourceHandle: 'output-0',  // Matches output_index 0
  target: 'next-node-true'
}

// FALSE output  
{
  source: 'if-node-id',
  sourceHandle: 'output-1',  // Matches output_index 1
  target: 'next-node-false'
}
```

---

## 🎨 Visual Indicators

### On Canvas:
```
┌──────────────┐
│      IF      │ ← Node
│  age > 18    │ ← Condition
└──┬────────┬──┘
   │        │
 TRUE     FALSE ← Output labels
   🟢       🔴  ← Connection handles
```

### During Execution:
- ✅ Node with condition met shows GREEN badge
- ✅ Connected node on TRUE path executes
- ❌ Connected node on FALSE path does NOT execute (no data)

---

## 🧪 Testing Your IF Node

### Test Workflow:
```
1. Add Start node
2. Add HTTP Request node
   - URL: https://api.restful-api.dev/objects
3. Add IF node
   - Value 1: "10"
   - Operation: "Greater Than"
   - Value 2: "5"
4. Add Code node (connect to TRUE output)
5. Add Slack node (connect to FALSE output)
6. Execute!
```

### Expected Result:
- IF evaluates: 10 > 5 = TRUE
- Data flows to Code node (TRUE path)
- Slack node does NOT execute (FALSE path)

---

## 📋 Output Structure

### IF Node Output:
```json
{
  "success": true,
  "result": true,
  "condition_met": true,
  "output_index": 0,
  "input_data": {...}
}
```

### Key Fields:
- **result**: Boolean TRUE/FALSE
- **output_index**: 0 (TRUE) or 1 (FALSE)
- **condition_met**: Same as result
- **input_data**: Original input data passed through

---

## 🔧 Advanced Usage

### Chaining Multiple IFs:
```
Start
  → IF (check A)
    ├─ TRUE → IF (check B)
    │         ├─ TRUE → Action 1
    │         └─ FALSE → Action 2
    └─ FALSE → Action 3
```

### Using with Switch:
```
Start
  → IF (simple check)
    ├─ TRUE → Switch (multiple routes)
    └─ FALSE → Error handler
```

---

## ✅ Benefits

1. **Clear Flow Control** - Visual branching paths
2. **No Code Required** - Simple dropdown operations
3. **Data Preservation** - Input data flows through
4. **Multiple Conditions** - Chain IFs for complex logic
5. **Error Handling** - Separate paths for success/failure

---

## 💡 Pro Tips

1. **Use TRUE for happy path** - Main flow on top output
2. **Use FALSE for errors** - Error handling on bottom
3. **Chain IFs carefully** - Too many nested IFs = complex
4. **Use Switch for 3+ routes** - Better than nested IFs
5. **Test both paths** - Make sure both TRUE and FALSE work

---

## 🚀 Ready to Use!

Your IF node now properly routes data through **TRUE (output-0)** or **FALSE (output-1)** based on conditions!

Create a workflow, add an IF node, connect different nodes to each output, and watch conditional routing in action! 🎉
