# 🔧 Sidebar Node Names Fix

## Problem

AI was generating workflows using made-up node names like "API Call", "Send Message", "Database" instead of using the exact node names available in the sidebar.

## Root Cause

The AI system prompt was using a list of node names that didn't exactly match the names in `n8nNodes.js` (the sidebar nodes).

## Solution

### 1. ✅ Updated System Prompt with Exact Sidebar Names

**File:** `/app/Services/NodeConfigurationContext.php`

**Before (Wrong):**
```
Start, HTTP Request, Webhook, Code, Function, IF, Switch, Merge, Split In Batches, Slack, Gmail, Discord, Telegram, Microsoft Teams, Twilio, WhatsApp, Google Sheets, Notion, Airtable, Asana, Trello, Monday, Jira, ClickUp, Todoist, Google Drive, HubSpot, Salesforce, Pipedrive, Zoho CRM, Close, Copper, Shopify, WooCommerce, Stripe, PayPal, Square, MySQL, PostgreSQL, MongoDB, Redis, Supabase, Firebase, GitHub, GitLab, Bitbucket, Docker, Jenkins, CircleCI, Kubernetes, AWS S3, AWS Lambda, Dropbox, Box, OneDrive, OpenAI, Anthropic, Google PaLM, Hugging Face, AI Transform, Date & Time, Set, Crypto, XML, JSON, HTML Extract, Compression, Schedule, Facebook, Instagram, Twitter, LinkedIn, Google Analytics, Mailchimp, SendGrid, Mixpanel, RSS Feed, YouTube, WordPress, Webflow, Contentful, Calendly, Typeform, Zoom, Spotify, Algolia
```

**After (Correct - Exact from sidebar):**
```
Start, HTTP Request, Webhook, Code, Function, IF, Switch, Merge, Split In Batches, Slack, Discord, Telegram, Gmail, Microsoft Teams, Twilio, WhatsApp, Notion, Google Sheets, Google Drive, Airtable, Asana, Trello, Monday, Jira, ClickUp, Todoist, HubSpot, Salesforce, Pipedrive, Zoho CRM, Close, Copper, Shopify, WooCommerce, Stripe, PayPal, Square, GitHub, GitLab, Bitbucket, Jenkins, CircleCI, Docker, Kubernetes, MySQL, PostgreSQL, MongoDB, Redis, Supabase, Firebase, Google Analytics, Facebook, Instagram, Twitter, LinkedIn, Mailchimp, SendGrid, Mixpanel, AWS S3, AWS Lambda, Dropbox, Box, OneDrive, OpenAI, Anthropic, Google PaLM, Hugging Face, AI Transform, Date & Time, Set, Function, Crypto, XML, JSON, HTML Extract, Compression, Calendly, Typeform, Zoom, Spotify, YouTube, RSS Feed, WordPress, Webflow, Contentful, Algolia
```

**Key changes:**
- Removed "Schedule" (not in sidebar)
- Added exact names from `n8nNodes.js`
- Ordered to match sidebar exactly

### 2. 🗺️ Added Concept Mapping

**Added section:** `COMMON CONCEPT MAPPING (DO NOT CREATE NEW NODES)`

```
When users ask for:
- "API call" → Use "HTTP Request"
- "Send message" → Use "Slack", "Gmail", "Discord", "Telegram", "Microsoft Teams", "Twilio", "WhatsApp"
- "Database query" → Use "MySQL", "PostgreSQL", "MongoDB", "Redis", "Supabase", "Firebase"
- "Email" → Use "Gmail", "SendGrid"
- "Spreadsheet" → Use "Google Sheets", "Airtable"
- "AI" → Use "OpenAI", "Anthropic", "Google PaLM", "Hugging Face", "AI Transform"
- "CRM" → Use "HubSpot", "Salesforce", "Pipedrive", "Zoho CRM", "Close", "Copper"
- "File storage" → Use "Google Drive", "Dropbox", "AWS S3", "Box", "OneDrive"
- "Git" → Use "GitHub", "GitLab", "Bitbucket"
- "CI/CD" → Use "Jenkins", "CircleCI"
- "Container" → Use "Docker", "Kubernetes"
- "Social media" → Use "Facebook", "Instagram", "Twitter", "LinkedIn"
- "Analytics" → Use "Google Analytics", "Mixpanel"
- "Marketing" → Use "Mailchimp", "SendGrid"
- "E-commerce" → Use "Shopify", "WooCommerce", "Stripe", "PayPal", "Square"
- "CMS" → Use "WordPress", "Webflow", "Contentful"
- "Forms" → Use "Typeform"
- "Scheduling" → Use "Calendly"
- "Video" → Use "Zoom", "YouTube"
- "Music" → Use "Spotify"
```

**Why:** When users say "send an email", AI knows to use "Gmail" or "SendGrid", not "Email".

### 3. 🛡️ Updated Validation List

**File:** `/app/Services/WorkflowDslParser.php`

Updated `VALID_NODE_TYPES` to match the exact sidebar names.

### 4. 📝 Updated Available Nodes List

**File:** `/app/Services/NodeConfigurationContext.php`

Updated `getAvailableNodesList()` to return the exact sidebar names.

---

## Testing

### Before (Broken)

**User:** "Send data to Slack"

**AI Generated:**
```json
{
  "nodes": [{
    "type": "Send Message",  ❌ Not in sidebar
    "data": {}
  }]
}
```
→ Backend rejects: "Invalid node type 'Send Message'"

### After (Fixed)

**User:** "Send data to Slack"

**AI Generated:**
```json
{
  "nodes": [{
    "type": "Slack",  ✅ Exact sidebar name
    "data": {
      "resource": "Message",
      "channel": "#general",
      "text": "{{$json.data}}"
    }
  }]
}
```
→ Backend accepts, workflow created ✅

---

## Key Changes Summary

| Component | Change | Impact |
|-----------|--------|--------|
| **System Prompt** | Exact sidebar names | AI uses correct node names |
| **Concept Mapping** | User concept → Node name | Translates user requests properly |
| **Validation** | Updated VALID_NODE_TYPES | Backend accepts correct nodes |
| **Available List** | Exact names from sidebar | User message shows correct options |

---

## Files Modified

1. ✅ `/app/Services/NodeConfigurationContext.php`
   - Updated available node types list
   - Added concept mapping section
   - Updated getAvailableNodesList()

2. ✅ `/app/Services/WorkflowDslParser.php`
   - Updated VALID_NODE_TYPES constant

---

## Expected Results

Now when you try prompts like:

```
✅ "Query database and send to Slack" → Uses "MySQL", "Slack"
✅ "Send email via Gmail" → Uses "Gmail"
✅ "Analyze with AI" → Uses "OpenAI" or "Anthropic"
✅ "Update Google Sheets" → Uses "Google Sheets"
✅ "Fetch API data" → Uses "HTTP Request"
✅ "Post to social media" → Uses "Facebook", "Twitter", "LinkedIn"
```

**No more custom node types!** 🎉

---

## Next Steps

1. **Test extensively** with various prompts
2. **Monitor logs** for any remaining invalid types
3. **Update mappings** if needed based on common user patterns

The AI will now **only use the exact node names from your sidebar**! 🚀
