/**
 * COMPLETE Node Configuration Schemas for ALL 100+ Node Types
 * 
 * This file contains configuration schemas for every node in the system.
 * Each schema defines the fields, types, and validation for that node.
 * 
 * Import this instead of nodeSchemas.js for complete coverage.
 */

import { nodeSchemas as baseSchemas } from './nodeSchemas.js';

// Generate default schema for any node type
const generateDefaultSchema = (nodeType, category = 'Other') => ({
  category,
  fields: [
    {
      name: 'operation',
      type: 'select',
      label: 'Operation',
      options: [
        { value: 'execute', label: 'Execute' },
        { value: 'get', label: 'Get' },
        { value: 'create', label: 'Create' },
        { value: 'update', label: 'Update' },
        { value: 'delete', label: 'Delete' }
      ],
      default: 'execute',
      required: true
    },
    {
      name: 'resource',
      type: 'text',
      label: 'Resource',
      placeholder: 'Enter resource identifier',
      supportsVariables: true
    },
    {
      name: 'data',
      type: 'textarea',
      label: 'Data (JSON)',
      placeholder: '{"key": "value"}',
      rows: 5,
      supportsVariables: true,
      description: `Configuration data for ${nodeType}`
    }
  ]
});

// Additional complete schemas
const additionalSchemas = {
  // Core & Flow
  'Start': {
    category: 'Core',
    fields: []
  },
  
  'Manual Trigger': {
    category: 'Core',
    fields: []
  },
  
  'Webhook': {
    category: 'Core',
    fields: [
      {
        name: 'httpMethod',
        type: 'select',
        label: 'HTTP Method',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' }
        ],
        default: 'POST',
        required: true
      },
      {
        name: 'path',
        type: 'text',
        label: 'Path',
        placeholder: 'my-webhook'
      }
    ]
  },

  'Function': {
    category: 'Core',
    fields: [
      {
        name: 'functionCode',
        type: 'code',
        label: 'Function Code',
        placeholder: 'return items;',
        rows: 15,
        required: true
      }
    ]
  },

  'Switch': {
    category: 'Flow',
    fields: [
      {
        name: 'mode',
        type: 'select',
        label: 'Mode',
        options: [
          { value: 'rules', label: 'Rules' },
          { value: 'expression', label: 'Expression' }
        ],
        default: 'rules'
      }
    ]
  },

  'Merge': {
    category: 'Flow',
    fields: [
      {
        name: 'mode',
        type: 'select',
        label: 'Merge Mode',
        options: [
          { value: 'append', label: 'Append' },
          { value: 'merge', label: 'Merge By Key' }
        ],
        default: 'append'
      }
    ]
  },

  'Split In Batches': {
    category: 'Flow',
    fields: [
      {
        name: 'batchSize',
        type: 'number',
        label: 'Batch Size',
        default: 10,
        min: 1,
        required: true
      }
    ]
  },

  // Communication (beyond existing)
  'Discord': {
    category: 'Communication',
    requiresCredentials: true,
    credentialType: 'discord_webhook',
    fields: [
      {
        name: 'webhookUrl',
        type: 'text',
        label: 'Webhook URL',
        required: true,
        placeholder: 'https://discord.com/api/webhooks/...'
      },
      {
        name: 'content',
        type: 'textarea',
        label: 'Message Content',
        required: true,
        rows: 4
      },
      {
        name: 'username',
        type: 'text',
        label: 'Bot Name',
        placeholder: 'n8n Bot'
      }
    ]
  },

  'Telegram': {
    category: 'Communication',
    requiresCredentials: true,
    credentialType: 'telegram_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [{ value: 'message', label: 'Message' }],
        default: 'message'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'sendMessage', label: 'Send Message' },
          { value: 'sendPhoto', label: 'Send Photo' }
        ],
        default: 'sendMessage'
      },
      {
        name: 'chatId',
        type: 'text',
        label: 'Chat ID',
        required: true
      },
      {
        name: 'text',
        type: 'textarea',
        label: 'Text',
        required: true,
        showWhen: { operation: 'sendMessage' }
      },
      {
        name: 'photo',
        type: 'text',
        label: 'Photo URL',
        showWhen: { operation: 'sendPhoto' }
      }
    ]
  },

  'Microsoft Teams': {
    category: 'Communication',
    requiresCredentials: true,
    credentialType: 'microsoft_teams_webhook',
    fields: [
      {
        name: 'webhookUrl',
        type: 'text',
        label: 'Webhook URL',
        required: true
      },
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        placeholder: 'Notification'
      },
      {
        name: 'text',
        type: 'textarea',
        label: 'Message Text',
        required: true
      }
    ]
  },

  'Twilio': {
    category: 'Communication',
    requiresCredentials: true,
    credentialType: 'twilio_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [{ value: 'sms', label: 'SMS' }],
        default: 'sms'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [{ value: 'send', label: 'Send' }],
        default: 'send'
      },
      {
        name: 'from',
        type: 'text',
        label: 'From Number',
        required: true
      },
      {
        name: 'to',
        type: 'text',
        label: 'To Number',
        required: true
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        required: true
      }
    ]
  },

  'WhatsApp': {
    category: 'Communication',
    requiresCredentials: true,
    credentialType: 'whatsapp_api',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'sendTemplate', label: 'Send Template' },
          { value: 'sendMessage', label: 'Send Message' }
        ],
        default: 'sendTemplate'
      },
      {
        name: 'to',
        type: 'text',
        label: 'To Number',
        required: true
      },
      {
        name: 'templateName',
        type: 'text',
        label: 'Template Name',
        showWhen: { operation: 'sendTemplate' }
      },
      {
        name: 'text',
        type: 'textarea',
        label: 'Message Body',
        showWhen: { operation: 'sendMessage' }
      }
    ]
  },

  // Productivity
  'Notion': {
    category: 'Productivity',
    requiresCredentials: true,
    credentialType: 'notion_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'database', label: 'Database' },
          { value: 'page', label: 'Page' },
          { value: 'block', label: 'Block' }
        ],
        default: 'database'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'get', label: 'Get' },
          { value: 'update', label: 'Update' },
          { value: 'append', label: 'Append' }
        ],
        default: 'create'
      },
      {
        name: 'databaseId',
        type: 'text',
        label: 'Database ID',
        showWhen: { resource: 'database' }
      },
      {
        name: 'pageId',
        type: 'text',
        label: 'Page ID',
        showWhen: { resource: 'page' }
      },
      {
        name: 'properties',
        type: 'json',
        label: 'Properties (JSON)',
        description: 'Properties to set on the item'
      }
    ]
  },

  'Google Sheets': {
    category: 'Productivity',
    requiresCredentials: true,
    credentialType: 'google_sheets_oauth2',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'sheet', label: 'Sheet' },
          { value: 'spreadsheet', label: 'Spreadsheet' }
        ],
        default: 'sheet'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'append', label: 'Append' },
          { value: 'update', label: 'Update' },
          { value: 'read', label: 'Read' },
          { value: 'clear', label: 'Clear' },
          { value: 'create', label: 'Create' }
        ],
        default: 'append'
      },
      {
        name: 'spreadsheetId',
        type: 'text',
        label: 'Spreadsheet ID',
        required: true
      },
      {
        name: 'range',
        type: 'text',
        label: 'Range',
        placeholder: 'Sheet1!A:B',
        required: true,
        showWhen: { operation: ['append', 'update', 'read', 'clear'] }
      },
      {
        name: 'dataMode',
        type: 'select',
        label: 'Data Mode',
        options: [
          { value: 'autoMap', label: 'Map Automatically' },
          { value: 'raw', label: 'Raw (JSON Array)' }
        ],
        default: 'autoMap',
        showWhen: { operation: ['append', 'update'] }
      },
      {
        name: 'keyRow',
        type: 'number',
        label: 'Key Row',
        default: 1,
        description: 'Row number containing headers',
        showWhen: { operation: ['append', 'update'] }
      },
      {
        name: 'values',
        type: 'json',
        label: 'Values (JSON Array)',
        description: 'Array of values to append',
        showWhen: { dataMode: 'raw', operation: ['append', 'update'] }
      }
    ]
  },
  
  'Google Drive': {
    category: 'Productivity',
    requiresCredentials: true,
    credentialType: 'google_drive_oauth2',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'file', label: 'File' },
          { value: 'folder', label: 'Folder' }
        ],
        default: 'file',
        required: true
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'upload', label: 'Upload', showWhen: { resource: 'file' } },
          { value: 'download', label: 'Download', showWhen: { resource: 'file' } },
          { value: 'list', label: 'List', showWhen: { resource: 'file' } },
          { value: 'create', label: 'Create', showWhen: { resource: 'folder' } }
        ],
        default: 'upload',
        required: true
      },
      {
        name: 'fileName',
        type: 'text',
        label: 'File Name',
        placeholder: 'report.pdf',
        showWhen: { resource: 'file', operation: 'upload' }
      },
      {
        name: 'fileContent',
        type: 'text',
        label: 'File Content / Binary Property',
        placeholder: 'data',
        showWhen: { resource: 'file', operation: 'upload' }
      },
      {
        name: 'folderId',
        type: 'text',
        label: 'Parent Folder ID',
        placeholder: 'root',
        showWhen: { resource: ['file', 'folder'] }
      }
    ]
  },

  'Airtable': {
    category: 'Productivity',
    requiresCredentials: true,
    credentialType: 'airtable_api',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'list', label: 'List Records' },
          { value: 'create', label: 'Create Record' },
          { value: 'update', label: 'Update Record' }
        ],
        default: 'list'
      },
      {
        name: 'baseId',
        type: 'text',
        label: 'Base ID',
        required: true
      },
      {
        name: 'table',
        type: 'text',
        label: 'Table Name',
        required: true
      },
      {
        name: 'fields',
        type: 'json',
        label: 'Fields (JSON)',
        showWhen: { operation: ['create', 'update'] }
      }
    ]
  },
  
  'Asana': {
    category: 'Productivity',
    requiresCredentials: true,
    credentialType: 'asana_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'task', label: 'Task' },
          { value: 'project', label: 'Project' }
        ],
        default: 'task',
        required: true
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'update', label: 'Update' },
          { value: 'get', label: 'Get' },
          { value: 'getAll', label: 'Get All' }
        ],
        default: 'create',
        required: true
      },
      {
        name: 'workspace',
        type: 'text',
        label: 'Workspace ID',
        required: true
      },
      {
        name: 'project',
        type: 'text',
        label: 'Project ID',
        showWhen: { resource: 'task' }
      },
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        required: true,
        showWhen: { operation: 'create' }
      },
      {
        name: 'notes',
        type: 'textarea',
        label: 'Notes',
        showWhen: { resource: 'task' }
      }
    ]
  },

  'Trello': {
    category: 'Productivity',
    requiresCredentials: true,
    credentialType: 'trello_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'card', label: 'Card' },
          { value: 'list', label: 'List' },
          { value: 'board', label: 'Board' }
        ],
        default: 'card',
        required: true
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'update', label: 'Update' },
          { value: 'get', label: 'Get' }
        ],
        default: 'create'
      },
      {
        name: 'listId',
        type: 'text',
        label: 'List ID',
        required: true,
        showWhen: { resource: 'card', operation: 'create' }
      },
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        required: true,
        showWhen: { operation: ['create', 'update'] }
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        showWhen: { resource: 'card', operation: ['create', 'update'] }
      }
    ]
  },

  'Monday': {
    category: 'Productivity',
    requiresCredentials: true,
    credentialType: 'monday_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'board', label: 'Board' },
          { value: 'item', label: 'Item' }
        ],
        default: 'item'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'get', label: 'Get' }
        ],
        default: 'create'
      },
      {
        name: 'boardId',
        type: 'text',
        label: 'Board ID',
        required: true
      },
      {
        name: 'itemName',
        type: 'text',
        label: 'Item Name',
        showWhen: { resource: 'item', operation: 'create' }
      }
    ]
  },
  
  'Jira': {
    category: 'Productivity',
    requiresCredentials: true,
    credentialType: 'jira_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'issue', label: 'Issue' },
          { value: 'project', label: 'Project' }
        ],
        default: 'issue'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'update', label: 'Update' },
          { value: 'get', label: 'Get' }
        ],
        default: 'create'
      },
      {
        name: 'projectKey',
        type: 'text',
        label: 'Project Key',
        placeholder: 'PROJ',
        required: true,
        showWhen: { resource: 'issue', operation: 'create' }
      },
      {
        name: 'summary',
        type: 'text',
        label: 'Summary',
        required: true,
        showWhen: { resource: 'issue', operation: 'create' }
      },
      {
        name: 'issueType',
        type: 'select',
        label: 'Issue Type',
        options: [
          { value: 'Task', label: 'Task' },
          { value: 'Bug', label: 'Bug' },
          { value: 'Story', label: 'Story' },
          { value: 'Epic', label: 'Epic' }
        ],
        default: 'Task',
        showWhen: { resource: 'issue', operation: 'create' }
      }
    ]
  },

  'ClickUp': {
    category: 'Productivity',
    requiresCredentials: true,
    credentialType: 'clickup_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'task', label: 'Task' },
          { value: 'list', label: 'List' }
        ],
        default: 'task'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'get', label: 'Get' }
        ],
        default: 'create'
      },
      {
        name: 'listId',
        type: 'text',
        label: 'List ID',
        required: true
      },
      {
        name: 'name',
        type: 'text',
        label: 'Task Name',
        showWhen: { resource: 'task', operation: 'create' }
      }
    ]
  },
  
  'Todoist': {
    category: 'Productivity',
    requiresCredentials: true,
    credentialType: 'todoist_api',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create Task' },
          { value: 'close', label: 'Close Task' },
          { value: 'getAll', label: 'Get All Tasks' }
        ],
        default: 'create'
      },
      {
        name: 'content',
        type: 'text',
        label: 'Content',
        required: true,
        showWhen: { operation: 'create' }
      },
      {
        name: 'projectId',
        type: 'text',
        label: 'Project ID',
        showWhen: { operation: 'create' }
      },
      {
        name: 'taskId',
        type: 'text',
        label: 'Task ID',
        required: true,
        showWhen: { operation: 'close' }
      }
    ]
  },

  // CRM
  'HubSpot': {
    category: 'CRM',
    requiresCredentials: true,
    credentialType: 'hubspot_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'contact', label: 'Contact' },
          { value: 'company', label: 'Company' },
          { value: 'deal', label: 'Deal' }
        ],
        default: 'contact'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'update', label: 'Update' },
          { value: 'get', label: 'Get' },
          { value: 'getAll', label: 'Get All' }
        ],
        default: 'create'
      },
      {
        name: 'email',
        type: 'text',
        label: 'Email',
        showWhen: { resource: 'contact', operation: 'create' }
      },
      {
        name: 'properties',
        type: 'json',
        label: 'Additional Properties',
        description: 'JSON object of properties'
      }
    ]
  },

  'Salesforce': {
    category: 'CRM',
    requiresCredentials: true,
    credentialType: 'salesforce_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'account', label: 'Account' },
          { value: 'contact', label: 'Contact' },
          { value: 'lead', label: 'Lead' },
          { value: 'opportunity', label: 'Opportunity' }
        ],
        default: 'contact'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'update', label: 'Update' },
          { value: 'get', label: 'Get' },
          { value: 'delete', label: 'Delete' }
        ],
        default: 'create'
      },
      {
        name: 'fields',
        type: 'json',
        label: 'Fields (JSON)',
        description: 'Field values to set'
      }
    ]
  },

  'Pipedrive': generateDefaultSchema('Pipedrive', 'CRM'),
  'Zoho CRM': generateDefaultSchema('Zoho CRM', 'CRM'),
  'Close': generateDefaultSchema('Close', 'CRM'),
  'Copper': generateDefaultSchema('Copper', 'CRM'),

  // E-commerce
  'Shopify': {
    category: 'E-commerce',
    requiresCredentials: true,
    credentialType: 'shopify_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'order', label: 'Order' },
          { value: 'product', label: 'Product' },
          { value: 'customer', label: 'Customer' }
        ],
        default: 'order',
        required: true
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'update', label: 'Update' },
          { value: 'get', label: 'Get' },
          { value: 'getAll', label: 'Get All' }
        ],
        default: 'getAll'
      },
      {
        name: 'orderId',
        type: 'text',
        label: 'Order ID',
        showWhen: { resource: 'order', operation: ['get', 'update'] }
      },
      {
        name: 'productId',
        type: 'text',
        label: 'Product ID',
        showWhen: { resource: 'product', operation: ['get', 'update'] }
      }
    ]
  },

  'WooCommerce': {
    category: 'E-commerce',
    requiresCredentials: true,
    credentialType: 'woocommerce_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'order', label: 'Order' },
          { value: 'product', label: 'Product' },
          { value: 'customer', label: 'Customer' }
        ],
        default: 'order'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'get', label: 'Get' },
          { value: 'getAll', label: 'Get All' }
        ],
        default: 'getAll'
      }
    ]
  },

  'Stripe': {
    category: 'E-commerce',
    requiresCredentials: true,
    credentialType: 'stripe_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'customer', label: 'Customer' },
          { value: 'charge', label: 'Charge' },
          { value: 'invoice', label: 'Invoice' }
        ],
        default: 'customer'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'get', label: 'Get' },
          { value: 'getAll', label: 'Get All' }
        ],
        default: 'create'
      },
      {
        name: 'email',
        type: 'text',
        label: 'Email',
        showWhen: { resource: 'customer', operation: 'create' }
      },
      {
        name: 'amount',
        type: 'number',
        label: 'Amount (cents)',
        showWhen: { resource: 'charge', operation: 'create' }
      },
      {
        name: 'currency',
        type: 'text',
        label: 'Currency',
        default: 'usd',
        showWhen: { resource: 'charge', operation: 'create' }
      }
    ]
  },

  'PayPal': generateDefaultSchema('PayPal', 'E-commerce'),
  'Square': generateDefaultSchema('Square', 'E-commerce'),

  // Development
  'GitHub': {
    category: 'Development',
    requiresCredentials: true,
    credentialType: 'github_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'issue', label: 'Issue' },
          { value: 'repository', label: 'Repository' },
          { value: 'user', label: 'User' }
        ],
        default: 'issue'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'get', label: 'Get' },
          { value: 'lock', label: 'Lock' }
        ],
        default: 'create'
      },
      {
        name: 'owner',
        type: 'text',
        label: 'Owner',
        required: true,
        placeholder: 'username or organization'
      },
      {
        name: 'repository',
        type: 'text',
        label: 'Repository',
        required: true,
        placeholder: 'repo-name'
      },
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        showWhen: { resource: 'issue', operation: 'create' }
      },
      {
        name: 'body',
        type: 'textarea',
        label: 'Body',
        showWhen: { resource: 'issue', operation: 'create' }
      }
    ]
  },

  'GitLab': {
    category: 'Development',
    requiresCredentials: true,
    credentialType: 'gitlab_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'issue', label: 'Issue' },
          { value: 'repository', label: 'Repository' }
        ],
        default: 'issue'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'get', label: 'Get' }
        ],
        default: 'create'
      },
      {
        name: 'projectId',
        type: 'text',
        label: 'Project ID',
        required: true
      }
    ]
  },

  'Bitbucket': generateDefaultSchema('Bitbucket', 'Development'),
  'Jenkins': generateDefaultSchema('Jenkins', 'Development'),
  'CircleCI': generateDefaultSchema('CircleCI', 'Development'),
  'Docker': generateDefaultSchema('Docker', 'Development'),
  'Kubernetes': generateDefaultSchema('Kubernetes', 'Development'),

  // Databases
  'PostgreSQL': {
    category: 'Database',
    requiresCredentials: true,
    credentialType: 'postgres',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'executeQuery', label: 'Execute Query' },
          { value: 'insert', label: 'Insert' },
          { value: 'update', label: 'Update' }
        ],
        default: 'executeQuery'
      },
      {
        name: 'query',
        type: 'code',
        label: 'Query',
        placeholder: 'SELECT * FROM table',
        required: true,
        showWhen: { operation: 'executeQuery' }
      },
      {
        name: 'table',
        type: 'text',
        label: 'Table',
        showWhen: { operation: ['insert', 'update'] }
      },
      {
        name: 'columns',
        type: 'text',
        label: 'Columns',
        placeholder: 'col1, col2',
        showWhen: { operation: 'insert' }
      }
    ]
  },

  'MongoDB': {
    category: 'Database',
    requiresCredentials: true,
    credentialType: 'mongodb',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'find', label: 'Find' },
          { value: 'insert', label: 'Insert' },
          { value: 'update', label: 'Update' },
          { value: 'delete', label: 'Delete' }
        ],
        default: 'find'
      },
      {
        name: 'collection',
        type: 'text',
        label: 'Collection',
        required: true
      },
      {
        name: 'query',
        type: 'json',
        label: 'Query (JSON)',
        placeholder: '{"field": "value"}',
        showWhen: { operation: ['find', 'update', 'delete'] }
      }
    ]
  },

  'Redis': {
    category: 'Database',
    requiresCredentials: true,
    credentialType: 'redis',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'get', label: 'Get' },
          { value: 'set', label: 'Set' },
          { value: 'delete', label: 'Delete' },
          { value: 'keys', label: 'Keys' }
        ],
        default: 'get'
      },
      {
        name: 'key',
        type: 'text',
        label: 'Key',
        required: true,
        showWhen: { operation: ['get', 'set', 'delete'] }
      },
      {
        name: 'value',
        type: 'text',
        label: 'Value',
        showWhen: { operation: 'set' }
      }
    ]
  },

  'Supabase': {
    category: 'Database',
    requiresCredentials: true,
    credentialType: 'supabase_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [{ value: 'database', label: 'Database' }],
        default: 'database'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'getAll', label: 'Get All' },
          { value: 'create', label: 'Create' },
          { value: 'update', label: 'Update' }
        ],
        default: 'getAll'
      },
      {
        name: 'table',
        type: 'text',
        label: 'Table Name',
        required: true
      }
    ]
  },

  'Firebase': {
    category: 'Database',
    requiresCredentials: true,
    credentialType: 'firebase_api',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'get', label: 'Get' },
          { value: 'set', label: 'Set' },
          { value: 'push', label: 'Push' },
          { value: 'update', label: 'Update' }
        ],
        default: 'get'
      },
      {
        name: 'path',
        type: 'text',
        label: 'Path',
        placeholder: '/users',
        required: true
      }
    ]
  },

  // Analytics & Marketing
  'Google Analytics': {
    category: 'Analytics',
    requiresCredentials: true,
    credentialType: 'google_analytics_oauth2',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [{ value: 'report', label: 'Report' }],
        default: 'report'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [{ value: 'get', label: 'Get' }],
        default: 'get'
      },
      {
        name: 'viewId',
        type: 'text',
        label: 'View ID',
        required: true
      },
      {
        name: 'metrics',
        type: 'text',
        label: 'Metrics',
        placeholder: 'ga:sessions,ga:users',
        required: true
      },
      {
        name: 'dimensions',
        type: 'text',
        label: 'Dimensions',
        placeholder: 'ga:date'
      },
      {
        name: 'dateRange',
        type: 'text',
        label: 'Date Range',
        default: '30daysAgo',
        placeholder: '30daysAgo'
      }
    ]
  },

  'Facebook': {
    category: 'Marketing',
    requiresCredentials: true,
    credentialType: 'facebook_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'post', label: 'Post' },
          { value: 'page', label: 'Page' }
        ],
        default: 'post'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'get', label: 'Get' }
        ],
        default: 'create'
      },
      {
        name: 'pageId',
        type: 'text',
        label: 'Page ID',
        required: true
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        showWhen: { resource: 'post', operation: 'create' }
      },
      {
        name: 'link',
        type: 'text',
        label: 'Link URL',
        showWhen: { resource: 'post', operation: 'create' }
      }
    ]
  },

  'Instagram': {
    category: 'Marketing',
    requiresCredentials: true,
    credentialType: 'instagram_api',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create Post' },
          { value: 'get', label: 'Get Post' }
        ],
        default: 'create'
      },
      {
        name: 'imageUrl',
        type: 'text',
        label: 'Image URL',
        required: true,
        showWhen: { operation: 'create' }
      },
      {
        name: 'caption',
        type: 'textarea',
        label: 'Caption',
        showWhen: { operation: 'create' }
      }
    ]
  },

  'Twitter': {
    category: 'Marketing',
    requiresCredentials: true,
    credentialType: 'twitter_api',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'post', label: 'Post Tweet' },
          { value: 'search', label: 'Search' }
        ],
        default: 'post'
      },
      {
        name: 'text',
        type: 'textarea',
        label: 'Tweet Text',
        required: true,
        showWhen: { operation: 'post' }
      },
      {
        name: 'query',
        type: 'text',
        label: 'Search Query',
        required: true,
        showWhen: { operation: 'search' }
      }
    ]
  },

  'LinkedIn': {
    category: 'Marketing',
    requiresCredentials: true,
    credentialType: 'linkedin_api',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create Post' },
          { value: 'get', label: 'Get Post' }
        ],
        default: 'create'
      },
      {
        name: 'text',
        type: 'textarea',
        label: 'Content',
        required: true,
        showWhen: { operation: 'create' }
      },
      {
        name: 'visibility',
        type: 'select',
        label: 'Visibility',
        options: [
          { value: 'PUBLIC', label: 'Public' },
          { value: 'CONNECTIONS', label: 'Connections Only' }
        ],
        default: 'PUBLIC',
        showWhen: { operation: 'create' }
      }
    ]
  },
  
  'Mailchimp': {
    category: 'Marketing',
    requiresCredentials: true,
    credentialType: 'mailchimp_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'member', label: 'Member' },
          { value: 'list', label: 'List' },
          { value: 'campaign', label: 'Campaign' }
        ],
        default: 'member',
        required: true
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create', showWhen: { resource: 'member' } },
          { value: 'update', label: 'Update', showWhen: { resource: 'member' } },
          { value: 'get', label: 'Get', showWhen: { resource: 'member' } },
          { value: 'delete', label: 'Delete', showWhen: { resource: 'member' } },
          { value: 'getAll', label: 'Get All', showWhen: { resource: ['list', 'campaign'] } }
        ],
        default: 'create',
        required: true
      },
      {
        name: 'listId',
        type: 'text',
        label: 'List ID',
        required: true,
        showWhen: { resource: 'member' }
      },
      {
        name: 'email',
        type: 'text',
        label: 'Email Address',
        required: true,
        placeholder: 'name@example.com',
        showWhen: { resource: 'member', operation: ['create', 'update', 'get', 'delete'] }
      },
      {
        name: 'status',
        type: 'select',
        label: 'Status',
        options: [
          { value: 'subscribed', label: 'Subscribed' },
          { value: 'unsubscribed', label: 'Unsubscribed' },
          { value: 'cleaned', label: 'Cleaned' },
          { value: 'pending', label: 'Pending' }
        ],
        default: 'subscribed',
        showWhen: { resource: 'member', operation: ['create', 'update'] }
      },
      {
        name: 'mergeFields',
        type: 'json',
        label: 'Merge Fields (JSON)',
        placeholder: '{"FNAME": "John", "LNAME": "Doe"}',
        showWhen: { resource: 'member', operation: ['create', 'update'] }
      }
    ]
  },

  'SendGrid': generateDefaultSchema('SendGrid', 'Marketing'),
  'Mixpanel': generateDefaultSchema('Mixpanel', 'Analytics'),

  // Cloud & Storage
  'AWS S3': {
    category: 'Cloud',
    requiresCredentials: true,
    credentialType: 'aws_s3',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'file', label: 'File' },
          { value: 'bucket', label: 'Bucket' }
        ],
        default: 'file'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'upload', label: 'Upload' },
          { value: 'download', label: 'Download' },
          { value: 'delete', label: 'Delete' },
          { value: 'list', label: 'List' }
        ],
        default: 'upload'
      },
      {
        name: 'bucketName',
        type: 'text',
        label: 'Bucket Name',
        required: true
      },
      {
        name: 'fileName',
        type: 'text',
        label: 'File Name',
        showWhen: { resource: 'file' }
      },
      {
        name: 'fileContent',
        type: 'text',
        label: 'File Content',
        showWhen: { resource: 'file', operation: 'upload' }
      }
    ]
  },

  'AWS Lambda': {
    category: 'Cloud',
    requiresCredentials: true,
    credentialType: 'aws_lambda',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [{ value: 'invoke', label: 'Invoke' }],
        default: 'invoke'
      },
      {
        name: 'functionName',
        type: 'text',
        label: 'Function Name',
        required: true
      },
      {
        name: 'payload',
        type: 'json',
        label: 'Payload (JSON)',
        placeholder: '{"key": "value"}'
      }
    ]
  },
  
  'Dropbox': {
    category: 'Cloud',
    requiresCredentials: true,
    credentialType: 'dropbox_api',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'upload', label: 'Upload' },
          { value: 'download', label: 'Download' },
          { value: 'list', label: 'List Folder' },
          { value: 'create', label: 'Create Folder' }
        ],
        default: 'upload'
      },
      {
        name: 'path',
        type: 'text',
        label: 'Path',
        placeholder: '/folder/file.txt',
        required: true
      },
      {
        name: 'fileContent',
        type: 'text',
        label: 'File Content',
        showWhen: { operation: 'upload' }
      }
    ]
  },

  'Box': generateDefaultSchema('Box', 'Cloud'),
  'OneDrive': generateDefaultSchema('OneDrive', 'Cloud'),

  // AI (beyond existing)
  'Anthropic': {
    category: 'AI',
    requiresCredentials: true,
    credentialType: 'anthropic_api',
    fields: [
      {
        name: 'model',
        type: 'select',
        label: 'Model',
        options: [
          { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
          { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
          { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
        ],
        default: 'claude-3-sonnet-20240229',
        required: true
      },
      {
        name: 'prompt',
        type: 'textarea',
        label: 'Prompt',
        required: true,
        rows: 6
      },
      {
        name: 'maxTokens',
        type: 'number',
        label: 'Max Tokens',
        default: 1024
      },
      {
        name: 'temperature',
        type: 'slider',
        label: 'Temperature',
        min: 0,
        max: 1,
        step: 0.1,
        default: 0.7
      }
    ]
  },

  'Google PaLM': {
    category: 'AI',
    requiresCredentials: true,
    credentialType: 'google_palm_api',
    fields: [
      {
        name: 'model',
        type: 'text',
        label: 'Model',
        default: 'models/text-bison-001'
      },
      {
        name: 'prompt',
        type: 'textarea',
        label: 'Prompt',
        required: true
      }
    ]
  },

  'Hugging Face': {
    category: 'AI',
    requiresCredentials: true,
    credentialType: 'huggingface_api',
    fields: [
      {
        name: 'model',
        type: 'text',
        label: 'Model ID',
        placeholder: 'gpt2',
        required: true
      },
      {
        name: 'inputs',
        type: 'text',
        label: 'Input Text',
        required: true
      }
    ]
  },

  'AI Transform': {
    category: 'AI',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'summarize', label: 'Summarize' },
          { value: 'extract', label: 'Extract Info' },
          { value: 'translate', label: 'Translate' }
        ],
        default: 'summarize'
      },
      {
        name: 'text',
        type: 'textarea',
        label: 'Input Text',
        required: true
      }
    ]
  },

  // Utilities
  'Date & Time': {
    category: 'Utilities',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'format', label: 'Format Date' },
          { value: 'add', label: 'Add Time' },
          { value: 'subtract', label: 'Subtract Time' },
          { value: 'diff', label: 'Get Difference' }
        ],
        default: 'format',
        required: true
      },
      {
        name: 'value',
        type: 'text',
        label: 'Date Value',
        placeholder: '={{ $now }}',
        supportsVariables: true,
        required: true
      },
      {
        name: 'format',
        type: 'text',
        label: 'Format',
        default: 'YYYY-MM-DD HH:mm:ss',
        showWhen: { operation: 'format' }
      }
    ]
  },

  'Set': {
    category: 'Utilities',
    fields: [
      {
        name: 'values',
        type: 'keyValue',
        label: 'Values to Set',
        description: 'Set key-value pairs'
      },
      {
        name: 'keepOnlySet',
        type: 'checkbox',
        label: 'Keep Only Set',
        default: false,
        description: 'If true, all other values will be removed'
      }
    ]
  },

  'Crypto': {
    category: 'Utilities',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'encrypt', label: 'Encrypt' },
          { value: 'decrypt', label: 'Decrypt' },
          { value: 'hash', label: 'Hash' }
        ],
        default: 'hash',
        required: true
      },
      {
        name: 'data',
        type: 'text',
        label: 'Data',
        required: true,
        supportsVariables: true
      }
    ]
  },

  // Additional Services
  'Calendly': {
    category: 'Scheduling',
    requiresCredentials: true,
    credentialType: 'calendly_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [{ value: 'scheduled_events', label: 'Scheduled Events' }],
        default: 'scheduled_events'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [{ value: 'getAll', label: 'Get All' }],
        default: 'getAll'
      }
    ]
  },

  'Typeform': {
    category: 'Forms',
    requiresCredentials: true,
    credentialType: 'typeform_api',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [{ value: 'getAll', label: 'Get Responses' }],
        default: 'getAll'
      },
      {
        name: 'formId',
        type: 'text',
        label: 'Form ID',
        required: true
      }
    ]
  },

  'Zoom': {
    category: 'Video',
    requiresCredentials: true,
    credentialType: 'zoom_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [{ value: 'meeting', label: 'Meeting' }],
        default: 'meeting'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'getAll', label: 'Get All' }
        ],
        default: 'create'
      },
      {
        name: 'topic',
        type: 'text',
        label: 'Topic',
        showWhen: { operation: 'create' }
      }
    ]
  },

  'Spotify': {
    category: 'Music',
    requiresCredentials: true,
    credentialType: 'spotify_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [
          { value: 'player', label: 'Player' },
          { value: 'playlist', label: 'Playlist' }
        ],
        default: 'player'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'pause', label: 'Pause' },
          { value: 'start', label: 'Start/Resume' },
          { value: 'next', label: 'Next Track' },
          { value: 'previous', label: 'Previous Track' }
        ],
        default: 'next'
      }
    ]
  },

  'YouTube': {
    category: 'Video',
    requiresCredentials: true,
    credentialType: 'youtube_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [{ value: 'video', label: 'Video' }],
        default: 'video'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'upload', label: 'Upload' },
          { value: 'update', label: 'Update' },
          { value: 'delete', label: 'Delete' }
        ],
        default: 'upload'
      },
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        required: true
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description'
      }
    ]
  },

  'WordPress': {
    category: 'CMS',
    requiresCredentials: true,
    credentialType: 'wordpress_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [{ value: 'post', label: 'Post' }],
        default: 'post'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'getAll', label: 'Get All' }
        ],
        default: 'create'
      },
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        required: true,
        showWhen: { operation: 'create' }
      },
      {
        name: 'content',
        type: 'textarea',
        label: 'Content',
        showWhen: { operation: 'create' }
      }
    ]
  },

  'Webflow': {
    category: 'CMS',
    requiresCredentials: true,
    credentialType: 'webflow_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [{ value: 'item', label: 'Item' }],
        default: 'item'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'update', label: 'Update' },
          { value: 'delete', label: 'Delete' }
        ],
        default: 'create'
      },
      {
        name: 'collectionId',
        type: 'text',
        label: 'Collection ID',
        required: true
      }
    ]
  },

  'Contentful': {
    category: 'CMS',
    requiresCredentials: true,
    credentialType: 'contentful_api',
    fields: [
      {
        name: 'resource',
        type: 'select',
        label: 'Resource',
        options: [{ value: 'entry', label: 'Entry' }],
        default: 'entry'
      },
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'create', label: 'Create' },
          { value: 'get', label: 'Get' }
        ],
        default: 'create'
      },
      {
        name: 'contentTypeId',
        type: 'text',
        label: 'Content Type ID',
        required: true
      }
    ]
  },

  'Algolia': {
    category: 'Search',
    requiresCredentials: true,
    credentialType: 'algolia_api',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'search', label: 'Search' },
          { value: 'index', label: 'Index Object' }
        ],
        default: 'search'
      },
      {
        name: 'index',
        type: 'text',
        label: 'Index Name',
        required: true
      },
      {
        name: 'query',
        type: 'text',
        label: 'Query',
        showWhen: { operation: 'search' }
      }
    ]
  },

  'XML': {
    category: 'Utilities',
    fields: [
      {
        name: 'mode',
        type: 'select',
        label: 'Mode',
        options: [
          { value: 'jsonToXml', label: 'JSON to XML' },
          { value: 'xmlToJson', label: 'XML to JSON' }
        ],
        default: 'xmlToJson',
        required: true
      },
      {
        name: 'property',
        type: 'text',
        label: 'Property Name',
        placeholder: 'data',
        required: true,
        description: 'Name of the property to process'
      }
    ]
  },

  'JSON': {
    category: 'Utilities',
    fields: [
      {
        name: 'mode',
        type: 'select',
        label: 'Mode',
        options: [
          { value: 'stringToJson', label: 'String to JSON' },
          { value: 'jsonToString', label: 'JSON to String' }
        ],
        default: 'stringToJson',
        required: true
      },
      {
        name: 'property',
        type: 'text',
        label: 'Property Name',
        placeholder: 'data',
        required: true
      }
    ]
  },

  'HTML Extract': {
    category: 'Utilities',
    fields: [
      {
        name: 'sourceData',
        type: 'select',
        label: 'Source Data',
        options: [
          { value: 'json', label: 'JSON Property' },
          { value: 'binary', label: 'Binary File' }
        ],
        default: 'json'
      },
      {
        name: 'property',
        type: 'text',
        label: 'Property Name',
        placeholder: 'data',
        required: true
      },
      {
        name: 'extractionValues',
        type: 'json',
        label: 'Extraction Values (JSON)',
        placeholder: '[{"key": "title", "cssSelector": "h1", "value": "text"}]',
        description: 'Define what to extract using CSS selectors'
      }
    ]
  },

  'Compression': {
    category: 'Utilities',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'compress', label: 'Compress' },
          { value: 'decompress', label: 'Decompress' }
        ],
        default: 'compress'
      },
      {
        name: 'binaryProperty',
        type: 'text',
        label: 'Binary Property',
        default: 'data',
        required: true
      },
      {
        name: 'format',
        type: 'select',
        label: 'Output Format',
        options: [
          { value: 'gzip', label: 'Gzip' },
          { value: 'zip', label: 'Zip' }
        ],
        default: 'gzip'
      }
    ]
  }
};

// Merge base schemas with additional schemas
export const nodeSchemas = {
  ...baseSchemas,
  ...additionalSchemas
};

/**
 * Get schema for a specific node type
 * Falls back to generated default if not explicitly defined
 */
export function getNodeSchema(nodeType) {
  if (nodeSchemas[nodeType]) {
    return nodeSchemas[nodeType];
  }
  
  // Generate default schema for unknown nodes
  return generateDefaultSchema(nodeType, 'Other');
}

/**
 * Check if node type requires credentials
 */
export function requiresCredentials(nodeType) {
  const schema = getNodeSchema(nodeType);
  return schema.requiresCredentials === true;
}

/**
 * Get credential type for a node
 */
export function getCredentialType(nodeType) {
  const schema = getNodeSchema(nodeType);
  return schema.credentialType || null;
}

/**
 * Get all available node types with schemas
 */
export function getAllNodeTypes() {
  return Object.keys(nodeSchemas);
}

/**
 * Check if a node type has a custom schema
 */
export function hasCustomSchema(nodeType) {
  return nodeSchemas.hasOwnProperty(nodeType);
}
