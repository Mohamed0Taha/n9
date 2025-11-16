/**
 * Node-specific execution data based on n8n's actual node implementations
 * Each node type has unique input/output data structures
 */

export const nodeExecutionData = {
    // ========== CORE NODES ==========
    
    'Start': {
        inputData: [], // No inputs - this is a trigger
        outputData: [{
            items: [{
                json: {
                    timestamp: new Date().toISOString(),
                    executionId: 'exec_' + Date.now(),
                    mode: 'manual'
                }
            }]
        }]
    },

    'HTTP Request': {
        inputData: [{
            items: [{
                json: {
                    trigger: 'manual',
                    timestamp: new Date().toISOString()
                }
            }]
        }],
        outputData: [{
            items: [{
                json: {
                    statusCode: 200,
                    statusMessage: 'OK',
                    headers: {
                        'content-type': 'application/json',
                        'date': new Date().toUTCString(),
                        'connection': 'keep-alive',
                        'content-length': '145'
                    },
                    body: {
                        success: true,
                        data: {
                            id: 12345,
                            name: 'Sample Response',
                            status: 'active'
                        },
                        timestamp: new Date().toISOString()
                    }
                }
            }]
        }]
    },

    'Webhook': {
        inputData: [], // No inputs - this is a trigger
        outputData: [{
            items: [{
                json: {
                    headers: {
                        'host': 'localhost:5678',
                        'user-agent': 'PostmanRuntime/7.32.0',
                        'content-type': 'application/json',
                        'accept': '*/*',
                        'content-length': '87'
                    },
                    params: {},
                    query: {},
                    body: {
                        event: 'user.created',
                        user_id: 'usr_123abc',
                        email: 'user@example.com',
                        timestamp: new Date().toISOString()
                    },
                    webhookUrl: 'http://localhost:5678/webhook/abc123',
                    executionMode: 'production'
                }
            }]
        }]
    },

    'Code': {
        inputData: [{
            items: [{
                json: {
                    id: 1,
                    name: 'Sample Data',
                    value: 42,
                    tags: ['test', 'sample']
                }
            }]
        }],
        outputData: [{
            items: [{
                json: {
                    id: 1,
                    name: 'SAMPLE DATA', // Transformed
                    value: 84, // Doubled
                    tags: ['test', 'sample', 'processed'],
                    processedAt: new Date().toISOString(),
                    processed: true
                }
            }]
        }]
    },

    // ========== FLOW CONTROL NODES ==========
    
    'IF': {
        inputData: [{
            items: [{
                json: {
                    temperature: 25,
                    location: 'New York',
                    timestamp: new Date().toISOString()
                }
            }]
        }],
        outputData: [
            {
                // Output 0 - TRUE branch
                items: [{
                    json: {
                        temperature: 25,
                        location: 'New York',
                        timestamp: new Date().toISOString(),
                        condition: 'Temperature > 20',
                        result: true
                    }
                }]
            },
            {
                // Output 1 - FALSE branch (empty in this case)
                items: []
            }
        ]
    },

    'Switch': {
        inputData: [{
            items: [{
                json: {
                    status: 'pending',
                    orderId: 'ORD-12345',
                    amount: 99.99
                }
            }]
        }],
        outputData: [
            { items: [] }, // Output 0
            { 
                items: [{ // Output 1 - Matches "pending"
                    json: {
                        status: 'pending',
                        orderId: 'ORD-12345',
                        amount: 99.99,
                        route: 'pending_orders'
                    }
                }]
            },
            { items: [] }, // Output 2
            { items: [] }, // Output 3
            { items: [] }  // Output 4
        ]
    },

    'Merge': {
        inputData: [
            {
                items: [
                    { json: { id: 1, name: 'User 1', email: 'user1@example.com' }},
                    { json: { id: 2, name: 'User 2', email: 'user2@example.com' }}
                ]
            },
            {
                items: [
                    { json: { id: 3, name: 'User 3', email: 'user3@example.com' }},
                    { json: { id: 4, name: 'User 4', email: 'user4@example.com' }}
                ]
            }
        ],
        outputData: [{
            items: [
                { json: { id: 1, name: 'User 1', email: 'user1@example.com' }},
                { json: { id: 2, name: 'User 2', email: 'user2@example.com' }},
                { json: { id: 3, name: 'User 3', email: 'user3@example.com' }},
                { json: { id: 4, name: 'User 4', email: 'user4@example.com' }}
            ]
        }]
    },

    'Split In Batches': {
        inputData: [{
            items: [
                { json: { id: 1, name: 'Item 1' }},
                { json: { id: 2, name: 'Item 2' }},
                { json: { id: 3, name: 'Item 3' }},
                { json: { id: 4, name: 'Item 4' }},
                { json: { id: 5, name: 'Item 5' }}
            ]
        }],
        outputData: [{
            items: [
                { json: { id: 1, name: 'Item 1' }},
                { json: { id: 2, name: 'Item 2' }},
                { json: { id: 3, name: 'Item 3' }}
            ]
        }]
    },

    // ========== COMMUNICATION NODES ==========
    
    'Slack': {
        inputData: [{
            items: [{
                json: {
                    message: 'Hello from workflow!',
                    channel: 'general',
                    timestamp: new Date().toISOString()
                }
            }]
        }],
        outputData: [{
            items: [{
                json: {
                    ok: true,
                    channel: 'C01ABC123',
                    ts: '1699999999.123456',
                    message: {
                        text: 'Hello from workflow!',
                        username: 'n8n Bot',
                        bot_id: 'B01ABC123',
                        type: 'message',
                        subtype: 'bot_message',
                        ts: '1699999999.123456'
                    }
                }
            }]
        }]
    },

    'Gmail': {
        inputData: [{
            items: [{
                json: {
                    to: 'recipient@example.com',
                    subject: 'Test Email',
                    body: 'This is a test email from n8n workflow',
                    timestamp: new Date().toISOString()
                }
            }]
        }],
        outputData: [{
            items: [{
                json: {
                    id: '18c1234567890abcd',
                    threadId: '18c1234567890abcd',
                    labelIds: ['SENT'],
                    snippet: 'This is a test email from n8n workflow',
                    sizeEstimate: 1234,
                    historyId: '123456',
                    internalDate: '1699999999000'
                }
            }]
        }]
    },

    'Telegram': {
        inputData: [{
            items: [{
                json: {
                    text: 'Notification from workflow',
                    chatId: '123456789',
                    timestamp: new Date().toISOString()
                }
            }]
        }],
        outputData: [{
            items: [{
                json: {
                    ok: true,
                    result: {
                        message_id: 4567,
                        from: {
                            id: 987654321,
                            is_bot: true,
                            first_name: 'n8n Bot',
                            username: 'n8n_bot'
                        },
                        chat: {
                            id: 123456789,
                            first_name: 'User',
                            type: 'private'
                        },
                        date: Math.floor(Date.now() / 1000),
                        text: 'Notification from workflow'
                    }
                }
            }]
        }]
    },

    // ========== AI NODES ==========
    
    'OpenAI': {
        inputData: [{
            items: [{
                json: {
                    prompt: 'Write a short poem about automation',
                    model: 'gpt-4',
                    temperature: 0.7
                }
            }]
        }],
        outputData: [{
            items: [{
                json: {
                    id: 'chatcmpl-ABC123',
                    object: 'chat.completion',
                    created: Math.floor(Date.now() / 1000),
                    model: 'gpt-4-0613',
                    choices: [{
                        index: 0,
                        message: {
                            role: 'assistant',
                            content: 'Silent machines hum with grace,\nTasks complete at rapid pace,\nWorkflows dance without a trace,\nAutomation finds its place.'
                        },
                        finish_reason: 'stop'
                    }],
                    usage: {
                        prompt_tokens: 12,
                        completion_tokens: 28,
                        total_tokens: 40
                    }
                }
            }]
        }]
    },

    'Anthropic': {
        inputData: [{
            items: [{
                json: {
                    prompt: 'Explain n8n in one sentence',
                    model: 'claude-3-sonnet',
                    max_tokens: 100
                }
            }]
        }],
        outputData: [{
            items: [{
                json: {
                    id: 'msg_abc123',
                    type: 'message',
                    role: 'assistant',
                    content: [{
                        type: 'text',
                        text: 'n8n is an open-source workflow automation platform that allows you to connect different services and automate tasks through a visual interface.'
                    }],
                    model: 'claude-3-sonnet-20240229',
                    stop_reason: 'end_turn',
                    usage: {
                        input_tokens: 15,
                        output_tokens: 32
                    }
                }
            }]
        }]
    },

    // ========== DATABASE NODES ==========
    
    'MySQL': {
        inputData: [{
            items: [{
                json: {
                    query: 'SELECT * FROM users WHERE status = ?',
                    params: ['active']
                }
            }]
        }],
        outputData: [{
            items: [
                {
                    json: {
                        id: 1,
                        username: 'john_doe',
                        email: 'john@example.com',
                        status: 'active',
                        created_at: '2024-01-15T10:30:00Z'
                    }
                },
                {
                    json: {
                        id: 2,
                        username: 'jane_smith',
                        email: 'jane@example.com',
                        status: 'active',
                        created_at: '2024-02-20T14:15:00Z'
                    }
                }
            ]
        }]
    },

    'PostgreSQL': {
        inputData: [{
            items: [{
                json: {
                    query: 'SELECT * FROM orders WHERE date > $1 LIMIT 3',
                    values: ['2024-01-01']
                }
            }]
        }],
        outputData: [{
            items: [
                {
                    json: {
                        order_id: 'ORD-001',
                        customer_id: 101,
                        total: 299.99,
                        status: 'shipped',
                        order_date: '2024-03-15T09:00:00Z'
                    }
                },
                {
                    json: {
                        order_id: 'ORD-002',
                        customer_id: 102,
                        total: 149.50,
                        status: 'pending',
                        order_date: '2024-03-16T11:30:00Z'
                    }
                }
            ]
        }]
    },

    'MongoDB': {
        inputData: [{
            items: [{
                json: {
                    collection: 'products',
                    operation: 'find',
                    query: { category: 'electronics', inStock: true }
                }
            }]
        }],
        outputData: [{
            items: [
                {
                    json: {
                        _id: '507f1f77bcf86cd799439011',
                        name: 'Wireless Mouse',
                        category: 'electronics',
                        price: 29.99,
                        inStock: true,
                        quantity: 150
                    }
                },
                {
                    json: {
                        _id: '507f191e810c19729de860ea',
                        name: 'USB Cable',
                        category: 'electronics',
                        price: 9.99,
                        inStock: true,
                        quantity: 500
                    }
                }
            ]
        }]
    },

    // ========== PRODUCTIVITY NODES ==========
    
    'Google Sheets': {
        inputData: [{
            items: [{
                json: {
                    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
                    range: 'Sheet1!A2:D5',
                    operation: 'read'
                }
            }]
        }],
        outputData: [{
            items: [
                {
                    json: {
                        Name: 'John Doe',
                        Email: 'john@example.com',
                        Department: 'Engineering',
                        Salary: 85000
                    }
                },
                {
                    json: {
                        Name: 'Jane Smith',
                        Email: 'jane@example.com',
                        Department: 'Marketing',
                        Salary: 75000
                    }
                },
                {
                    json: {
                        Name: 'Bob Johnson',
                        Email: 'bob@example.com',
                        Department: 'Sales',
                        Salary: 80000
                    }
                }
            ]
        }]
    },

    'Airtable': {
        inputData: [{
            items: [{
                json: {
                    base: 'appABC123',
                    table: 'Tasks',
                    operation: 'list'
                }
            }]
        }],
        outputData: [{
            items: [
                {
                    json: {
                        id: 'rec123',
                        fields: {
                            Name: 'Complete project documentation',
                            Status: 'In Progress',
                            Priority: 'High',
                            'Due Date': '2024-03-30',
                            Assignee: 'John Doe'
                        },
                        createdTime: '2024-03-01T10:00:00.000Z'
                    }
                },
                {
                    json: {
                        id: 'rec456',
                        fields: {
                            Name: 'Review pull requests',
                            Status: 'Done',
                            Priority: 'Medium',
                            'Due Date': '2024-03-20',
                            Assignee: 'Jane Smith'
                        },
                        createdTime: '2024-02-15T14:30:00.000Z'
                    }
                }
            ]
        }]
    },

    'Notion': {
        inputData: [{
            items: [{
                json: {
                    database_id: 'abc123-def456',
                    operation: 'query',
                    filter: { property: 'Status', select: { equals: 'Active' }}
                }
            }]
        }],
        outputData: [{
            items: [
                {
                    json: {
                        id: 'page-123',
                        properties: {
                            Title: { title: [{ text: { content: 'Q1 Planning' }}]},
                            Status: { select: { name: 'Active' }},
                            Priority: { select: { name: 'High' }},
                            'Created time': { created_time: '2024-01-15T10:00:00.000Z' }
                        }
                    }
                }
            ]
        }]
    },

    // ========== CRM NODES ==========
    
    'Salesforce': {
        inputData: [{
            items: [{
                json: {
                    object: 'Contact',
                    operation: 'get',
                    id: '003xx000004TmiOAAS'
                }
            }]
        }],
        outputData: [{
            items: [{
                json: {
                    Id: '003xx000004TmiOAAS',
                    FirstName: 'John',
                    LastName: 'Doe',
                    Email: 'john.doe@example.com',
                    Phone: '+1-555-0100',
                    AccountId: '001xx000003DGb0AAG',
                    CreatedDate: '2024-01-15T08:30:00.000Z',
                    LastModifiedDate: '2024-03-10T15:45:00.000Z'
                }
            }]
        }]
    },

    'HubSpot': {
        inputData: [{
            items: [{
                json: {
                    resource: 'contact',
                    operation: 'get',
                    contactId: '12345'
                }
            }]
        }],
        outputData: [{
            items: [{
                json: {
                    id: '12345',
                    properties: {
                        email: 'contact@example.com',
                        firstname: 'Jane',
                        lastname: 'Smith',
                        phone: '+1-555-0200',
                        company: 'Tech Corp',
                        lifecyclestage: 'customer',
                        createdate: '2024-02-01T10:00:00.000Z',
                        lastmodifieddate: '2024-03-15T14:30:00.000Z'
                    },
                    createdAt: '2024-02-01T10:00:00.000Z',
                    updatedAt: '2024-03-15T14:30:00.000Z'
                }
            }]
        }]
    },

    // ========== E-COMMERCE NODES ==========
    
    'Shopify': {
        inputData: [{
            items: [{
                json: {
                    resource: 'order',
                    operation: 'get',
                    orderId: '450789469'
                }
            }]
        }],
        outputData: [{
            items: [{
                json: {
                    id: 450789469,
                    email: 'customer@example.com',
                    created_at: '2024-03-15T10:30:00-04:00',
                    total_price: '199.99',
                    subtotal_price: '179.99',
                    total_tax: '20.00',
                    currency: 'USD',
                    financial_status: 'paid',
                    fulfillment_status: 'fulfilled',
                    line_items: [{
                        id: 466157049,
                        title: 'Awesome Product',
                        price: '179.99',
                        quantity: 1,
                        sku: 'PROD-001'
                    }],
                    customer: {
                        id: 207119551,
                        email: 'customer@example.com',
                        first_name: 'John',
                        last_name: 'Doe'
                    }
                }
            }]
        }]
    },

    'WooCommerce': {
        inputData: [{
            items: [{
                json: {
                    resource: 'order',
                    operation: 'get',
                    orderId: '123'
                }
            }]
        }],
        outputData: [{
            items: [{
                json: {
                    id: 123,
                    number: '123',
                    status: 'processing',
                    currency: 'USD',
                    total: '79.90',
                    billing: {
                        first_name: 'Jane',
                        last_name: 'Doe',
                        email: 'jane@example.com',
                        phone: '555-0300'
                    },
                    line_items: [{
                        id: 23,
                        name: 'Premium Widget',
                        quantity: 1,
                        total: '79.90'
                    }],
                    date_created: '2024-03-15T12:00:00',
                    date_modified: '2024-03-15T12:05:00'
                }
            }]
        }]
    }
};

/**
 * Get execution data for a specific node type
 * @param {string} nodeType - The type of the node
 * @returns {object} The execution data with inputData and outputData
 */
export function getNodeExecutionData(nodeType) {
    // Normalize node type
    const normalizedType = nodeType.trim();
    
    // Return node-specific data if available
    if (nodeExecutionData[normalizedType]) {
        return nodeExecutionData[normalizedType];
    }
    
    // Default fallback for unknown node types
    return {
        inputData: [{
            items: [{
                json: {
                    message: 'Sample input data',
                    timestamp: new Date().toISOString()
                }
            }]
        }],
        outputData: [{
            items: [{
                json: {
                    result: 'success',
                    message: 'Sample output data',
                    timestamp: new Date().toISOString()
                }
            }]
        }]
    };
}
