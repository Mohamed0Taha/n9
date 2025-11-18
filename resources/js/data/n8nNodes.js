// Complete n8n nodes library extracted from the n8n repository
export const n8nNodes = [
  { id: 'manual-trigger', name: 'Manual Trigger', category: 'Core', icon: '👆', color: '#22c55e', description: 'Trigger workflow manually' },
  { id: 'schedule', name: 'Schedule', category: 'Core', icon: '⏰', color: '#10b981', description: 'Schedule workflow execution' },
  { id: 'http-request', name: 'HTTP Request', category: 'Core', icon: '🌐', color: '#3b82f6', description: 'Make HTTP requests' },
  { id: 'webhook', name: 'Webhook', category: 'Core', icon: '🪝', color: '#8b5cf6', description: 'Receive webhook data' },
  { id: 'code', name: 'Code', category: 'Core', icon: '💻', color: '#f59e0b', description: 'Execute custom code' },
  { id: 'if', name: 'IF', category: 'Flow', icon: '🔀', color: '#10b981', description: 'Conditional routing' },
  { id: 'switch', name: 'Switch', category: 'Flow', icon: '🎚️', color: '#06b6d4', description: 'Multiple conditions' },
  { id: 'merge', name: 'Merge', category: 'Flow', icon: '🔗', color: '#8b5cf6', description: 'Merge data' },
  { id: 'split-in-batches', name: 'Split In Batches', category: 'Flow', icon: '📦', color: '#ec4899', description: 'Process in batches' },
  
  // Communication & Collaboration
  { id: 'slack', name: 'Slack', category: 'Communication', icon: '💬', color: '#4A154B', description: 'Send Slack messages' },
  { id: 'discord', name: 'Discord', category: 'Communication', icon: '🎮', color: '#5865F2', description: 'Discord integration' },
  { id: 'telegram', name: 'Telegram', category: 'Communication', icon: '✈️', color: '#26A5E4', description: 'Telegram bot' },
  { id: 'gmail', name: 'Gmail', category: 'Communication', icon: '📧', color: '#EA4335', description: 'Send emails via Gmail' },
  { id: 'microsoft-teams', name: 'Microsoft Teams', category: 'Communication', icon: '👥', color: '#6264A7', description: 'Teams integration' },
  { id: 'twilio', name: 'Twilio', category: 'Communication', icon: '📱', color: '#F22F46', description: 'Send SMS' },
  { id: 'whatsapp', name: 'WhatsApp', category: 'Communication', icon: '💚', color: '#25D366', description: 'WhatsApp Business' },
  
  // Productivity & PM
  { id: 'notion', name: 'Notion', category: 'Productivity', icon: '📝', color: '#000000', description: 'Notion workspace' },
  { id: 'google-sheets', name: 'Google Sheets', category: 'Productivity', icon: '📊', color: '#0F9D58', description: 'Google Sheets operations' },
  { id: 'google-drive', name: 'Google Drive', category: 'Productivity', icon: '📁', color: '#4285F4', description: 'Google Drive files' },
  { id: 'airtable', name: 'Airtable', category: 'Productivity', icon: '🗄️', color: '#18BFFF', description: 'Airtable database' },
  { id: 'asana', name: 'Asana', category: 'Productivity', icon: '✓', color: '#F06A6A', description: 'Task management' },
  { id: 'trello', name: 'Trello', category: 'Productivity', icon: '📋', color: '#0079BF', description: 'Trello boards' },
  { id: 'monday', name: 'Monday', category: 'Productivity', icon: '🔵', color: '#FF3D57', description: 'Monday.com platform' },
  { id: 'jira', name: 'Jira', category: 'Productivity', icon: '🎫', color: '#0052CC', description: 'Jira issues' },
  { id: 'clickup', name: 'ClickUp', category: 'Productivity', icon: '⬆️', color: '#7B68EE', description: 'ClickUp tasks' },
  { id: 'todoist', name: 'Todoist', category: 'Productivity', icon: '✅', color: '#E44332', description: 'Todoist tasks' },
  
  // CRM & Sales
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', icon: '🧲', color: '#FF7A59', description: 'HubSpot CRM' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', icon: '☁️', color: '#00A1E0', description: 'Salesforce platform' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'CRM', icon: '📈', color: '#1A1A1A', description: 'Pipedrive CRM' },
  { id: 'zoho-crm', name: 'Zoho CRM', category: 'CRM', icon: '🎯', color: '#E42527', description: 'Zoho CRM' },
  { id: 'close', name: 'Close', category: 'CRM', icon: '📞', color: '#0073EA', description: 'Close CRM' },
  { id: 'copper', name: 'Copper', category: 'CRM', icon: '🥉', color: '#FB7E5A', description: 'Copper CRM' },
  
  // E-commerce
  { id: 'shopify', name: 'Shopify', category: 'E-commerce', icon: '🛍️', color: '#96BF48', description: 'Shopify store' },
  { id: 'woocommerce', name: 'WooCommerce', category: 'E-commerce', icon: '🛒', color: '#96588A', description: 'WooCommerce integration' },
  { id: 'stripe', name: 'Stripe', category: 'E-commerce', icon: '💳', color: '#635BFF', description: 'Stripe payments' },
  { id: 'paypal', name: 'PayPal', category: 'E-commerce', icon: '💰', color: '#003087', description: 'PayPal integration' },
  { id: 'square', name: 'Square', category: 'E-commerce', icon: '⬛', color: '#000000', description: 'Square payments' },
  
  // Development & DevOps
  { id: 'github', name: 'GitHub', category: 'Development', icon: '🐙', color: '#181717', description: 'GitHub repositories' },
  { id: 'gitlab', name: 'GitLab', category: 'Development', icon: '🦊', color: '#FC6D26', description: 'GitLab projects' },
  { id: 'bitbucket', name: 'Bitbucket', category: 'Development', icon: '🪣', color: '#0052CC', description: 'Bitbucket repos' },
  { id: 'jenkins', name: 'Jenkins', category: 'Development', icon: '⚙️', color: '#D24939', description: 'Jenkins CI/CD' },
  { id: 'circleci', name: 'CircleCI', category: 'Development', icon: '⭕', color: '#343434', description: 'CircleCI builds' },
  { id: 'docker', name: 'Docker', category: 'Development', icon: '🐳', color: '#2496ED', description: 'Docker containers' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'Development', icon: '☸️', color: '#326CE5', description: 'Kubernetes cluster' },
  
  // Databases
  { id: 'mysql', name: 'MySQL', category: 'Database', icon: '🐬', color: '#4479A1', description: 'MySQL database' },
  { id: 'postgres', name: 'PostgreSQL', category: 'Database', icon: '🐘', color: '#336791', description: 'PostgreSQL database' },
  { id: 'mongodb', name: 'MongoDB', category: 'Database', icon: '🍃', color: '#47A248', description: 'MongoDB database' },
  { id: 'redis', name: 'Redis', category: 'Database', icon: '🔴', color: '#DC382D', description: 'Redis cache' },
  { id: 'supabase', name: 'Supabase', category: 'Database', icon: '⚡', color: '#3ECF8E', description: 'Supabase backend' },
  { id: 'firebase', name: 'Firebase', category: 'Database', icon: '🔥', color: '#FFCA28', description: 'Firebase services' },
  
  // Marketing & Analytics
  { id: 'google-analytics', name: 'Google Analytics', category: 'Analytics', icon: '📊', color: '#E37400', description: 'Google Analytics data' },
  { id: 'facebook', name: 'Facebook', category: 'Marketing', icon: '👍', color: '#1877F2', description: 'Facebook integration' },
  { id: 'instagram', name: 'Instagram', category: 'Marketing', icon: '📷', color: '#E4405F', description: 'Instagram posts' },
  { id: 'twitter', name: 'Twitter', category: 'Marketing', icon: '🐦', color: '#1DA1F2', description: 'Twitter/X API' },
  { id: 'linkedin', name: 'LinkedIn', category: 'Marketing', icon: '💼', color: '#0A66C2', description: 'LinkedIn integration' },
  { id: 'mailchimp', name: 'Mailchimp', category: 'Marketing', icon: '🐵', color: '#FFE01B', description: 'Email marketing' },
  { id: 'sendgrid', name: 'SendGrid', category: 'Marketing', icon: '📬', color: '#1A82E2', description: 'SendGrid emails' },
  { id: 'mixpanel', name: 'Mixpanel', category: 'Analytics', icon: '📈', color: '#7856FF', description: 'Mixpanel analytics' },
  
  // Cloud & Storage
  { id: 'aws-s3', name: 'AWS S3', category: 'Cloud', icon: '☁️', color: '#FF9900', description: 'Amazon S3 storage' },
  { id: 'aws-lambda', name: 'AWS Lambda', category: 'Cloud', icon: 'λ', color: '#FF9900', description: 'AWS Lambda functions' },
  { id: 'dropbox', name: 'Dropbox', category: 'Cloud', icon: '📦', color: '#0061FF', description: 'Dropbox storage' },
  { id: 'box', name: 'Box', category: 'Cloud', icon: '📁', color: '#0061D5', description: 'Box storage' },
  { id: 'onedrive', name: 'OneDrive', category: 'Cloud', icon: '☁️', color: '#0078D4', description: 'Microsoft OneDrive' },
  
  // AI & ML
  { id: 'openai', name: 'OpenAI', category: 'AI', icon: '🤖', color: '#10A37F', description: 'OpenAI GPT' },
  { id: 'anthropic', name: 'Anthropic', category: 'AI', icon: '🧠', color: '#191919', description: 'Claude AI' },
  { id: 'google-palm', name: 'Google PaLM', category: 'AI', icon: '🌴', color: '#4285F4', description: 'Google PaLM API' },
  { id: 'huggingface', name: 'Hugging Face', category: 'AI', icon: '🤗', color: '#FFD21E', description: 'Hugging Face models' },
  { id: 'ai-transform', name: 'AI Transform', category: 'AI', icon: '✨', color: '#8B5CF6', description: 'AI data transformation' },
  
  // Utilities
  { id: 'datetime', name: 'Date & Time', category: 'Utilities', icon: '⏰', color: '#64748b', description: 'Date operations' },
  { id: 'set', name: 'Set', category: 'Utilities', icon: '⚙️', color: '#64748b', description: 'Set values' },
  { id: 'function', name: 'Function', category: 'Utilities', icon: 'ƒ', color: '#64748b', description: 'Custom function' },
  { id: 'crypto', name: 'Crypto', category: 'Utilities', icon: '🔐', color: '#64748b', description: 'Encryption operations' },
  { id: 'xml', name: 'XML', category: 'Utilities', icon: '📄', color: '#64748b', description: 'XML parsing' },
  { id: 'json', name: 'JSON', category: 'Utilities', icon: '{', color: '#64748b', description: 'JSON operations' },
  { id: 'html-extract', name: 'HTML Extract', category: 'Utilities', icon: '🌐', color: '#64748b', description: 'Extract HTML data' },
  { id: 'compress', name: 'Compression', category: 'Utilities', icon: '🗜️', color: '#64748b', description: 'Compress/decompress' },
  
  // Additional popular nodes
  { id: 'calendly', name: 'Calendly', category: 'Scheduling', icon: '📅', color: '#006BFF', description: 'Calendly events' },
  { id: 'typeform', name: 'Typeform', category: 'Forms', icon: '📋', color: '#262627', description: 'Typeform responses' },
  { id: 'zoom', name: 'Zoom', category: 'Video', icon: '🎥', color: '#2D8CFF', description: 'Zoom meetings' },
  { id: 'spotify', name: 'Spotify', category: 'Music', icon: '🎵', color: '#1DB954', description: 'Spotify API' },
  { id: 'youtube', name: 'YouTube', category: 'Video', icon: '📺', color: '#FF0000', description: 'YouTube operations' },
  { id: 'rss', name: 'RSS Feed', category: 'Content', icon: '📡', color: '#FFA500', description: 'RSS feed reader' },
  { id: 'wordpress', name: 'WordPress', category: 'CMS', icon: '📝', color: '#21759B', description: 'WordPress site' },
  { id: 'webflow', name: 'Webflow', category: 'CMS', icon: '🎨', color: '#4353FF', description: 'Webflow CMS' },
  { id: 'contentful', name: 'Contentful', category: 'CMS', icon: '📚', color: '#2478CC', description: 'Contentful CMS' },
  { id: 'algolia', name: 'Algolia', category: 'Search', icon: '🔍', color: '#5468FF', description: 'Algolia search' },
];

export const nodeCategories = [
  'All',
  'Core',
  'Flow',
  'Communication',
  'Productivity',
  'CRM',
  'E-commerce',
  'Development',
  'Database',
  'Analytics',
  'Marketing',
  'Cloud',
  'AI',
  'Utilities',
  'Scheduling',
  'Forms',
  'Video',
  'Music',
  'Content',
  'CMS',
  'Search',
];

export function getNodesByCategory(category) {
  if (!category || category === 'All') {
    return n8nNodes;
  }
  return n8nNodes.filter(node => node.category === category);
}

export function searchNodes(query) {
  const lowerQuery = query.toLowerCase();
  return n8nNodes.filter(
    node => 
      node.name.toLowerCase().includes(lowerQuery) ||
      node.category.toLowerCase().includes(lowerQuery) ||
      node.description.toLowerCase().includes(lowerQuery)
  );
}
