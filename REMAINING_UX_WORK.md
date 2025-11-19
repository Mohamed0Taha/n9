# Remaining UX Work

## Completed ✅
1. **CTRL+A to select all nodes** - Working
2. **Default 80% zoom** - Canvas now loads at 80% zoom
3. **Sidebar animation** - Smooth slide in/out transition

## In Progress 🚧

### Critical: Node Configuration System
The NodeSettingsPanel exists but needs major enhancements to support actual node configuration.

#### Required Node Types with Configuration
1. **RSS Feed** (`RSS Feed`)
   - URL input (required)
   - Poll interval
   - Example: `https://rss.app/feeds/xxx.xml`

2. **OpenAI** (`OpenAI`)
   - Model selection (gpt-4o-mini, gpt-4o, gpt-3.5-turbo)
   - Temperature slider (0-1)
   - Max tokens input
   - System message textarea
   - User prompt textarea (with variable support {{ $json }})
   - API key (credentials)

3. **Gmail** (`Gmail`)
   - To/From email inputs
   - Subject input
   - Message textarea (with variable support)
   - OAuth2 credentials

4. **Schedule** (`Schedule`)
   - Interval type (hours, minutes, days)
   - Interval value
   - Cron expression (advanced)

5. **IF** (`IF`)
   - Conditions builder
   - Value1, Operation, Value2
   - Multiple conditions with AND/OR

6. **HTTP Request** (`HTTP Request`)
   - Method dropdown (GET, POST, PUT, DELETE)
   - URL input
   - Headers editor (key-value pairs)
   - Query parameters editor
   - Body editor (JSON)
   - Authentication (None, Basic, API Key, OAuth)

### Critical: Credentials Management
Need to implement n8n-style credential system:

#### Features Needed
1. **Credentials Storage**
   - Database table: `credentials`
   - Fields: id, user_id, name, type, data (encrypted), created_at
   - Types: oauth2, api_key, basic_auth, custom

2. **Credentials UI**
   - Global credentials manager (accessible from settings)
   - Per-node credential selection
   - New credential creation modal
   - Test connection button

3. **Node Integration**
   - Nodes reference credentials by ID
   - Dropdown to select existing credential
   - "Create new" option inline

## Implementation Plan

### Phase 1: Node Configuration Forms (Priority: HIGH)

#### Step 1: Create Universal Node Config Component
```javascript
// components/NodeConfigForm.jsx
- Dynamic form builder based on node type
- Support text, select, textarea, number, slider
- Support variable interpolation ({{ $json.field }})
- Validation
```

#### Step 2: Define Node Schemas
```javascript
// data/nodeSchemas.js
export const nodeSchemas = {
  'RSS Feed': {
    fields: [
      { name: 'url', type: 'text', label: 'Feed URL', required: true },
      { name: 'pollInterval', type: 'number', label: 'Poll Interval (minutes)', default: 60 }
    ]
  },
  'OpenAI': {
    fields: [
      { name: 'model', type: 'select', options: ['gpt-4o-mini', 'gpt-4o'], required: true },
      { name: 'temperature', type: 'slider', min: 0, max: 1, step: 0.1, default: 0.7 },
      { name: 'maxTokens', type: 'number', default: 1000 },
      { name: 'systemMessage', type: 'textarea', label: 'System Message' },
      { name: 'prompt', type: 'textarea', label: 'User Prompt', required: true },
      { name: 'credential', type: 'credential', credentialType: 'openai_api' }
    ]
  },
  // ... more nodes
}
```

#### Step 3: Update NodeSettingsPanel
- Replace hardcoded sections with dynamic schema-based rendering
- Add proper save/update functionality
- Persist to node.data.parameters

#### Step 4: Test Each Node Type
- Create test workflow with each node
- Verify configuration saves
- Verify configuration displays correctly

### Phase 2: Credentials System (Priority: HIGH)

#### Step 1: Database Migration
```php
// Create credentials table
Schema::create('credentials', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('name'); // e.g., "My OpenAI Key"
    $table->string('type'); // e.g., "openai_api", "oauth2_google"
    $table->text('data'); // Encrypted JSON
    $table->timestamps();
});
```

#### Step 2: Credential Model & Controller
```php
// app/Models/Credential.php
- Encrypted data attribute
- Belongs to user
- Validation

// app/Http/Controllers/CredentialController.php
- index() - List user's credentials
- store() - Create new credential
- update() - Update credential
- destroy() - Delete credential
- test() - Test credential (if applicable)
```

#### Step 3: Credentials UI
```javascript
// components/CredentialsManager.jsx
- List all credentials
- Add new credential modal
- Edit credential
- Delete confirmation

// components/CredentialSelector.jsx
- Dropdown for node config
- "Create new" option
- Inline credential creation
```

#### Step 4: Integration
- Nodes save credential_id in data
- Backend resolves credential when executing
- Never send credential data to frontend (only ID and name)

### Phase 3: Polish (Priority: MEDIUM)

1. **Multiple Node Selection**
   - Bulk edit support
   - Bulk delete confirmation
   - Visual feedback for multi-select

2. **Form Validation**
   - Required field indicators
   - Error messages
   - Prevent save with invalid data

3. **Variable Suggestions**
   - Autocomplete for {{ $json.* }}
   - Show available variables from previous nodes

4. **Better Mobile Support**
   - Responsive node settings panel
   - Touch-friendly controls

## Files That Need Changes

### Frontend
1. `resources/js/components/NodeSettingsPanel.jsx` - Major refactor
2. `resources/js/components/NodeConfigForm.jsx` - New file
3. `resources/js/components/CredentialsManager.jsx` - New file
4. `resources/js/components/CredentialSelector.jsx` - New file
5. `resources/js/data/nodeSchemas.js` - New file
6. `resources/js/components/App.jsx` - Add credentials state

### Backend
1. `database/migrations/xxx_create_credentials_table.php` - New
2. `app/Models/Credential.php` - New
3. `app/Http/Controllers/CredentialController.php` - New
4. `routes/web.php` - Add credential routes
5. `app/Services/WorkflowExecutor.php` - Resolve credentials during execution

## Testing Checklist

### Node Configuration
- [ ] RSS Feed URL saves and loads
- [ ] OpenAI model selection works
- [ ] Temperature slider saves correct value
- [ ] Variables {{ $json }} are preserved
- [ ] Gmail to/from/subject save correctly
- [ ] Schedule interval configuration works
- [ ] IF conditions save and load
- [ ] HTTP Request method dropdown works

### Credentials
- [ ] Can create new credential
- [ ] Can edit existing credential
- [ ] Can delete credential
- [ ] Credential data is encrypted in DB
- [ ] Nodes can select credentials
- [ ] Credential selector shows only relevant types
- [ ] "Create new" works inline

### UX
- [ ] Forms are intuitive
- [ ] Validation messages are clear
- [ ] Save button updates node immediately
- [ ] No data loss when opening/closing panel

## Current Status

✅ **Quick Wins (Completed)**
- CTRL+A select all
- 80% default zoom
- Sidebar animation

🚧 **In Progress**
- Node configuration system architecture
- Node schemas definition

❌ **Not Started**
- Credentials database schema
- Credentials UI
- Node config forms for each type

## Estimated Effort

- **Node Configuration System**: 8-12 hours
  - Schema definition: 2 hours
  - Form component: 3 hours
  - Integration & testing: 3-4 hours
  - Per-node customizations: 2-3 hours

- **Credentials System**: 6-8 hours
  - Database & backend: 2-3 hours
  - Frontend UI: 2-3 hours
  - Integration: 2 hours

- **Total**: 14-20 hours of focused development

## Next Steps

1. Create `nodeSchemas.js` with all node definitions
2. Build `NodeConfigForm.jsx` dynamic form component
3. Refactor `NodeSettingsPanel.jsx` to use schemas
4. Test with RSS Feed and OpenAI nodes
5. If working well, add credentials system
6. Test end-to-end workflow with configured nodes

## Notes

- This is substantial work that transforms the app from a visual editor to a functional workflow builder
- Consider implementing incrementally - start with top 5 most important nodes
- Credentials system is complex - may want to start with simple API key storage first
- Testing is critical - each node type needs verification
