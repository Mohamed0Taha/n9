<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class WorkflowDslParser
{
    /**
     * Valid node types that can be used in workflows - exact names from sidebar
     */
    private const VALID_NODE_TYPES = [
        'Start', 'Schedule', 'HTTP Request', 'Webhook', 'Code', 'Function',
        'IF', 'Switch', 'Merge', 'Split In Batches',
        'Slack', 'Discord', 'Telegram', 'Gmail', 'Microsoft Teams', 'Twilio', 'WhatsApp',
        'Notion', 'Google Sheets', 'Google Drive', 'Airtable', 'Asana', 'Trello', 'Monday', 'Jira', 'ClickUp', 'Todoist',
        'HubSpot', 'Salesforce', 'Pipedrive', 'Zoho CRM', 'Close', 'Copper',
        'Shopify', 'WooCommerce', 'Stripe', 'PayPal', 'Square',
        'GitHub', 'GitLab', 'Bitbucket', 'Jenkins', 'CircleCI', 'Docker', 'Kubernetes',
        'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase',
        'Google Analytics', 'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'Mailchimp', 'SendGrid', 'Mixpanel',
        'AWS S3', 'AWS Lambda', 'Dropbox', 'Box', 'OneDrive',
        'OpenAI', 'Anthropic', 'Google PaLM', 'Hugging Face', 'AI Transform',
        'Date & Time', 'Set', 'Function', 'Crypto', 'XML', 'JSON', 'HTML Extract', 'Compression',
        'Calendly', 'Typeform', 'Zoom', 'Spotify', 'YouTube', 'RSS Feed', 'WordPress', 'Webflow', 'Contentful', 'Algolia',
    ];

    /**
     * Validate the AI response and normalize the workflow graph.
     *
     * @throws ValidationException
     */
    public function parse(array $payload): array
    {
        $nodes = Arr::get($payload, 'nodes', []);
        $edges = Arr::get($payload, 'edges', []);

        if (!is_array($nodes) || count($nodes) === 0) {
            throw ValidationException::withMessages([
                'nodes' => ['At least one node is required.'],
            ]);
        }

        foreach ($nodes as $index => $node) {
            if (empty($node['id'] ?? null)) {
                throw ValidationException::withMessages([
                    "nodes.{$index}.id" => ['Each node needs an id.'],
                ]);
            }

            // Validate node type
            $nodeType = $node['type'] ?? null;
            if (empty($nodeType)) {
                throw ValidationException::withMessages([
                    "nodes.{$index}.type" => ['Node type is required.'],
                ]);
            }

            if (!in_array($nodeType, self::VALID_NODE_TYPES, true)) {
                throw ValidationException::withMessages([
                    "nodes.{$index}.type" => [
                        "Invalid node type '{$nodeType}'. Must be one of the available node types."
                    ],
                ]);
            }

            // Validate and enhance node configuration
            $nodeData = $node['data'] ?? [];
            
            // Get default configuration for this node type
            $defaults = NodeConfigurationSchema::getDefaultConfig($nodeType);
            
            // Merge with defaults (user data takes precedence)
            $nodeData = array_merge($defaults, $nodeData);
            
            // Validate required fields
            $missing = NodeConfigurationSchema::validate($nodeType, $nodeData);
            if (!empty($missing)) {
                \Log::warning("Node '{$nodeType}' at index {$index} is missing required fields", [
                    'missing_fields' => $missing,
                    'node_id' => $node['id'] ?? 'unknown',
                ]);
                // Don't throw error, just log warning and use defaults
            }
            
            $nodes[$index]['data'] = $nodeData;
        }

        $normalizedEdges = [];
        foreach ($edges as $edge) {
            if (!isset($edge['source'], $edge['target'])) {
                continue;
            }
            $normalizedEdges[] = [
                'id' => $edge['id'] ?? $edge['source'] . '-' . $edge['target'],
                'source' => $edge['source'],
                'target' => $edge['target'],
            ];
        }

        return [
            'nodes' => $nodes,
            'edges' => $normalizedEdges,
        ];
    }
}
