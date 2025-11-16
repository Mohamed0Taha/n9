# Node Integration Testing Guide

## ✅ Currently Working Nodes (Restart Queue Worker!)

Remember: **Restart your queue worker** after code changes!
```bash
php artisan queue:work
```

---

## 1. HTTP Request ✅ TESTED & WORKING

### Test Configuration:
- **Method:** GET
- **URL:** `https://api.restful-api.dev/objects`
- **Expected Output:** 13 products array

### Test Steps:
1. Add HTTP Request node
2. Configure URL
3. Connect to Start node
4. Execute workflow
5. Check output shows 13 products

---

## 2. Code 🆕 NEW - READY TO TEST

### What It Does:
Transforms input data using custom logic (currently adds metadata)

### Test Configuration:
- **Input:** Connect to HTTP Request output
- **Expected Output:** Same data + `processed_by_code: true` + timestamp

### Test Steps:
1. Create workflow: `Start → HTTP Request → Code`
2. Execute
3. Check Code node output has:
   - Original data from HTTP Request
   - `processed_by_code: true`
   - `timestamp` field

### Sample Output:
```json
{
  "success": true,
  "items": [
    {
      "statusCode": 200,
      "body": [...],
      "processed_by_code": true,
      "timestamp": "2025-11-16T19:16:00.000000Z"
    }
  ],
  "code_executed": true
}
```

---

## 3. IF 🆕 NEW - READY TO TEST

### What It Does:
Routes workflow based on conditions

### Test Configuration A: Simple Check (Input exists)
- **Input:** Connect to node with data
- **Expected:** Routes to TRUE output (green connection)

### Test Configuration B: Value Comparison
- **Value 1:** `10`
- **Operation:** `larger`
- **Value 2:** `5`
- **Expected:** Routes to TRUE output

### Test Steps:
1. Create workflow: `Start → HTTP Request → IF → Code`
2. Configure IF node
3. Execute
4. Check output shows:
   - `result: true` or `false`
   - `condition_met: true/false`
   - `output_index: 0` (true) or `1` (false)

### Sample Output:
```json
{
  "success": true,
  "result": true,
  "condition_met": true,
  "output_index": 0,
  "input_data": {...}
}
```

---

## 4. Slack 🆕 NEW - READY TO TEST

### What It Does:
Sends messages to Slack via webhook

### Prerequisites:
1. Create Slack incoming webhook:
   - Go to https://api.slack.com/messaging/webhooks
   - Create new webhook
   - Copy webhook URL

### Test Configuration:
- **Webhook URL:** `https://hooks.slack.com/services/YOUR/WEBHOOK/URL`
- **Message:** `Test from n8n Workflow!` (or leave empty to send input data)

### Test Steps:
1. Create workflow: `Start → HTTP Request → Slack`
2. Configure Slack webhook URL
3. Execute
4. Check Slack channel for message
5. Check node output shows `message_sent: true`

### Sample Output:
```json
{
  "success": true,
  "message_sent": true,
  "channel": "Slack",
  "response": "ok"
}
```

---

## Quick Test Workflows

### Workflow 1: HTTP → Code → IF
Tests data flow and transformation

```
[Start] → [HTTP Request] → [Code] → [IF] → [Display Results]
           (Get data)      (Transform)  (Route)
```

**What to check:**
- HTTP fetches 13 products
- Code adds metadata
- IF routes based on data presence

---

### Workflow 2: HTTP → Slack
Tests external API integration

```
[Start] → [HTTP Request] → [Slack]
           (Get data)      (Send to Slack)
```

**What to check:**
- HTTP fetches data
- Slack receives formatted message
- Webhook returns success

---

## Troubleshooting

### Node Returns Error

**Check:**
1. Queue worker is running with latest code
2. Configuration is saved (click "Save Changes")
3. Parameters are in correct format
4. Check logs: `tail -f storage/logs/laravel.log`

### Slack Not Working

**Common issues:**
- Invalid webhook URL → verify URL format
- Webhook revoked → regenerate in Slack settings
- Network blocked → check firewall

### Code Node Not Transforming

**Current limitation:**
- Only adds metadata for now
- Full JavaScript execution coming in Phase 2
- For now, tests basic data flow

### IF Node Always Routes Same Way

**Check:**
- Are you setting value1/value2?
- Is operation correct?
- Try simple test: value1=10, operation=larger, value2=5

---

## Integration Test Checklist

For each node, verify:

- [ ] Configuration saves correctly
- [ ] Node executes without errors
- [ ] Output structure is correct
- [ ] Data flows to next node
- [ ] Execution time is reasonable (2-3s per node)
- [ ] Error messages are clear
- [ ] Works with different input types

---

## Next Phase Nodes

### Coming Soon:
- **OpenAI** (GPT integration)
- **Gmail** (SMTP email sending)
- **MySQL** (Database queries)
- **Google Sheets** (Read/write operations)

### Request Priority:
Which nodes do you need most urgently? Let me know!

---

## Report Issues

When a node doesn't work, please provide:

1. **Node type:** (e.g., "Slack")
2. **Configuration:** (parameters used)
3. **Error message:** (from output or logs)
4. **Expected vs Actual:** What you expected vs what happened

This helps fix issues quickly!
