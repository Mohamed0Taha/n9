# n8n Workflow Import Fix

## What Was Fixed

### Issue
When importing n8n workflows, the system was failing with error:
```
Import Error: Failed to import workflow: Undefined array key "node"
```

### Root Cause
The n8n workflow format has a **deeply nested connection structure** that wasn't being parsed correctly:

**n8n connections structure:**
```json
{
  "connections": {
    "Schedule Trigger": {
      "main": [              // Output type
        [                    // Output index
          {                  // Connection object
            "node": "RSS Feed Read",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**What we were doing (WRONG):**
```php
foreach ($connections as $outputIndex => $connections) {
    foreach ($connections as $connection) {
        $connection['node']  // ❌ FAILS - connections is an array of arrays
    }
}
```

**What we should do (CORRECT):**
```php
foreach ($outputs as $outputType => $outputArray) {
    foreach ($outputArray as $outputIndex => $connections) {
        foreach ($connections as $connection) {
            $connection['node']  // ✅ WORKS
        }
    }
}
```

### Solution Implemented

1. **Fixed Connection Parsing**
   - Added extra loop to handle nested array structure
   - Properly iterate through: `node → outputType → outputIndex → connections`

2. **Added Node Name to ID Mapping**
   - n8n uses node **names** in connections
   - Our system uses node **IDs**
   - Created `findNodeIdByName()` helper to map between them

3. **Added Missing Node Types**
   - `Schedule` (`n8n-nodes-base.scheduleTrigger`)
   - `RSS Feed` (`n8n-nodes-base.rssFeedRead`)

4. **Added Configuration Schemas**
   - Schedule: `rule` with interval configuration
   - RSS Feed: `url` parameter

## Testing Your Workflow

Your workflow has:
- ✅ **Schedule Trigger** - Now mapped correctly
- ✅ **RSS Feed Read** - Now mapped correctly
- ✅ **Filter (IF)** - Already supported
- ✅ **OpenAI** - Already supported
- ✅ **Gmail** - Already supported

### Expected Import Result

**Original n8n workflow:**
- 5 nodes (Schedule → RSS → Filter → OpenAI → Gmail)
- 4 connections

**After import, you should see:**
```json
{
  "name": "generated_workflow",
  "graph": {
    "nodes": [
      {
        "id": "d4397643-1111-4444-8888-111111111111",
        "type": "Schedule",
        "label": "Schedule Trigger",
        "data": {
          "rule": {
            "interval": [{"field": "hours"}]
          }
        },
        "position": {"x": 460, "y": 240}
      },
      {
        "id": "a1b2c3d4-2222-4444-8888-222222222222",
        "type": "RSS Feed",
        "label": "RSS Feed Read",
        "data": {
          "url": "https://rss.app/feeds/tNQQp6fOtU7Ij7sk.xml"
        },
        "position": {"x": 680, "y": 240}
      },
      // ... IF, OpenAI, Gmail nodes
    ],
    "edges": [
      {"source": "d4397643-...", "target": "a1b2c3d4-..."},
      {"source": "a1b2c3d4-...", "target": "b2c3d4e5-..."},
      {"source": "b2c3d4e5-...", "target": "c3d4e5f6-..."},
      {"source": "c3d4e5f6-...", "target": "d4e5f6g7-..."}
    ]
  }
}
```

## How to Import

### Via Upload Button (UI)
1. Click **UPLOAD** button (blue, top right)
2. Select your n8n workflow `.json` file
3. Workflow appears as draft
4. Review nodes and connections
5. Save if everything looks good

### Via API
```bash
curl -X POST http://localhost:8000/app/workflows/upload \
  -F "file=@workflow.json"
```

## Deployment Status

✅ **Fixed and deployed** (v59)
- Production: https://pure-inlet-35276-c4fd929e7b3a.herokuapp.com/
- Local: Run `./dev.sh` to test

## Supported Node Types (55+)

### Triggers
- ✅ Start (Manual Trigger)
- ✅ Schedule
- ✅ Webhook

### Actions
- ✅ HTTP Request
- ✅ Code / Function
- ✅ RSS Feed

### Flow Control
- ✅ IF
- ✅ Switch
- ✅ Merge

### Communication
- ✅ Slack
- ✅ Discord
- ✅ Telegram
- ✅ Gmail
- ✅ Microsoft Teams

### Databases
- ✅ MySQL
- ✅ PostgreSQL
- ✅ MongoDB
- ✅ Redis

### AI
- ✅ OpenAI
- ✅ Anthropic

### Productivity
- ✅ Google Sheets
- ✅ Notion
- ✅ Airtable

### And 30+ more...

## Node Mapping Examples

| n8n Type | Our Type | Config Fields |
|----------|----------|---------------|
| `n8n-nodes-base.scheduleTrigger` | `Schedule` | `rule.interval` |
| `n8n-nodes-base.rssFeedRead` | `RSS Feed` | `url` |
| `n8n-nodes-base.if` | `IF` | `conditions` |
| `n8n-nodes-base.openAi` | `OpenAI` | `model`, `messages` |
| `n8n-nodes-base.gmail` | `Gmail` | `sendTo`, `subject`, `message` |

## Troubleshooting

### Still Getting Import Errors?

1. **Check File Format**
   ```bash
   # Validate JSON
   cat workflow.json | jq .
   ```

2. **Check Required Fields**
   - File must have `nodes` array
   - File must have `connections` object
   - Each node must have `id`, `name`, `type`

3. **Unsupported Node Types**
   - If you see "Invalid node type", the node isn't supported yet
   - Check the mapping in `N8nFormatConverter.php`
   - Create a GitHub issue with the node type

4. **Check Logs**
   ```bash
   # Local
   tail -f storage/logs/laravel.log
   
   # Heroku
   heroku logs --tail --app=pure-inlet-35276
   ```

## What Gets Preserved

✅ **Preserved:**
- Node configurations
- Node positions
- Node connections
- Workflow name
- Workflow description (from meta)

⚠️ **Not Preserved:**
- Credentials (for security)
- Execution history
- Static data
- Workflow settings (active status, etc.)

## Future Improvements

- [ ] Support for more node types
- [ ] Credential migration helpers
- [ ] Batch import multiple workflows
- [ ] Import validation preview
- [ ] Error messages with node names

## Example: Your RSS News Workflow

**What it does:**
1. **Schedule**: Runs every hour
2. **RSS Feed**: Fetches news from RSS feed
3. **Filter**: Only shows news from last hour
4. **OpenAI**: Generates article summary
5. **Gmail**: Sends email with summary

**After import:**
- All nodes visible on canvas
- Proper connections between nodes
- Ready to configure credentials
- Can be edited and saved
