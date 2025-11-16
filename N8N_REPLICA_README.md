# n8n Workflow Automation Replica

## 🎯 Overview

A complete replica of n8n's workflow automation platform built with React, ReactFlow, and Laravel. Features 100+ drag-and-drop nodes with smooth interactions matching n8n's UX.

## ✨ Features Implemented

### 1. **Complete Node Library** (100+ nodes)
- **Core Nodes**: Start, HTTP Request, Webhook, Code, IF, Switch, Merge, Split In Batches
- **Communication**: Slack, Discord, Telegram, Gmail, Microsoft Teams, Twilio, WhatsApp
- **Productivity**: Notion, Google Sheets, Google Drive, Airtable, Asana, Trello, Monday, Jira
- **CRM**: HubSpot, Salesforce, Pipedrive, Zoho CRM, Close, Copper
- **E-commerce**: Shopify, WooCommerce, Stripe, PayPal, Square
- **Development**: GitHub, GitLab, Bitbucket, Jenkins, CircleCI, Docker, Kubernetes
- **Databases**: MySQL, PostgreSQL, MongoDB, Redis, Supabase, Firebase
- **Marketing**: Google Analytics, Facebook, Instagram, Twitter, LinkedIn, Mailchimp
- **AI**: OpenAI, Anthropic, Google PaLM, Hugging Face
- **Cloud**: AWS S3, AWS Lambda, Dropbox, Box, OneDrive
- **Utilities**: Date & Time, Crypto, XML, JSON, HTML Extract, Compression
- And many more...

### 2. **Drag & Drop Interface**
- ✅ Smooth drag and drop from sidebar to canvas
- ✅ Real-time node positioning with snap-to-grid (15px)
- ✅ Visual feedback during drag operations
- ✅ Automatic node ID generation
- ✅ Position calculation based on canvas bounds

### 3. **Node Management**
- ✅ Custom node component with n8n-style design
- ✅ Color-coded nodes by category
- ✅ Icon-based visual identification
- ✅ Node selection and highlighting
- ✅ Delete nodes with connections cleanup
- ✅ Node info panel showing details

### 4. **Connection System**
- ✅ Drag to connect nodes
- ✅ Animated connection lines
- ✅ Arrow markers on edges
- ✅ Multiple connection points (top, bottom, left, right)
- ✅ Automatic edge cleanup on node deletion
- ✅ Smooth bezier curves for connections

### 5. **Search & Filter**
- ✅ Real-time node search
- ✅ Category-based filtering
- ✅ Search by name, category, or description
- ✅ Quick category buttons for common types

### 6. **Canvas Features**
- ✅ Background grid with proper styling
- ✅ Zoom controls (+, -, fit view)
- ✅ MiniMap with color-coded nodes
- ✅ Pan around canvas
- ✅ Fit view on load
- ✅ Empty state with instructions

### 7. **UI/UX**
- ✅ Clean, modern interface matching n8n
- ✅ Responsive sidebar (280px width)
- ✅ Collapsible sidebar toggle
- ✅ Status indicators and badges
- ✅ Hover effects and transitions
- ✅ Loading states with spinner
- ✅ Action panels (delete, save)

### 8. **AI Integration Ready**
- ✅ AI prompt panel for workflow generation
- ✅ Draft workflow preview
- ✅ Accept/reject AI-generated workflows
- ✅ Status messaging for AI operations

## 🏗️ Architecture

### Components Structure

```
resources/js/
├── components/
│   ├── App.jsx                  # Main application container
│   ├── NodesSidebar.jsx         # Draggable nodes library
│   ├── WorkflowCanvas.jsx       # ReactFlow canvas with interactions
│   ├── CustomNode.jsx           # Custom node component
│   ├── PromptPanel.jsx          # AI workflow generation
│   ├── ConnectorShelf.jsx       # Connector display
│   ├── RunHistoryDrawer.jsx     # Execution history
│   └── WorkflowList.jsx         # Workflow management
├── data/
│   └── n8nNodes.js             # Complete node library
├── app.js                       # React entry point
└── bootstrap.js                 # App initialization
```

### Node Data Structure

Each node includes:
- `id`: Unique identifier
- `name`: Display name
- `category`: Grouping category
- `icon`: Emoji icon for visual identification
- `color`: Brand color for the service
- `description`: Short description

### Graph Data Structure

```javascript
{
  nodes: [
    {
      id: "node-1",
      type: "custom",
      position: { x: 100, y: 100 },
      data: {
        label: "Slack",
        icon: "💬",
        color: "#4A154B",
        description: "Send Slack messages",
        category: "Communication"
      }
    }
  ],
  edges: [
    {
      id: "edge-1",
      source: "node-1",
      target: "node-2",
      animated: true
    }
  ]
}
```

## 🎨 Styling

The application uses:
- **TailwindCSS** for utility-first styling
- **Custom gradients** for visual appeal
- **Smooth transitions** on all interactive elements
- **Shadow system** for depth and hierarchy
- **Color palette** matching n8n's design system

## 🚀 Getting Started

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 20+
- npm

### Installation

1. **Install PHP dependencies**:
```bash
composer install
```

2. **Install JavaScript dependencies**:
```bash
npm install
```

3. **Build assets**:
```bash
npm run dev
```

4. **Start the server**:
```bash
php artisan serve
```

5. **Open in browser**:
Navigate to `http://localhost:8000`

## 🎯 Usage

### Adding Nodes
1. Open the nodes sidebar (left panel)
2. Search or browse nodes by category
3. Drag any node onto the canvas
4. Drop to place the node

### Connecting Nodes
1. Click on a node's connection point (handle)
2. Drag to another node's connection point
3. Release to create the connection

### Managing Nodes
- **Select**: Click on a node to select it
- **Move**: Drag nodes around the canvas
- **Delete**: Select a node and click "Delete Node" button
- **Info**: View node details in the info panel when selected

### Using AI Generation
1. Click "AI Generate" button
2. Enter a workflow description
3. Review the generated workflow
4. Accept to add it to your workflows

## 📊 Node Categories

- **Core**: Essential workflow building blocks
- **Flow**: Conditional logic and routing
- **Communication**: Messaging and email platforms
- **Productivity**: Task and project management
- **CRM**: Customer relationship management
- **E-commerce**: Shopping and payment platforms
- **Development**: Code repositories and CI/CD
- **Database**: Data storage and retrieval
- **Analytics**: Data tracking and analysis
- **Marketing**: Campaign and social media tools
- **Cloud**: Cloud storage and computing
- **AI**: Artificial intelligence and ML
- **Utilities**: Helper functions and transformations

## 🔄 Workflow Execution (Coming Soon)

Future features planned:
- ✅ Execute workflows
- ✅ View execution history
- ✅ Debug mode with step-by-step execution
- ✅ Error handling and retry logic
- ✅ Webhook triggers
- ✅ Schedule-based triggers

## 🎨 Customization

### Adding New Nodes

Edit `/resources/js/data/n8nNodes.js`:

```javascript
{
  id: 'my-service',
  name: 'My Service',
  category: 'Custom',
  icon: '🎯',
  color: '#FF6B6B',
  description: 'My custom service integration'
}
```

### Changing Styles

Modify Tailwind classes in components or add custom CSS in `/resources/css/app.css`.

## 🐛 Known Issues

None at the moment! Report issues as you find them.

## 📝 License

This is a demonstration/replica project for educational purposes.

## 🙏 Acknowledgments

- **n8n.io** - Original inspiration and design reference
- **ReactFlow** - Excellent node-based UI library
- **TailwindCSS** - Utility-first CSS framework
- **Laravel** - Backend framework

## 📞 Support

For questions or issues, please check the documentation or create an issue.

---

**Built with ⚡ by replicating the amazing n8n platform**
