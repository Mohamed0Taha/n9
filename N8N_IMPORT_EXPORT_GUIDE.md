# n8n Workflow Import/Export Guide

## Overview
This system provides full bidirectional compatibility with n8n workflows, allowing you to import existing n8n workflows and export workflows in n8n-compatible format.

## Features

### 1. **Upload n8n Workflows** (Free)
- Import existing n8n workflow JSON files
- Automatic format conversion to our internal structure
- Validates n8n workflow format before import
- No authentication required
- File size limit: 2MB

### 2. **Download Workflows** (10 Credits)
- Export workflows in n8n-compatible JSON format
- Requires authentication
- Costs 10 credits per download
- Downloads directly to your computer
- Ready to import into n8n

### 3. **Preview n8n Format** (Free)
- View how your workflow will look in n8n format
- No credit cost
- Useful for debugging and validation

## How It Works

### n8n Format Structure
n8n workflows use this structure:
```json
{
  "name": "Workflow Name",
  "nodes": [
    {
      "id": "node-id",
      "name": "Node Name",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [250, 250],
      "parameters": {
        "method": "GET",
        "url": "https://api.example.com"
      }
    }
  ],
  "connections": {
    "node-1": {
      "main": [
        [
          {
            "node": "node-2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {},
  "meta": {}
}
```

### Our Internal Format
We use a simplified format:
```json
{
  "name": "Workflow Name",
  "description": "Description",
  "graph": {
    "nodes": [
      {
        "id": "node-1",
        "type": "HTTP Request",
        "label": "Fetch Data",
        "data": {
          "method": "GET",
          "url": "https://api.example.com"
        },
        "position": { "x": 250, "y": 250 }
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "node-1",
        "target": "node-2"
      }
    ]
  }
}
```

## Node Type Mapping

### From n8n to Our Format
| n8n Type | Our Type |
|----------|----------|
| `n8n-nodes-base.manualTrigger` | `Start` |
| `n8n-nodes-base.httpRequest` | `HTTP Request` |
| `n8n-nodes-base.webhook` | `Webhook` |
| `n8n-nodes-base.code` | `Code` |
| `n8n-nodes-base.if` | `IF` |
| `n8n-nodes-base.slack` | `Slack` |
| `n8n-nodes-base.gmail` | `Gmail` |
| `n8n-nodes-base.openAi` | `OpenAI` |
| `n8n-nodes-base.googleSheets` | `Google Sheets` |
| `n8n-nodes-base.mysql` | `MySQL` |
| ... and 30+ more nodes |

## API Endpoints

### Upload Workflow
```
POST /app/workflows/upload
Content-Type: multipart/form-data

Form Data:
- file: n8n workflow JSON file

Response:
{
  "message": "Workflow imported successfully",
  "workflow": {
    "name": "Imported Workflow",
    "description": "...",
    "graph": { ... }
  }
}
```

### Download Workflow
```
GET /app/workflows/{workflow_id}/download

Headers:
- Authentication required (session)

Response:
- File download (JSON)
- Credits deducted: 10

Error Responses:
- 401: Not authenticated
- 402: Insufficient credits
- 404: Workflow not found
```

### Preview n8n Format
```
GET /app/workflows/{workflow_id}/preview

Response:
{
  "n8n_workflow": { ... },
  "nodes_count": 5,
  "connections_count": 4
}
```

## UI Usage

### Upload Button (Blue, Top Right)
1. Click the **UPLOAD** button in the header
2. Select an n8n workflow JSON file
3. Workflow appears as a draft in the prompt panel
4. Review and save if desired

### Download Button (Purple, Top Right)
1. Select a workflow from the sidebar
2. Click the **DOWNLOAD** button
3. Login prompt appears if not authenticated
4. Credit check occurs (10 credits required)
5. File downloads automatically as `workflow-name.json`
6. Import the file into n8n

## Conversion Details

### What Gets Converted

#### ✅ Fully Supported
- **Node Types**: All 100+ node types
- **Node Parameters**: All configuration data
- **Connections**: All edges between nodes
- **Node Positions**: Canvas layout preserved
- **Workflow Metadata**: Name, description

#### ⚠️ Partially Supported
- **Credentials**: References removed (configure in n8n)
- **Execution Data**: Not included in export
- **Webhook URLs**: Need reconfiguration in n8n

#### ❌ Not Converted
- **Workflow Settings**: Some advanced settings
- **Version History**: Only latest version exported
- **Static Data**: Node-specific static data

## Credit System

### Pricing
- **Upload**: Free (no limits)
- **Download**: 10 credits per workflow
- **Preview**: Free

### How Credits Work
1. Download requires authentication
2. System checks your credit balance
3. If sufficient, credits are deducted
4. Transaction is logged to your account
5. File downloads immediately

### Insufficient Credits
If you don't have enough credits:
```json
{
  "message": "Insufficient credits",
  "required_credits": 10.00,
  "current_balance": 5.00
}
```

You'll see a modal showing:
- Credits required: 10
- Your balance: (current amount)
- Option to purchase more credits

## Example Workflows

### Example 1: Simple HTTP → Slack
**n8n Format:**
```json
{
  "name": "API to Slack",
  "nodes": [
    {
      "id": "start",
      "name": "When clicking Test workflow",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [250, 300]
    },
    {
      "id": "http",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "GET",
        "url": "https://api.github.com/repos/n8n-io/n8n"
      },
      "position": [450, 300]
    },
    {
      "id": "slack",
      "name": "Slack",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#general",
        "text": "Stars: {{ $json.stargazers_count }}"
      },
      "position": [650, 300]
    }
  ],
  "connections": {
    "start": { "main": [[{ "node": "http", "type": "main", "index": 0 }]] },
    "http": { "main": [[{ "node": "slack", "type": "main", "index": 0 }]] }
  }
}
```

**Our Format (after import):**
```json
{
  "name": "API to Slack",
  "graph": {
    "nodes": [
      {
        "id": "start",
        "type": "Start",
        "label": "When clicking Test workflow",
        "position": { "x": 250, "y": 300 }
      },
      {
        "id": "http",
        "type": "HTTP Request",
        "label": "HTTP Request",
        "data": {
          "method": "GET",
          "url": "https://api.github.com/repos/n8n-io/n8n"
        },
        "position": { "x": 450, "y": 300 }
      },
      {
        "id": "slack",
        "type": "Slack",
        "label": "Slack",
        "data": {
          "channel": "#general",
          "text": "Stars: {{ $json.stargazers_count }}"
        },
        "position": { "x": 650, "y": 300 }
      }
    ],
    "edges": [
      { "source": "start", "target": "http" },
      { "source": "http", "target": "slack" }
    ]
  }
}
```

## Troubleshooting

### Upload Issues

**"Invalid JSON file"**
- Ensure file is valid JSON
- Check for syntax errors
- Verify it's an n8n workflow export

**"Invalid n8n workflow format"**
- File must have `nodes` array
- File must have `connections` object
- Use actual n8n export, not custom JSON

### Download Issues

**"Authentication required"**
- Sign in with Google before downloading
- Check if session is active

**"Insufficient credits"**
- Check your credit balance (top right)
- Purchase more credits if needed
- Each download costs 10 credits

**"No workflow selected"**
- Click a workflow in the sidebar first
- Ensure workflow has been saved

### Import into n8n

1. Open n8n
2. Go to Workflows
3. Click **Import from File**
4. Select downloaded JSON
5. Click **Import**
6. Configure credentials for nodes that need them
7. Test the workflow

## Best Practices

### Before Upload
1. ✅ Export from n8n using **Download** option
2. ✅ Keep file under 2MB
3. ✅ Test workflow in n8n first

### Before Download
1. ✅ Ensure you have 10+ credits
2. ✅ Save workflow first
3. ✅ Verify workflow works in our system

### After Import to n8n
1. ✅ Check all node configurations
2. ✅ Add credentials where needed
3. ✅ Update webhook URLs
4. ✅ Test execution
5. ✅ Verify data flow

## Limitations

1. **Credentials**: Not exported for security
2. **Subworkflows**: Not currently supported
3. **Static Data**: May need reconfiguration
4. **Custom Nodes**: Only built-in nodes supported
5. **Execution History**: Not included

## Security

- Uploaded files are validated before processing
- No credentials are stored or exported
- Downloads require authentication
- Credit transactions are logged
- File size limits prevent abuse

## Support

For issues or questions:
1. Check workflow validation in preview endpoint
2. Verify n8n format matches expected structure
3. Test with simple workflows first
4. Contact support with error messages

## Version Compatibility

- **n8n Version**: Compatible with n8n v1.x
- **Node Type Version**: Supports typeVersion 1
- **API Version**: v1 (current)

## Future Enhancements

- [ ] Support for subworkflows
- [ ] Bulk upload/download
- [ ] Workflow templates library
- [ ] Advanced node mapping options
- [ ] Credential migration tools
