# n9 - Workflow Automation Platform 🚀

<p align="center">
  <strong>A powerful n8n-style workflow automation platform with 100+ nodes, real API integrations, and AI-powered workflow generation</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11-FF2D20?style=flat&logo=laravel" alt="Laravel">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react" alt="React">
  <img src="https://img.shields.io/badge/ReactFlow-11-FF385C?style=flat" alt="React Flow">
  <img src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat&logo=tailwind-css" alt="Tailwind">
</p>

---

## ✨ Features

### 🎨 **Professional n8n-Style UI**
- Beautiful gradient nodes with distinct colors for each type
- Large, easy-to-click connection handles (12x12px)
- Clear labeled inputs/outputs (TRUE/FALSE for IF, Input 1/Input 2 for Merge, etc.)
- Real-time execution status badges
- Drag-and-drop workflow builder

### 🔧 **100+ Integrated Nodes**
#### Core Nodes
- **HTTP Request** - Full REST API support (GET, POST, PUT, DELETE, PATCH)
- **Webhook** - Trigger workflows via HTTP endpoints
- **Code** - Execute JavaScript/Python code
- **IF** - Conditional routing with TRUE/FALSE paths
- **Switch** - Multi-path routing
- **Merge** - Combine data from multiple sources
- **Split** - Split data into multiple outputs

#### Communication
- **Slack** - Send messages and notifications
- **Discord** - Bot integration
- **Gmail** - Send emails
- **Telegram** - Send messages
- **Microsoft Teams** - Team notifications

#### AI & ML
- **OpenAI** - GPT integrations
- **Anthropic** - Claude AI
- **Google AI** - Gemini/PaLM

#### Productivity
- **Google Sheets** - Spreadsheet automation
- **Airtable** - Database operations
- **Notion** - Workspace automation
- **Trello** - Project management

#### CRM & Sales
- **Salesforce** - CRM operations
- **HubSpot** - Marketing automation
- **Pipedrive** - Sales pipeline
- **Zendesk** - Customer support

#### Development
- **GitHub** - Repository operations
- **GitLab** - CI/CD integration
- **Jira** - Issue tracking
- **Docker** - Container management

### 🤖 **AI-Powered Workflow Generation**
- Natural language workflow creation
- Intelligent node configuration
- Context-aware suggestions
- Multi-turn conversation support

### ⚡ **Real Execution Engine**
- Background job processing with Laravel Queue
- Real-time status updates
- Conditional routing support
- Error handling and retries
- 5-minute timeout for complex workflows

### 🎯 **Advanced Features**
- **Input/Output Panels** - n8n-style 3-panel layout
- **Execution History** - Track all workflow runs
- **Node Configuration** - Comprehensive settings for each node
- **Connection Routing** - Smart data flow based on conditions
- **Fresh Data** - Automatic data clearing on new execution

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer
- MySQL/PostgreSQL
- Redis (optional, for better queue performance)

### Installation

```bash
# Clone repository
git clone https://github.com/Mohamed0Taha/n9.git
cd n9

# Install dependencies
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate
php artisan db:seed

# Build assets
npm run build

# Start queue worker (REQUIRED for workflow execution)
./START_QUEUE_WORKER.sh
# OR manually:
php artisan queue:work --timeout=300 --tries=3

# Start server
php artisan serve
```

Visit `http://localhost:8000` 🎉

---

## 📖 Documentation

### Core Guides
- **[Quick Start Guide](QUICK_START.md)** - Get up and running
- **[Node Configuration](NODE_CONFIGURATION_GUIDE.md)** - Configure nodes
- **[IF Node Guide](IF_NODE_GUIDE.md)** - Conditional routing
- **[HTTP Methods Guide](HTTP_METHODS_GUIDE.md)** - REST API usage

### Advanced Guides
- **[AI Workflow Generation](AI_WORKFLOW_GENERATION.md)** - Natural language workflows
- **[Node Labels Guide](NODE_LABELS_GUIDE.md)** - Understanding connections
- **[Visual Improvements](NODE_VISUAL_IMPROVEMENTS.md)** - UI enhancements
- **[Timeout Fix](TIMEOUT_FIX_README.md)** - Queue worker setup

### Testing & Implementation
- **[All 100 Nodes Complete](ALL_100_NODES_COMPLETE.md)** - Node catalog
- **[Node Testing Guide](NODE_TESTING_GUIDE.md)** - Testing strategies
- **[Test Checklist](ALL_NODES_TEST_CHECKLIST.md)** - Comprehensive tests

---

## 🎮 Usage

### Creating a Workflow

1. **Add Nodes**
   - Drag nodes from sidebar to canvas
   - Or use AI prompt: "Create a workflow that sends Slack message when HTTP request succeeds"

2. **Connect Nodes**
   - Click output handle (cyan circle)
   - Drag to input handle (green circle)
   - Conditional nodes (IF) route through TRUE/FALSE outputs

3. **Configure Nodes**
   - Click node settings button (⚙️)
   - Fill in parameters
   - Test configuration

4. **Execute**
   - Click "▶️ Execute" button
   - Watch real-time status updates
   - Check results in OUTPUT panel

### Example Workflows

#### Simple API to Slack
```
Start → HTTP Request → Slack
```

#### Conditional Routing
```
Start → HTTP Request → IF
                       ├─ TRUE → Slack (success)
                       └─ FALSE → Gmail (error)
```

#### Multi-Source Merge
```
HTTP Request 1 ─┐
                ├─ Merge → Code → Slack
HTTP Request 2 ─┘
```

---

## 🏗️ Architecture

### Tech Stack
- **Backend**: Laravel 11 (PHP 8.2)
- **Frontend**: React 18 + Vite
- **Canvas**: React Flow 11
- **Styling**: TailwindCSS 3
- **Queue**: Laravel Queue (Database driver)
- **Database**: MySQL/PostgreSQL

### Project Structure
```
n9/
├── app/
│   ├── Http/Controllers/    # API endpoints
│   ├── Jobs/                # RunWorkflow job
│   ├── Models/              # Eloquent models
│   └── Services/            # AI & workflow services
├── resources/
│   ├── js/
│   │   ├── components/      # React components
│   │   └── data/            # Node configurations
│   └── views/               # Blade templates
├── routes/
│   ├── web.php             # Main routes
│   └── test-http.php       # HTTP test routes
└── database/
    └── migrations/         # Database schema
```

### Key Components
- **`App.jsx`** - Main application controller
- **`WorkflowCanvas.jsx`** - Canvas and node management
- **`N8nStyleNode.jsx`** - Node rendering with n8n styling
- **`NodeSettingsPanel.jsx`** - 3-panel configuration UI
- **`RunWorkflow.php`** - Workflow execution engine
- **`nodeConfigurations.js`** - Node schema definitions

---

## 🎨 Node Types

### Visual Design
Each node has a unique color and icon:
- 🟢 **Start** (Emerald) - Workflow trigger
- 🔵 **HTTP Request** (Blue) - API calls
- 🟣 **Webhook** (Violet) - HTTP triggers
- 🟠 **Code** (Amber) - Custom logic
- 🔷 **IF** (Teal) - Conditions
- 💠 **Switch** (Cyan) - Multiple routes
- 🟪 **Merge** (Purple) - Combine data
- 🌹 **Slack** (Rose) - Notifications

### Connection Handles
- **12x12px** handles (2x bigger than before!)
- **Clear labels** (TRUE/FALSE, Input 1/2)
- **Hover to enlarge** (14x14px)
- **Strong shadows** for better visibility

---

## ⚙️ Configuration

### Environment Variables
```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=n9
DB_USERNAME=root
DB_PASSWORD=

# Queue (Required for workflow execution)
QUEUE_CONNECTION=database

# OpenAI (Optional - for AI workflow generation)
OPENAI_API_KEY=your-key-here

# Integrations (Optional)
SLACK_WEBHOOK_URL=
DISCORD_WEBHOOK_URL=
```

### Queue Worker
**CRITICAL**: Always run queue worker for workflow execution:
```bash
php artisan queue:work --timeout=300 --tries=3 --sleep=3
```

Without queue worker, workflows won't execute!

---

## 🐛 Troubleshooting

### Workflows Not Executing?
1. **Check queue worker is running:**
   ```bash
   ps aux | grep "queue:work"
   ```
2. **Start queue worker:**
   ```bash
   ./START_QUEUE_WORKER.sh
   ```

### Timeout Errors?
- Queue worker has 300-second timeout
- Increase if needed: `--timeout=600`

### Connection Issues?
- Handles are now 12x12px - easier to click!
- Hover over handle to enlarge
- Check browser console for errors

### Stale Data?
- Data automatically clears on new execution
- Refresh browser if needed

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📝 License

This project is open-source software licensed under the MIT license.

---

## 🙏 Acknowledgments

- **n8n** - Inspiration for UI/UX design
- **Laravel** - Robust backend framework
- **React Flow** - Powerful workflow canvas
- **Tailwind CSS** - Beautiful styling

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Mohamed0Taha/n9/issues)
- **Documentation**: See `/docs` folder
- **Guides**: See `*.md` files in root directory

---

<p align="center">Made with ❤️ by Mohamed Taha</p>
