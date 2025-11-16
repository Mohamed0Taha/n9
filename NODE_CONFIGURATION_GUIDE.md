# 🎛️ Node Configuration System

## Overview

The n8n replica now features a comprehensive node configuration system that opens a settings panel on the right side when you click on any node. This matches the actual n8n workflow editor behavior.

## How to Use

### Opening Node Settings

**Method 1: Click the Settings Icon**
- Look for the ⚙️ (gear) icon in the top-right corner of any node
- Click it to open the configuration panel

**Method 2: Double-Click Node (Coming Soon)**
- Double-click on the node body to open settings

### Configuration Panel Layout

```
┌─────────────────────────────┐
│  [🎨] Node Name        [×]  │  ← Header
├─────────────────────────────┤
│  ▼ Request                  │  ← Collapsible Section
│    Method: [GET ▼]          │
│    URL: [_______________]   │
│                             │
│  ▼ Headers                  │
│    Content-Type: [___▼]    │
│                             │
│  ▼ Execution Settings       │
│    ☐ Always Output Data     │
│    ☐ Continue on Fail       │
├─────────────────────────────┤
│     [Cancel] [Save Changes] │  ← Footer
└─────────────────────────────┘
```

## Supported Nodes with Custom Configurations

### 1. **HTTP Request**
Perfect for making API calls

**Sections:**
- **Request**
  - Method (GET, POST, PUT, DELETE, PATCH)
  - URL
  - Authentication (None, Basic Auth, OAuth2, Header Auth, API Key)
  
- **Headers**
  - Content-Type (JSON, Form Data, Plain Text)
  - Custom Headers (JSON format)
  
- **Body**
  - Body Type (JSON, Form Data, Raw)
  - Body Content (Code editor)

**Example Use Case:**
```javascript
// Call an external API
Method: POST
URL: https://api.example.com/users
Headers: {"Authorization": "Bearer token123"}
Body: {"name": "John", "email": "john@example.com"}
```

### 2. **Slack**
Send messages to Slack channels

**Sections:**
- **Authentication**
  - Credential (Select or create new Slack credential)
  
- **Message**
  - Channel (#general, #alerts, etc.)
  - Message Text
  - Bot Name
  - Icon Emoji (:robot_face:, :bell:, etc.)
  
- **Attachments**
  - Rich message attachments (JSON format)

**Example Use Case:**
```javascript
Channel: #notifications
Message: "New user registered: John Doe"
Bot Name: "Registration Bot"
Icon: :tada:
```

### 3. **OpenAI**
Integrate with GPT models

**Sections:**
- **Authentication**
  - API Key (sk-...)
  
- **Model Configuration**
  - Model (gpt-4, gpt-4-turbo, gpt-3.5-turbo)
  - Temperature (0-2, controls randomness)
  - Max Tokens (1-4000, response length)
  
- **Prompt**
  - Prompt (Your main instruction)
  - System Message (AI personality/role)

**Example Use Case:**
```javascript
Model: gpt-3.5-turbo
Temperature: 0.7
Prompt: "Summarize this customer feedback: {{$json.feedback}}"
System Message: "You are a helpful customer service analyst"
```

### 4. **Webhook**
Receive HTTP requests

**Sections:**
- **Webhook Configuration**
  - Path (/webhook/unique-path) - Auto-generated
  - HTTP Method (GET, POST, PUT, DELETE)
  - Response Mode (On Received, Last Node, When Last Node Finishes)
  
- **Response**
  - Response Code (200, 201, 404, etc.)
  - Response Data (JSON format)

**Example Use Case:**
```javascript
Path: /webhook/github-deploy
Method: POST
Response Code: 200
Response: {"status": "received", "message": "Deployment started"}
```

### 5. **Code**
Execute custom JavaScript or Python

**Sections:**
- **Code Configuration**
  - Language (JavaScript, Python)
  - Code (Multi-line code editor)
  
- **Settings**
  - Continue on Fail

**Example Use Case:**
```javascript
Language: JavaScript
Code:
// Transform incoming data
for (const item of items) {
  item.json.fullName = `${item.json.firstName} ${item.json.lastName}`;
  item.json.timestamp = new Date().toISOString();
}
return items;
```

### 6. **IF**
Conditional routing

**Sections:**
- **Conditions**
  - Conditions (All must match, or Any can match)
  - Value 1 ({{ $json.field }})
  - Operation (Equal, Not Equal, Contains, Starts With, Ends With, Greater Than, Less Than)
  - Value 2 (comparison value)

**Example Use Case:**
```javascript
Conditions: All
Value 1: {{ $json.status }}
Operation: Equal
Value 2: "approved"
```

### 7. **Schedule**
Time-based workflow triggers

**Sections:**
- **Trigger Times**
  - Trigger On (Interval, Cron, Specific Times)
  - Interval (number)
  - Unit (Seconds, Minutes, Hours, Days)
  - Cron Expression (0 0 * * *)

**Example Use Case:**
```javascript
Trigger On: Interval
Interval: 30
Unit: Minutes
// Runs every 30 minutes
```

## Universal Sections

All nodes include these standard sections:

### Execution Settings
Available for all nodes:

- **Always Output Data**: Send data to next node even if this node has no output
- **Continue on Fail**: Don't stop workflow if this node errors
- **Retry on Fail**: Automatically retry the node if it fails

## Field Types

The configuration system supports various field types:

### Text Input
```jsx
<input type="text" placeholder="Enter value..." />
```
For URLs, names, simple values

### Password Input
```jsx
<input type="password" placeholder="sk-..." />
```
For API keys and secrets (obscured)

### Number Input
```jsx
<input type="number" min="0" max="2" step="0.1" />
```
For numeric values with validation

### Select Dropdown
```jsx
<select>
  <option>GET</option>
  <option>POST</option>
</select>
```
For predefined choices

### Textarea
```jsx
<textarea rows="4"></textarea>
```
For multi-line text

### Code Editor
```jsx
<textarea className="font-mono bg-slate-50" />
```
For JSON, JavaScript, or code snippets

### Checkbox
```jsx
<input type="checkbox" />
<span>Enable feature</span>
```
For boolean options

### Credential Selector
```jsx
<select>
  <option>Select credential...</option>
</select>
<button>+ New</button>
```
For authentication credentials

## Adding New Node Configurations

To add configuration for a new node type, edit `NodeSettingsPanel.jsx`:

```javascript
const nodeConfigurations = {
    'Your Node Name': {
        sections: [
            {
                title: 'Section Title',
                fields: [
                    {
                        name: 'fieldName',
                        label: 'Field Label',
                        type: 'text', // or 'select', 'number', etc.
                        placeholder: 'Placeholder text',
                        default: 'default value',
                        options: ['option1', 'option2'] // for select type
                    }
                ]
            }
        ]
    }
};
```

### Field Configuration Options

```javascript
{
    name: 'fieldName',          // Required: Internal field name
    label: 'Field Label',       // Required: Display label
    type: 'text',               // Required: Field type
    placeholder: 'Text...',     // Optional: Placeholder text
    default: 'value',           // Optional: Default value
    options: ['A', 'B'],        // Optional: For select type
    min: 0,                     // Optional: For number type
    max: 100,                   // Optional: For number type
    step: 0.1,                  // Optional: For number type
    rows: 4,                    // Optional: For textarea/code type
    readOnly: true,             // Optional: Make field read-only
    language: 'javascript'      // Optional: For code type
}
```

## Collapsible Sections

All sections are collapsible by default:
- Click the section header to expand/collapse
- Arrow icon rotates to indicate state
- Sections remember their state within the same session

## Data Flow

### 1. User Opens Settings
```
User clicks ⚙️ → onOpenSettings({ id, data }) → App opens panel
```

### 2. User Edits Fields
```
User types → handleFieldChange(name, value) → formData state updates
```

### 3. User Saves
```
User clicks "Save Changes" → handleSave() → onUpdate({ ...node, data: { ...parameters } })
```

### 4. Graph Updates
```
onUpdate → App.handleNodeSettingsUpdate → Graph re-renders with new data
```

## Styling Guidelines

The panel follows n8n's design principles:

### Colors
- **Background**: White (#ffffff)
- **Border**: Slate-200 (#e2e8f0)
- **Headers**: Slate-50 background
- **Text**: Slate-900 for headers, Slate-700 for content
- **Accent**: Blue-600 for buttons (#2563eb)

### Spacing
- **Section padding**: 16px (px-4 py-4)
- **Field spacing**: 16px between fields (space-y-4)
- **Panel width**: 384px (w-96)

### Typography
- **Headers**: 14px, semibold
- **Labels**: 12px, medium
- **Input text**: 14px, regular
- **Code**: Monospace font

## Tips & Best Practices

### For Users

1. **Save Often**: Click "Save Changes" to persist your configuration
2. **Test in Stages**: Configure one section at a time and test
3. **Use Expressions**: Many fields support n8n expressions like `{{ $json.field }}`
4. **Check Credentials**: Ensure credentials are set up before using auth fields

### For Developers

1. **Match n8n Nodes**: Study actual n8n node configurations
2. **Validate Inputs**: Add validation for required fields
3. **Clear Placeholders**: Use descriptive placeholder text
4. **Group Logically**: Related fields should be in the same section
5. **Default Values**: Provide sensible defaults when possible

## Keyboard Shortcuts

- **Escape**: Close the settings panel (coming soon)
- **Ctrl/Cmd + S**: Save changes (coming soon)
- **Tab**: Navigate between fields

## Examples

### Complete HTTP Request Configuration

```javascript
// Configure an API call to create a user
{
  method: 'POST',
  url: 'https://api.myapp.com/users',
  authentication: 'Header Auth',
  contentType: 'application/json',
  customHeaders: {
    "Authorization": "Bearer {{$node.Webhook.json.token}}",
    "X-App-Version": "1.0"
  },
  bodyType: 'JSON',
  body: {
    "name": "{{$json.name}}",
    "email": "{{$json.email}}",
    "role": "user"
  },
  continueOnFail: true,
  retryOnFail: true
}
```

### Complete OpenAI Configuration

```javascript
// Configure AI text summarization
{
  apiKey: 'sk-proj-abc123...',
  model: 'gpt-4-turbo',
  temperature: 0.3,
  maxTokens: 500,
  systemMessage: 'You are an expert at creating concise summaries. Focus on key points and action items.',
  prompt: `Please summarize this text in 3 bullet points:\n\n{{$json.content}}`
}
```

### Complete Slack Configuration

```javascript
// Send formatted notification to Slack
{
  credential: 'my-slack-workspace',
  channel: '#deployments',
  text: ':rocket: Deployment completed!\n\nVersion: {{$json.version}}\nEnvironment: Production\nStatus: Success',
  username: 'Deploy Bot',
  icon: ':rocket:',
  attachments: [{
    color: '#36a64f',
    fields: [
      { title: 'Deployed by', value: '{{$json.user}}', short: true },
      { title: 'Duration', value: '{{$json.duration}}s', short: true }
    ]
  }]
}
```

## Troubleshooting

### Panel Doesn't Open
- Check browser console for errors
- Ensure node is properly selected
- Verify `onNodeSettingsOpen` prop is passed to WorkflowCanvas

### Changes Not Saving
- Click "Save Changes" button explicitly
- Check that `onUpdate` callback is working
- Verify `handleNodeSettingsUpdate` in App.jsx

### Fields Not Showing
- Check node name matches configuration key exactly
- Verify nodeConfigurations object includes your node
- Check browser console for React errors

### Styling Issues
- Ensure TailwindCSS is properly loaded
- Check for conflicting CSS classes
- Verify panel width and overflow settings

## Future Enhancements

Planned improvements:

- [ ] Expression editor with autocomplete
- [ ] Credential management system
- [ ] Field validation and error messages
- [ ] Node testing from settings panel
- [ ] Parameter presets and templates
- [ ] Import/export node configurations
- [ ] Keyboard navigation
- [ ] Field dependencies (show/hide based on other fields)
- [ ] Real-time preview of node output
- [ ] Undo/redo for configuration changes

## API Reference

### NodeSettingsPanel Props

```typescript
interface NodeSettingsPanelProps {
  node: {
    id: string;
    data: {
      label: string;
      name: string;
      category: string;
      icon: string;
      color: string;
      parameters?: Record<string, any>;
    };
  };
  onClose: () => void;
  onUpdate: (updatedNode: Node) => void;
}
```

### Node Configuration Schema

```typescript
interface NodeConfiguration {
  sections: Section[];
}

interface Section {
  title: string;
  fields: Field[];
}

interface Field {
  name: string;
  label: string;
  type: 'text' | 'password' | 'number' | 'select' | 'textarea' | 'code' | 'json' | 'checkbox' | 'credential';
  placeholder?: string;
  default?: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  readOnly?: boolean;
  language?: string;
  credentialType?: string;
}
```

---

**Your workflow automation is now more powerful than ever! 🚀**

Configure nodes with precision and build complex workflows with ease.
