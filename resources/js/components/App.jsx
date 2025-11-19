import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import WorkflowCanvas from './WorkflowCanvas.jsx';
import PromptPanel from './PromptPanel.jsx';
import NodesCarousel from './NodesCarousel.jsx';
import NodeSettingsPanel from './NodeSettingsPanel.jsx';
import GoogleLoginModal from './GoogleLoginModal.jsx';
import InsufficientCreditsModal from './InsufficientCreditsModal.jsx';
import { n8nNodes } from '../data/n8nNodes.js';
import { getNodeExecutionData } from '../data/nodeExecutionData.js';

function enrichGraphWithNodeMetadata(graph) {
    if (!graph || !Array.isArray(graph.nodes)) {
        return graph;
    }

    const nodeByType = new Map(n8nNodes.map((node) => [node.name, node]));

    return {
        ...graph,
        nodes: graph.nodes.map((node) => {
            const typeName = node.type;
            const meta = nodeByType.get(typeName);
            if (!meta) {
                return node;
            }

            const existingData = node.data ?? {};

            return {
                ...node,
                data: {
                    ...existingData,
                    icon: existingData.icon ?? meta.icon,
                    color: existingData.color ?? meta.color,
                    category: existingData.category ?? meta.category,
                    description: existingData.description ?? meta.description,
                },
            };
        }),
    };
}

const initialDraft = {
    name: '',
    description: '',
    graph: { nodes: [], edges: [] },
};

export default function App() {
    const [loading, setLoading] = useState(true);
    const [workflows, setWorkflows] = useState([]);
    const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
    const [draft, setDraft] = useState(initialDraft);
    const [generateStatus, setGenerateStatus] = useState({ state: 'idle', message: null });
    const [isPromptOpen, setIsPromptOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectionCount, setSelectionCount] = useState(0);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const [activeNode, setActiveNode] = useState(null);
    const [isNodeSettingsOpen, setIsNodeSettingsOpen] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionMessage, setExecutionMessage] = useState(null);
    const [executionData, setExecutionData] = useState(null);
    const [user, setUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginReason, setLoginReason] = useState('');
    const [showCreditsModal, setShowCreditsModal] = useState(false);
    const [creditInfo, setCreditInfo] = useState({ required: 0, current: 0, action: '' });
    const canvasRef = useRef(null);
    const editMenuRef = useRef(null);
    const pollingIntervalRef = useRef(null);
    const executionTimeoutRef = useRef(null);

    // Fetch current user on mount
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get('/auth/user');
                setUser(data.user);
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get('/app/bootstrap');
                setWorkflows(data.workflows || []);
                if (data.workflows?.length) {
                    setSelectedWorkflowId(data.workflows[0].id);
                }
            } catch (error) {
                console.error('Failed to bootstrap app', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        function handleDocumentClick(event) {
            if (!isEditMenuOpen) {
                return;
            }
            if (editMenuRef.current && !editMenuRef.current.contains(event.target)) {
                setIsEditMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleDocumentClick);
        return () => document.removeEventListener('mousedown', handleDocumentClick);
    }, [isEditMenuOpen]);

    const selectedWorkflow = useMemo(
        () => workflows.find((workflow) => workflow.id === selectedWorkflowId),
        [workflows, selectedWorkflowId],
    );

    const latestGraph = selectedWorkflow?.versions?.[0]?.graph ?? { nodes: [], edges: [] };
    const initialGraph = enrichGraphWithNodeMetadata(latestGraph);
    const [currentGraph, setCurrentGraph] = useState(initialGraph);
    const [graphHistory, setGraphHistory] = useState(initialGraph ? [initialGraph] : []);
    const [historyIndex, setHistoryIndex] = useState(latestGraph ? 0 : -1);
    const [selectionMode, setSelectionMode] = useState('pan');

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex >= 0 && historyIndex < graphHistory.length - 1;

    useEffect(() => {
        if (!selectedWorkflow) {
            return;
        }
        const graphWithMetadata = enrichGraphWithNodeMetadata(latestGraph);
        setCurrentGraph(graphWithMetadata);
        setGraphHistory([graphWithMetadata]);
        setHistoryIndex(0);
        if (canvasRef.current?.setGraph) {
            canvasRef.current.setGraph(graphWithMetadata);
        }
    }, [selectedWorkflow, latestGraph]);

    const handleSelectionUpdate = useCallback((selectedNodes = []) => {
        setSelectionCount(selectedNodes.length);
        setSelectedNodes(selectedNodes);
    }, []);

    const handleSelectAllNodes = useCallback(() => {
        canvasRef.current?.selectAll?.();
    }, []);

    const handleCopySelection = useCallback(() => {
        canvasRef.current?.duplicateSelection?.();
    }, []);

    const handleDeleteSelection = useCallback(() => {
        canvasRef.current?.deleteSelection?.();
    }, []);

    const handleQuickSave = useCallback(() => {
        // Check if user is logged in before saving
        if (!user) {
            setShowLoginModal(true);
            setLoginReason('save_workflow');
            return;
        }
        
        // User is logged in, proceed with save
        canvasRef.current?.saveWorkflow?.();
    }, [user]);

    const handleSaveFromMenu = useCallback(() => {
        handleQuickSave();
        setIsEditMenuOpen(false);
    }, [handleQuickSave]);

    const handleUndo = useCallback(() => {
        setHistoryIndex((prev) => {
            if (prev <= 0) {
                return prev;
            }
            const newIndex = prev - 1;
            const graph = graphHistory[newIndex];
            if (graph) {
                setCurrentGraph(graph);
                canvasRef.current?.setGraph?.(graph);
            }
            return newIndex;
        });
    }, [graphHistory]);

    const handleRedo = useCallback(() => {
        setHistoryIndex((prev) => {
            if (prev < 0 || prev >= graphHistory.length - 1) {
                return prev;
            }
            const newIndex = prev + 1;
            const graph = graphHistory[newIndex];
            if (graph) {
                setCurrentGraph(graph);
                canvasRef.current?.setGraph?.(graph);
            }
            return newIndex;
        });
    }, [graphHistory]);

    const toggleSelectionMode = useCallback(() => {
        setSelectionMode((prev) => (prev === 'select' ? 'pan' : 'select'));
    }, []);

    const handleNodeSettingsOpen = useCallback((nodeProps) => {
        const graphNodeWithMeta = nodeProps?.data?.type
            ? enrichGraphWithNodeMetadata({
                  nodes: [{ id: nodeProps.id, type: nodeProps.data.type, data: nodeProps.data }],
                  edges: [],
              }).nodes[0]
            : nodeProps;

        setActiveNode(graphNodeWithMeta);
        setIsNodeSettingsOpen(true);
    }, []);

    const handleNodeSettingsClose = useCallback(() => {
        setIsNodeSettingsOpen(false);
        setActiveNode(null);
    }, []);

    // Sync activeNode with execution data updates
    useEffect(() => {
        // If executionData is cleared (null), clear activeNode execution data too
        if (!executionData && activeNode) {
            setActiveNode(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        executionStatus: undefined,
                        executionTime: undefined,
                        executionData: undefined,
                    }
                };
            });
            return;
        }
        
        if (!activeNode || !isNodeSettingsOpen || !executionData?.node_results) {
            return;
        }
        
        // Check if this is a bundle node
        const isBundle = activeNode.type === 'bundle' || activeNode.data?.isBundle || activeNode.data?.bundledNodes?.length > 0;
        
        if (isBundle && activeNode.data?.bundledNodes?.length) {
            // For bundle nodes, aggregate execution data from all bundled nodes
            const bundledNodeIds = activeNode.data.bundledNodes.map(node => node.id);
            const bundledExecutionData = [];
            let bundleStatus = 'success';
            let totalExecutionTime = 0;
            
            // Collect execution data from all bundled nodes
            bundledNodeIds.forEach(nodeId => {
                const nodeExecData = executionData.node_results[nodeId];
                if (nodeExecData) {
                    bundledExecutionData.push(nodeExecData);
                    totalExecutionTime += nodeExecData.execution_time_ms || 0;
                    if (nodeExecData.status === 'running') bundleStatus = 'running';
                    if (nodeExecData.status === 'error') bundleStatus = 'error';
                }
            });
            
            // If we have execution data from bundled nodes, create aggregated data
            if (bundledExecutionData.length > 0) {
                const aggregatedData = {
                    status: bundleStatus,
                    execution_time_ms: totalExecutionTime,
                    // Bundle behaves like a sub-workflow: first node input, last node output
                    input: bundledExecutionData[0]?.input || null, // First node's input
                    output: bundledExecutionData[bundledExecutionData.length - 1]?.output || null, // Last node's output
                    bundled_results: bundledExecutionData, // Store individual results for debugging
                };
                
                setActiveNode(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        data: {
                            ...prev.data,
                            executionStatus: bundleStatus,
                            executionTime: totalExecutionTime,
                            executionData: aggregatedData,
                        }
                    };
                });
            }
        } else {
            // For regular nodes, use execution data directly
            const nodeExecutionData = executionData.node_results[activeNode.id];
            if (nodeExecutionData) {
                // Update activeNode with latest execution data
                setActiveNode(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        data: {
                            ...prev.data,
                            executionStatus: nodeExecutionData.status,
                            executionTime: nodeExecutionData.execution_time_ms,
                            executionData: nodeExecutionData,
                        }
                    };
                });
            }
        }
    }, [executionData, activeNode?.id, activeNode?.type, activeNode?.data?.bundledNodes, isNodeSettingsOpen]);

    // Get node-specific execution data based on active node type
    // Each node type has unique input/output data structures matching n8n
    const currentExecutionData = useMemo(() => {
        if (!activeNode || !activeNode.data) {
            return null;
        }
        
        // Get the node type from data
        const nodeType = activeNode.data.type || activeNode.data.label || activeNode.type || 'HTTP Request';
        
        // Get node-specific execution data
        return getNodeExecutionData(nodeType);
    }, [activeNode]);

    async function handlePromptSubmit(prompt) {
        setIsPromptOpen(true);
        const hasSelection = selectedNodes.length > 0;
        setGenerateStatus({ 
            state: 'generating', 
            message: hasSelection ? 'Editing selected nodes...' : 'Drafting workflow...' 
        });
        
        try {
            // Prepare selected nodes context (only relevant data)
            const selectedNodesContext = selectedNodes.map(node => ({
                id: node.id,
                type: node.data?.type || node.type,
                label: node.data?.label,
                data: node.data,
                position: node.position
            }));

            const { data } = await axios.post('/app/ai/generate', { 
                prompt,
                selectedNodes: hasSelection ? selectedNodesContext : undefined,
                mode: hasSelection ? 'edit' : 'create'
            });
            
            const graphWithMetadata = enrichGraphWithNodeMetadata(data.graph);
            setDraft({ ...data, graph: graphWithMetadata });
            setGenerateStatus({ state: 'draft-ready', message: 'Draft ready for review.' });
        } catch (error) {
            const message = error.response?.data?.message ?? 'Unable to reach AI service.';
            setGenerateStatus({ state: 'error', message });
        }
    }

    async function handleAcceptDraft() {
        if (!draft.graph?.nodes?.length) {
            return;
        }
        setGenerateStatus({ state: 'saving', message: 'Saving workflow...' });
        try {
            const { data } = await axios.post('/app/workflows', draft);
            setWorkflows((prev) => [data.workflow, ...prev]);
            setSelectedWorkflowId(data.workflow.id);
            setDraft(initialDraft);
            setGenerateStatus({ state: 'saved', message: 'Workflow created.' });
        } catch (error) {
            const message = error.response?.data?.message ?? 'Unable to save workflow.';
            setGenerateStatus({ state: 'error', message });
        }
    }

    function handleGraphChange(newGraph) {
        setCurrentGraph(newGraph);
        setGraphHistory((prev) => {
            const base = historyIndex >= 0 ? prev.slice(0, historyIndex + 1) : prev;
            const updated = [...base, newGraph];
            const limited = updated.length > 50 ? updated.slice(updated.length - 50) : updated;
            setHistoryIndex(limited.length - 1);
            return limited;
        });
    }

    const handleNodeSettingsUpdate = useCallback(
        async (updatedNode) => {
            if (!currentGraph) {
                return;
            }
            const updatedNodes = (currentGraph.nodes ?? []).map((node) =>
                node.id === updatedNode.id ? { ...node, data: { ...node.data, ...updatedNode.data } } : node,
            );
            const nextGraph = { ...currentGraph, nodes: updatedNodes };
            handleGraphChange(nextGraph);
            canvasRef.current?.setGraph?.(nextGraph);
            setActiveNode((prev) => (prev?.id === updatedNode.id ? { ...prev, data: updatedNode.data } : prev));
            
            // Save to database immediately so execution uses latest config
            if (selectedWorkflow?.id) {
                try {
                    await axios.patch(`/app/workflows/${selectedWorkflow.id}`, {
                        graph: nextGraph,
                    });
                    console.log('✅ Node configuration saved to database');
                    
                    // Refresh user balance if logged in
                    if (user) {
                        const { data } = await axios.get('/auth/user');
                        setUser(data.user);
                    }
                } catch (error) {
                    console.error('Failed to save node configuration:', error);
                    
                    if (error.response?.status === 401) {
                        // Not logged in - show Google login modal
                        setShowLoginModal(true);
                        setLoginReason('save_workflow');
                    } else if (error.response?.status === 402) {
                        // Insufficient credits
                        const { required_credits, current_balance, pricing_key } = error.response.data;
                        setCreditInfo({
                            required: required_credits,
                            current: current_balance,
                            action: pricing_key || 'save_workflow'
                        });
                        setShowCreditsModal(true);
                    }
                }
            }
        },
        [currentGraph, selectedWorkflow?.id],
    );

    const pollExecutionStatus = useCallback(async (workflowId) => {
        try {
            const { data } = await axios.get(`/app/workflows/${workflowId}/execution`);
            console.log('📊 Poll response:', {
                hasRun: !!data.run,
                status: data.run?.status,
                nodeResultsCount: Object.keys(data.run?.node_results || {}).length
            });
            
            if (data.run) {
                setExecutionData(data.run);
                
                // Stop polling when execution is complete
                if (data.run.status === 'success' || data.run.status === 'failed') {
                    console.log('⏹️ Execution complete, stopping polling');
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }
                    if (executionTimeoutRef.current) {
                        clearTimeout(executionTimeoutRef.current);
                        executionTimeoutRef.current = null;
                    }
                    setIsExecuting(false);
                    
                    // Don't show global message - spinners and badges on nodes are enough
                    setExecutionMessage(null);
                }
            }
        } catch (error) {
            console.error('Failed to poll execution status', error);
        }
    }, []);

    const handleExecute = useCallback(async () => {
        console.log('🎬 Execute button clicked!');
        
        if (!selectedWorkflow) {
            console.log('❌ No workflow selected');
            setExecutionMessage({ type: 'error', text: 'No workflow selected' });
            setTimeout(() => setExecutionMessage(null), 3000);
            return;
        }
        
        if (isExecuting) {
            console.log('⚠️ Already executing, ignoring click');
            return;
        }

        console.log('✅ Starting execution for workflow:', selectedWorkflow.id);
        setIsExecuting(true);
        setExecutionData(null);
        
        // Clear activeNode execution data for fresh start
        setActiveNode(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                data: {
                    ...prev.data,
                    executionStatus: undefined,
                    executionTime: undefined,
                    executionData: undefined,
                }
            };
        });
        
        // Don't show global message - users will see spinners on individual nodes
        setExecutionMessage(null);

        try {
            console.log('📤 Sending execute request...');
            const response = await axios.post(`/app/workflows/${selectedWorkflow.id}/execute`);
            console.log('✅ Execute request successful:', response.data);
            
            // DON'T update the workflow - it would replace current graph with old saved version
            // Just start polling for execution status

            // Start polling for execution status
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
            
            // Poll immediately to catch running states
            console.log('🚀 Starting polling');
            pollExecutionStatus(selectedWorkflow.id);
            
            // Then poll every 250ms for real-time updates (balanced between responsiveness and performance)
            pollingIntervalRef.current = setInterval(() => {
                pollExecutionStatus(selectedWorkflow.id);
            }, 250);
            
            // Safeguard: Re-enable button after 30 seconds max
            if (executionTimeoutRef.current) {
                clearTimeout(executionTimeoutRef.current);
            }
            executionTimeoutRef.current = setTimeout(() => {
                if (pollingIntervalRef.current) {
                    console.log('⚠️ Execution timeout - stopping polling');
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                    setIsExecuting(false);
                }
                executionTimeoutRef.current = null;
            }, 30000);
        } catch (error) {
            console.error('❌ Execute request failed:', error);
            const message = error.response?.data?.message ?? 'Failed to execute workflow';
            setExecutionMessage({ type: 'error', text: `❌ ${message}` });
            setTimeout(() => setExecutionMessage(null), 5000);
            setIsExecuting(false);
        }
    }, [selectedWorkflow, pollExecutionStatus, isExecuting]);
    
    // Cleanup polling and timeout on unmount
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
            if (executionTimeoutRef.current) {
                clearTimeout(executionTimeoutRef.current);
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
                    <p className="text-lg">Loading n8n Replica...</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="h-screen flex flex-col bg-yellow-100 overflow-hidden" style={{ fontFamily: "'Comic Neue', 'Bangers', cursive" }}>
            {/* Header */}
            <header className="flex-shrink-0 px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 border-b-2 sm:border-b-4 border-black flex flex-wrap items-center justify-between gap-2 sm:gap-3 md:gap-4 z-10" style={{ boxShadow: '2px 2px 0px #000' }}>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="tactile-button p-2 sm:p-2.5 md:p-3 bg-white hover:bg-yellow-300 rounded-lg transition border-2 sm:border-3 border-black min-h-[44px] min-w-[44px]"
                        title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                        style={{ boxShadow: '2px 2px 0px #000' }}
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-black flex items-center gap-1 sm:gap-2" style={{ fontFamily: "'Bangers', cursive", textShadow: '2px 2px 0px #fff, 3px 3px 0px #000', letterSpacing: '1px' }}>
                            <span className="text-lg sm:text-2xl md:text-3xl">⚡</span>
                            <span className="hidden sm:inline">N8N WORKFLOW AUTOMATION!</span>
                            <span className="sm:hidden">N8N</span>
                        </h1>
                        <p className="hidden md:block text-xs md:text-sm text-black font-bold" style={{ fontFamily: "'Comic Neue', cursive" }}>
                            POW! Build workflows visually • BAM! 100+ integrations
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 order-last lg:order-none w-full lg:w-auto justify-center lg:justify-start mt-2 lg:mt-0">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            onClick={toggleSelectionMode}
                            className={`hidden lg:flex tactile-button w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-col items-center justify-center gap-0.5 px-1 sm:px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold ${
                                selectionMode === 'select'
                                    ? 'bg-cyan-400 text-black border-2 md:border-3 lg:border-4 border-black'
                                    : 'bg-white text-black border-2 md:border-3 lg:border-4 border-black'
                            }`}
                            style={{ boxShadow: '2px 2px 0px #000', fontFamily: "'Comic Neue', cursive" }}
                            title={selectionMode === 'select' ? 'Box selection enabled' : 'Enable box selection'}
                            aria-pressed={selectionMode === 'select'}
                        >
                            <span className="w-6 h-6 border-2 border-dashed border-current rounded mb-0.5"></span>
                            <span className="w-6 h-px bg-current opacity-40 mb-0.5"></span>
                            <svg className="w-3 h-3 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                            </svg>
                            <span className="text-[10px] uppercase tracking-wide leading-none">Select</span>
                        </button>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button
                                type="button"
                                onClick={handleUndo}
                                disabled={!canUndo}
                                className="hidden md:flex tactile-button w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-col items-center justify-center gap-0.5 px-1 sm:px-2 py-1 rounded-lg bg-white text-black border-2 md:border-3 lg:border-4 border-black disabled:opacity-30 disabled:hover:scale-100"
                                style={{ boxShadow: '2px 2px 0px #000', fontFamily: "'Comic Neue', cursive" }}
                                title="Undo"
                                aria-label="Undo"
                            >
                                <span className="material-symbols-outlined text-[22px] leading-none">
                                    undo
                                </span>
                                <span className="text-[10px] uppercase tracking-wide leading-none text-slate-500">
                                    Undo
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={handleRedo}
                                disabled={!canRedo}
                                className="hidden md:flex tactile-button w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-col items-center justify-center gap-0.5 px-1 sm:px-2 py-1 rounded-lg bg-white text-black border-2 md:border-3 lg:border-4 border-black disabled:opacity-30 disabled:hover:scale-100"
                                style={{ boxShadow: '2px 2px 0px #000', fontFamily: "'Comic Neue', cursive" }}
                                title="Redo"
                                aria-label="Redo"
                            >
                                <span className="material-symbols-outlined text-[22px] leading-none">
                                    redo
                                </span>
                                <span className="text-[10px] uppercase tracking-wide leading-none text-slate-500">
                                    Redo
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={handleQuickSave}
                                className="tactile-button w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex flex-col items-center justify-center gap-0.5 px-1 sm:px-2 py-1 rounded-lg bg-green-400 text-black border-2 sm:border-3 md:border-4 border-black min-h-[48px] min-w-[48px]"
                                style={{ boxShadow: '2px 2px 0px #000', fontFamily: "'Comic Neue', cursive" }}
                                title="Quick save"
                                aria-label="Save"
                            >
                                <span className="material-symbols-outlined text-lg sm:text-[20px] md:text-[22px] leading-none">
                                    save
                                </span>
                                <span className="hidden sm:block text-[9px] sm:text-[10px] uppercase tracking-wide leading-none text-black font-bold">
                                    SAVE
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteSelection}
                                disabled={!selectionCount}
                                className="hidden sm:flex tactile-button w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-col items-center justify-center gap-0.5 px-1 sm:px-2 py-1 rounded-lg bg-red-400 text-black border-2 sm:border-3 md:border-4 border-black disabled:opacity-30 disabled:hover:scale-100"
                                style={{ boxShadow: '2px 2px 0px #000', fontFamily: "'Comic Neue', cursive" }}
                                title="Delete selection"
                                aria-label="Delete selection"
                            >
                                <span className="material-symbols-outlined text-[22px] leading-none">
                                    delete
                                </span>
                                <span className="text-[10px] uppercase tracking-wide leading-none text-black font-bold">
                                    ZAP!
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => canvasRef.current?.groupNodes?.()}
                                disabled={selectionCount < 2}
                                className="hidden xl:flex tactile-button w-14 h-14 lg:w-16 lg:h-16 flex-col items-center justify-center gap-0.5 px-1 sm:px-2 py-1 rounded-lg bg-orange-400 text-black border-2 md:border-3 lg:border-4 border-black disabled:opacity-30"
                                style={{ boxShadow: '2px 2px 0px #000', fontFamily: "'Comic Neue', cursive" }}
                                title="Group selected nodes into a bundle"
                                aria-label="Bundle nodes"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                                    {/* Stacked colored bars */}
                                    <rect x="8" y="6" width="32" height="5" rx="0.5" fill="#22c55e"/>
                                    <rect x="8" y="12" width="32" height="5" rx="0.5" fill="#eab308"/>
                                    <rect x="8" y="18" width="32" height="5" rx="0.5" fill="#f97316"/>
                                    <rect x="8" y="24" width="32" height="5" rx="0.5" fill="#ef4444"/>
                                    <rect x="8" y="30" width="32" height="5" rx="0.5" fill="#a855f7"/>
                                    <rect x="8" y="36" width="32" height="5" rx="0.5" fill="#3b82f6"/>
                                    
                                    {/* Belt with buckle */}
                                    <rect x="6" y="19" width="36" height="10" rx="1" fill="#d97706"/>
                                    <rect x="18" y="21" width="12" height="6" rx="0.5" fill="#e5e5e5" stroke="#525252" strokeWidth="0.8"/>
                                    <rect x="20" y="22.5" width="8" height="3" rx="0.3" fill="none" stroke="#404040" strokeWidth="0.8"/>
                                    <circle cx="24" cy="24" r="0.8" fill="#262626"/>
                                </svg>
                                <span className="text-[10px] uppercase tracking-wide leading-none text-black font-bold">
                                    BUNDLE
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="relative" ref={editMenuRef}>
                        <button
                            type="button"
                            className="tactile-button flex items-center gap-1 text-xs sm:text-sm font-bold text-black px-2 sm:px-3 md:px-4 h-12 sm:h-14 md:h-16 rounded-lg bg-purple-400 border-2 sm:border-3 md:border-4 border-black min-h-[48px]"
                            onClick={() => setIsEditMenuOpen((prev) => !prev)}
                            style={{ boxShadow: '2px 2px 0px #000', fontFamily: "'Bangers', cursive", letterSpacing: '0.5px' }}
                            aria-haspopup="true"
                            aria-expanded={isEditMenuOpen}
                        >
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden text-base">⋮</span>
                            <svg className={`hidden sm:block w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isEditMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isEditMenuOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 space-y-3 z-20">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Selection
                                    </div>
                                    <p className="text-sm text-slate-800">
                                        {selectionCount > 0 ? `${selectionCount} item${selectionCount > 1 ? 's' : ''} selected` : 'No nodes selected'}
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-1">
                                        Right-click and drag to draw a selection box.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleSelectAllNodes();
                                            setIsEditMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Select all
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleCopySelection();
                                            setIsEditMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                        disabled={!selectionCount}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 11h8m-5 4h5M6 7h.01M6 11h.01M6 15h.01" />
                                        </svg>
                                        Copy selection
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleDeleteSelection();
                                            setIsEditMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                        disabled={!selectionCount}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete selection
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSaveFromMenu}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Save workflow
                                </button>
                            </div>
                        )}
                    </div>

                    {/* User Info and Credits */}
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-auto">
                        {user ? (
                            <>
                                {/* Credit Balance */}
                                <div className="flex items-center gap-1 sm:gap-2 bg-yellow-300 px-2 sm:px-3 md:px-4 h-12 sm:h-14 md:h-16 rounded-lg border-2 sm:border-3 border-black"
                                     style={{ boxShadow: '2px 2px 0px #000' }}>
                                    <span className="text-lg sm:text-xl md:text-2xl">💰</span>
                                    <span className="font-bold text-sm sm:text-base md:text-lg">{user.credit_balance}</span>
                                    <span className="hidden sm:inline text-xs text-gray-700">credits</span>
                                </div>

                                {/* User Avatar and Name */}
                                <div className="hidden sm:flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 h-12 sm:h-14 md:h-16 rounded-lg border-2 sm:border-3 border-black max-w-[100px] sm:max-w-[150px] md:max-w-[200px]"
                                     style={{ boxShadow: '2px 2px 0px #000' }}>
                                    {user.avatar && (
                                        <img src={user.avatar} alt={user.name} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-black flex-shrink-0" />
                                    )}
                                    <span className="font-medium text-xs sm:text-sm truncate">{user.name}</span>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={async () => {
                                        await axios.post('/auth/logout');
                                        setUser(null);
                                        window.location.reload();
                                    }}
                                    className="tactile-button bg-red-400 text-white px-2 sm:px-3 md:px-4 h-12 sm:h-14 md:h-16 rounded-lg text-xs sm:text-sm font-bold border-2 sm:border-3 border-black hover:bg-red-500 min-h-[48px]"
                                    style={{ boxShadow: '2px 2px 0px #000' }}
                                >
                                    <span className="hidden sm:inline">Logout</span>
                                    <span className="sm:hidden">🚪</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    setShowLoginModal(true);
                                    setLoginReason('general');
                                }}
                                className="tactile-button bg-blue-500 text-white px-3 sm:px-4 md:px-6 h-12 sm:h-14 md:h-16 rounded-lg text-xs sm:text-sm font-bold border-2 sm:border-3 border-black hover:bg-blue-600 flex items-center gap-1 sm:gap-2 min-h-[48px]"
                                style={{ boxShadow: '2px 2px 0px #000' }}
                            >
                                <span className="text-base sm:text-lg">🔐</span>
                                <span className="hidden sm:inline">Sign In</span>
                                <span className="sm:hidden text-xs">In</span>
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        data-execute-workflow="true"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleExecute();
                        }}
                        disabled={isExecuting || !selectedWorkflow}
                        className="tactile-button text-xs sm:text-sm md:text-base bg-lime-400 text-black px-3 sm:px-4 md:px-6 h-12 sm:h-14 md:h-16 rounded-lg font-bold border-2 sm:border-3 md:border-4 border-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-500 active:bg-lime-600 transition-colors min-h-[48px]"
                        style={{ boxShadow: '2px 2px 0px #000', fontFamily: "'Bangers', cursive", letterSpacing: '1px', pointerEvents: (isExecuting || !selectedWorkflow) ? 'none' : 'auto' }}
                    >
                        <span className="flex items-center gap-1 sm:gap-2">
                            {isExecuting ? (
                                <><span className="hidden sm:inline">⚡ RUNNING...</span><span className="sm:hidden">⚡</span></>
                            ) : (
                                <><span className="hidden sm:inline">▶️ EXECUTE!</span><span className="sm:hidden">▶️</span></>
                            )}
                        </span>
                    </button>
                </div>
            </header>

            {/* Execution Feedback */}
            {executionMessage && (
                <div className={`fixed top-20 right-6 z-50 px-6 py-4 rounded-xl border-4 border-black animate-bounce ${
                    executionMessage.type === 'success' ? 'bg-green-300' : 
                    executionMessage.type === 'error' ? 'bg-red-300' : 
                    'bg-blue-300'
                }`} style={{ boxShadow: '4px 4px 0px #000', fontFamily: "'Comic Neue', cursive" }}>
                    <p className="text-black font-bold text-lg flex items-center gap-2">
                        {executionMessage.text}
                    </p>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Nodes Carousel */}
                {isSidebarOpen && <NodesCarousel />}

                {/* Canvas Area */}
                <div className="flex-1 relative">
                    <WorkflowCanvas 
                        ref={canvasRef}
                        graph={currentGraph} 
                        onGraphChange={handleGraphChange}
                        onSelectionUpdate={handleSelectionUpdate}
                        selectionMode={selectionMode}
                        onNodeSettingsOpen={handleNodeSettingsOpen}
                        executionData={executionData}
                    />
                </div>
                {isNodeSettingsOpen && (
                    <NodeSettingsPanel
                        node={activeNode}
                        onClose={handleNodeSettingsClose}
                        onUpdate={handleNodeSettingsUpdate}
                        executionData={activeNode?.data?.executionData || null}
                        graph={currentGraph}
                    />
                )}
            </main>

            {/* AI Prompt Panel */}
            <PromptPanel
                onSubmit={handlePromptSubmit}
                onAcceptDraft={handleAcceptDraft}
                draft={draft}
                status={generateStatus}
                isOpen={isPromptOpen}
                onExpand={() => setIsPromptOpen(true)}
                onCollapse={() => setIsPromptOpen(false)}
                isSidebarOpen={isSidebarOpen}
                isNodeSettingsOpen={isNodeSettingsOpen}
                selectedNodes={selectedNodes}
            />

            {/* Google Login Modal */}
            <GoogleLoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                reason={loginReason}
            />

            {/* Insufficient Credits Modal */}
            <InsufficientCreditsModal
                isOpen={showCreditsModal}
                onClose={() => setShowCreditsModal(false)}
                required={creditInfo.required}
                current={creditInfo.current}
                action={creditInfo.action}
            />
        </div>
        <style>{`
          .tactile-button {
            transition: transform 0.06s ease-out, box-shadow 0.06s ease-out;
          }
          .tactile-button:active {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px #000 !important;
          }
          
          /* Execution status indicators */
          .react-flow__node.execution-running {
            animation: pulse-running 1s ease-in-out infinite;
            border: 3px solid #f59e0b !important;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.6) !important;
          }
          
          .react-flow__node.execution-success {
            border: 3px solid #10b981 !important;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.4) !important;
          }
          
          .react-flow__node.execution-failed {
            border: 3px solid #ef4444 !important;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.4) !important;
          }
          
          @keyframes pulse-running {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 20px rgba(245, 158, 11, 0.6);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 30px rgba(245, 158, 11, 0.8);
            }
          }
        `}</style>
        </>
    );
}
