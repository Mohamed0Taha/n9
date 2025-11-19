<?php

namespace App\Services;

use App\Models\AiSession;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AiWorkflowGenerator
{
    public function __construct(
        private WorkflowDslParser $parser,
    ) {
    }

    public function generate(string $prompt, User $user, ?array $selectedNodes = null, string $mode = 'create'): array
    {
        $prompt = trim($prompt);
        $openAiResponse = $this->generateViaOpenAi($prompt, $user, $selectedNodes, $mode);

        if ($openAiResponse) {
            return $openAiResponse;
        }

        return $this->fallbackWorkflow($prompt, $user);
    }

    protected function generateViaOpenAi(string $prompt, User $user, ?array $selectedNodes = null, string $mode = 'create'): ?array
    {
        $apiKey = config('services.openai.api_key');

        if (!$apiKey) {
            return null;
        }

        try {
            $systemPrompt = NodeConfigurationContext::getSystemPrompt();
            $availableNodes = NodeConfigurationContext::getAvailableNodesList();

            // Build user message based on mode
            $userMessage = "User request: {$prompt}\n\nIMPORTANT: Use ONLY these exact node types: {$availableNodes}\n\n";

            if ($mode === 'edit' && $selectedNodes && count($selectedNodes) > 0) {
                $userMessage .= "MODE: EDIT SELECTED NODES\n\n";
                $userMessage .= "The user has selected " . count($selectedNodes) . " node(s) to edit:\n";
                $userMessage .= json_encode($selectedNodes, JSON_PRETTY_PRINT) . "\n\n";
                $userMessage .= "Please modify these nodes according to the user's request. You may:\n";
                $userMessage .= "1. Update node configurations (data fields)\n";
                $userMessage .= "2. Change node types if needed\n";
                $userMessage .= "3. Add new nodes to extend the workflow\n";
                $userMessage .= "4. Modify connections between nodes\n";
                $userMessage .= "5. Preserve node IDs where possible to maintain context\n\n";
            }

            $userMessage .= "Generate a workflow with:\n1. Node 'type' field using EXACT names from the list above\n2. Node 'data' object with COMPLETE configuration parameters\n3. All required fields filled with realistic values\n4. RESPECT INPUT/OUTPUT CONSTRAINTS:\n   - Start/Webhook/Schedule nodes: NO inputs (they trigger workflows)\n   - IF nodes: 1 input, connect to 2 outputs (True/False paths)\n   - Merge nodes: Connect MULTIPLE inputs to 1 output\n   - HTTP Request: Can connect Success output to next node, Error output to notification\n   - Standard nodes: 1 input, 1 output flow\n\nDO NOT create custom node types. DO NOT use abbreviations.";

            $response = Http::timeout(60)
                ->withToken($apiKey)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4o-mini',
                    'temperature' => 0.2,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => $systemPrompt,
                        ],
                        [
                            'role' => 'user',
                            'content' => $userMessage,
                        ],
                    ],
                ]);

            if ($response->failed()) {
                Log::warning('OpenAI workflow generation failed', ['body' => $response->body()]);
                return null;
            }

            $content = trim($response->json('choices.0.message.content', ''));
            $content = preg_replace('/^```json|```$/m', '', $content);
            $decoded = json_decode($content, true);

            if (!is_array($decoded)) {
                Log::warning('OpenAI workflow generation returned invalid JSON', ['content' => $content]);
                return null;
            }

            // Log what node types the AI generated for debugging
            $generatedTypes = array_map(fn($node) => $node['type'] ?? 'unknown', $decoded['nodes'] ?? []);
            Log::info('AI generated workflow with node types', ['types' => $generatedTypes]);

            $graph = $this->parser->parse([
                'nodes' => $decoded['nodes'] ?? [],
                'edges' => $decoded['edges'] ?? [],
            ]);

            $payload = [
                'name' => $decoded['name'] ?? Str::headline(Str::limit($prompt, 32)),
                'description' => $decoded['description'] ?? $prompt,
                'graph' => $graph,
            ];

            AiSession::create([
                'workflow_id' => null,
                'user_id' => $user->id,
                'prompt' => $prompt,
                'response' => $decoded,
                'token_cost' => $response->json('usage.total_tokens', 0),
            ]);

            return $payload;
        } catch (\Throwable $exception) {
            Log::error('OpenAI workflow generation exception', [
                'message' => $exception->getMessage(),
            ]);
            return null;
        }
    }

    protected function fallbackWorkflow(string $prompt, User $user): array
    {
        $promptLower = strtolower($prompt);
        
        // Start with a trigger node
        $nodes = [
            [
                'id' => 'start_' . Str::random(5),
                'type' => 'Start',
                'label' => 'Start',
                'data' => array_merge(
                    NodeConfigurationSchema::getDefaultConfig('Start'),
                    ['description' => "Manually triggered workflow: {$prompt}"]
                ),
            ],
        ];

        $edges = [];

        // HTTP/API operations
        if (Str::contains($promptLower, ['api', 'http', 'fetch', 'get data', 'request'])) {
            $nodes[] = [
                'id' => 'http_' . Str::random(5),
                'type' => 'HTTP Request',
                'label' => 'Fetch Data',
                'data' => NodeConfigurationSchema::getDefaultConfig('HTTP Request'),
            ];
            $edges[] = [
                'source' => $nodes[0]['id'],
                'target' => $nodes[count($nodes) - 1]['id'],
            ];
        }

        // AI/LLM operations
        if (Str::contains($promptLower, ['ai', 'gpt', 'openai', 'summarize', 'analyze', 'generate'])) {
            $aiNode = [
                'id' => 'openai_' . Str::random(5),
                'type' => 'OpenAI',
                'label' => 'Analyze with AI',
                'data' => array_merge(
                    NodeConfigurationSchema::getDefaultConfig('OpenAI'),
                    ['prompt' => "Task: {$prompt}\n\nInput: {{ \$json.data }}"]
                ),
            ];
            $nodes[] = $aiNode;
            $edges[] = [
                'source' => $nodes[count($nodes) - 2]['id'],
                'target' => $aiNode['id'],
            ];
        }

        // Slack notifications
        if (Str::contains($promptLower, ['slack', 'notify', 'alert', 'message'])) {
            $slackNode = [
                'id' => 'slack_' . Str::random(5),
                'type' => 'Slack',
                'label' => 'Send Notification',
                'data' => array_merge(
                    NodeConfigurationSchema::getDefaultConfig('Slack'),
                    ['text' => "Workflow result: {{ \$json.output }}"]
                ),
            ];
            $nodes[] = $slackNode;
            $edges[] = [
                'source' => $nodes[count($nodes) - 2]['id'],
                'target' => $slackNode['id'],
            ];
        }

        // Email operations
        if (Str::contains($promptLower, ['email', 'gmail', 'mail', 'send'])) {
            $emailNode = [
                'id' => 'gmail_' . Str::random(5),
                'type' => 'Gmail',
                'label' => 'Send Email',
                'data' => array_merge(
                    NodeConfigurationSchema::getDefaultConfig('Gmail'),
                    [
                        'subject' => "Workflow: {$prompt}",
                        'message' => "Results: {{ \$json.output }}"
                    ]
                ),
            ];
            $nodes[] = $emailNode;
            $edges[] = [
                'source' => $nodes[count($nodes) - 2]['id'],
                'target' => $emailNode['id'],
            ];
        }

        // Database operations
        if (Str::contains($promptLower, ['database', 'mysql', 'postgres', 'sql', 'query'])) {
            $dbNode = [
                'id' => 'mysql_' . Str::random(5),
                'type' => 'MySQL',
                'label' => 'Query Database',
                'data' => array_merge(
                    NodeConfigurationSchema::getDefaultConfig('MySQL'),
                    ['query' => 'SELECT * FROM users WHERE status = ?']
                ),
            ];
            $nodes[] = $dbNode;
            $edges[] = [
                'source' => $nodes[count($nodes) - 2]['id'],
                'target' => $dbNode['id'],
            ];
        }

        // Spreadsheet operations
        if (Str::contains($promptLower, ['spreadsheet', 'sheets', 'google sheets', 'excel'])) {
            $sheetsNode = [
                'id' => 'sheets_' . Str::random(5),
                'type' => 'Google Sheets',
                'label' => 'Update Spreadsheet',
                'data' => NodeConfigurationSchema::getDefaultConfig('Google Sheets'),
            ];
            $nodes[] = $sheetsNode;
            $edges[] = [
                'source' => $nodes[count($nodes) - 2]['id'],
                'target' => $sheetsNode['id'],
            ];
        }

        // If only one node (start), add a simple HTTP request
        if (count($nodes) === 1) {
            $nodes[] = [
                'id' => 'http_' . Str::random(5),
                'type' => 'HTTP Request',
                'label' => 'Fetch Data',
                'data' => NodeConfigurationSchema::getDefaultConfig('HTTP Request'),
            ];
            $edges[] = [
                'source' => $nodes[0]['id'],
                'target' => $nodes[1]['id'],
            ];
        }

        $graph = $this->parser->parse([
            'nodes' => $nodes,
            'edges' => $edges,
        ]);

        AiSession::create([
            'workflow_id' => null,
            'user_id' => $user->id,
            'prompt' => $prompt,
            'response' => [
                'graph' => $graph,
                'explanation' => 'Fallback heuristic result',
            ],
            'token_cost' => 0.0,
        ]);

        return [
            'name' => Str::headline(Str::limit($prompt, 32)),
            'description' => $prompt,
            'graph' => $graph,
        ];
    }
}
