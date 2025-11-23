<?php

namespace App\Services;

/**
 * Node configuration schema - defines required and optional fields for each node type
 */
class NodeConfigurationSchema
{
    /**
     * Get required configuration fields for a node type
     */
    public static function getRequiredFields(string $nodeType): array
    {
        $schemas = self::getSchemas();
        return $schemas[$nodeType]['required'] ?? [];
    }

    /**
     * Get default configuration for a node type
     */
    public static function getDefaultConfig(string $nodeType): array
    {
        $schemas = self::getSchemas();
        return $schemas[$nodeType]['defaults'] ?? [];
    }

    /**
     * Validate node configuration
     */
    public static function validate(string $nodeType, array $data): array
    {
        $required = self::getRequiredFields($nodeType);
        $missing = [];

        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
                $missing[] = $field;
            }
        }

        return $missing;
    }

    /**
     * Complete configuration schemas for all node types
     */
    private static function getSchemas(): array
    {
        // Generic schema for integration nodes that follow the standard pattern
        $genericIntegrationSchema = [
            'required' => ['operation'],
            'defaults' => [
                'operation' => 'execute',
                'resource' => '',
                'data' => '{}',
            ],
        ];

        return [
            // --- Core Nodes ---
            'Manual Trigger' => [
                'required' => [],
                'defaults' => [
                    'description' => 'Trigger workflow manually',
                ],
            ],
            'Start' => [
                'required' => [],
                'defaults' => [
                    'description' => 'Manual workflow trigger',
                ],
            ],
            'Schedule' => [
                'required' => ['rule'],
                'defaults' => [
                    'rule' => [
                        'interval' => [
                            ['field' => 'hours'],
                        ],
                    ],
                ],
            ],
            'HTTP Request' => [
                'required' => ['method', 'url'],
                'defaults' => [
                    'method' => 'GET',
                    'url' => 'https://api.example.com/endpoint',
                    'authentication' => 'None',
                    'queryParameters' => [],
                    'headers' => [],
                    'timeout' => 30000,
                ],
            ],
            'Webhook' => [
                'required' => ['httpMethod', 'path'],
                'defaults' => [
                    'httpMethod' => 'POST',
                    'path' => 'webhook',
                    'responseMode' => 'On Received',
                    'responseCode' => 200,
                ],
            ],
            'Code' => [
                'required' => ['code', 'language'],
                'defaults' => [
                    'code' => 'return items;',
                    'language' => 'JavaScript',
                    'mode' => 'Run Once for All Items',
                ],
            ],
            
            // --- Flow Nodes ---
            'IF' => [
                'required' => ['conditions'],
                'defaults' => [
                    'conditions' => [
                        [
                            'value1' => '={{ $json.value }}',
                            'operation' => 'equal',
                            'value2' => 'true',
                        ],
                    ],
                    'combineOperation' => 'all',
                ],
            ],
            'Switch' => [
                'required' => ['mode', 'rules'],
                'defaults' => [
                    'mode' => 'rules',
                    'rules' => [
                        [
                            'conditions' => [
                                [
                                    'value1' => '={{ $json.status }}',
                                    'operation' => 'equal',
                                    'value2' => 'active',
                                ],
                            ],
                            'output' => 0,
                        ],
                    ],
                ],
            ],
            'Merge' => [
                'required' => ['mode'],
                'defaults' => [
                    'mode' => 'append',
                ],
            ],
            'Split In Batches' => [
                'required' => ['batchSize'],
                'defaults' => [
                    'batchSize' => 10,
                    'options' => [],
                ],
            ],

            // --- Communication ---
            'Slack' => [
                'required' => ['resource', 'operation', 'channel', 'text'],
                'defaults' => [
                    'resource' => 'Message',
                    'operation' => 'Post',
                    'channel' => '#general',
                    'text' => 'Message from n8n workflow',
                    'username' => 'n8n Bot',
                    'icon_emoji' => ':robot_face:',
                ],
            ],
            'Discord' => [
                'required' => ['webhookUrl', 'content'],
                'defaults' => [
                    'webhookUrl' => 'https://discord.com/api/webhooks/YOUR_WEBHOOK',
                    'content' => 'Message from n8n',
                    'username' => 'n8n Bot',
                ],
            ],
            'Telegram' => [
                'required' => ['resource', 'operation', 'chatId', 'text'],
                'defaults' => [
                    'resource' => 'Message',
                    'operation' => 'Send Text',
                    'chatId' => '123456789',
                    'text' => 'Notification from n8n',
                ],
            ],
            'Gmail' => [
                'required' => ['resource', 'operation', 'to', 'subject', 'message'],
                'defaults' => [
                    'resource' => 'Message',
                    'operation' => 'Send',
                    'to' => 'recipient@example.com',
                    'subject' => 'Email from n8n',
                    'message' => 'This is an automated email from n8n workflow',
                ],
            ],
            'Microsoft Teams' => [
                'required' => ['resource', 'operation', 'channelId', 'message'],
                'defaults' => [
                    'resource' => 'Channel Message',
                    'operation' => 'Create',
                    'channelId' => 'channel-id',
                    'message' => 'Message from n8n',
                ],
            ],
            'Twilio' => [
                'required' => ['operation', 'from', 'to', 'message'],
                'defaults' => [
                    'operation' => 'Send',
                    'from' => '+1234567890',
                    'to' => '+0987654321',
                    'message' => 'SMS from n8n workflow',
                ],
            ],
            'WhatsApp' => [
                'required' => ['operation', 'to', 'message'],
                'defaults' => [
                    'operation' => 'Send Template',
                    'to' => '+1234567890',
                    'message' => 'WhatsApp message from n8n',
                ],
            ],

            // --- Productivity & CRM ---
            'Google Sheets' => [
                'required' => ['resource', 'operation', 'spreadsheetId', 'range'],
                'defaults' => [
                    'resource' => 'Spreadsheet',
                    'operation' => 'Append',
                    'spreadsheetId' => 'your-spreadsheet-id',
                    'range' => 'Sheet1!A:Z',
                    'dataMode' => 'Auto-Map',
                ],
            ],
            'Notion' => [
                'required' => ['resource', 'operation', 'databaseId'],
                'defaults' => [
                    'resource' => 'Database',
                    'operation' => 'Create',
                    'databaseId' => 'database-id',
                    'properties' => [],
                ],
            ],
            'Airtable' => [
                'required' => ['operation', 'baseId', 'table'],
                'defaults' => [
                    'operation' => 'Append',
                    'baseId' => 'base-id',
                    'table' => 'Table Name',
                    'fields' => [],
                ],
            ],
            'HubSpot' => [
                'required' => ['resource', 'operation'],
                'defaults' => [
                    'resource' => 'Contact',
                    'operation' => 'Create',
                    'email' => 'contact@example.com',
                    'properties' => [],
                ],
            ],
            'Salesforce' => [
                'required' => ['resource', 'operation'],
                'defaults' => [
                    'resource' => 'Contact',
                    'operation' => 'Create',
                    'fields' => [],
                ],
            ],
            // Generic Productivity/CRM fallbacks
            'Google Drive' => $genericIntegrationSchema,
            'Asana' => $genericIntegrationSchema,
            'Trello' => $genericIntegrationSchema,
            'Monday' => $genericIntegrationSchema,
            'Jira' => $genericIntegrationSchema,
            'ClickUp' => $genericIntegrationSchema,
            'Todoist' => $genericIntegrationSchema,
            'Pipedrive' => $genericIntegrationSchema,
            'Zoho CRM' => $genericIntegrationSchema,
            'Close' => $genericIntegrationSchema,
            'Copper' => $genericIntegrationSchema,

            // --- E-commerce ---
            'Stripe' => [
                'required' => ['resource', 'operation'],
                'defaults' => [
                    'resource' => 'Charge',
                    'operation' => 'Create',
                    'amount' => 1000,
                    'currency' => 'usd',
                ],
            ],
            'Shopify' => $genericIntegrationSchema,
            'WooCommerce' => $genericIntegrationSchema,
            'PayPal' => $genericIntegrationSchema,
            'Square' => $genericIntegrationSchema,

            // --- Development ---
            'GitHub' => [
                'required' => ['resource', 'operation', 'owner', 'repository'],
                'defaults' => [
                    'resource' => 'Issue',
                    'operation' => 'Create',
                    'owner' => 'username',
                    'repository' => 'repo-name',
                    'title' => 'New Issue',
                ],
            ],
            'GitLab' => $genericIntegrationSchema,
            'Bitbucket' => $genericIntegrationSchema,
            'Jenkins' => $genericIntegrationSchema,
            'CircleCI' => $genericIntegrationSchema,
            'Docker' => $genericIntegrationSchema,
            'Kubernetes' => $genericIntegrationSchema,

            // --- Database ---
            'MySQL' => [
                'required' => ['operation', 'query'],
                'defaults' => [
                    'operation' => 'Execute Query',
                    'query' => 'SELECT * FROM table_name WHERE id = ?',
                ],
            ],
            'PostgreSQL' => [
                'required' => ['operation', 'query'],
                'defaults' => [
                    'operation' => 'Execute Query',
                    'query' => 'SELECT * FROM table_name WHERE id = $1',
                ],
            ],
            'MongoDB' => [
                'required' => ['operation', 'collection'],
                'defaults' => [
                    'operation' => 'Find',
                    'collection' => 'users',
                    'query' => '{}',
                ],
            ],
            'Redis' => [
                'required' => ['operation', 'key'],
                'defaults' => [
                    'operation' => 'Get',
                    'key' => 'cache_key',
                ],
            ],
            'Supabase' => $genericIntegrationSchema,
            'Firebase' => $genericIntegrationSchema,

            // --- AI ---
            'OpenAI' => [
                'required' => ['resource', 'model', 'prompt'],
                'defaults' => [
                    'resource' => 'Chat',
                    'model' => 'gpt-4o-mini',
                    'temperature' => 0.7,
                    'maxTokens' => 1000,
                    'systemMessage' => 'You are a helpful assistant.',
                    'prompt' => 'Analyze this data: {{ $json }}',
                ],
            ],
            'Anthropic' => [
                'required' => ['model', 'prompt'],
                'defaults' => [
                    'model' => 'claude-3-5-sonnet-20241022',
                    'temperature' => 0.7,
                    'maxTokens' => 1000,
                    'systemMessage' => 'You are a helpful assistant.',
                    'prompt' => 'Analyze: {{ $json }}',
                ],
            ],
            'Google PaLM' => [
                'required' => ['model', 'prompt'],
                'defaults' => [
                    'model' => 'text-bison-001',
                    'prompt' => '{{ $json.text }}',
                ],
            ],
            'Hugging Face' => $genericIntegrationSchema,
            'AI Transform' => $genericIntegrationSchema,

            // --- Cloud ---
            'AWS S3' => [
                'required' => ['operation', 'bucketName'],
                'defaults' => [
                    'operation' => 'Upload',
                    'bucketName' => 'my-bucket',
                    'fileName' => 'file.txt',
                ],
            ],
            'AWS Lambda' => $genericIntegrationSchema,
            'Dropbox' => $genericIntegrationSchema,
            'Box' => $genericIntegrationSchema,
            'OneDrive' => $genericIntegrationSchema,

            // --- Utilities ---
            'Date & Time' => [
                'required' => ['operation', 'value'],
                'defaults' => [
                    'operation' => 'format',
                    'value' => '{{ $now }}',
                    'format' => 'YYYY-MM-DD',
                ],
            ],
            'Set' => [
                'required' => ['values'],
                'defaults' => [
                    'values' => [],
                    'keepOnlySet' => false,
                ],
            ],
            'Function' => [
                'required' => ['functionCode'],
                'defaults' => [
                    'functionCode' => 'return items;',
                ],
            ],
            'Crypto' => $genericIntegrationSchema,
            'XML' => $genericIntegrationSchema,
            'JSON' => $genericIntegrationSchema,
            'HTML Extract' => $genericIntegrationSchema,
            'Compression' => $genericIntegrationSchema,

            // --- Other Services ---
            'Google Analytics' => $genericIntegrationSchema,
            'Facebook' => $genericIntegrationSchema,
            'Instagram' => $genericIntegrationSchema,
            'Twitter' => $genericIntegrationSchema,
            'LinkedIn' => $genericIntegrationSchema,
            'Mailchimp' => $genericIntegrationSchema,
            'SendGrid' => $genericIntegrationSchema,
            'Mixpanel' => $genericIntegrationSchema,
            'Calendly' => $genericIntegrationSchema,
            'Typeform' => $genericIntegrationSchema,
            'Zoom' => $genericIntegrationSchema,
            'Spotify' => $genericIntegrationSchema,
            'YouTube' => $genericIntegrationSchema,
            'RSS Feed' => [
                'required' => ['url'],
                'defaults' => [
                    'url' => 'https://example.com/feed.xml',
                ],
            ],
            'WordPress' => $genericIntegrationSchema,
            'Webflow' => $genericIntegrationSchema,
            'Contentful' => $genericIntegrationSchema,
            'Algolia' => $genericIntegrationSchema,
        ];
    }
}
