# Node Handle Labels - n8n Style! ✅

## 🎨 All Nodes Now Have Clear Labels!

Your nodes now display clear, descriptive labels on their connection handles, just like n8n!

---

## 📊 Node Handle Configurations

### IF Node
```
     INPUT
       ↓
   ┌───────┐
   │   IF  │
   └───┬───┘
       │
   ┌───┴───┐
   ↓       ↓
 True    False
```

### Merge Node
```
 Input 1
    ↓
┌───────┐
│ MERGE │ ← Input 2
└───┬───┘
    ↓
  Output
```

### Switch Node
```
     INPUT
       ↓
   ┌────────┐
   │ SWITCH │
   └────┬───┘
        │
   ┌────┼────┬────┬────┐
   ↓    ↓    ↓    ↓    ↓
Output Output Output Output Output
  0     1     2     3     4
```

### HTTP Request Node
```
     INPUT
       ↓
   ┌────────┐
   │  HTTP  │
   └───┬────┘
       │
   ┌───┴───┐
   ↓       ↓
Success  Error
```

### Standard Nodes (Code, Slack, etc.)
```
     INPUT
       ↓
   ┌───────┐
   │ NODE  │
   └───┬───┘
       ↓
     OUTPUT
```

---

## 🔧 What Was Changed

### 1. **Merge Node** - 2 Separate Inputs
**Before:**
```javascript
inputs: [
    { type: 'main', required: true, multiple: true }
]
```

**After:**
```javascript
inputs: [
    { type: 'main', required: true, label: 'Input 1' },
    { type: 'main', required: false, label: 'Input 2' }
]
```

### 2. **Dynamic Labels** - Smart Label Detection
```javascript
// Input labels
const inputLabel = input.label || 
    (inputs.length > 1 ? `Input ${index + 1}` : 'INPUT');

// Output labels  
const outputLabel = output.label || 
    (outputs.length > 1 ? `Output ${index}` : 'OUTPUT');
```

### 3. **Visual Style** - Clear & Readable
- **Input labels**: Green background, above handle
- **Output labels**: Cyan background, below handle
- **Font**: Bold, 9px, black text
- **Border**: 2px black with shadow

---

## 📋 Complete Node List with Labels

### Core Nodes
| Node | Inputs | Outputs |
|------|--------|---------|
| Start | - | OUTPUT |
| HTTP Request | INPUT | Success, Error |
| Webhook | - | OUTPUT |
| Code | INPUT | OUTPUT |
| IF | INPUT | True, False |
| Switch | INPUT | Output 0-4 |
| Merge | Input 1, Input 2 | Output |
| Split In Batches | INPUT | OUTPUT |

### Communication Nodes
| Node | Inputs | Outputs |
|------|--------|---------|
| Slack | INPUT | OUTPUT |
| Discord | INPUT | OUTPUT |
| Telegram | INPUT | OUTPUT |
| Gmail | INPUT | OUTPUT |
| Teams | INPUT | OUTPUT |

### All Other Nodes
- **Single Input**: Shows "INPUT"
- **Single Output**: Shows "OUTPUT"
- **Multiple Inputs**: Shows "Input 1", "Input 2", etc.
- **Multiple Outputs**: Shows "Output 0", "Output 1", etc.

---

## 🎯 How Labels Work

### For IF Node:
```javascript
outputs: [
    { type: 'main', label: 'True' },   // Shows "True"
    { type: 'main', label: 'False' }   // Shows "False"
]
```

### For Merge Node:
```javascript
inputs: [
    { type: 'main', required: true, label: 'Input 1' },  // Shows "Input 1"
    { type: 'main', required: false, label: 'Input 2' }  // Shows "Input 2"
]
```

### For Switch Node:
```javascript
outputs: [
    { type: 'main', label: 'Output 0' },  // Shows "Output 0"
    { type: 'main', label: 'Output 1' },  // Shows "Output 1"
    // ... etc
]
```

### Auto-Generated Labels:
If no label is specified:
- Multiple inputs → `Input 1`, `Input 2`, etc.
- Multiple outputs → `Output 0`, `Output 1`, etc.
- Single input → `INPUT`
- Single output → `OUTPUT`

---

## 🎨 Visual Examples

### IF Node Labels:
```
     ┌──────────┐
     │  INPUT   │ ← Green label
     └────┬─────┘
          🟢
     ┌────────┐
     │   IF   │
     └────┬───┘
     ┌────┴────┐
     🔵       🔵
  ┌──┴──┐  ┌──┴───┐
  │True │  │False │ ← Cyan labels
  └─────┘  └──────┘
```

### Merge Node Labels:
```
  ┌────────┐  ┌────────┐
  │Input 1 │  │Input 2 │ ← Green labels
  └────┬───┘  └───┬────┘
       🟢        🟢
       └────┬────┘
       ┌────┴────┐
       │  MERGE  │
       └────┬────┘
            🔵
       ┌────┴────┐
       │ Output  │ ← Cyan label
       └─────────┘
```

---

## ✅ Benefits

1. **Clear Connection Points** - Easy to see where to connect
2. **No Confusion** - True vs False clearly labeled
3. **Professional Look** - Just like n8n!
4. **Better UX** - Know exactly which output connects where
5. **Multiple Inputs/Outputs** - Each one labeled clearly

---

## 🚀 Try It Now!

1. **Add an IF node** to canvas
2. **See "True" and "False" labels** on outputs
3. **Add a Merge node**
4. **See "Input 1" and "Input 2" labels** on inputs
5. **Connect nodes** using the clearly labeled handles!

---

## 💡 Pro Tips

1. **IF Node**: TRUE is always top output, FALSE is bottom
2. **Merge Node**: Input 1 is left, Input 2 is right
3. **Switch Node**: Outputs numbered 0-4 for different routes
4. **Hover Effect**: Handles grow when you hover for easy clicking

---

**Your nodes now have professional n8n-style labels!** 🎉
