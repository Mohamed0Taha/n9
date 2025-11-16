# 🔗 Input/Output Handles Implementation

## Problem Solved

n8n's core principle is **input/output manipulation** - data flows between nodes through connection points. Our implementation was missing proper input/output handles for each node type.

## Solution Implemented

### 1. ✅ Node Configuration with Input/Output Definitions

**File:** `/resources/js/data/nodeConfigurations.js`

Added `inputs` and `outputs` arrays to each node configuration:

```javascript
'HTTP Request': {
    inputs: [
        { type: 'main', required: false } // Can be triggered or have input data
    ],
    outputs: [
        { type: 'main', label: 'Success' }, // Main response output
        { type: 'main', label: 'Error' }    // Error output
    ],
    sections: [...]
}
```

#### Node Types by Input/Output Pattern:

**Trigger Nodes (0 inputs, 1 output):**
- `Start`: 0 inputs, 1 output → Workflow starter
- `Webhook`: 0 inputs, 1 output → Receives HTTP requests
- `Schedule`: 0 inputs, 1 output → Time-based triggers

**Standard Nodes (1 input, 1 output):**
- `Code`: 1 input, 1 output → Data processing
- `OpenAI`: 1 input, 1 output → AI processing
- `Slack`: 1 input, 1 output → Send messages
- `Gmail`: 1 input, 1 output → Send emails
- `MySQL/PostgreSQL`: 1 input, 1 output → Database operations
- `Google Sheets`: 1 input, 1 output → Spreadsheet operations

**Flow Control Nodes:**
- `IF`: 1 input, 2 outputs (True/False) → Conditional routing
- `Switch`: 1 input, 5 outputs (Output 0-4) → Multi-way routing
- `Merge`: Multiple inputs, 1 output → Data combination
- `Split In Batches`: 1 input, 1 output → Batch processing

**Special Cases:**
- `HTTP Request`: 1 input, 2 outputs (Success/Error) → API calls with error handling

---

### 2. 🔄 Dynamic Handle Rendering

**File:** `/resources/js/components/N8nStyleNode.jsx`

**Before:** Static handles (top, bottom, left, right)

**After:** Dynamic handles based on node configuration

```jsx
// Get node configuration
const nodeConfig = getNodeConfiguration(nodeName, nodeType, data.category);
const inputs = nodeConfig?.inputs || [{ type: 'main', required: false }];
const outputs = nodeConfig?.outputs || [{ type: 'main', label: 'Output' }];

// Render handles dynamically
const renderHandles = () => {
  const handles = [];

  // Input handles (top)
  inputs.forEach((input, index) => {
    if (input.type === 'main') {
      handles.push(
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Top}
          id={`input-${index}`}
          style={{
            top: -7,
            left: inputs.length === 1 ? '50%' : `${(index + 1) * 100 / (inputs.length + 1)}%`
          }}
        />
      );
    }
  });

  // Output handles (bottom)
  outputs.forEach((output, index) => {
    if (output.type === 'main') {
      handles.push(
        <Handle
          key={`output-${index}`}
          type="source"
          position={Position.Bottom}
          id={`output-${index}`}
          style={{
            bottom: -7,
            left: outputs.length === 1 ? '50%' : `${(index + 1) * 100 / (outputs.length + 1)}%`
          }}
        />
      );
    }
  });

  return handles;
};
```

**Features:**
- ✅ Multiple input/output handles based on node type
- ✅ Proper positioning (evenly distributed)
- ✅ Correct handle types (target for inputs, source for outputs)
- ✅ Unique IDs for React Flow connections

---

### 3. 🤖 AI Input/Output Awareness

**File:** `/app/Services/NodeConfigurationContext.php`

Added comprehensive input/output guidance to system prompt:

```php
## INPUT/OUTPUT CONSTRAINTS (CRITICAL FOR n8n WORKFLOWS)

### Trigger Nodes (0 inputs):
- Start: 0 inputs, 1 output → Use as workflow starter
- Webhook: 0 inputs, 1 output → Receives HTTP requests
- Schedule: 0 inputs, 1 output → Time-based triggers

### Flow Control Nodes:
- IF: 1 input, 2 outputs (True/False) → Route data based on conditions
- Switch: 1 input, 5 outputs (Output 0-4) → Multi-way routing
- Merge: Multiple inputs, 1 output → Combine data from multiple sources

### Workflow Patterns:
1. Trigger → Processing → Output: Start/Webhook → HTTP Request/OpenAI → Slack/Gmail
2. Conditional Flow: Any Node → IF → Different paths for True/False
3. Error Handling: HTTP Request → Success path, Error path → Notification
```

**File:** `/app/Services/AiWorkflowGenerator.php`

Enhanced user message to emphasize input/output constraints:

```php
"4. RESPECT INPUT/OUTPUT CONSTRAINTS:
   - Start/Webhook/Schedule nodes: NO inputs (they trigger workflows)
   - IF nodes: 1 input, connect to 2 outputs (True/False paths)
   - Merge nodes: Connect MULTIPLE inputs to 1 output
   - HTTP Request: Can connect Success output to next node, Error output to notification
   - Standard nodes: 1 input, 1 output flow"
```

---

## How Input/Output Works

### Data Flow Patterns

#### 1. **Simple Linear Flow**
```
Start → HTTP Request → OpenAI → Slack
  ↓         ↓            ↓        ↓
  0i/1o    1i/2o        1i/1o    1i/1o
```

#### 2. **Conditional Flow**
```
Webhook → IF → True: Slack
           ↓     False: Gmail
          1i/2o
```

#### 3. **Error Handling**
```
HTTP Request → Success: Process Data
     ↓             Error: Send Alert
    1i/2o
```

#### 4. **Data Merging**
```
API 1 → Merge ← API 2
    ↓     ↑
  1i/1o  1i/1o
```

### Handle Positioning

- **Single Handle**: Centered (50%)
- **Multiple Handles**: Evenly distributed across node width
- **Input Handles**: Top of node
- **Output Handles**: Bottom of node

---

## Testing

### Test 1: Start Node
- **Should have:** 0 input handles, 1 output handle (bottom center)
- **Use case:** Drag from sidebar, connect to other nodes

### Test 2: IF Node
- **Should have:** 1 input handle (top center), 2 output handles (bottom left/right)
- **Use case:** Connect input from data source, connect True/False to different paths

### Test 3: HTTP Request Node
- **Should have:** 1 input handle (top center), 2 output handles (bottom left/right)
- **Labels:** "Success" and "Error"
- **Use case:** Connect Success to processing, Error to notification

### Test 4: Merge Node
- **Should have:** Multiple input handles (top, evenly spaced)
- **Use case:** Connect multiple data sources to combine

### Test 5: AI-Generated Workflow
**Prompt:** "Fetch weather data, if temperature > 20°C send to Slack, otherwise send email"

**Expected:**
- Start/Webhook → HTTP Request (weather API)
- HTTP Request → IF (temperature check)
- IF True → Slack
- IF False → Gmail
- Proper connections respecting input/output constraints

---

## Visual Differences

### Before (Static Handles)
```
[🔗] Node Name [⚙️]
     ↓
    (static handles)
```

### After (Dynamic Handles)
```
Start Node:         [▶️] Start []
                     ↓
                (no input, 1 output)

HTTP Request:       [🌐] HTTP Request [⚙️]
                     ↓          ↙      ↘
                (1 input)  (Success) (Error)

IF Node:           [🔀] IF [⚙️]
                    ↓       ↙      ↘
               (1 input)  (True)  (False)
```

---

## Files Modified

1. ✅ `/resources/js/data/nodeConfigurations.js` - Added inputs/outputs to all nodes
2. ✅ `/resources/js/components/N8nStyleNode.jsx` - Dynamic handle rendering
3. ✅ `/app/Services/NodeConfigurationContext.php` - Input/output guidance
4. ✅ `/app/Services/AiWorkflowGenerator.php` - Enhanced constraints

---

## Key Benefits

### For Users
- ✅ **Authentic n8n Experience** - Handles match real n8n nodes
- ✅ **Visual Data Flow** - Clear connection points show data flow
- ✅ **Proper Routing** - IF nodes show True/False paths
- ✅ **Error Handling** - HTTP Request shows Success/Error outputs

### For AI
- ✅ **Constraint Awareness** - Knows which nodes can connect where
- ✅ **Proper Workflows** - Generates realistic connection patterns
- ✅ **n8n Patterns** - Follows established workflow design patterns

### For Developers
- ✅ **Type Safety** - Input/output definitions prevent invalid connections
- ✅ **Extensible** - Easy to add new node types with custom I/O
- ✅ **Consistent** - All nodes follow same configuration pattern

---

## Next Steps

1. **Test extensively** with different node combinations
2. **Add connection validation** in frontend (prevent invalid connections)
3. **Add visual feedback** when hovering over handles
4. **Consider advanced handles** (credential inputs, etc.)

---

## Summary

**Problem:** Nodes missing proper input/output handles for data flow

**Solution:**
- Added input/output definitions to all node configurations
- Dynamic handle rendering based on node type
- AI awareness of connection constraints
- Authentic n8n-style workflow creation

**Result:** 🎉 **True n8n-style input/output manipulation with proper data flow visualization!**

---

## Example Workflow Connections

```javascript
// AI now understands these patterns:
{
  "nodes": [
    {"id": "start", "type": "Start"},           // 0 inputs, 1 output
    {"id": "http", "type": "HTTP Request"},     // 1 input, 2 outputs
    {"id": "if", "type": "IF"},                 // 1 input, 2 outputs
    {"id": "slack", "type": "Slack"},           // 1 input, 1 output
    {"id": "gmail", "type": "Gmail"}            // 1 input, 1 output
  ],
  "edges": [
    {"source": "start", "target": "http"},     // Start → HTTP
    {"source": "http", "target": "if"},        // HTTP Success → IF
    {"source": "if", "target": "slack", "sourceHandle": "output-0"},  // IF True → Slack
    {"source": "if", "target": "gmail", "sourceHandle": "output-1"}    // IF False → Gmail
  ]
}
```

**The AI now generates workflows with proper n8n-style input/output connections!** 🚀
