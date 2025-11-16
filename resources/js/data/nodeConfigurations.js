// Comprehensive node configurations based on actual n8n repository
// Each node type has unique parameters matching n8n's implementation

export const nodeConfigurations = {
    // ========== CORE NODES ==========
    'HTTP Request': {
        inputs: [
            { type: 'main', required: false } // Can be triggered or have input data
        ],
        outputs: [
            { type: 'main', label: 'Success' }, // Main response output
            { type: 'main', label: 'Error' }    // Error output
        ],
        sections: [
            {
                title: 'Request',
                fields: [
                    { 
                        name: 'method', 
                        label: 'Method', 
                        type: 'select', 
                        options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'], 
                        default: 'GET',
                        description: 'The request method to use'
                    },
                    { 
                        name: 'url', 
                        label: 'URL', 
                        type: 'text', 
                        placeholder: 'https://api.example.com/endpoint',
                        description: 'The URL to make the request to',
                        required: true
                    },
                    { 
                        name: 'authentication', 
                        label: 'Authentication', 
                        type: 'select', 
                        options: ['None', 'Basic Auth', 'OAuth2', 'Header Auth', 'API Key', 'Bearer Token'], 
                        default: 'None' 
                    },
                ]
            },
            {
                title: 'Query Parameters',
                fields: [
                    { 
                        name: 'sendQuery', 
                        label: 'Send Query Parameters', 
                        type: 'checkbox', 
                        default: false 
                    },
                    { 
                        name: 'queryParameters', 
                        label: 'Parameters', 
                        type: 'json', 
                        placeholder: '{"param1": "value1", "param2": "value2"}' 
                    },
                ]
            },
            {
                title: 'Headers',
                fields: [
                    { 
                        name: 'sendHeaders', 
                        label: 'Send Headers', 
                        type: 'checkbox', 
                        default: false 
                    },
                    { 
                        name: 'headerParameters', 
                        label: 'Header Parameters', 
                        type: 'json', 
                        placeholder: '{"Content-Type": "application/json"}' 
                    },
                ]
            },
            {
                title: 'Body',
                fields: [
                    { 
                        name: 'sendBody', 
                        label: 'Send Body', 
                        type: 'checkbox', 
                        default: false 
                    },
                    { 
                        name: 'contentType', 
                        label: 'Body Content Type', 
                        type: 'select', 
                        options: ['JSON', 'Form Urlencoded', 'Form-Data', 'Raw', 'Binary'], 
                        default: 'JSON' 
                    },
                    { 
                        name: 'jsonBody', 
                        label: 'JSON Body', 
                        type: 'code', 
                        language: 'json', 
                        rows: 8,
                        placeholder: '{\n  "key": "value"\n}' 
                    },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { name: 'timeout', label: 'Timeout (ms)', type: 'number', min: 0, default: 10000 },
                    { name: 'redirect', label: 'Follow Redirects', type: 'checkbox', default: true },
                    { name: 'ignoreSSL', label: 'Ignore SSL Issues', type: 'checkbox', default: false },
                ]
            }
        ]
    },

    'Webhook': {
        inputs: [], // No inputs - this is a trigger
        outputs: [
            { type: 'main', label: 'Response' } // Main output for webhook data
        ],
        sections: [
            {
                title: 'Webhook Configuration',
                fields: [
                    { 
                        name: 'path', 
                        label: 'Path', 
                        type: 'text', 
                        placeholder: '/webhook/unique-path',
                        description: 'The webhook URL path',
                        default: `/webhook/${Date.now()}`
                    },
                    { 
                        name: 'httpMethod', 
                        label: 'HTTP Method', 
                        type: 'select', 
                        options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'], 
                        default: 'POST' 
                    },
                    { 
                        name: 'responseMode', 
                        label: 'Response Mode', 
                        type: 'select', 
                        options: ['On Received', 'Last Node', 'When Last Node Finishes'], 
                        default: 'On Received',
                        description: 'When to return the response to the webhook caller'
                    },
                ]
            },
            {
                title: 'Response',
                fields: [
                    { 
                        name: 'responseCode', 
                        label: 'Response Code', 
                        type: 'number', 
                        min: 100, 
                        max: 599,
                        default: 200 
                    },
                    { 
                        name: 'responseData', 
                        label: 'Response Data', 
                        type: 'code', 
                        language: 'json', 
                        placeholder: '{"status": "received", "message": "OK"}' 
                    },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { name: 'authentication', label: 'Authentication', type: 'select', options: ['None', 'Basic Auth', 'Header Auth'], default: 'None' },
                ]
            }
        ]
    },

    'Code': {
        inputs: [
            { type: 'main', required: true } // Requires input data
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Processed data output
        ],
        sections: [
            {
                title: 'Code Configuration',
                fields: [
                    { 
                        name: 'mode', 
                        label: 'Mode', 
                        type: 'select', 
                        options: ['Run Once for All Items', 'Run Once for Each Item'], 
                        default: 'Run Once for All Items',
                        description: 'How the code should be executed'
                    },
                    { 
                        name: 'language', 
                        label: 'Language', 
                        type: 'select', 
                        options: ['JavaScript', 'Python'], 
                        default: 'JavaScript' 
                    },
                    { 
                        name: 'code', 
                        label: 'JavaScript Code', 
                        type: 'code', 
                        language: 'javascript', 
                        rows: 15, 
                        placeholder: '// The code here will run once for all input items\n// Access items using $input.all()\n\nfor (const item of $input.all()) {\n  item.json.myNewField = 1;\n}\n\nreturn $input.all();' 
                    },
                ]
            }
        ]
    },

    // ========== FLOW NODES ==========
    'IF': {
        inputs: [
            { type: 'main', required: true } // Requires input data to evaluate conditions
        ],
        outputs: [
            { type: 'main', label: 'True' },  // Data flows here if condition is true
            { type: 'main', label: 'False' }  // Data flows here if condition is false
        ],
        sections: [
            {
                title: 'Conditions',
                fields: [
                    { 
                        name: 'conditions', 
                        label: 'Conditions', 
                        type: 'select', 
                        options: ['AND (all must be true)', 'OR (any can be true)'], 
                        default: 'AND (all must be true)',
                        description: 'How to combine multiple conditions'
                    },
                    { 
                        name: 'value1', 
                        label: 'Value 1', 
                        type: 'text', 
                        placeholder: '{{ $json.status }}' 
                    },
                    { 
                        name: 'operation', 
                        label: 'Operation', 
                        type: 'select', 
                        options: [
                            'Equal', 
                            'Not Equal', 
                            'Contains', 
                            'Does Not Contain',
                            'Starts With', 
                            'Ends With',
                            'Regex Match',
                            'Is Empty',
                            'Is Not Empty',
                            'Greater Than', 
                            'Less Than',
                            'Greater Than or Equal',
                            'Less Than or Equal'
                        ], 
                        default: 'Equal' 
                    },
                    { 
                        name: 'value2', 
                        label: 'Value 2', 
                        type: 'text', 
                        placeholder: 'comparison value' 
                    },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { 
                        name: 'fallbackOutput', 
                        label: 'Fallback Output', 
                        type: 'select', 
                        options: ['False', 'Extra Output'],
                        default: 'False',
                        description: 'What to do when no condition matches'
                    },
                ]
            }
        ]
    },

    'Switch': {
        inputs: [
            { type: 'main', required: true } // Requires input data to evaluate conditions
        ],
        outputs: [
            { type: 'main', label: 'Output 0' }, // First output
            { type: 'main', label: 'Output 1' }, // Second output
            { type: 'main', label: 'Output 2' }, // Third output
            { type: 'main', label: 'Output 3' }, // Fourth output
            { type: 'main', label: 'Output 4' }  // Fifth output
        ],
        sections: [
            {
                title: 'Switch Configuration',
                fields: [
                    { 
                        name: 'mode', 
                        label: 'Mode', 
                        type: 'select', 
                        options: ['Rules', 'Expression'], 
                        default: 'Rules' 
                    },
                    { 
                        name: 'output', 
                        label: 'Output', 
                        type: 'select', 
                        options: ['Route Items to Separate Outputs', 'Send All Items to Single Output'], 
                        default: 'Route Items to Separate Outputs' 
                    },
                ]
            },
            {
                title: 'Rules',
                fields: [
                    { 
                        name: 'rules', 
                        label: 'Rules', 
                        type: 'json', 
                        placeholder: '[\n  {"output": 0, "condition": "{{ $json.value > 10 }}"}\n]' 
                    },
                ]
            }
        ]
    },

    'Merge': {
        inputs: [
            { type: 'main', required: true, label: 'Input 1' },
            { type: 'main', required: false, label: 'Input 2' }
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Merged data output
        ],
        sections: [
            {
                title: 'Merge Configuration',
                fields: [
                    { 
                        name: 'mode', 
                        label: 'Mode', 
                        type: 'select', 
                        options: ['Append', 'Combine', 'Choose Branch', 'Combine By Key', 'Combine By Position', 'Multiplex'], 
                        default: 'Append',
                        description: 'How to merge data from multiple inputs'
                    },
                    { 
                        name: 'mergeByFields', 
                        label: 'Merge By Fields', 
                        type: 'json', 
                        placeholder: '{"input1": "id", "input2": "userId"}' 
                    },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { 
                        name: 'fuzzyCompare', 
                        label: 'Fuzzy Compare', 
                        type: 'checkbox', 
                        default: false 
                    },
                ]
            }
        ]
    },

    // ========== COMMUNICATION NODES ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { 
                        name: 'credential', 
                        label: 'Credential', 
                        type: 'credential', 
                        credentialType: 'slackApi' 
                    },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { 
                        name: 'resource', 
                        label: 'Resource', 
                        type: 'select', 
                        options: ['Channel', 'Message', 'File', 'Reaction', 'User', 'User Group'], 
                        default: 'Message' 
                    },
                    { 
                        name: 'operation', 
                        label: 'Operation', 
                        type: 'select', 
                        options: ['Post', 'Update', 'Delete', 'Get', 'Get Many'], 
                        default: 'Post' 
                    },
                ]
            },
            {
                title: 'Message',
                fields: [
                    { 
                        name: 'channel', 
                        label: 'Channel', 
                        type: 'text', 
                        placeholder: '#general',
                        description: 'Channel name or ID' 
                    },
                    { 
                        name: 'text', 
                        label: 'Message Text', 
                        type: 'textarea', 
                        rows: 4, 
                        placeholder: 'Enter your message...' 
                    },
                    { 
                        name: 'username', 
                        label: 'Bot Name', 
                        type: 'text', 
                        placeholder: 'n8n Bot' 
                    },
                    { 
                        name: 'icon_emoji', 
                        label: 'Icon Emoji', 
                        type: 'text', 
                        placeholder: ':robot_face:' 
                    },
                ]
            },
            {
                title: 'Attachments & Blocks',
                fields: [
                    { 
                        name: 'sendAsBlock', 
                        label: 'Send as Block', 
                        type: 'checkbox', 
                        default: false 
                    },
                    { 
                        name: 'blocks', 
                        label: 'Blocks', 
                        type: 'code', 
                        language: 'json',
                        rows: 8,
                        placeholder: '[\n  {\n    "type": "section",\n    "text": {\n      "type": "mrkdwn",\n      "text": "Your message here"\n    }\n  }\n]' 
                    },
                    { 
                        name: 'attachments', 
                        label: 'Attachments', 
                        type: 'code', 
                        language: 'json',
                        placeholder: '[]' 
                    },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { name: 'linkNames', label: 'Link Names', type: 'checkbox', default: false },
                    { name: 'unfurlLinks', label: 'Unfurl Links', type: 'checkbox', default: false },
                    { name: 'unfurlMedia', label: 'Unfurl Media', type: 'checkbox', default: true },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { 
                        name: 'credential', 
                        label: 'Gmail OAuth2', 
                        type: 'credential', 
                        credentialType: 'gmailOAuth2' 
                    },
                ]
            },
            {
                title: 'Email',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Draft', 'Message', 'Label'], default: 'Message' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Send', 'Get', 'Get Many', 'Delete', 'Mark as Read', 'Mark as Unread'], default: 'Send' },
                    { name: 'to', label: 'To', type: 'text', placeholder: 'user@example.com' },
                    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Email subject' },
                    { name: 'message', label: 'Message', type: 'textarea', rows: 8, placeholder: 'Email body...' },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { name: 'cc', label: 'CC', type: 'text', placeholder: 'user@example.com' },
                    { name: 'bcc', label: 'BCC', type: 'text', placeholder: 'user@example.com' },
                    { name: 'attachments', label: 'Attachments', type: 'text', placeholder: 'Binary data field names' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'webhookUrl', label: 'Webhook URL', type: 'password', placeholder: 'https://discord.com/api/webhooks/...' },
                ]
            },
            {
                title: 'Message',
                fields: [
                    { name: 'content', label: 'Content', type: 'textarea', rows: 6, placeholder: 'Message content...' },
                    { name: 'username', label: 'Username', type: 'text', placeholder: 'Bot Name' },
                    { name: 'avatarUrl', label: 'Avatar URL', type: 'text', placeholder: 'https://...' },
                ]
            },
            {
                title: 'Embeds',
                fields: [
                    { name: 'embeds', label: 'Embeds', type: 'code', language: 'json', rows: 8, placeholder: '[\n  {\n    "title": "Embed Title",\n    "description": "Embed Description",\n    "color": 3447003\n  }\n]' },
                ]
            }
        ]
    },

    // ========== AI NODES ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { 
                        name: 'apiKey', 
                        label: 'API Key', 
                        type: 'password', 
                        placeholder: 'sk-...',
                        description: 'Your OpenAI API key' 
                    },
                ]
            },
            {
                title: 'Model Configuration',
                fields: [
                    { 
                        name: 'resource', 
                        label: 'Resource', 
                        type: 'select', 
                        options: ['Chat', 'Text Completion', 'Image', 'Audio', 'Embeddings'], 
                        default: 'Chat' 
                    },
                    { 
                        name: 'model', 
                        label: 'Model', 
                        type: 'select', 
                        options: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k'], 
                        default: 'gpt-4o-mini' 
                    },
                    { 
                        name: 'temperature', 
                        label: 'Temperature', 
                        type: 'number', 
                        min: 0, 
                        max: 2, 
                        step: 0.1, 
                        default: 0.7,
                        description: 'Controls randomness (0-2)' 
                    },
                    { 
                        name: 'maxTokens', 
                        label: 'Max Tokens', 
                        type: 'number', 
                        min: 1, 
                        max: 16000, 
                        default: 1000,
                        description: 'Maximum length of the response' 
                    },
                ]
            },
            {
                title: 'Messages',
                fields: [
                    { 
                        name: 'systemMessage', 
                        label: 'System Message', 
                        type: 'textarea', 
                        rows: 3, 
                        placeholder: 'You are a helpful assistant...',
                        description: 'Set the behavior of the assistant' 
                    },
                    { 
                        name: 'prompt', 
                        label: 'User Message / Prompt', 
                        type: 'code', 
                        language: 'text', 
                        rows: 8, 
                        placeholder: 'Enter your prompt here...' 
                    },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { name: 'topP', label: 'Top P', type: 'number', min: 0, max: 1, step: 0.1, default: 1 },
                    { name: 'frequencyPenalty', label: 'Frequency Penalty', type: 'number', min: -2, max: 2, step: 0.1, default: 0 },
                    { name: 'presencePenalty', label: 'Presence Penalty', type: 'number', min: -2, max: 2, step: 0.1, default: 0 },
                    { name: 'jsonMode', label: 'JSON Response Format', type: 'checkbox', default: false },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-ant-...' },
                ]
            },
            {
                title: 'Model Configuration',
                fields: [
                    { name: 'model', label: 'Model', type: 'select', options: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'], default: 'claude-3-5-sonnet-20241022' },
                    { name: 'temperature', label: 'Temperature', type: 'number', min: 0, max: 1, step: 0.1, default: 1 },
                    { name: 'maxTokens', label: 'Max Tokens', type: 'number', min: 1, max: 4096, default: 1024 },
                ]
            },
            {
                title: 'Messages',
                fields: [
                    { name: 'systemMessage', label: 'System Message', type: 'textarea', rows: 3, placeholder: 'You are a helpful assistant...' },
                    { name: 'prompt', label: 'User Message', type: 'code', language: 'text', rows: 8, placeholder: 'Enter your prompt here...' },
                ]
            }
        ]
    },

    // ========== DATABASE NODES ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Connection',
                fields: [
                    { name: 'credential', label: 'Credentials', type: 'credential', credentialType: 'mysql' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Execute Query', 'Insert', 'Update', 'Delete', 'Select'], default: 'Execute Query' },
                    { name: 'query', label: 'Query', type: 'code', language: 'sql', rows: 8, placeholder: 'SELECT * FROM users WHERE id = ?' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Connection',
                fields: [
                    { name: 'credential', label: 'Credentials', type: 'credential', credentialType: 'postgres' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Execute Query', 'Insert', 'Update', 'Delete', 'Select'], default: 'Execute Query' },
                    { name: 'query', label: 'Query', type: 'code', language: 'sql', rows: 8, placeholder: 'SELECT * FROM users WHERE id = $1' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Connection',
                fields: [
                    { name: 'credential', label: 'Credentials', type: 'credential', credentialType: 'mongoDb' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Find', 'Insert', 'Update', 'Delete', 'Aggregate'], default: 'Find' },
                    { name: 'collection', label: 'Collection', type: 'text', placeholder: 'users' },
                    { name: 'query', label: 'Query', type: 'code', language: 'json', rows: 6, placeholder: '{"_id": "{{ $json.id }}"}' },
                ]
            }
        ]
    },

    // ========== PRODUCTIVITY NODES ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Google OAuth2', type: 'credential', credentialType: 'googleSheetsOAuth2' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Spreadsheet', 'Sheet'], default: 'Sheet' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Append', 'Clear', 'Create', 'Delete', 'Get', 'Update'], default: 'Append' },
                    { name: 'spreadsheetId', label: 'Spreadsheet ID', type: 'text', placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms' },
                    { name: 'range', label: 'Range', type: 'text', placeholder: 'Sheet1!A1:Z999' },
                ]
            },
            {
                title: 'Data',
                fields: [
                    { name: 'dataMode', label: 'Data Mode', type: 'select', options: ['Auto-Map Columns', 'Define Below', 'Raw'], default: 'Auto-Map Columns' },
                    { name: 'data', label: 'Data', type: 'code', language: 'json', rows: 6, placeholder: '[["Name", "Email"], ["John", "john@example.com"]]' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Notion API', type: 'credential', credentialType: 'notionApi' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Database', 'Page', 'Block'], default: 'Database' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Get', 'Get All', 'Create', 'Update', 'Delete', 'Search'], default: 'Get' },
                    { name: 'databaseId', label: 'Database ID', type: 'text', placeholder: 'abc123...' },
                ]
            },
            {
                title: 'Properties',
                fields: [
                    { name: 'properties', label: 'Properties', type: 'code', language: 'json', rows: 8, placeholder: '{\n  "Name": {"title": [{"text": {"content": "New Page"}}]}\n}' },
                ]
            }
        ]
    },

    // ========== SCHEDULING ==========
    '': {
        inputs: [], // No inputs - this is a trigger
        outputs: [
            { type: 'main', label: 'Scheduled' } // Trigger output
        ],
        sections: [
            {
                title: 'Trigger Times',
                fields: [
                    { name: 'triggerOn', label: 'Trigger On', type: 'select', options: ['Interval', 'Cron', 'Specific Times'], default: 'Interval' },
                    { name: 'interval', label: 'Interval', type: 'number', min: 1, default: 60 },
                    { name: 'unit', label: 'Unit', type: 'select', options: ['Seconds', 'Minutes', 'Hours', 'Days'], default: 'Minutes' },
                    { name: 'cronExpression', label: 'Cron Expression', type: 'text', placeholder: '0 0 * * *' },
                ]
            }
        ]
    },

    // ========== COMMUNICATION (CONTINUED) ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Telegram API', type: 'credential', credentialType: 'telegramApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Message', 'Chat', 'File', 'Callback', 'Sticker'], default: 'Message' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Send', 'Edit', 'Delete', 'Get', 'Pin'], default: 'Send' },
                ]
            },
            {
                title: 'Message',
                fields: [
                    { name: 'chatId', label: 'Chat ID', type: 'text', placeholder: '@channel or 123456789', description: 'Unique identifier for the target chat' },
                    { name: 'text', label: 'Message', type: 'textarea', rows: 6, placeholder: 'Your message...' },
                    { name: 'parseMode', label: 'Parse Mode', type: 'select', options: ['None', 'Markdown', 'HTML'], default: 'None' },
                    { name: 'disableNotification', label: 'Disable Notification', type: 'checkbox', default: false },
                ]
            },
            {
                title: 'Keyboard',
                fields: [
                    { name: 'replyMarkup', label: 'Reply Markup', type: 'code', language: 'json', rows: 6, placeholder: '{"inline_keyboard": [[{"text": "Button", "callback_data": "data"}]]}' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Microsoft OAuth2', type: 'credential', credentialType: 'microsoftTeamsOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Channel', 'Channel Message', 'Task'], default: 'Channel Message' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Get', 'Get All', 'Update', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Message',
                fields: [
                    { name: 'teamId', label: 'Team ID', type: 'text', placeholder: 'Team identifier' },
                    { name: 'channelId', label: 'Channel ID', type: 'text', placeholder: 'Channel identifier' },
                    { name: 'messageType', label: 'Message Type', type: 'select', options: ['Text', 'HTML'], default: 'Text' },
                    { name: 'message', label: 'Message', type: 'textarea', rows: 6, placeholder: 'Your message...' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Twilio API', type: 'credential', credentialType: 'twilioApi' },
                ]
            },
            {
                title: 'SMS',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Send SMS', 'Get Message', 'Get All Messages', 'Delete Message'], default: 'Send SMS' },
                    { name: 'from', label: 'From', type: 'text', placeholder: '+1234567890', description: 'Twilio phone number' },
                    { name: 'to', label: 'To', type: 'text', placeholder: '+1234567890', description: 'Recipient phone number' },
                    { name: 'message', label: 'Message', type: 'textarea', rows: 4, placeholder: 'SMS message text...' },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { name: 'statusCallback', label: 'Status Callback URL', type: 'text', placeholder: 'https://...' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'WhatsApp Business API', type: 'credential', credentialType: 'whatsAppApi' },
                ]
            },
            {
                title: 'Message',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Send Message', 'Send Template', 'Send Media'], default: 'Send Message' },
                    { name: 'to', label: 'To', type: 'text', placeholder: '1234567890', description: 'Recipient phone number (no +)' },
                    { name: 'messageType', label: 'Message Type', type: 'select', options: ['Text', 'Template', 'Image', 'Document', 'Audio', 'Video'], default: 'Text' },
                    { name: 'message', label: 'Message', type: 'textarea', rows: 4, placeholder: 'Message text...' },
                ]
            }
        ]
    },

    // ========== PRODUCTIVITY (CONTINUED) ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Airtable API', type: 'credential', credentialType: 'airtableApi' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Append', 'List', 'Read', 'Update', 'Delete'], default: 'Append' },
                    { name: 'baseId', label: 'Base ID', type: 'text', placeholder: 'appXXXXXXXXXXXXXX' },
                    { name: 'table', label: 'Table', type: 'text', placeholder: 'Table name' },
                ]
            },
            {
                title: 'Fields',
                fields: [
                    { name: 'fields', label: 'Fields', type: 'code', language: 'json', rows: 6, placeholder: '{"Name": "John", "Email": "john@example.com"}' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Asana OAuth2', type: 'credential', credentialType: 'asanaOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Task', 'Project', 'User', 'Subtask', 'Tag'], default: 'Task' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete', 'Search'], default: 'Create' },
                ]
            },
            {
                title: 'Task',
                fields: [
                    { name: 'workspace', label: 'Workspace', type: 'text', placeholder: 'Workspace ID' },
                    { name: 'projectId', label: 'Project ID', type: 'text', placeholder: 'Project identifier' },
                    { name: 'name', label: 'Task Name', type: 'text', placeholder: 'Task title' },
                    { name: 'notes', label: 'Notes', type: 'textarea', rows: 4, placeholder: 'Task description...' },
                    { name: 'assignee', label: 'Assignee', type: 'text', placeholder: 'User ID or email' },
                    { name: 'dueOn', label: 'Due Date', type: 'text', placeholder: 'YYYY-MM-DD' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Trello API', type: 'credential', credentialType: 'trelloApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Board', 'Card', 'List', 'Checklist', 'Label', 'Attachment'], default: 'Card' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Card',
                fields: [
                    { name: 'boardId', label: 'Board ID', type: 'text', placeholder: 'Board identifier' },
                    { name: 'listId', label: 'List ID', type: 'text', placeholder: 'List identifier' },
                    { name: 'name', label: 'Card Name', type: 'text', placeholder: 'Card title' },
                    { name: 'description', label: 'Description', type: 'textarea', rows: 4, placeholder: 'Card description...' },
                    { name: 'pos', label: 'Position', type: 'select', options: ['Top', 'Bottom'], default: 'Bottom' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Monday.com API', type: 'credential', credentialType: 'mondayApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Board', 'Item', 'Update'], default: 'Item' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Get', 'Get All', 'Delete', 'Update'], default: 'Create' },
                ]
            },
            {
                title: 'Item',
                fields: [
                    { name: 'boardId', label: 'Board ID', type: 'number', placeholder: '123456789' },
                    { name: 'groupId', label: 'Group ID', type: 'text', placeholder: 'Group identifier' },
                    { name: 'name', label: 'Item Name', type: 'text', placeholder: 'Item title' },
                    { name: 'columnValues', label: 'Column Values', type: 'code', language: 'json', rows: 6, placeholder: '{"status": "Working on it", "date": "2024-01-01"}' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Jira API', type: 'credential', credentialType: 'jiraApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Issue', 'Comment', 'Attachment', 'User', 'Project'], default: 'Issue' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete', 'Transition'], default: 'Create' },
                ]
            },
            {
                title: 'Issue',
                fields: [
                    { name: 'project', label: 'Project Key', type: 'text', placeholder: 'PROJ' },
                    { name: 'issueType', label: 'Issue Type', type: 'select', options: ['Task', 'Bug', 'Story', 'Epic'], default: 'Task' },
                    { name: 'summary', label: 'Summary', type: 'text', placeholder: 'Issue title' },
                    { name: 'description', label: 'Description', type: 'textarea', rows: 6, placeholder: 'Issue description...' },
                    { name: 'assignee', label: 'Assignee', type: 'text', placeholder: 'username or email' },
                    { name: 'priority', label: 'Priority', type: 'select', options: ['Highest', 'High', 'Medium', 'Low', 'Lowest'], default: 'Medium' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'ClickUp API', type: 'credential', credentialType: 'clickUpApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Task', 'Checklist', 'Comment', 'List', 'Folder'], default: 'Task' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Task',
                fields: [
                    { name: 'listId', label: 'List ID', type: 'text', placeholder: 'List identifier' },
                    { name: 'name', label: 'Task Name', type: 'text', placeholder: 'Task title' },
                    { name: 'description', label: 'Description', type: 'textarea', rows: 4, placeholder: 'Task description...' },
                    { name: 'status', label: 'Status', type: 'text', placeholder: 'to do' },
                    { name: 'priority', label: 'Priority', type: 'select', options: ['Urgent', 'High', 'Normal', 'Low'], default: 'Normal' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Todoist API', type: 'credential', credentialType: 'todoistApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Task', 'Project', 'Label', 'Comment'], default: 'Task' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Close', 'Delete', 'Get', 'Get All', 'Reopen', 'Update'], default: 'Create' },
                ]
            },
            {
                title: 'Task',
                fields: [
                    { name: 'content', label: 'Content', type: 'text', placeholder: 'Task title', description: 'Task name' },
                    { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Task description...' },
                    { name: 'project', label: 'Project', type: 'text', placeholder: 'Project ID' },
                    { name: 'dueDate', label: 'Due Date', type: 'text', placeholder: '2024-12-31' },
                    { name: 'priority', label: 'Priority', type: 'select', options: ['1', '2', '3', '4'], default: '1', description: '4=Urgent, 1=Normal' },
                ]
            }
        ]
    },

    // ========== CRM NODES ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'HubSpot OAuth2', type: 'credential', credentialType: 'hubspotOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Contact', 'Company', 'Deal', 'Ticket', 'Engagement'], default: 'Contact' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete', 'Search'], default: 'Create' },
                ]
            },
            {
                title: 'Contact',
                fields: [
                    { name: 'email', label: 'Email', type: 'text', placeholder: 'contact@example.com' },
                    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John' },
                    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
                    { name: 'company', label: 'Company', type: 'text', placeholder: 'Company name' },
                    { name: 'phone', label: 'Phone', type: 'text', placeholder: '+1234567890' },
                    { name: 'properties', label: 'Additional Properties', type: 'code', language: 'json', rows: 4, placeholder: '{"property": "value"}' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Salesforce OAuth2', type: 'credential', credentialType: 'salesforceOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Account', 'Contact', 'Lead', 'Opportunity', 'Task', 'Case', 'Custom Object'], default: 'Contact' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Upsert', 'Get', 'Get All', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Object',
                fields: [
                    { name: 'objectType', label: 'Object Type', type: 'text', placeholder: 'Contact' },
                    { name: 'fields', label: 'Fields', type: 'code', language: 'json', rows: 8, placeholder: '{\n  "FirstName": "John",\n  "LastName": "Doe",\n  "Email": "john@example.com"\n}' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Pipedrive API', type: 'credential', credentialType: 'pipedriveApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Activity', 'Deal', 'File', 'Note', 'Organization', 'Person', 'Product'], default: 'Deal' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete', 'Search'], default: 'Create' },
                ]
            },
            {
                title: 'Deal',
                fields: [
                    { name: 'title', label: 'Title', type: 'text', placeholder: 'Deal name' },
                    { name: 'value', label: 'Value', type: 'number', placeholder: '1000', min: 0 },
                    { name: 'currency', label: 'Currency', type: 'text', placeholder: 'USD', default: 'USD' },
                    { name: 'personId', label: 'Person ID', type: 'text', placeholder: 'Person identifier' },
                    { name: 'organizationId', label: 'Organization ID', type: 'text', placeholder: 'Organization identifier' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Zoho CRM OAuth2', type: 'credential', credentialType: 'zohoCrmOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Lead', 'Contact', 'Account', 'Deal', 'Product'], default: 'Lead' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete', 'Upsert'], default: 'Create' },
                ]
            },
            {
                title: 'Fields',
                fields: [
                    { name: 'data', label: 'Data', type: 'code', language: 'json', rows: 8, placeholder: '{\n  "Last_Name": "Doe",\n  "Email": "john@example.com",\n  "Company": "Acme Inc"\n}' },
                ]
            }
        ]
    },

    // ========== E-COMMERCE NODES ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Shopify API', type: 'credential', credentialType: 'shopifyApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Order', 'Product', 'Customer', 'Inventory'], default: 'Order' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete'], default: 'Get' },
                ]
            },
            {
                title: 'Order',
                fields: [
                    { name: 'orderId', label: 'Order ID', type: 'text', placeholder: 'Order identifier' },
                    { name: 'status', label: 'Status', type: 'select', options: ['Open', 'Closed', 'Cancelled', 'Any'], default: 'Any' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'WooCommerce API', type: 'credential', credentialType: 'wooCommerceApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Order', 'Product', 'Customer'], default: 'Order' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete'], default: 'Get All' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Stripe API', type: 'credential', credentialType: 'stripeApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Charge', 'Customer', 'Payment Intent', 'Subscription', 'Invoice'], default: 'Charge' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Get', 'Get All', 'Update', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Charge',
                fields: [
                    { name: 'amount', label: 'Amount', type: 'number', placeholder: '1000', description: 'Amount in cents', min: 0 },
                    { name: 'currency', label: 'Currency', type: 'text', placeholder: 'usd', default: 'usd' },
                    { name: 'source', label: 'Source', type: 'text', placeholder: 'tok_visa' },
                    { name: 'description', label: 'Description', type: 'text', placeholder: 'Charge description' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'PayPal API', type: 'credential', credentialType: 'payPalApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Payment', 'Payout', 'Payout Item'], default: 'Payment' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Get', 'Execute'], default: 'Create' },
                ]
            },
            {
                title: 'Payment',
                fields: [
                    { name: 'amount', label: 'Amount', type: 'number', placeholder: '10.00', min: 0, step: 0.01 },
                    { name: 'currency', label: 'Currency', type: 'text', placeholder: 'USD', default: 'USD' },
                ]
            }
        ]
    },

    // ========== DEVELOPMENT NODES ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'GitHub OAuth2', type: 'credential', credentialType: 'githubOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Repository', 'Issue', 'Pull Request', 'File', 'Release', 'User'], default: 'Issue' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete', 'Edit'], default: 'Create' },
                ]
            },
            {
                title: 'Repository',
                fields: [
                    { name: 'owner', label: 'Owner', type: 'text', placeholder: 'username' },
                    { name: 'repository', label: 'Repository', type: 'text', placeholder: 'repo-name' },
                ]
            },
            {
                title: 'Issue',
                fields: [
                    { name: 'title', label: 'Title', type: 'text', placeholder: 'Issue title' },
                    { name: 'body', label: 'Body', type: 'textarea', rows: 6, placeholder: 'Issue description...' },
                    { name: 'labels', label: 'Labels', type: 'text', placeholder: 'bug,enhancement' },
                    { name: 'assignees', label: 'Assignees', type: 'text', placeholder: 'username1,username2' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'GitLab API', type: 'credential', credentialType: 'gitLabApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Repository', 'Issue', 'Merge Request', 'Release', 'User'], default: 'Issue' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Project',
                fields: [
                    { name: 'projectId', label: 'Project ID', type: 'text', placeholder: '12345' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Connection',
                fields: [
                    { name: 'credential', label: 'Docker API', type: 'credential', credentialType: 'dockerApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Container', 'Image'], default: 'Container' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Start', 'Stop', 'Restart', 'Remove', 'List'], default: 'List' },
                ]
            },
            {
                title: 'Container',
                fields: [
                    { name: 'containerId', label: 'Container ID or Name', type: 'text', placeholder: 'container-name' },
                ]
            }
        ]
    },

    // ========== CLOUD & STORAGE NODES ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'AWS Credentials', type: 'credential', credentialType: 'aws' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Upload', 'Download', 'Delete', 'List', 'Get All'], default: 'Upload' },
                    { name: 'bucketName', label: 'Bucket Name', type: 'text', placeholder: 'my-bucket' },
                    { name: 'fileName', label: 'File Name', type: 'text', placeholder: 'path/to/file.txt' },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { name: 'region', label: 'Region', type: 'select', options: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-southeast-1'], default: 'us-east-1' },
                    { name: 'acl', label: 'ACL', type: 'select', options: ['private', 'public-read', 'public-read-write'], default: 'private' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'AWS Credentials', type: 'credential', credentialType: 'aws' },
                ]
            },
            {
                title: 'Function',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Invoke', 'Get', 'List'], default: 'Invoke' },
                    { name: 'functionName', label: 'Function Name', type: 'text', placeholder: 'my-function' },
                    { name: 'payload', label: 'Payload', type: 'code', language: 'json', rows: 6, placeholder: '{"key": "value"}' },
                    { name: 'invocationType', label: 'Invocation Type', type: 'select', options: ['RequestResponse', 'Event', 'DryRun'], default: 'RequestResponse' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Dropbox OAuth2', type: 'credential', credentialType: 'dropboxOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['File', 'Folder'], default: 'File' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Upload', 'Download', 'Delete', 'Copy', 'Move', 'List', 'Search'], default: 'Upload' },
                ]
            },
            {
                title: 'Path',
                fields: [
                    { name: 'path', label: 'Path', type: 'text', placeholder: '/folder/file.txt' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Google OAuth2', type: 'credential', credentialType: 'googleOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['File', 'Folder'], default: 'File' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Upload', 'Download', 'Delete', 'Copy', 'List', 'Share', 'Update'], default: 'Upload' },
                ]
            },
            {
                title: 'File',
                fields: [
                    { name: 'fileId', label: 'File ID', type: 'text', placeholder: 'File identifier' },
                    { name: 'name', label: 'Name', type: 'text', placeholder: 'document.pdf' },
                    { name: 'folderId', label: 'Parent Folder ID', type: 'text', placeholder: 'Folder identifier' },
                ]
            }
        ]
    },

    // ========== AI NODES (CONTINUED) ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'API key' },
                ]
            },
            {
                title: 'Model Configuration',
                fields: [
                    { name: 'model', label: 'Model', type: 'select', options: ['text-bison-001', 'chat-bison-001'], default: 'text-bison-001' },
                    { name: 'temperature', label: 'Temperature', type: 'number', min: 0, max: 1, step: 0.1, default: 0.7 },
                    { name: 'maxTokens', label: 'Max Output Tokens', type: 'number', min: 1, max: 1024, default: 256 },
                ]
            },
            {
                title: 'Prompt',
                fields: [
                    { name: 'prompt', label: 'Prompt', type: 'textarea', rows: 8, placeholder: 'Enter your prompt...' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'hf_...' },
                ]
            },
            {
                title: 'Model',
                fields: [
                    { name: 'model', label: 'Model ID', type: 'text', placeholder: 'gpt2' },
                    { name: 'task', label: 'Task', type: 'select', options: ['Text Generation', 'Text Classification', 'Token Classification', 'Fill Mask', 'Summarization', 'Translation'], default: 'Text Generation' },
                ]
            },
            {
                title: 'Input',
                fields: [
                    { name: 'input', label: 'Input Text', type: 'textarea', rows: 6, placeholder: 'Input for the model...' },
                    { name: 'parameters', label: 'Parameters', type: 'code', language: 'json', rows: 4, placeholder: '{"max_length": 100}' },
                ]
            }
        ]
    },

    // ========== UTILITIES NODES ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Format', 'Add Time', 'Subtract Time', 'Get Current', 'Parse'], default: 'Format' },
                    { name: 'date', label: 'Date', type: 'text', placeholder: '{{ $json.date }}' },
                    { name: 'format', label: 'Format', type: 'text', placeholder: 'YYYY-MM-DD HH:mm:ss', default: 'YYYY-MM-DD' },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { name: 'timezone', label: 'Timezone', type: 'text', placeholder: 'America/New_York' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Values',
                fields: [
                    { name: 'keepOnlySet', label: 'Keep Only Set', type: 'checkbox', default: false },
                    { name: 'values', label: 'Values', type: 'code', language: 'json', rows: 10, placeholder: '{\n  "field1": "{{ $json.input }}",\n  "field2": "value2",\n  "field3": 123\n}' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Code',
                fields: [
                    { name: 'functionCode', label: 'Function Code', type: 'code', language: 'javascript', rows: 15, placeholder: '// Define function\nreturn items.map(item => {\n  item.json.newField = "value";\n  return item;\n});' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Hash', 'Encrypt', 'Decrypt', 'Generate', 'Sign', 'Verify'], default: 'Hash' },
                    { name: 'algorithm', label: 'Algorithm', type: 'select', options: ['MD5', 'SHA1', 'SHA256', 'SHA512', 'AES', 'RSA'], default: 'SHA256' },
                ]
            },
            {
                title: 'Data',
                fields: [
                    { name: 'value', label: 'Value', type: 'text', placeholder: 'Data to process' },
                    { name: 'encoding', label: 'Encoding', type: 'select', options: ['hex', 'base64', 'latin1', 'utf8'], default: 'hex' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Parse', 'Create'], default: 'Parse' },
                ]
            },
            {
                title: 'Data',
                fields: [
                    { name: 'xml', label: 'XML', type: 'code', language: 'xml', rows: 8, placeholder: '<root>\n  <item>value</item>\n</root>' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Parse', 'Stringify', 'Get Property', 'Set Property'], default: 'Parse' },
                ]
            },
            {
                title: 'Data',
                fields: [
                    { name: 'json', label: 'JSON', type: 'code', language: 'json', rows: 8, placeholder: '{"key": "value"}' },
                    { name: 'property', label: 'Property Path', type: 'text', placeholder: 'data.items[0].name' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Extraction',
                fields: [
                    { name: 'sourceData', label: 'Source Data', type: 'select', options: ['HTML', 'URL'], default: 'HTML' },
                    { name: 'html', label: 'HTML', type: 'textarea', rows: 6, placeholder: '<html>...</html>' },
                    { name: 'url', label: 'URL', type: 'text', placeholder: 'https://example.com' },
                ]
            },
            {
                title: 'Selectors',
                fields: [
                    { name: 'extractionType', label: 'Extraction Type', type: 'select', options: ['CSS Selector', 'XPath', 'Regex'], default: 'CSS Selector' },
                    { name: 'selector', label: 'Selector', type: 'text', placeholder: '.class-name' },
                    { name: 'attribute', label: 'Attribute', type: 'text', placeholder: 'href or textContent' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Compress', 'Decompress'], default: 'Compress' },
                    { name: 'algorithm', label: 'Algorithm', type: 'select', options: ['gzip', 'deflate', 'brotli', 'zip'], default: 'gzip' },
                ]
            },
            {
                title: 'Data',
                fields: [
                    { name: 'dataPropertyName', label: 'Binary Property', type: 'text', placeholder: 'data', description: 'Name of the binary data property' },
                ]
            }
        ]
    },

    'Split In Batches': {
        inputs: [
            { type: 'main', required: true } // Requires input data to split into batches
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Batches output
        ],
        sections: [
            {
                title: 'Batch Configuration',
                fields: [
                    { name: 'batchSize', label: 'Batch Size', type: 'number', min: 1, default: 10, description: 'Number of items per batch' },
                    { name: 'options', label: 'Options', type: 'select', options: ['Keep Input Data', 'Split Items'], default: 'Split Items' },
                ]
            }
        ]
    },

    // ========== MARKETING & ANALYTICS ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Google OAuth2', type: 'credential', credentialType: 'googleOAuth2' },
                ]
            },
            {
                title: 'Report',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Report', 'User Activity'], default: 'Report' },
                    { name: 'viewId', label: 'View ID', type: 'text', placeholder: '123456789' },
                    { name: 'startDate', label: 'Start Date', type: 'text', placeholder: '2024-01-01' },
                    { name: 'endDate', label: 'End Date', type: 'text', placeholder: '2024-01-31' },
                    { name: 'metrics', label: 'Metrics', type: 'text', placeholder: 'ga:sessions,ga:pageviews' },
                    { name: 'dimensions', label: 'Dimensions', type: 'text', placeholder: 'ga:date,ga:country' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Mailchimp OAuth2', type: 'credential', credentialType: 'mailchimpOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Member', 'List', 'Campaign'], default: 'Member' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Member',
                fields: [
                    { name: 'listId', label: 'List ID', type: 'text', placeholder: 'List identifier' },
                    { name: 'email', label: 'Email', type: 'text', placeholder: 'subscriber@example.com' },
                    { name: 'status', label: 'Status', type: 'select', options: ['subscribed', 'unsubscribed', 'cleaned', 'pending'], default: 'subscribed' },
                    { name: 'mergeFields', label: 'Merge Fields', type: 'code', language: 'json', rows: 4, placeholder: '{"FNAME": "John", "LNAME": "Doe"}' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'SG...' },
                ]
            },
            {
                title: 'Email',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Send', 'Send Template'], default: 'Send' },
                    { name: 'to', label: 'To Email', type: 'text', placeholder: 'recipient@example.com' },
                    { name: 'from', label: 'From Email', type: 'text', placeholder: 'sender@example.com' },
                    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Email subject' },
                    { name: 'text', label: 'Text', type: 'textarea', rows: 6, placeholder: 'Plain text content...' },
                    { name: 'html', label: 'HTML', type: 'code', language: 'html', rows: 6, placeholder: '<html>...</html>' },
                ]
            }
        ]
    },

    // ========== CONTENT & MEDIA ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Feed',
                fields: [
                    { name: 'url', label: 'Feed URL', type: 'text', placeholder: 'https://example.com/feed.xml' },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { name: 'limit', label: 'Limit', type: 'number', min: 1, max: 100, default: 20 },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Google OAuth2', type: 'credential', credentialType: 'googleOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Video', 'Channel', 'Playlist', 'Comment'], default: 'Video' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Get', 'Get All', 'Upload', 'Update', 'Delete'], default: 'Get' },
                ]
            },
            {
                title: 'Video',
                fields: [
                    { name: 'videoId', label: 'Video ID', type: 'text', placeholder: 'dQw4w9WgXcQ' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'WordPress API', type: 'credential', credentialType: 'wordPressApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Post', 'Page', 'User', 'Category', 'Tag'], default: 'Post' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Post',
                fields: [
                    { name: 'title', label: 'Title', type: 'text', placeholder: 'Post title' },
                    { name: 'content', label: 'Content', type: 'textarea', rows: 8, placeholder: 'Post content...' },
                    { name: 'status', label: 'Status', type: 'select', options: ['publish', 'draft', 'pending', 'private'], default: 'publish' },
                ]
            }
        ]
    },

    // ========== SOCIAL MEDIA NODES ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Facebook OAuth2', type: 'credential', credentialType: 'facebookOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Post', 'Page', 'Photo', 'Video'], default: 'Post' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Get', 'Get All', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Post',
                fields: [
                    { name: 'pageId', label: 'Page ID', type: 'text', placeholder: 'Page identifier' },
                    { name: 'message', label: 'Message', type: 'textarea', rows: 6, placeholder: 'Post content...' },
                    { name: 'link', label: 'Link', type: 'text', placeholder: 'https://...' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Instagram OAuth2', type: 'credential', credentialType: 'instagramOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Media', 'Comment', 'Story'], default: 'Media' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Get', 'Get All', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Media',
                fields: [
                    { name: 'caption', label: 'Caption', type: 'textarea', rows: 4, placeholder: 'Post caption...' },
                    { name: 'imageUrl', label: 'Image URL', type: 'text', placeholder: 'https://...' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Twitter OAuth2', type: 'credential', credentialType: 'twitterOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Tweet', 'Direct Message', 'User'], default: 'Tweet' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Delete', 'Like', 'Retweet', 'Search'], default: 'Create' },
                ]
            },
            {
                title: 'Tweet',
                fields: [
                    { name: 'text', label: 'Text', type: 'textarea', rows: 4, placeholder: 'Tweet text (max 280 chars)...', description: 'Maximum 280 characters' },
                    { name: 'inReplyToStatusId', label: 'Reply to Tweet ID', type: 'text', placeholder: 'Tweet ID to reply to' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'LinkedIn OAuth2', type: 'credential', credentialType: 'linkedInOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Post', 'Company'], default: 'Post' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Get', 'Get All', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Post',
                fields: [
                    { name: 'text', label: 'Text', type: 'textarea', rows: 6, placeholder: 'Post content...' },
                    { name: 'visibility', label: 'Visibility', type: 'select', options: ['Anyone', 'Connections Only'], default: 'Anyone' },
                ]
            }
        ]
    },

    // ========== DATABASE NODES (CONTINUED) ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Connection',
                fields: [
                    { name: 'credential', label: 'Redis Credentials', type: 'credential', credentialType: 'redis' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Get', 'Set', 'Delete', 'Incr', 'Keys', 'Publish', 'Info'], default: 'Get' },
                    { name: 'key', label: 'Key', type: 'text', placeholder: 'cache:user:123' },
                    { name: 'value', label: 'Value', type: 'text', placeholder: 'Value to store' },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { name: 'ttl', label: 'TTL (seconds)', type: 'number', placeholder: '3600', description: 'Time to live in seconds' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Supabase API', type: 'credential', credentialType: 'supabaseApi' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Rows', 'Auth'], default: 'Rows' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Get', 'Get All', 'Insert', 'Update', 'Delete'], default: 'Get All' },
                    { name: 'table', label: 'Table', type: 'text', placeholder: 'users' },
                ]
            },
            {
                title: 'Data',
                fields: [
                    { name: 'data', label: 'Data', type: 'code', language: 'json', rows: 6, placeholder: '{"name": "John", "email": "john@example.com"}' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Firebase Service Account', type: 'credential', credentialType: 'firebaseServiceAccount' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Firestore', 'Realtime Database', 'Cloud Storage'], default: 'Firestore' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Get', 'Set', 'Update', 'Delete', 'Query'], default: 'Get' },
                ]
            },
            {
                title: 'Document',
                fields: [
                    { name: 'collection', label: 'Collection', type: 'text', placeholder: 'users' },
                    { name: 'documentId', label: 'Document ID', type: 'text', placeholder: 'doc-123' },
                    { name: 'data', label: 'Data', type: 'code', language: 'json', rows: 6, placeholder: '{"field": "value"}' },
                ]
            }
        ]
    },

    // ========== DEVELOPMENT (CONTINUED) ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Bitbucket OAuth2', type: 'credential', credentialType: 'bitbucketOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Repository', 'Issue', 'Pull Request'], default: 'Issue' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Repository',
                fields: [
                    { name: 'workspace', label: 'Workspace', type: 'text', placeholder: 'workspace-name' },
                    { name: 'repository', label: 'Repository', type: 'text', placeholder: 'repo-slug' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Jenkins API', type: 'credential', credentialType: 'jenkinsApi' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Trigger Build', 'Get Build', 'Get Job'], default: 'Trigger Build' },
                    { name: 'jobName', label: 'Job Name', type: 'text', placeholder: 'my-job' },
                ]
            },
            {
                title: 'Parameters',
                fields: [
                    { name: 'parameters', label: 'Build Parameters', type: 'code', language: 'json', rows: 4, placeholder: '{"BRANCH": "main", "ENV": "production"}' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Circle CI API token' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Trigger Pipeline', 'Get Pipeline', 'Get Workflow'], default: 'Trigger Pipeline' },
                    { name: 'projectSlug', label: 'Project Slug', type: 'text', placeholder: 'gh/org/repo' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Connection',
                fields: [
                    { name: 'credential', label: 'Kubernetes', type: 'credential', credentialType: 'kubernetes' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Pod', 'Deployment', 'Service', 'ConfigMap'], default: 'Pod' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Get', 'Get All', 'Create', 'Update', 'Delete'], default: 'Get All' },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { name: 'namespace', label: 'Namespace', type: 'text', placeholder: 'default', default: 'default' },
                    { name: 'name', label: 'Resource Name', type: 'text', placeholder: 'resource-name' },
                ]
            }
        ]
    },

    // ========== CLOUD (CONTINUED) ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Box OAuth2', type: 'credential', credentialType: 'boxOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['File', 'Folder'], default: 'File' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Upload', 'Download', 'Delete', 'Copy', 'Move', 'Get', 'Share'], default: 'Upload' },
                ]
            },
            {
                title: 'File',
                fields: [
                    { name: 'fileId', label: 'File ID', type: 'text', placeholder: 'File identifier' },
                    { name: 'folderId', label: 'Folder ID', type: 'text', placeholder: 'Folder identifier', default: '0' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Microsoft OAuth2', type: 'credential', credentialType: 'microsoftOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['File', 'Folder'], default: 'File' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Upload', 'Download', 'Delete', 'Copy', 'Move', 'Get', 'Search'], default: 'Upload' },
                ]
            },
            {
                title: 'File',
                fields: [
                    { name: 'fileId', label: 'File ID', type: 'text', placeholder: 'File identifier' },
                    { name: 'path', label: 'Path', type: 'text', placeholder: '/Documents/file.pdf' },
                ]
            }
        ]
    },

    // ========== AI (CONTINUED) ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Summarize', 'Extract', 'Classify', 'Transform'], default: 'Summarize' },
                    { name: 'model', label: 'Model', type: 'select', options: ['GPT-3.5', 'GPT-4', 'Claude'], default: 'GPT-3.5' },
                ]
            },
            {
                title: 'Input',
                fields: [
                    { name: 'text', label: 'Text', type: 'textarea', rows: 8, placeholder: 'Text to transform...' },
                    { name: 'instructions', label: 'Instructions', type: 'textarea', rows: 4, placeholder: 'How to transform the text...' },
                ]
            },
            {
                title: 'Options',
                fields: [
                    { name: 'outputFormat', label: 'Output Format', type: 'select', options: ['Text', 'JSON', 'Markdown'], default: 'Text' },
                ]
            }
        ]
    },

    // ========== MISCELLANEOUS ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Calendly API', type: 'credential', credentialType: 'calendlyApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Event', 'Invitee', 'User'], default: 'Event' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Get', 'Get All', 'Cancel'], default: 'Get All' },
                ]
            },
            {
                title: 'Event',
                fields: [
                    { name: 'eventUuid', label: 'Event UUID', type: 'text', placeholder: 'Event identifier' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Typeform API', type: 'credential', credentialType: 'typeformApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Form', 'Response'], default: 'Response' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Get', 'Get All', 'Delete'], default: 'Get All' },
                ]
            },
            {
                title: 'Form',
                fields: [
                    { name: 'formId', label: 'Form ID', type: 'text', placeholder: 'Form identifier' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Zoom OAuth2', type: 'credential', credentialType: 'zoomOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Meeting', 'Webinar', 'Recording'], default: 'Meeting' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Get', 'Get All', 'Update', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Meeting',
                fields: [
                    { name: 'topic', label: 'Topic', type: 'text', placeholder: 'Meeting topic' },
                    { name: 'type', label: 'Type', type: 'select', options: ['Instant', 'Scheduled', 'Recurring'], default: 'Scheduled' },
                    { name: 'startTime', label: 'Start Time', type: 'text', placeholder: '2024-12-31T10:00:00Z' },
                    { name: 'duration', label: 'Duration (minutes)', type: 'number', min: 1, default: 60 },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Spotify OAuth2', type: 'credential', credentialType: 'spotifyOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Track', 'Playlist', 'Album', 'Artist'], default: 'Track' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Get', 'Search', 'Add', 'Remove'], default: 'Search' },
                ]
            },
            {
                title: 'Search',
                fields: [
                    { name: 'query', label: 'Query', type: 'text', placeholder: 'Search query' },
                    { name: 'limit', label: 'Limit', type: 'number', min: 1, max: 50, default: 20 },
                ]
            }
        ]
    },

    // ========== CMS NODES ==========
    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Webflow API key' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Item', 'Collection'], default: 'Item' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete', 'Publish'], default: 'Get All' },
                ]
            },
            {
                title: 'Collection',
                fields: [
                    { name: 'siteId', label: 'Site ID', type: 'text', placeholder: 'Site identifier' },
                    { name: 'collectionId', label: 'Collection ID', type: 'text', placeholder: 'Collection identifier' },
                ]
            },
            {
                title: 'Item',
                fields: [
                    { name: 'fields', label: 'Fields', type: 'code', language: 'json', rows: 6, placeholder: '{"name": "Item name", "slug": "item-slug"}' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Contentful API', type: 'credential', credentialType: 'contentfulApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Entry', 'Asset', 'Content Type'], default: 'Entry' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Get', 'Get All', 'Create', 'Update', 'Delete', 'Publish'], default: 'Get All' },
                ]
            },
            {
                title: 'Entry',
                fields: [
                    { name: 'spaceId', label: 'Space ID', type: 'text', placeholder: 'Space identifier' },
                    { name: 'contentType', label: 'Content Type', type: 'text', placeholder: 'blogPost' },
                    { name: 'fields', label: 'Fields', type: 'code', language: 'json', rows: 6, placeholder: '{"title": {"en-US": "Title"}}' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Algolia API', type: 'credential', credentialType: 'algoliaApi' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Search', 'Add Object', 'Update Object', 'Delete Object', 'Get Object'], default: 'Search' },
                    { name: 'indexName', label: 'Index Name', type: 'text', placeholder: 'products' },
                ]
            },
            {
                title: 'Search',
                fields: [
                    { name: 'query', label: 'Query', type: 'text', placeholder: 'Search query' },
                    { name: 'hitsPerPage', label: 'Hits Per Page', type: 'number', min: 1, max: 1000, default: 20 },
                    { name: 'filters', label: 'Filters', type: 'text', placeholder: 'category:electronics' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Mixpanel API', type: 'credential', credentialType: 'mixpanelApi' },
                ]
            },
            {
                title: 'Operation',
                fields: [
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Track Event', 'Create Profile', 'Update Profile'], default: 'Track Event' },
                ]
            },
            {
                title: 'Event',
                fields: [
                    { name: 'event', label: 'Event Name', type: 'text', placeholder: 'Page Viewed' },
                    { name: 'distinctId', label: 'Distinct ID', type: 'text', placeholder: 'user-123' },
                    { name: 'properties', label: 'Properties', type: 'code', language: 'json', rows: 4, placeholder: '{"page": "home", "referrer": "google"}' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Close API key' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Lead', 'Contact', 'Activity', 'Opportunity'], default: 'Lead' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Lead',
                fields: [
                    { name: 'name', label: 'Name', type: 'text', placeholder: 'Company name' },
                    { name: 'contacts', label: 'Contacts', type: 'code', language: 'json', rows: 4, placeholder: '[{"name": "John Doe", "email": "john@example.com"}]' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Copper API', type: 'credential', credentialType: 'copperApi' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Company', 'Person', 'Opportunity', 'Task'], default: 'Person' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Update', 'Get', 'Get All', 'Delete'], default: 'Create' },
                ]
            },
            {
                title: 'Person',
                fields: [
                    { name: 'name', label: 'Name', type: 'text', placeholder: 'Person name' },
                    { name: 'email', label: 'Email', type: 'text', placeholder: 'person@example.com' },
                ]
            }
        ]
    },

    '': {
        inputs: [
            { type: 'main', required: false } // Most nodes can work with or without input
        ],
        outputs: [
            { type: 'main', label: 'Output' } // Main data output
        ],
        sections: [
            {
                title: 'Authentication',
                fields: [
                    { name: 'credential', label: 'Square OAuth2', type: 'credential', credentialType: 'squareOAuth2' },
                ]
            },
            {
                title: 'Resource',
                fields: [
                    { name: 'resource', label: 'Resource', type: 'select', options: ['Payment', 'Customer', 'Order', 'Inventory'], default: 'Payment' },
                    { name: 'operation', label: 'Operation', type: 'select', options: ['Create', 'Get', 'Get All', 'Update'], default: 'Create' },
                ]
            },
            {
                title: 'Payment',
                fields: [
                    { name: 'amount', label: 'Amount', type: 'number', placeholder: '1000', description: 'Amount in cents', min: 1 },
                    { name: 'currency', label: 'Currency', type: 'text', placeholder: 'USD', default: 'USD' },
                    { name: 'sourceId', label: 'Source ID', type: 'text', placeholder: 'Card nonce' },
                ]
            }
        ]
    },

    // ========== DEFAULT ==========
    '': {
        inputs: [], // No inputs - this is a trigger
        outputs: [
            { type: 'main', label: 'Started' } // Trigger output
        ],
        sections: [
            {
                title: 'Trigger',
                fields: [
                    { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Describe when this workflow should start...' },
                ]
            }
        ]
    }
};

// Helper function to get configuration for a node
export function getNodeConfiguration(nodeName, nodeType, nodeCategory) {
    // Try exact name match first
    if (nodeConfigurations[nodeName]) {
        return nodeConfigurations[nodeName];
    }
    
    // Try type match
    if (nodeType && nodeConfigurations[nodeType]) {
        return nodeConfigurations[nodeType];
    }
    
    // Try category match
    if (nodeCategory && nodeConfigurations[nodeCategory]) {
        return nodeConfigurations[nodeCategory];
    }
    
    // Return default configuration
    return {
        sections: [{
            title: 'Configuration',
            fields: [
                { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter name...', description: 'Node name' },
                { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Describe this node...' },
                { name: 'value', label: 'Value', type: 'text', placeholder: 'Enter value...' }
            ]
        }]
    };
}
