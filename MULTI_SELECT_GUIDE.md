# 🎯 Multi-Select & Bulk Delete Guide

## Overview

The n8n replica now supports selecting and deleting multiple nodes at once, just like the real n8n!

## How to Use Multi-Select

### Method 1: Hold Shift + Click
1. Click on the first node
2. **Hold Shift key**
3. Click on additional nodes to add them to selection
4. All selected nodes will have a blue highlight

### Method 2: Keyboard Shortcut
- **Ctrl+A (Windows/Linux)** or **Cmd+A (Mac)** - Select all nodes
- **Escape** - Deselect all nodes

### Method 3: Box Selection
- Click and drag on empty canvas while holding **Shift**
- Draw a box around multiple nodes to select them

## Deleting Multiple Nodes

Once you have multiple nodes selected, you can delete them in several ways:

### Option 1: Delete Button
- Click the **"Delete Selected (X)"** button in the top-right panel
- Shows the count of selected nodes

### Option 2: Keyboard Shortcut
- Press **Delete** key
- Or press **Backspace** key

### Option 3: Context Menu
- Right-click on any selected node
- Choose delete from the menu (if implemented)

## Visual Feedback

### Selection Counter
- Top-right panel shows: **"X nodes selected"**
- Lists all selected node names

### Info Panel (Top-Left)
When multiple nodes are selected, you'll see:
- 📦 Icon indicating multiple selection
- Count of selected nodes
- List of selected node names with their icons
- Helpful tips

### Action Panel (Top-Right)
- **Red delete button** with count: "Delete Selected (3)"
- Tip: "💡 Hold Shift to select multiple"
- **Blue save button** to save the workflow

## Keyboard Shortcuts Summary

| Shortcut | Action |
|----------|--------|
| **Shift + Click** | Add node to selection |
| **Ctrl+A / Cmd+A** | Select all nodes |
| **Escape** | Deselect all |
| **Delete** | Delete selected nodes |
| **Backspace** | Delete selected nodes |

## Features

### ✅ What Works
- Multi-select with Shift+Click
- Select all with Ctrl+A / Cmd+A
- Box selection (drag while holding Shift)
- Visual feedback with blue highlights
- Bulk delete with one click
- Keyboard Delete/Backspace support
- Automatic edge cleanup (connections are removed too)
- Selection counter and node list

### ✅ Smart Deletion
When you delete multiple nodes:
- All selected nodes are removed
- All edges connected to those nodes are also removed
- The graph updates automatically
- Selection is cleared

### ✅ Works With
- Dragged nodes from sidebar
- AI-generated workflows
- Manually created nodes
- Connected and disconnected nodes

## Tips & Tricks

### Quick Cleanup
1. **Ctrl+A** to select all nodes
2. **Delete** to clear the entire canvas
3. Start fresh!

### Selective Deletion
1. **Shift+Click** to select specific problem nodes
2. **Delete** to remove them
3. Keeps your workflow intact

### Undo Selection
- **Escape** to deselect if you selected by mistake
- Click on empty canvas to deselect
- Select individual node again to work on it

## Visual Cues

### Selected Nodes
- Blue border around selected nodes
- Highlighted in the minimap
- Listed in the info panel

### Action Panel Changes
- **Single node**: Shows "Delete Node" button
- **Multiple nodes**: Shows "Delete Selected (X)" with count
- Always shows "Save Workflow" button

### Info Panel Changes
- **Single node**: Shows node details (icon, name, description, ID)
- **Multiple nodes**: Shows selection summary with all node names

## Example Workflow

### Cleaning Up a Draft
```
1. Drag 5 nodes onto canvas for testing
2. Hold Shift + Click on 3 nodes you don't need
3. See "3 nodes selected" in top-right
4. Click "Delete Selected (3)" button
5. Or just press Delete key
6. Those 3 nodes are gone, others remain
```

### Starting Over
```
1. You have a complex workflow with 20 nodes
2. Press Ctrl+A (all nodes turn blue)
3. Press Delete key
4. Canvas is cleared instantly
5. Ready to start a new workflow
```

### Precision Editing
```
1. You have a workflow with 10 nodes
2. Nodes 3, 5, and 7 need updating
3. Shift+Click those three
4. See their names listed in the panel
5. Delete them all at once
6. Add better replacements
```

## Implementation Details

### Technology
- Built with ReactFlow's native selection system
- Uses `onSelectionChange` callback
- Maintains selection state in React
- Keyboard events handled globally

### Node Deletion Logic
```javascript
// Deletes nodes and their connections
const selectedIds = new Set(selectedNodes.map(n => n.id));
nodes = nodes.filter(n => !selectedIds.has(n.id));
edges = edges.filter(e => 
  !selectedIds.has(e.source) && 
  !selectedIds.has(e.target)
);
```

### Selection Props
```javascript
multiSelectionKeyCode="Shift"  // Hold Shift to multi-select
selectionKeyCode="Shift"       // Box selection with Shift
deleteKeyCode="Delete"         // Delete key removes nodes
```

## Troubleshooting

### Selection not working?
- Make sure you're holding **Shift** key
- Click on the node body, not empty space
- Check that nodes aren't locked or disabled

### Delete button not showing?
- Select at least 2 nodes (Shift+Click multiple)
- Check top-right action panel
- Look for the "X nodes selected" message

### Keyboard shortcuts not working?
- Make sure canvas/window has focus
- Click on canvas first
- Check browser console for errors

## Future Enhancements

Possible additions:
- [ ] Box selection without holding Shift
- [ ] Copy/paste multiple nodes
- [ ] Duplicate selected nodes
- [ ] Group selected nodes
- [ ] Apply bulk actions (change color, settings)
- [ ] Save selection as template
- [ ] Undo/Redo support

## Comparison with n8n

Our multi-select feature matches n8n's functionality:
- ✅ Shift+Click to add to selection
- ✅ Visual selection feedback
- ✅ Bulk delete
- ✅ Keyboard shortcuts
- ✅ Selection info panel
- ✅ Edge cleanup on deletion

---

**Enjoy faster workflow editing with multi-select! 🚀**
