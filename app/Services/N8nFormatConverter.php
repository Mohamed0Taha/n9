<?php

namespace App\Services;

/**
 * Converts between our workflow format and n8n's native format
 */
class N8nFormatConverter
{
    /**
     * Convert n8n workflow to our internal format
     */
    public static function fromN8n(array $n8nWorkflow): array
    {
        $nodes = [];
        $edges = [];

        // Extract workflow metadata
        $name = $n8nWorkflow['name'] ?? 'Imported Workflow';
        $description = $n8nWorkflow['meta']['description'] ?? '';

        // Convert nodes
        foreach ($n8nWorkflow['nodes'] ?? [] as $n8nNode) {
            $nodes[] = [
                'id' => $n8nNode['id'] ?? $n8nNode['name'],
                'type' => self::mapN8nNodeType($n8nNode['type'] ?? ''),
                'label' => $n8nNode['name'] ?? $n8nNode['type'],
                'data' => self::extractNodeData($n8nNode),
                'position' => [
                    'x' => $n8nNode['position'][0] ?? 0,
                    'y' => $n8nNode['position'][1] ?? 0,
                ],
            ];
        }

        // Convert connections to edges
        // n8n structure: connections[nodeName][outputType][outputIndex][connectionIndex]
        foreach ($n8nWorkflow['connections'] ?? [] as $sourceNode => $outputs) {
            foreach ($outputs as $outputType => $outputArray) {
                // Each output type (e.g., "main") has an array of connection arrays
                foreach ($outputArray as $outputIndex => $connections) {
                    // Each connections entry is an array of connection objects
                    if (is_array($connections)) {
                        foreach ($connections as $connection) {
                            if (isset($connection['node'])) {
                                $edges[] = [
                                    'id' => $sourceNode . '-' . $connection['node'],
                                    'source' => $this->findNodeIdByName($n8nWorkflow['nodes'] ?? [], $sourceNode),
                                    'target' => $this->findNodeIdByName($n8nWorkflow['nodes'] ?? [], $connection['node']),
                                    'sourceOutput' => $outputType,
                                    'targetInput' => $connection['type'] ?? 'main',
                                ];
                            }
                        }
                    }
                }
            }
        }

        return [
            'name' => $name,
            'description' => $description,
            'graph' => [
                'nodes' => $nodes,
                'edges' => $edges,
            ],
        ];
    }

    /**
     * Convert our internal format to n8n workflow
     */
    public static function toN8n(array $workflow): array
    {
        $nodes = [];
        $connections = [];

        // Convert nodes
        foreach ($workflow['graph']['nodes'] ?? [] as $node) {
            $n8nNode = [
                'id' => $node['id'],
                'name' => $node['label'] ?? $node['type'],
                'type' => self::mapToN8nNodeType($node['type']),
                'typeVersion' => 1,
                'position' => [
                    (int) ($node['position']['x'] ?? 250),
                    (int) ($node['position']['y'] ?? 250),
                ],
                'parameters' => self::convertNodeData($node['data'] ?? []),
            ];

            // Add credentials reference if needed
            if (self::nodeRequiresCredentials($node['type'])) {
                $n8nNode['credentials'] = self::getCredentialMapping($node['type']);
            }

            $nodes[] = $n8nNode;
        }

        // Convert edges to connections
        foreach ($workflow['graph']['edges'] ?? [] as $edge) {
            $source = $edge['source'];
            $target = $edge['target'];
            $outputIndex = $edge['sourceOutput'] ?? 'main';

            if (!isset($connections[$source])) {
                $connections[$source] = [];
            }

            if (!isset($connections[$source][$outputIndex])) {
                $connections[$source][$outputIndex] = [];
            }

            $connections[$source][$outputIndex][] = [
                'node' => $target,
                'type' => $edge['targetInput'] ?? 'main',
                'index' => 0,
            ];
        }

        return [
            'name' => $workflow['name'] ?? 'Workflow',
            'nodes' => $nodes,
            'connections' => $connections,
            'active' => false,
            'settings' => [
                'executionOrder' => 'v1',
            ],
            'versionId' => bin2hex(random_bytes(16)),
            'meta' => [
                'instanceId' => config('app.name'),
                'description' => $workflow['description'] ?? '',
            ],
        ];
    }

    /**
     * Find node ID by node name (n8n uses names in connections)
     */
    private static function findNodeIdByName(array $nodes, string $name): string
    {
        foreach ($nodes as $node) {
            if (($node['name'] ?? '') === $name) {
                return $node['id'] ?? $name;
            }
        }
        // If not found, return the name itself as fallback
        return $name;
    }

    /**
     * Map n8n node types to our node types
     */
    private static function mapN8nNodeType(string $n8nType): string
    {
        $mapping = [
            'n8n-nodes-base.manualTrigger' => 'Start',
            'n8n-nodes-base.start' => 'Start',
            'n8n-nodes-base.scheduleTrigger' => 'Schedule',
            'n8n-nodes-base.httpRequest' => 'HTTP Request',
            'n8n-nodes-base.webhook' => 'Webhook',
            'n8n-nodes-base.code' => 'Code',
            'n8n-nodes-base.function' => 'Function',
            'n8n-nodes-base.if' => 'IF',
            'n8n-nodes-base.switch' => 'Switch',
            'n8n-nodes-base.merge' => 'Merge',
            'n8n-nodes-base.splitInBatches' => 'Split In Batches',
            'n8n-nodes-base.slack' => 'Slack',
            'n8n-nodes-base.discord' => 'Discord',
            'n8n-nodes-base.telegram' => 'Telegram',
            'n8n-nodes-base.gmail' => 'Gmail',
            'n8n-nodes-base.microsoftTeams' => 'Microsoft Teams',
            'n8n-nodes-base.twilio' => 'Twilio',
            'n8n-nodes-base.whatsApp' => 'WhatsApp',
            'n8n-nodes-base.notion' => 'Notion',
            'n8n-nodes-base.googleSheets' => 'Google Sheets',
            'n8n-nodes-base.googleDrive' => 'Google Drive',
            'n8n-nodes-base.airtable' => 'Airtable',
            'n8n-nodes-base.rssFeedRead' => 'RSS Feed',
            'n8n-nodes-base.mysql' => 'MySQL',
            'n8n-nodes-base.postgres' => 'PostgreSQL',
            'n8n-nodes-base.mongoDb' => 'MongoDB',
            'n8n-nodes-base.redis' => 'Redis',
            'n8n-nodes-base.openAi' => 'OpenAI',
            'n8n-nodes-base.hubspot' => 'HubSpot',
            'n8n-nodes-base.salesforce' => 'Salesforce',
            'n8n-nodes-base.stripe' => 'Stripe',
            'n8n-nodes-base.github' => 'GitHub',
            'n8n-nodes-base.awsS3' => 'AWS S3',
        ];

        return $mapping[$n8nType] ?? $n8nType;
    }

    /**
     * Map our node types to n8n node types
     */
    private static function mapToN8nNodeType(string $ourType): string
    {
        $mapping = [
            'Start' => 'n8n-nodes-base.manualTrigger',
            'Schedule' => 'n8n-nodes-base.scheduleTrigger',
            'HTTP Request' => 'n8n-nodes-base.httpRequest',
            'Webhook' => 'n8n-nodes-base.webhook',
            'Code' => 'n8n-nodes-base.code',
            'Function' => 'n8n-nodes-base.function',
            'IF' => 'n8n-nodes-base.if',
            'Switch' => 'n8n-nodes-base.switch',
            'Merge' => 'n8n-nodes-base.merge',
            'Split In Batches' => 'n8n-nodes-base.splitInBatches',
            'Slack' => 'n8n-nodes-base.slack',
            'Discord' => 'n8n-nodes-base.discord',
            'Telegram' => 'n8n-nodes-base.telegram',
            'Gmail' => 'n8n-nodes-base.gmail',
            'Microsoft Teams' => 'n8n-nodes-base.microsoftTeams',
            'Twilio' => 'n8n-nodes-base.twilio',
            'WhatsApp' => 'n8n-nodes-base.whatsApp',
            'Notion' => 'n8n-nodes-base.notion',
            'Google Sheets' => 'n8n-nodes-base.googleSheets',
            'Google Drive' => 'n8n-nodes-base.googleDrive',
            'Airtable' => 'n8n-nodes-base.airtable',
            'RSS Feed' => 'n8n-nodes-base.rssFeedRead',
            'MySQL' => 'n8n-nodes-base.mysql',
            'PostgreSQL' => 'n8n-nodes-base.postgres',
            'MongoDB' => 'n8n-nodes-base.mongoDb',
            'Redis' => 'n8n-nodes-base.redis',
            'OpenAI' => 'n8n-nodes-base.openAi',
            'HubSpot' => 'n8n-nodes-base.hubspot',
            'Salesforce' => 'n8n-nodes-base.salesforce',
            'Stripe' => 'n8n-nodes-base.stripe',
            'GitHub' => 'n8n-nodes-base.github',
            'AWS S3' => 'n8n-nodes-base.awsS3',
        ];

        return $mapping[$ourType] ?? 'n8n-nodes-base.noOp';
    }

    /**
     * Extract node data from n8n node
     */
    private static function extractNodeData(array $n8nNode): array
    {
        return $n8nNode['parameters'] ?? [];
    }

    /**
     * Convert our node data to n8n parameters
     */
    private static function convertNodeData(array $data): array
    {
        // Remove our internal metadata fields
        unset($data['icon'], $data['color'], $data['category'], $data['description']);
        
        return $data;
    }

    /**
     * Check if node type requires credentials
     */
    private static function nodeRequiresCredentials(string $nodeType): bool
    {
        $credentialNodes = [
            'Slack', 'Gmail', 'OpenAI', 'HubSpot', 'Salesforce', 
            'Stripe', 'GitHub', 'MySQL', 'PostgreSQL', 'MongoDB',
            'Google Sheets', 'Google Drive', 'Notion', 'Airtable',
        ];

        return in_array($nodeType, $credentialNodes);
    }

    /**
     * Get credential mapping for node type
     */
    private static function getCredentialMapping(string $nodeType): array
    {
        // Return empty array - credentials need to be configured in n8n
        return [];
    }

    /**
     * Validate n8n workflow structure
     */
    public static function validateN8nWorkflow(array $workflow): bool
    {
        if (!isset($workflow['nodes']) || !is_array($workflow['nodes'])) {
            return false;
        }

        if (!isset($workflow['connections'])) {
            return false;
        }

        // Check if at least one node exists
        return count($workflow['nodes']) > 0;
    }
}
