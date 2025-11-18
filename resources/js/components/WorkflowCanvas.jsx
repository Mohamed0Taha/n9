import { forwardRef, useCallback, useRef, useState, useEffect, useImperativeHandle, useMemo } from 'react';
import ReactFlow, {
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  applyNodeChanges,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import N8nStyleNode from './N8nStyleNode.jsx';
import ComicEdge from './ComicEdge.jsx';
import BundleNode from './BundleNode.jsx';
import BundleZoneNode from './BundleZoneNode.jsx';

const edgeTypes = {
  comic: ComicEdge,
};

const defaultPosition = (index) => ({
  x: 120 + index * 180,
  y: 120 + index * 40,
});

const edgeOptions = {
  animated: true,
  style: { stroke: '#bef264', strokeWidth: 2.5 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#bef264',
    width: 14,
    height: 14,
  },
};

const buildNodes = (graph) =>
  (graph?.nodes ?? []).map((node, index) => ({
    id: node.id || `node-${Date.now()}-${index}`,
    // Regular nodes use our custom renderer; bundles use the bundle renderer
    type: node.type === 'bundle' ? 'bundle' : 'custom',
    data: {
      label: node.label ?? node.name ?? node.type,
      type: node.type, // Preserve original type for configuration lookup
      name: node.name || node.type,
      category: node.category,
      ...node.data,
    },
    position: node.position ?? defaultPosition(index),
  }));

const buildEdges = (graph) =>
  (graph?.edges ?? []).map((edge) => ({
    id: edge.id ?? `edge-${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: 'comic',
    ...edgeOptions,
  }));

function WorkflowCanvas(
  { graph, onGraphChange, onSelectionUpdate, selectionMode = 'pan', onNodeSettingsOpen, executionData },
  ref,
) {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const hasInitializedGraph = useRef(false);
  const [clipboard, setClipboard] = useState([]);

  const [nodes, setNodes, baseOnNodesChange] = useNodesState(buildNodes(graph));
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(graph));

  // Update nodes with execution status
  useEffect(() => {
    // If no execution data, clear any existing execution state
    if (!executionData) {
      console.log('🧹 Clearing execution data');
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (!node.data?.executionStatus) {
            return node;
          }
          const baseClassName = node.className?.replace(/execution-\w+/g, '').trim() || '';
          return {
            ...node,
            data: {
              ...node.data,
              executionStatus: undefined,
              executionTime: undefined,
              executionData: undefined,
            },
            className: baseClassName,
          };
        })
      );
      return;
    }
    
    if (!executionData.node_results) {
      console.log('⚠️ No node_results in execution data');
      return;
    }
    
    const nodeResults = executionData.node_results;
    console.log('🔄 Updating nodes with execution status:', {
      totalNodes: Object.keys(nodeResults).length,
      statuses: Object.entries(nodeResults).map(([id, r]) => ({ id, status: r.status }))
    });
    
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        const result = nodeResults[node.id];
        if (!result) {
          return node;
        }
        
        if (result.status === 'running') {
          console.log(`🔵 Node ${node.id} is RUNNING`);
        } else if (result.status === 'success') {
          console.log(`✅ Node ${node.id} completed successfully`);
        } else if (result.status === 'error') {
          console.log(`❌ Node ${node.id} failed`);
        }
        
        // Only update data and className, preserve everything else (position, etc.)
        const baseClassName = node.className?.replace(/execution-\w+/g, '').trim() || '';
        return {
          ...node,
          data: {
            ...node.data,
            executionStatus: result.status,
            executionTime: result.execution_time_ms,
            executionData: result,
          },
          className: `${baseClassName} execution-${result.status}`.trim(),
        };
      })
    );
  }, [executionData, setNodes]);

  const updateSelectionState = useCallback(
    (selection) => {
      setSelectedNodes(selection);

      if (selection.length === 1) {
        setSelectedNode(selection[0]);
      } else if (!selection.length) {
        setSelectedNode(null);
      } else {
        setSelectedNode(null);
      }

      if (onSelectionUpdate) {
        onSelectionUpdate(selection);
      }
    },
    [onSelectionUpdate],
  );

  const loadGraphFromParent = useCallback(
    (graphData) => {
      const nextNodes = buildNodes(graphData);
      const nextEdges = buildEdges(graphData);
      setNodes(nextNodes);
      setEdges(nextEdges);
      updateSelectionState([]);
    },
    [setNodes, setEdges, updateSelectionState],
  );

  // Custom nodes change handler so dragging a bundleZone moves its contents
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        // Track previous positions of bundle zones
        const prevZonePositions = new Map();
        nds.forEach((node) => {
          if (node.type === 'bundleZone') {
            prevZonePositions.set(node.id, node.position || { x: 0, y: 0 });
          }
        });

        let next = applyNodeChanges(changes, nds);

        // For any moved bundle zone, offset its child nodes by the same delta
        changes.forEach((change) => {
          if (change.type === 'position' && change.id && prevZonePositions.has(change.id)) {
            const prevPos = prevZonePositions.get(change.id);
            const zoneNode = next.find((n) => n.id === change.id);
            if (!zoneNode || !zoneNode.data?.nodeIds?.length) {
              return;
            }

            const currentPos = zoneNode.position || { x: 0, y: 0 };
            const dx = currentPos.x - prevPos.x;
            const dy = currentPos.y - prevPos.y;

            if (dx === 0 && dy === 0) {
              return;
            }

            const idSet = new Set(zoneNode.data.nodeIds);
            next = next.map((node) => {
              if (!idSet.has(node.id)) return node;
              const pos = node.position || { x: 0, y: 0 };
              return {
                ...node,
                position: {
                  x: pos.x + dx,
                  y: pos.y + dy,
                },
              };
            });
          }
        });

        return next;
      });
    },
    [setNodes],
  );

  useEffect(() => {
    if (hasInitializedGraph.current) {
      return;
    }

    if (graph?.nodes?.length || graph?.edges?.length) {
      loadGraphFromParent(graph);
      hasInitializedGraph.current = true;
    }
  }, [graph, loadGraphFromParent]);

  // Handle connection between nodes
  const onConnect = useCallback(
    (params) => {
      const newEdge = { ...params, ...edgeOptions, type: 'comic' };
      setEdges((eds) => addEdge(newEdge, eds));

      if (onGraphChange) {
        onGraphChange({ nodes, edges: [...edges, newEdge] });
      }
    },
    [edges, nodes, onGraphChange, setEdges],
  );

  // Handle drag over canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    console.log('🎯 Drag over canvas');
  }, []);

  // Handle drop node on canvas
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      console.log('🎯 Drop event triggered!');

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      console.log('📦 ReactFlow bounds:', reactFlowBounds);
      
      const dataString = event.dataTransfer.getData('application/reactflow');
      console.log('📝 Raw data from drag:', dataString);
      
      const nodeData = dataString ? JSON.parse(dataString) : null;
      console.log('🔍 Parsed node data:', nodeData);
      console.log('🔍 ReactFlow instance:', reactFlowInstance);

      if (!nodeData || !reactFlowBounds) {
        console.log('❌ Missing required data:', { nodeData: !!nodeData, reactFlowBounds: !!reactFlowBounds });
        return;
      }

      // Calculate position manually if reactFlowInstance not available yet
      const position = reactFlowInstance 
        ? reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          })
        : {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          };

      const newNode = {
        id: `${nodeData.id}-${Date.now()}`,
        type: 'custom',
        position,
        data: {
          label: nodeData.name,
          type: nodeData.name, // Use node name as type for configuration lookup
          name: nodeData.name,
          icon: nodeData.icon,
          color: nodeData.color,
          description: nodeData.description,
          category: nodeData.category,
          parameters: {}, // Initialize empty parameters
        },
        style: {
          zIndex: 10,
        },
      };

      console.log('✅ Adding new node:', newNode);
      setNodes((nds) => nds.concat(newNode));

      if (onGraphChange) {
        onGraphChange({ nodes: [...nodes, newNode], edges });
      }
      console.log('🎉 Node added successfully!');
    },
    [reactFlowInstance, nodes, edges, onGraphChange, setNodes],
  );

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Zip an expanded bundle back into a single bundle node
  const handleZipBundle = useCallback(
    (zoneId) => {
      const zoneNode = nodes.find((n) => n.id === zoneId);
      const zoneData = zoneNode?.data;

      if (!zoneNode) {
        return;
      }

      // Calculate zone boundaries (accounting for resize)
      const zoneX = zoneNode.position?.x ?? 0;
      const zoneY = zoneNode.position?.y ?? 0;
      const zoneWidth = zoneNode.width ?? zoneData?.width ?? 520;
      const zoneHeight = zoneNode.height ?? zoneData?.height ?? 260;

      // Find all nodes that are inside the zone boundaries
      const nodesInsideZone = nodes.filter((node) => {
        if (node.id === zoneId || node.type === 'bundleZone') {
          return false; // Don't include the zone itself or other zones
        }

        const nodeX = node.position?.x ?? 0;
        const nodeY = node.position?.y ?? 0;
        const nodeWidth = node.width ?? 240; // Estimated node width
        const nodeHeight = node.height ?? 140; // Estimated node height

        // Check if node center is inside zone
        const nodeCenterX = nodeX + nodeWidth / 2;
        const nodeCenterY = nodeY + nodeHeight / 2;

        return (
          nodeCenterX >= zoneX &&
          nodeCenterX <= zoneX + zoneWidth &&
          nodeCenterY >= zoneY &&
          nodeCenterY <= zoneY + zoneHeight
        );
      });

      if (nodesInsideZone.length < 2) {
        // Not enough items to bundle, just remove the zone
        alert('⚠️ Bundle zone needs at least 2 items (nodes or bundles) inside to zip!');
        setNodes((nds) => nds.filter((n) => n.id !== zoneId));
        return;
      }

      const bundledIdSet = new Set(nodesInsideZone.map((n) => n.id));
      const bundledNodes = nodesInsideZone;

      // Calculate center of bundled nodes
      const centerX =
        bundledNodes.reduce((sum, node) => sum + (node.position?.x ?? 0), 0) /
        bundledNodes.length;
      const centerY =
        bundledNodes.reduce((sum, node) => sum + (node.position?.y ?? 0), 0) /
        bundledNodes.length;

      // Internal and external edges for this group
      const internalEdges = edges.filter(
        (edge) => bundledIdSet.has(edge.source) && bundledIdSet.has(edge.target),
      );
      const externalEdges = edges.filter(
        (edge) =>
          (bundledIdSet.has(edge.source) && !bundledIdSet.has(edge.target)) ||
          (!bundledIdSet.has(edge.source) && bundledIdSet.has(edge.target)),
      );

      const bundleId = zoneData.bundleId || `bundle-${Date.now()}`;

      const bundleNode = {
        id: bundleId,
        type: 'bundle',
        position: { x: centerX - 100, y: centerY - 70 },
        data: {
          label: zoneData.label || 'Unnamed Bundle', // Reuse original name from zone
          originalZoneWidth: zoneWidth, // Store zone size for restoration
          originalZoneHeight: zoneHeight,
          bundledNodes: bundledNodes.map((node) => ({
            ...node,
            relativePosition: {
              x: (node.position?.x ?? 0) - centerX,
              y: (node.position?.y ?? 0) - centerY,
            },
          })),
          internalEdges,
        },
        selected: false,
      };

      // Re-point external edges to the bundle node
      const updatedExternalEdges = externalEdges.map((edge) => {
        if (bundledIdSet.has(edge.source)) {
          return { ...edge, source: bundleId, sourceHandle: 'output-0' };
        }
        if (bundledIdSet.has(edge.target)) {
          return { ...edge, target: bundleId, targetHandle: 'input-0' };
        }
        return edge;
      });

      const nodesWithoutBundleGroup = nodes.filter(
        (n) => !bundledIdSet.has(n.id) && n.id !== zoneId,
      );

      const edgesWithoutGroup = edges.filter(
        (edge) => !bundledIdSet.has(edge.source) && !bundledIdSet.has(edge.target),
      );

      const nextNodes = [...nodesWithoutBundleGroup, bundleNode];
      const nextEdges = [...edgesWithoutGroup, ...updatedExternalEdges];

      setNodes(nextNodes);
      setEdges(nextEdges);
      if (onGraphChange) {
        onGraphChange({ nodes: nextNodes, edges: nextEdges });
      }
      updateSelectionState([]);
    },
    [nodes, edges, setNodes, setEdges, updateSelectionState, onGraphChange],
  );

  // Handle double-click to unfold bundles
  const onNodeDoubleClick = useCallback(
    (event, node) => {
      // If user double-clicks the blanket zone, zip the bundle back up
      if (node.type === 'bundleZone') {
        handleZipBundle(node.id);
        return;
      }

      if ((node.type === 'bundle' || node.data?.isBundle) && node.data?.bundledNodes?.length) {
        const bundleX = node.position.x;
        const bundleY = node.position.y;

        // Restore bundled nodes with their original positions
        const restoredNodes = node.data.bundledNodes.map((bundledNode) => ({
          ...bundledNode,
          position: {
            x: bundleX + (bundledNode.relativePosition?.x || 0),
            y: bundleY + (bundledNode.relativePosition?.y || 0),
          },
          selected: false,
        }));

        const bundledIds = new Set(restoredNodes.map((n) => n.id));

        // Find edges that connect to this bundle
        const bundleEdges = edges.filter(
          (edge) => edge.source === node.id || edge.target === node.id,
        );

        // Restore internal edges
        const restoredInternalEdges = node.data.internalEdges || [];

        // Update external edges to connect to the restored nodes
        const updatedExternalEdges = bundleEdges.map((edge) => {
          if (edge.source === node.id) {
            const firstNode = restoredNodes[0];
            return { ...edge, source: firstNode.id, sourceHandle: null };
          }
          if (edge.target === node.id) {
            const firstNode = restoredNodes[0];
            return { ...edge, target: firstNode.id, targetHandle: null };
          }
          return edge;
        });

        // Remove bundle node and add restored nodes
        const remainingNodes = nodes.filter((n) => n.id !== node.id);
        const remainingEdges = edges.filter(
          (edge) => edge.source !== node.id && edge.target !== node.id,
        );

        // Compute blanket size around restored nodes with generous padding
        const padding = 100; // Increased padding for more space
        const estimatedWidth = 240;
        const estimatedHeight = 140;

        const minX = Math.min(...restoredNodes.map((n) => n.position.x));
        const minY = Math.min(...restoredNodes.map((n) => n.position.y));
        const maxX = Math.max(
          ...restoredNodes.map((n) => n.position.x + (n.width || estimatedWidth)),
        );
        const maxY = Math.max(
          ...restoredNodes.map((n) => n.position.y + (n.height || estimatedHeight)),
        );

        // Use original zone size if available, otherwise calculate with generous padding
        const calculatedWidth = maxX - minX + padding * 2;
        const calculatedHeight = maxY - minY + padding * 2;
        
        // Preserve original size or use calculated (whichever is larger for more room)
        const zoneWidth = node.data.originalZoneWidth 
          ? Math.max(node.data.originalZoneWidth, calculatedWidth)
          : Math.max(calculatedWidth, 600); // Minimum 600px width
        const zoneHeight = node.data.originalZoneHeight
          ? Math.max(node.data.originalZoneHeight, calculatedHeight)
          : Math.max(calculatedHeight, 400); // Minimum 400px height

        // Create blue blanket zone with original bundle name
        const zoneNode = {
          id: `${node.id}-zone`,
          type: 'bundleZone',
          position: { x: minX - padding, y: minY - padding },
          width: zoneWidth,
          height: zoneHeight,
          data: {
            bundleId: node.id,
            label: node.data.label || 'Unnamed Bundle', // Preserve original bundle name
            nodeIds: Array.from(bundledIds),
            width: zoneWidth,
            height: zoneHeight,
          },
          draggable: true,
          selectable: true,
          resizable: true,
          style: {
            width: zoneWidth,
            height: zoneHeight,
            zIndex: 0,
          },
        };

        const nextNodes = [...remainingNodes, zoneNode, ...restoredNodes];
        const nextEdges = [...remainingEdges, ...restoredInternalEdges, ...updatedExternalEdges];

        setNodes(nextNodes);
        setEdges(nextEdges);
        if (onGraphChange) {
          onGraphChange({ nodes: nextNodes, edges: nextEdges });
        }

        // Update selection
        updateSelectionState([]);
      }
    },
    [nodes, edges, setNodes, setEdges, updateSelectionState, handleZipBundle, onGraphChange],
  );

  // Handle selection change (for multi-select)
  const onSelectionChange = useCallback(
    ({ nodes: nextSelectedNodes }) => {
      updateSelectionState(nextSelectedNodes);
    },
    [updateSelectionState],
  );

  // Handle single node deletion
  const onDeleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      updateSelectionState([]);

      if (onGraphChange) {
        const updatedNodes = nodes.filter((n) => n.id !== selectedNode.id);
        const updatedEdges = edges.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id);
        onGraphChange({ nodes: updatedNodes, edges: updatedEdges });
      }
    }
  }, [selectedNode, nodes, edges, onGraphChange, setNodes, setEdges, updateSelectionState]);

  // Handle multiple nodes deletion
  const handleDeleteSelectedNodes = useCallback(() => {
    if (selectedNodes.length > 0) {
      const selectedIds = new Set(selectedNodes.map((n) => n.id));

      setNodes((nds) => nds.filter((n) => !selectedIds.has(n.id)));
      setEdges((eds) => eds.filter((e) => !selectedIds.has(e.source) && !selectedIds.has(e.target)));
      updateSelectionState([]);

      if (onGraphChange) {
        const updatedNodes = nodes.filter((n) => !selectedIds.has(n.id));
        const updatedEdges = edges.filter((e) => !selectedIds.has(e.source) && !selectedIds.has(e.target));
        onGraphChange({ nodes: updatedNodes, edges: updatedEdges });
      }
    }
  }, [selectedNodes, nodes, edges, onGraphChange, setNodes, setEdges, updateSelectionState]);

  const handleDuplicateSelectedNodes = useCallback(() => {
    if (!selectedNodes.length) {
      return;
    }

    const timestamp = Date.now();
    const duplicatedNodes = selectedNodes.map((node, index) => ({
      ...node,
      id: `${node.id}-copy-${timestamp}-${index}`,
      data: JSON.parse(JSON.stringify(node.data)), // Deep clone to preserve all config
      position: {
        x: (node.position?.x ?? 0) + 40,
        y: (node.position?.y ?? 0) + 40,
      },
      selected: false,
    }));

    setNodes((nds) => [...nds, ...duplicatedNodes]);
    updateSelectionState(duplicatedNodes);

    if (onGraphChange) {
      onGraphChange({ nodes: [...nodes, ...duplicatedNodes], edges });
    }
  }, [selectedNodes, nodes, edges, onGraphChange, setNodes, updateSelectionState]);

  // Copy selected nodes to clipboard
  const handleCopyNodes = useCallback(() => {
    if (!selectedNodes.length) {
      return;
    }

    // Deep clone nodes to preserve all configuration
    const copiedNodes = selectedNodes.map((node) => ({
      ...node,
      data: JSON.parse(JSON.stringify(node.data)), // Deep clone preserves nested config
    }));

    setClipboard(copiedNodes);
    console.log(`📋 Copied ${copiedNodes.length} node(s) with configurations!`);
  }, [selectedNodes]);

  // Paste nodes from clipboard
  const handlePasteNodes = useCallback(() => {
    if (!clipboard.length) {
      return;
    }

    const timestamp = Date.now();
    const pastedNodes = clipboard.map((node, index) => ({
      ...node,
      id: `${node.id}-paste-${timestamp}-${index}`,
      data: JSON.parse(JSON.stringify(node.data)), // Deep clone to preserve config
      position: {
        x: (node.position?.x ?? 0) + 50,
        y: (node.position?.y ?? 0) + 50,
      },
      selected: true, // Select pasted nodes for easy repositioning
    }));

    setNodes((nds) => [...nds, ...pastedNodes]);
    updateSelectionState(pastedNodes);

    if (onGraphChange) {
      onGraphChange({ nodes: [...nodes, ...pastedNodes], edges });
    }

    console.log(`📌 Pasted ${pastedNodes.length} node(s) with configurations!`);
  }, [clipboard, nodes, edges, onGraphChange, setNodes, updateSelectionState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in input fields
      const isInputFocused = 
        event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable;

      // Delete/Backspace - Delete selected nodes
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNodes.length > 0 && !isInputFocused) {
        event.preventDefault();
        handleDeleteSelectedNodes();
      }

      // Ctrl/Cmd + A - Select all nodes
      if ((event.ctrlKey || event.metaKey) && event.key === 'a' && !isInputFocused) {
        event.preventDefault();
        updateSelectionState(nodes);
      }

      // Ctrl/Cmd + C - Copy selected nodes
      if ((event.ctrlKey || event.metaKey) && event.key === 'c' && selectedNodes.length > 0 && !isInputFocused) {
        event.preventDefault();
        handleCopyNodes();
      }

      // Ctrl/Cmd + V - Paste copied nodes
      if ((event.ctrlKey || event.metaKey) && event.key === 'v' && !isInputFocused) {
        event.preventDefault();
        handlePasteNodes();
      }

      // Ctrl/Cmd + D - Duplicate selected nodes
      if ((event.ctrlKey || event.metaKey) && event.key === 'd' && selectedNodes.length > 0 && !isInputFocused) {
        event.preventDefault();
        handleDuplicateSelectedNodes();
      }

      // Escape - Clear selection
      if (event.key === 'Escape') {
        updateSelectionState([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes, nodes, handleDeleteSelectedNodes, handleCopyNodes, handlePasteNodes, handleDuplicateSelectedNodes, updateSelectionState]);

  const handleNodeSettingsOpen = useCallback(
    (nodeProps) => {
      if (onNodeSettingsOpen) {
        // Find the CURRENT node from nodes state (includes execution data)
        // Don't use nodeProps.data which may be stale
        const currentNode = nodes.find(n => n.id === nodeProps.id);
        
        onNodeSettingsOpen({
          id: nodeProps.id,
          data: currentNode?.data || nodeProps.data,
        });
      }
    },
    [onNodeSettingsOpen, nodes],
  );

  // Create stable nodeTypes - memoize with empty deps and use refs for handlers
  const handleNodeSettingsOpenRef = useRef(handleNodeSettingsOpen);
  const handleZipBundleRef = useRef(handleZipBundle);
  
  // Update refs when handlers change
  useEffect(() => {
    handleNodeSettingsOpenRef.current = handleNodeSettingsOpen;
    handleZipBundleRef.current = handleZipBundle;
  }, [handleNodeSettingsOpen, handleZipBundle]);

  const nodeTypes = useMemo(
    () => ({
      custom: (nodeProps) => (
        <N8nStyleNode
          {...nodeProps}
          onOpenSettings={(event) => {
            event?.stopPropagation?.();
            handleNodeSettingsOpenRef.current(nodeProps);
          }}
        />
      ),
      n8n: (nodeProps) => (
        <N8nStyleNode
          {...nodeProps}
          onOpenSettings={(event) => {
            event?.stopPropagation?.();
            handleNodeSettingsOpenRef.current(nodeProps);
          }}
        />
      ),
      bundle: (nodeProps) => (
        <BundleNode
          {...nodeProps}
          onOpenSettings={(event) => {
            event?.stopPropagation?.();
            handleNodeSettingsOpenRef.current(nodeProps);
          }}
        />
      ),
      bundleZone: (nodeProps) => (
        <BundleZoneNode
          {...nodeProps}
          onZip={() => handleZipBundleRef.current(nodeProps.id)}
        />
      ),
    }),
    [], // Empty deps - nodeTypes object never changes
  );

  const selectionEnabled = selectionMode === 'select';
  const selectionOnDragSetting = selectionEnabled;
  const panOnDragSetting = !selectionEnabled;

  const handleSelectAllNodes = useCallback(() => {
    updateSelectionState(nodes);
  }, [nodes, updateSelectionState]);

  const handleClearSelection = useCallback(() => {
    updateSelectionState([]);
  }, [updateSelectionState]);

  const handleSaveWorkflow = useCallback(() => {
    if (onGraphChange) {
      onGraphChange({ nodes, edges });
    }
  }, [nodes, edges, onGraphChange]);

  const handleInit = useCallback((instance) => {
    console.log('🎬 ReactFlow initialized:', instance);
    setReactFlowInstance(instance);
  }, []);

  // Auto-layout function to organize nodes and prevent line mingling
  const autoLayoutNodes = useCallback(() => {
    if (!nodes.length || !edges.length) return;

    // Build adjacency information
    const incomingEdges = {};
    const outgoingEdges = {};
    
    nodes.forEach(node => {
      incomingEdges[node.id] = [];
      outgoingEdges[node.id] = [];
    });
    
    edges.forEach(edge => {
      if (incomingEdges[edge.target]) {
        incomingEdges[edge.target].push(edge.source);
      }
      if (outgoingEdges[edge.source]) {
        outgoingEdges[edge.source].push(edge.target);
      }
    });

    // Find root nodes (nodes with no incoming edges)
    const rootNodes = nodes.filter(node => incomingEdges[node.id].length === 0);
    
    // Organize nodes into levels using BFS
    const levels = [];
    const visited = new Set();
    const nodeToLevel = {};
    
    const queue = rootNodes.map(node => ({ node, level: 0 }));
    
    while (queue.length > 0) {
      const { node, level } = queue.shift();
      
      if (visited.has(node.id)) continue;
      visited.add(node.id);
      
      if (!levels[level]) levels[level] = [];
      levels[level].push(node);
      nodeToLevel[node.id] = level;
      
      // Add children to queue
      outgoingEdges[node.id].forEach(targetId => {
        const targetNode = nodes.find(n => n.id === targetId);
        if (targetNode && !visited.has(targetId)) {
          queue.push({ node: targetNode, level: level + 1 });
        }
      });
    }
    
    // Handle disconnected nodes
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        const lastLevel = levels.length;
        if (!levels[lastLevel]) levels[lastLevel] = [];
        levels[lastLevel].push(node);
      }
    });
    
    // Calculate positions
    const horizontalSpacing = 300;
    const verticalSpacing = 150;
    const startX = 100;
    const startY = 100;
    
    const newNodes = nodes.map(node => {
      const level = nodeToLevel[node.id] ?? levels.length - 1;
      const nodesInLevel = levels[level];
      const indexInLevel = nodesInLevel.findIndex(n => n.id === node.id);
      
      // Center nodes in each level
      const levelWidth = (nodesInLevel.length - 1) * horizontalSpacing;
      const levelStartX = startX - (levelWidth / 2);
      
      return {
        ...node,
        position: {
          x: levelStartX + (indexInLevel * horizontalSpacing),
          y: startY + (level * verticalSpacing)
        }
      };
    });
    
    setNodes(newNodes);
    
    // Fit view after layout
    setTimeout(() => {
      reactFlowInstance?.fitView({ padding: 0.2 });
    }, 50);
  }, [nodes, edges, setNodes, reactFlowInstance]);

  // Group selected nodes into a bundle
  const handleGroupNodes = useCallback(() => {
    // Allow bundling any nodes including bundles (nested bundles)
    // Exclude only bundleZone nodes (the blue blanket overlays)
    const selectedNodes = nodes.filter(
      (node) => node.selected && node.type !== 'bundleZone',
    );
    
    if (selectedNodes.length < 2) {
      alert('⚠️ Please select at least 2 items to create a bundle!');
      return;
    }

    // Prompt for custom bundle name
    const bundleName = prompt(
      '📦 Name your bundle!\n\nEnter a name for this bundle (or leave empty for default):',
      `My Bundle ${Math.floor(Math.random() * 1000)}`
    );
    
    // If user cancels, don't create bundle
    if (bundleName === null) {
      return;
    }

    // Calculate center position of selected nodes
    const centerX = selectedNodes.reduce((sum, node) => sum + node.position.x, 0) / selectedNodes.length;
    const centerY = selectedNodes.reduce((sum, node) => sum + node.position.y, 0) / selectedNodes.length;

    // Find edges connected to selected nodes
    const selectedNodeIds = new Set(selectedNodes.map(n => n.id));
    const internalEdges = edges.filter(edge => 
      selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target)
    );
    const externalEdges = edges.filter(edge => 
      (selectedNodeIds.has(edge.source) && !selectedNodeIds.has(edge.target)) ||
      (!selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target))
    );

    // Create bundle node
    const bundleId = `bundle-${Date.now()}`;
    const bundleNode = {
      id: bundleId,
      type: 'bundle',
      position: { x: centerX - 100, y: centerY - 70 }, // Center the bundle (200x140)
      data: {
        label: bundleName.trim() || 'Unnamed Bundle',
        bundledNodes: selectedNodes.map((node) => ({
          ...node,
          // Store relative position within bundle
          relativePosition: {
            x: node.position.x - centerX,
            y: node.position.y - centerY,
          },
        })),
        internalEdges,
        expanded: false,
      },
      selected: false,
    };

    // Update external edges to connect to bundle instead
    const updatedExternalEdges = externalEdges.map(edge => {
      if (selectedNodeIds.has(edge.source)) {
        return { ...edge, source: bundleId, sourceHandle: 'output-0' };
      } else if (selectedNodeIds.has(edge.target)) {
        return { ...edge, target: bundleId, targetHandle: 'input-0' };
      }
      return edge;
    });

    // Remove selected nodes and add bundle
    const remainingNodes = nodes.filter(node => !selectedNodeIds.has(node.id));
    setNodes([...remainingNodes, bundleNode]);
    setEdges(updatedExternalEdges);

    // Update selection state
    updateSelectionState([]);
  }, [nodes, edges, setNodes, setEdges, updateSelectionState]);

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: (options) => reactFlowInstance?.zoomIn?.(options),
      zoomOut: (options) => reactFlowInstance?.zoomOut?.(options),
      fitView: (options) => reactFlowInstance?.fitView?.(options ?? { padding: 0.2 }),
      selectAll: handleSelectAllNodes,
      clearSelection: handleClearSelection,
      duplicateSelection: handleDuplicateSelectedNodes,
      deleteSelection: handleDeleteSelectedNodes,
      saveWorkflow: handleSaveWorkflow,
      setGraph: loadGraphFromParent,
      groupNodes: handleGroupNodes,
    }),
    [
      reactFlowInstance,
      handleSelectAllNodes,
      handleClearSelection,
      handleDuplicateSelectedNodes,
      handleDeleteSelectedNodes,
      handleSaveWorkflow,
      loadGraphFromParent,
      handleGroupNodes,
    ],
  );

  if (!nodes.length) {
    return (
      <div
        ref={reactFlowWrapper}
        className="h-full flex items-center justify-center text-slate-400 bg-slate-50"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-slate-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-lg font-medium text-slate-600 mb-1">
            Drag and drop nodes to build your workflow
          </p>
          <p className="text-sm text-slate-400">
            Or use the prompt panel to generate workflows with AI
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={reactFlowWrapper} 
      className="w-full h-full relative"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {/* Auto-Layout Button */}
      <button
        onClick={autoLayoutNodes}
        className="tactile-button absolute bottom-32 right-8 z-50 p-4 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 border-4 border-black text-black font-bold flex flex-col items-center gap-1"
        style={{ boxShadow: '4px 4px 0px #000', fontFamily: "'Comic Neue', cursive" }}
        title="Auto-organize workflow layout"
      >
        <svg className="w-6 h-6 text-black stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zm10 0a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
        </svg>
        <span className="text-xs font-bold">ORGANIZE!</span>
      </button>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={handleInit}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-slate-50"
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultEdgeOptions={edgeOptions}
        connectionRadius={10}
        multiSelectionKeyCode="Shift"
        selectionKeyCode="Shift"
        deleteKeyCode="Delete"
        selectionOnDrag={selectionOnDragSetting}
        panOnDrag={panOnDragSetting}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        edgesUpdatable={true}
        edgesFocusable={true}
      >
        <Background color="#cbd5e1" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}

export default forwardRef(WorkflowCanvas);
