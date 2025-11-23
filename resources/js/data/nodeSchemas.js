/**
 * Node Configuration Schemas
 * 
 * Defines the configuration fields for each node type.
 * Used by NodeSettingsPanel to dynamically render configuration forms.
 */

export const nodeSchemas = {
  'RSS Feed': {
    category: 'Data',
    fields: [
      {
        name: 'url',
        type: 'text',
        label: 'Feed URL',
        placeholder: 'https://example.com/feed.xml',
        required: true,
        description: 'URL of the RSS/Atom feed to monitor'
      },
      {
        name: 'pollInterval',
        type: 'number',
        label: 'Poll Interval (minutes)',
        default: 60,
        min: 1,
        description: 'How often to check for new items'
      }
    ]
  },

  'OpenAI': {
    category: 'AI',
    requiresCredentials: true,
    credentialType: 'openai_api',
    fields: [
      {
        name: 'model',
        type: 'select',
        label: 'Model',
        options: [
          { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast & Cheap)' },
          { value: 'gpt-4o', label: 'GPT-4o (Most Capable)' },
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Legacy)' }
        ],
        default: 'gpt-4o-mini',
        required: true
      },
      {
        name: 'temperature',
        type: 'slider',
        label: 'Temperature',
        min: 0,
        max: 1,
        step: 0.1,
        default: 0.7,
        description: 'Controls randomness. Lower = more focused, Higher = more creative'
      },
      {
        name: 'maxTokens',
        type: 'number',
        label: 'Max Tokens',
        default: 1000,
        min: 1,
        max: 4000,
        description: 'Maximum length of the response'
      },
      {
        name: 'systemMessage',
        type: 'textarea',
        label: 'System Message',
        placeholder: 'You are a helpful assistant.',
        rows: 3,
        description: 'Instructions for the AI model'
      },
      {
        name: 'prompt',
        type: 'textarea',
        label: 'User Prompt',
        placeholder: 'Analyze this data: {{ $json }}',
        rows: 5,
        required: true,
        supportsVariables: true,
        description: 'The prompt to send. Use {{ $json }} for previous node data.'
      }
    ]
  },

  'Gmail': {
    category: 'Communication',
    requiresCredentials: true,
    credentialType: 'gmail_oauth2',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'send', label: 'Send Email' },
          { value: 'sendReply', label: 'Send Reply' },
          { value: 'getAll', label: 'Get All Emails' }
        ],
        default: 'send',
        required: true
      },
      {
        name: 'to',
        type: 'text',
        label: 'To',
        placeholder: 'recipient@example.com',
        required: true,
        supportsVariables: true,
        showWhen: { operation: ['send', 'sendReply'] }
      },
      {
        name: 'subject',
        type: 'text',
        label: 'Subject',
        placeholder: 'Email subject',
        required: true,
        supportsVariables: true,
        showWhen: { operation: ['send', 'sendReply'] }
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Email body...',
        rows: 8,
        required: true,
        supportsVariables: true,
        showWhen: { operation: ['send', 'sendReply'] }
      },
      {
        name: 'cc',
        type: 'text',
        label: 'CC',
        placeholder: 'cc@example.com',
        supportsVariables: true,
        showWhen: { operation: ['send'] }
      },
      {
        name: 'bcc',
        type: 'text',
        label: 'BCC',
        placeholder: 'bcc@example.com',
        supportsVariables: true,
        showWhen: { operation: ['send'] }
      }
    ]
  },

  'Schedule': {
    category: 'Trigger',
    fields: [
      {
        name: 'triggerType',
        type: 'select',
        label: 'Trigger Type',
        options: [
          { value: 'interval', label: 'Interval' },
          { value: 'cron', label: 'Cron Expression' }
        ],
        default: 'interval',
        required: true
      },
      {
        name: 'intervalValue',
        type: 'number',
        label: 'Interval Value',
        default: 1,
        min: 1,
        showWhen: { triggerType: 'interval' }
      },
      {
        name: 'intervalUnit',
        type: 'select',
        label: 'Interval Unit',
        options: [
          { value: 'minutes', label: 'Minutes' },
          { value: 'hours', label: 'Hours' },
          { value: 'days', label: 'Days' }
        ],
        default: 'hours',
        showWhen: { triggerType: 'interval' }
      },
      {
        name: 'cronExpression',
        type: 'text',
        label: 'Cron Expression',
        placeholder: '0 9 * * *',
        description: 'Example: "0 9 * * *" runs daily at 9 AM',
        showWhen: { triggerType: 'cron' }
      }
    ]
  },

  'IF': {
    category: 'Flow Control',
    fields: [
      {
        name: 'conditionMode',
        type: 'select',
        label: 'Mode',
        options: [
          { value: 'all', label: 'All conditions must be true (AND)' },
          { value: 'any', label: 'Any condition can be true (OR)' }
        ],
        default: 'all',
        required: true
      },
      {
        name: 'conditions',
        type: 'conditions',
        label: 'Conditions',
        description: 'Define conditions to evaluate',
        defaultCondition: {
          value1: '={{ $json.status }}',
          operation: 'equal',
          value2: 'active'
        }
      }
    ]
  },

  'HTTP Request': {
    category: 'Data',
    fields: [
      {
        name: 'method',
        type: 'select',
        label: 'Method',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' },
          { value: 'PATCH', label: 'PATCH' }
        ],
        default: 'GET',
        required: true
      },
      {
        name: 'url',
        type: 'text',
        label: 'URL',
        placeholder: 'https://api.example.com/endpoint',
        required: true,
        supportsVariables: true
      },
      {
        name: 'authentication',
        type: 'select',
        label: 'Authentication',
        options: [
          { value: 'none', label: 'None' },
          { value: 'basic', label: 'Basic Auth' },
          { value: 'bearer', label: 'Bearer Token' },
          { value: 'apiKey', label: 'API Key' }
        ],
        default: 'none'
      },
      {
        name: 'bodyContentType',
        type: 'select',
        label: 'Body Content Type',
        options: [
          { value: 'json', label: 'JSON' },
          { value: 'form-urlencoded', label: 'Form-Urlencoded' },
          { value: 'form-data', label: 'Form-Data' },
          { value: 'raw', label: 'Raw' }
        ],
        default: 'json',
        showWhen: { method: ['POST', 'PUT', 'PATCH'] }
      },
      {
        name: 'jsonBody',
        type: 'json',
        label: 'JSON Body',
        placeholder: '{"key": "value"}',
        supportsVariables: true,
        showWhen: { method: ['POST', 'PUT', 'PATCH'], bodyContentType: 'json' }
      },
      {
        name: 'headers',
        type: 'keyValue',
        label: 'Headers',
        description: 'Request headers'
      },
      {
        name: 'queryParameters',
        type: 'keyValue',
        label: 'Query Parameters',
        description: 'URL query parameters'
      },
      {
        name: 'responseFormat',
        type: 'select',
        label: 'Response Format',
        options: [
          { value: 'json', label: 'JSON' },
          { value: 'string', label: 'String' },
          { value: 'file', label: 'File' }
        ],
        default: 'json'
      }
    ]
  },

  'Slack': {
    category: 'Communication',
    requiresCredentials: true,
    credentialType: 'slack_oauth2',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'post', label: 'Post Message' },
          { value: 'update', label: 'Update Message' }
        ],
        default: 'post',
        required: true
      },
      {
        name: 'channel',
        type: 'text',
        label: 'Channel',
        placeholder: '#general',
        required: true,
        description: 'Channel name or ID'
      },
      {
        name: 'text',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Your message here...',
        rows: 5,
        required: true,
        supportsVariables: true
      },
      {
        name: 'username',
        type: 'text',
        label: 'Bot Username',
        placeholder: 'n8n Bot',
        default: 'Workflow Bot'
      },
      {
        name: 'icon_emoji',
        type: 'text',
        label: 'Icon Emoji',
        placeholder: ':robot_face:',
        description: 'Bot icon (emoji code)'
      }
    ]
  },

  'Code': {
    category: 'Transform',
    fields: [
      {
        name: 'language',
        type: 'select',
        label: 'Language',
        options: [
          { value: 'javascript', label: 'JavaScript' },
          { value: 'python', label: 'Python' }
        ],
        default: 'javascript',
        required: true
      },
      {
        name: 'code',
        type: 'code',
        label: 'Code',
        placeholder: 'return items;',
        rows: 15,
        required: true,
        description: 'Transform input items and return result'
      },
      {
        name: 'mode',
        type: 'select',
        label: 'Mode',
        options: [
          { value: 'runOnceForAllItems', label: 'Run Once for All Items' },
          { value: 'runOnceForEachItem', label: 'Run Once for Each Item' }
        ],
        default: 'runOnceForAllItems'
      }
    ]
  },

  'MySQL': {
    category: 'Database',
    requiresCredentials: true,
    credentialType: 'mysql',
    fields: [
      {
        name: 'operation',
        type: 'select',
        label: 'Operation',
        options: [
          { value: 'executeQuery', label: 'Execute Query' },
          { value: 'insert', label: 'Insert' },
          { value: 'update', label: 'Update' },
          { value: 'delete', label: 'Delete' }
        ],
        default: 'executeQuery',
        required: true
      },
      {
        name: 'query',
        type: 'textarea',
        label: 'SQL Query',
        placeholder: 'SELECT * FROM users WHERE id = ?',
        rows: 8,
        required: true,
        supportsVariables: true,
        description: 'SQL query to execute. Use ? for parameters.'
      }
    ]
  }
};

/**
 * Get schema for a specific node type
 */
export function getNodeSchema(nodeType) {
  return nodeSchemas[nodeType] || {
    category: 'Other',
    fields: []
  };
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
