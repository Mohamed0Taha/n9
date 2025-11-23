import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useTheme, THEMES } from '../contexts/ThemeContext.jsx';
import WorkflowCanvas from './WorkflowCanvas.jsx';
import PromptPanel from './PromptPanel.jsx';
import NodesCarousel from './NodesCarousel.jsx';
import NodeSettingsPanel from './NodeSettingsPanel.jsx';
import GoogleLoginModal from './GoogleLoginModal.jsx';
import InsufficientCreditsModal from './InsufficientCreditsModal.jsx';
import CredentialsModal from './CredentialsModal.jsx';
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
    const { theme, toggleTheme, setTheme, THEMES, isProfessional, isComic, isHacker, isTerminal, isDark } = useTheme();
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    
    const themeStyles = useMemo(() => {
        const baseButton = "p-2 rounded-lg transition";
        switch(theme) {
            case THEMES.PROFESSIONAL: return {
                app: 'bg-slate-50 font-sans text-slate-900',
                header: 'bg-white border-b border-slate-200 shadow-sm',
                divider: 'bg-slate-200',
                button: `${baseButton} hover:bg-slate-100 text-slate-600`,
                buttonActive: `${baseButton} bg-blue-100 text-blue-600`,
                primaryButton: "flex items-center gap-2 px-4 py-2 rounded-lg transition font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
                successButton: "flex items-center gap-2 px-3 py-2 rounded-lg transition font-bold text-sm bg-green-600 hover:bg-green-700 text-white shadow-sm",
                dangerButton: `${baseButton} text-red-500 hover:bg-red-50 disabled:opacity-30`,
                avatar: "border-slate-200"
            };
            case THEMES.HACKER: return {
                app: 'bg-black font-mono text-green-500',
                header: 'bg-black border-b border-green-900 shadow-[0_0_15px_rgba(0,255,0,0.1)]',
                divider: 'bg-green-900',
                button: `${baseButton} hover:bg-green-900/30 text-green-500 border border-transparent hover:border-green-800`,
                buttonActive: `${baseButton} bg-green-900/50 text-green-400 border border-green-600`,
                primaryButton: "flex items-center gap-2 px-4 py-2 rounded-lg transition font-bold text-sm bg-green-900 hover:bg-green-800 text-green-400 border border-green-600 disabled:opacity-50",
                successButton: "flex items-center gap-2 px-3 py-2 rounded-lg transition font-bold text-sm bg-green-900 hover:bg-green-800 text-green-400 border border-green-600",
                dangerButton: `${baseButton} text-red-500 hover:bg-red-900/20 border border-transparent hover:border-red-900 disabled:opacity-30`,
                avatar: "border-green-700 grayscale"
            };
            case THEMES.TERMINAL: return {
                app: 'bg-slate-950 font-mono text-amber-500',
                header: 'bg-slate-950 border-b border-amber-900',
                divider: 'bg-amber-900',
                button: `${baseButton} hover:bg-amber-900/20 text-amber-500`,
                buttonActive: `${baseButton} bg-amber-900/40 text-amber-400 border border-amber-800`,
                primaryButton: "flex items-center gap-2 px-4 py-2 rounded-lg transition font-bold text-sm bg-amber-700 hover:bg-amber-600 text-slate-950 font-bold disabled:opacity-50",
                successButton: "flex items-center gap-2 px-3 py-2 rounded-lg transition font-bold text-sm bg-amber-700 hover:bg-amber-600 text-slate-950 font-bold",
                dangerButton: `${baseButton} text-red-500 hover:bg-red-900/20 disabled:opacity-30`,
                avatar: "border-amber-900 sepia"
            };
            case THEMES.DARK: return {
                app: 'bg-gray-900 font-sans text-gray-100',
                header: 'bg-gray-800 border-b border-gray-700 shadow-md',
                divider: 'bg-gray-700',
                button: `${baseButton} hover:bg-gray-700 text-gray-300`,
                buttonActive: `${baseButton} bg-blue-900/40 text-blue-400`,
                primaryButton: "flex items-center gap-2 px-4 py-2 rounded-lg transition font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50",
                successButton: "flex items-center gap-2 px-3 py-2 rounded-lg transition font-bold text-sm bg-green-600 hover:bg-green-700 text-white",
                dangerButton: `${baseButton} text-red-400 hover:bg-red-900/20 disabled:opacity-30`,
                avatar: "border-gray-600"
            };
            default: return { // COMIC
                app: 'bg-yellow-100 font-comic text-black',
                header: 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 border-b-4 border-black',
                divider: 'bg-black opacity-20',
                button: `${baseButton} tactile-button bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000]`,
                buttonActive: `${baseButton} tactile-button bg-cyan-400 border-2 border-black shadow-[2px_2px_0px_#000]`,
                primaryButton: "flex items-center gap-2 px-4 py-2 rounded-lg transition font-bold text-sm tactile-button bg-blue-500 text-white border-2 border-black shadow-[2px_2px_0px_#000] disabled:opacity-50",
                successButton: "flex items-center gap-2 px-3 py-2 rounded-lg transition font-bold text-sm tactile-button bg-green-400 text-black border-2 border-black shadow-[2px_2px_0px_#000]",
                dangerButton: `${baseButton} tactile-button bg-red-400 border-2 border-black shadow-[2px_2px_0px_#000] disabled:opacity-50`,
                avatar: "border-2 border-black"
            };
        }
    }, [theme]);

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
    const [credentials, setCredentials] = useState([]);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
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

    // Fetch credentials when user is authenticated
    useEffect(() => {
        if (user) {
            fetchCredentials();
        }
    }, [user]);

    const fetchCredentials = async () => {
        try {
            const { data } = await axios.get('/app/credentials');
            setCredentials(data.credentials || []);
            console.log('📋 Loaded credentials:', data.credentials?.length || 0);
        } catch (error) {
            console.error('Failed to fetch credentials', error);
        }
    };

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

    const handleGraphChange = useCallback((newGraph) => {
        setCurrentGraph(newGraph);
        setGraphHistory((prev) => {
            const newHistory = prev.slice(0, historyIndex + 1);
            return [...newHistory, newGraph];
        });
        setHistoryIndex((prev) => prev + 1);
    }, [historyIndex]);

    const handleUndo = useCallback(() => {
        if (canUndo) {
            setHistoryIndex((prev) => prev - 1);
            setCurrentGraph(graphHistory[historyIndex - 1]);
        }
    }, [canUndo, historyIndex, graphHistory]);

    const handleRedo = useCallback(() => {
        if (canRedo) {
            setHistoryIndex((prev) => prev + 1);
            setCurrentGraph(graphHistory[historyIndex + 1]);
        }
    }, [canRedo, historyIndex, graphHistory]);

    const handlePromptSubmit = async (prompt) => {
        setGenerateStatus({ state: 'generating', message: 'Analyzing request...' });
        try {
            const response = await axios.post('/app/ai/generate', { prompt });
            const generatedGraph = enrichGraphWithNodeMetadata(response.data.graph);
            
            setGenerateStatus({ state: 'success', message: 'Workflow generated!' });
            setDraft({ ...draft, description: prompt, graph: generatedGraph });
            setCurrentGraph(generatedGraph);
            
            // Add to history
            handleGraphChange(generatedGraph);
        } catch (error) {
            setGenerateStatus({ state: 'error', message: 'Failed to generate workflow' });
            console.error(error);
        }
    };

    const handleAcceptDraft = async () => {
        try {
            const { data } = await axios.post('/app/workflows', {
                name: 'AI Generated Workflow',
                description: draft.description,
                graph: currentGraph,
            });
            
            setWorkflows([data.workflow, ...workflows]);
            setSelectedWorkflowId(data.workflow.id);
            setIsPromptOpen(false);
        } catch (error) {
            console.error('Failed to save workflow', error);
        }
    };

    const handleSelectionUpdate = useCallback((selection) => {
        const nodes = Array.isArray(selection) ? selection : (selection?.nodes || []);
        setSelectionCount(nodes.length);
        setSelectedNodes(nodes);
    }, []);

    const toggleSelectionMode = () => {
        setSelectionMode(prev => prev === 'pan' ? 'select' : 'pan');
        // Close menu if open
        setIsEditMenuOpen(false);
    };

    const handleDeleteSelection = () => {
        if (canvasRef.current) {
            canvasRef.current.deleteSelection();
            setSelectionCount(0);
            setSelectedNodes([]);
        }
    };

    const handleNodeSettingsOpen = (node) => {
        setActiveNode(node);
        setIsNodeSettingsOpen(true);
    };

    const handleNodeSettingsClose = () => {
        setIsNodeSettingsOpen(false);
        setActiveNode(null);
    };

    const handleNodeSettingsUpdate = (updatedNode) => {
        if (canvasRef.current) {
            canvasRef.current.updateNode(updatedNode);
        }
    };

    const handleExecute = async () => {
        if (!selectedWorkflow) return;
        
        setIsExecuting(true);
        setExecutionMessage({ type: 'info', text: 'Initializing execution environment...' });
        setExecutionData(null); // Clear previous data

        try {
            // 1. Save current state first
            await handleQuickSave();
            
            setExecutionMessage({ type: 'info', text: 'Dispatching workflow execution...' });

            // 2. Trigger execution
            const { data } = await axios.post(`/app/workflows/${selectedWorkflowId}/execute`);
            
            // 3. Poll for results
            pollExecutionStatus(selectedWorkflowId);
            
        } catch (error) {
            console.error('Execution failed', error);
            setExecutionMessage({ type: 'error', text: 'Failed to start execution' });
            setIsExecuting(false);
        }
    };

    const pollExecutionStatus = (workflowId) => {
        let attempts = 0;
        const maxAttempts = 60; // 1 minute timeout
        
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        
        pollingIntervalRef.current = setInterval(async () => {
            attempts++;
            try {
                const { data } = await axios.get(`/app/workflows/${workflowId}/execution`);
                
                if (data.status === 'completed' || data.status === 'success') {
                    clearInterval(pollingIntervalRef.current);
                    setIsExecuting(false);
                    setExecutionMessage({ type: 'success', text: 'Workflow executed successfully!' });
                    setExecutionData(data.node_results); // Update overlay data
                    
                    // Clear success message after 3s
                    setTimeout(() => setExecutionMessage(null), 3000);
                } else if (data.status === 'failed') {
                    clearInterval(pollingIntervalRef.current);
                    setIsExecuting(false);
                    setExecutionMessage({ type: 'error', text: 'Workflow execution failed.' });
                    setExecutionData(data.node_results);
                } else {
                    // Still running - update intermediate status if available
                    if (data.node_results) {
                        setExecutionData(data.node_results);
                    }
                }
                
                if (attempts >= maxAttempts) {
                    clearInterval(pollingIntervalRef.current);
                    setIsExecuting(false);
                    setExecutionMessage({ type: 'error', text: 'Execution timed out.' });
                }
            } catch (error) {
                console.error('Polling error', error);
            }
        }, 1000);
    };

    const handleQuickSave = async () => {
        if (!selectedWorkflow) return;
        
        try {
            await axios.patch(`/app/workflows/${selectedWorkflowId}`, {
                graph: currentGraph
            });
            
            // Show brief success toast (using execution message for now)
            setExecutionMessage({ type: 'success', text: 'Workflow saved!' });
            setTimeout(() => setExecutionMessage(null), 2000);
        } catch (error) {
            if (error.response?.status === 401) {
                setShowLoginModal(true);
                setLoginReason('save_workflow');
            } else if (error.response?.status === 402) {
                setCreditInfo({
                    required: error.response.data.required_credits,
                    current: error.response.data.current_balance,
                    action: 'Save Workflow'
                });
                setShowCreditsModal(true);
            } else {
                console.error('Save failed', error);
                setExecutionMessage({ type: 'error', text: 'Failed to save workflow' });
            }
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('workflow', file);

        try {
            setLoading(true);
            const { data } = await axios.post('/app/workflows/upload', formData);
            setWorkflows([data.workflow, ...workflows]);
            setSelectedWorkflowId(data.workflow.id);
            setExecutionMessage({ type: 'success', text: 'Workflow imported successfully!' });
            setTimeout(() => setExecutionMessage(null), 3000);
        } catch (error) {
            console.error('Upload failed', error);
            setExecutionMessage({ type: 'error', text: 'Failed to import workflow' });
        } finally {
            setLoading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    const handleDownload = () => {
        if (!selectedWorkflowId) return;
        window.location.href = `/app/workflows/${selectedWorkflowId}/download`;
    };

    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
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
        <div className={`fixed inset-0 flex flex-col overflow-hidden ${themeStyles.app}`} style={isComic ? { fontFamily: "'Comic Neue', 'Bangers', cursive" } : {}}>
            {/* Header */}
            <header className={`flex-shrink-0 px-4 py-3 flex flex-wrap items-center justify-between gap-4 z-10 ${themeStyles.header}`} style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={themeStyles.button}
                        title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                        style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div>
                        {!isComic ? (
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-lg ${
                                    isHacker ? 'bg-green-900 text-green-400' : 
                                    isTerminal ? 'bg-amber-900/50 text-amber-500' :
                                    isDark ? 'bg-blue-900 text-blue-200' :
                                    'bg-blue-600 text-white'
                                }`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className={`text-lg font-semibold leading-none ${isHacker ? 'text-green-500' : isTerminal ? 'text-amber-500' : isDark ? 'text-gray-100' : 'text-slate-900'}`}>Workflow AI</h1>
                                    <p className={`text-xs ${isHacker ? 'text-green-700' : isTerminal ? 'text-amber-700' : isDark ? 'text-gray-500' : 'text-slate-500'}`}>Enterprise Automation</p>
                                </div>
                            </div>
                        ) : (
                            <h1 className="text-xl sm:text-2xl font-bold text-black flex items-center gap-2" style={{ fontFamily: "'Bangers', cursive", letterSpacing: '1px', textShadow: '2px 2px 0px #fff' }}>
                                <span>⚡</span>
                                <span>N8N WORKFLOW</span>
                            </h1>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
                    {/* Theme Selector Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                            className={themeStyles.button}
                            style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                            title="Select Theme"
                        >
                            {theme === THEMES.HACKER ? '🤖' : theme === THEMES.TERMINAL ? '💻' : theme === THEMES.DARK ? '🌙' : theme === THEMES.COMIC ? '🎨' : '💼'}
                        </button>
                        
                        {isThemeMenuOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setIsThemeMenuOpen(false)}
                                ></div>
                                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50 border overflow-hidden ${
                                    isComic ? 'bg-white border-2 border-black' : 
                                    isHacker ? 'bg-black border-green-900 shadow-[0_0_10px_rgba(0,255,0,0.2)]' : 
                                    isTerminal ? 'bg-slate-950 border-amber-900 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                                    isDark ? 'bg-gray-800 border-gray-700' :
                                    'bg-white border-slate-200'
                                }`} style={isComic ? { boxShadow: '4px 4px 0px #000' } : {}}>
                                    {[
                                        { id: THEMES.PROFESSIONAL, label: 'Professional', icon: '💼' },
                                        { id: THEMES.COMIC, label: 'Comic', icon: '🎨' },
                                        { id: THEMES.DARK, label: 'Dark Mode', icon: '🌙' },
                                        { id: THEMES.HACKER, label: 'Hacker', icon: '🤖' },
                                        { id: THEMES.TERMINAL, label: 'Terminal', icon: '💻' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => {
                                                setTheme(opt.id);
                                                setIsThemeMenuOpen(false);
                                            }}
                                            className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                                                theme === opt.id ? 'font-bold' : ''
                                            } ${
                                                isComic ? 'hover:bg-yellow-100 text-black' :
                                                isHacker ? 'hover:bg-green-900/30 text-green-500' :
                                                isTerminal ? 'hover:bg-amber-900/30 text-amber-500' :
                                                isDark ? 'hover:bg-gray-700 text-gray-200' :
                                                'hover:bg-slate-50 text-slate-700'
                                            }`}
                                        >
                                            <span>{opt.icon}</span>
                                            <span>{opt.label}</span>
                                            {theme === opt.id && (
                                                <span className="ml-auto text-xs">✓</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className={`h-8 w-px ${themeStyles.divider}`}></div>

                    {/* Select Mode */}
                    <button
                        onClick={toggleSelectionMode}
                        className={selectionMode === 'select' ? themeStyles.buttonActive : themeStyles.button}
                        style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                        title={selectionMode === 'select' ? 'Selection Mode Active' : 'Enable Selection Mode'}
                    >
                        <span className="material-symbols-outlined text-xl">select_all</span>
                    </button>

                    {/* History Controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleUndo}
                            disabled={!canUndo}
                            className={`${themeStyles.button} disabled:opacity-30`}
                            style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                            title="Undo"
                        >
                            <span className="material-symbols-outlined text-xl">undo</span>
                        </button>
                        <button
                            onClick={handleRedo}
                            disabled={!canRedo}
                            className={`${themeStyles.button} disabled:opacity-30`}
                            style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                            title="Redo"
                        >
                            <span className="material-symbols-outlined text-xl">redo</span>
                        </button>
                    </div>

                    <div className={`h-8 w-px ${themeStyles.divider}`}></div>

                    {/* Tools Group */}
                    <div className="flex items-center gap-1">
                        {/* Credentials */}
                        {user && (
                            <button
                                onClick={() => setShowCredentialsModal(true)}
                                className={themeStyles.button}
                                style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                                title="Manage Credentials"
                            >
                                <span className="text-xl">🔐</span>
                            </button>
                        )}

                        {/* Upload */}
                        <label 
                            className={`${themeStyles.button} cursor-pointer`}
                            style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                            title="Upload Workflow"
                        >
                            <input type="file" accept=".json" onChange={handleUpload} className="hidden" />
                            <span className="material-symbols-outlined text-xl">upload</span>
                        </label>

                        {/* Download */}
                        <button
                            onClick={handleDownload}
                            disabled={!selectedWorkflow}
                            className={`${themeStyles.button} disabled:opacity-50`}
                            style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                            title="Download Workflow"
                        >
                            <span className="material-symbols-outlined text-xl">download</span>
                        </button>
                        
                        {/* Bundle */}
                        <button
                            onClick={() => canvasRef.current?.groupNodes?.()}
                            disabled={selectionCount < 2}
                            className={`${themeStyles.button} disabled:opacity-50`}
                            style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                            title="Bundle Selection"
                        >
                            <span className="text-xl">📦</span>
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <button
                        onClick={handleDeleteSelection}
                        disabled={!selectionCount}
                        className={themeStyles.dangerButton}
                        style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                        title="Delete Selection"
                    >
                        <span className="material-symbols-outlined text-xl">delete</span>
                    </button>

                    <button
                        onClick={handleQuickSave}
                        className={themeStyles.successButton}
                        style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                    >
                        <span className="material-symbols-outlined text-lg">save</span>
                        <span className="hidden sm:inline">Save</span>
                    </button>

                    <button
                        onClick={handleExecute}
                        disabled={isExecuting || !selectedWorkflow}
                        className={themeStyles.primaryButton}
                        style={isComic ? { boxShadow: '2px 2px 0px #000', fontFamily: "'Bangers', cursive", letterSpacing: '1px' } : {}}
                    >
                        {isExecuting ? (
                            <>
                                <span className="animate-spin">⚡</span>
                                <span>Running...</span>
                            </>
                        ) : (
                            <>
                                <span>▶️</span>
                                <span>Execute</span>
                            </>
                        )}
                    </button>

                    {/* User Profile */}
                    {user ? (
                        <div className={`ml-2 w-8 h-8 rounded-full overflow-hidden border ${themeStyles.avatar}`}>
                            <img 
                                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => window.location.href = '/auth/google'}
                            className="text-sm font-bold text-blue-600 hover:underline ml-2"
                        >
                            Sign In
                        </button>
                    )}
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
            <main className="flex-1 flex overflow-hidden relative">
                {/* Nodes Carousel with transition */}
                <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-96 opacity-100' : 'w-0 opacity-0'} overflow-hidden h-full min-h-0 border-r ${themeStyles.divider} flex flex-col`}>
                    <NodesCarousel />
                </div>

                {/* Canvas Area */}
                <div className={`flex-1 relative ${themeStyles.app}`}>
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
                        credentials={credentials}
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

            {/* Credentials Manager Modal */}
            <CredentialsModal
                isOpen={showCredentialsModal}
                onClose={() => setShowCredentialsModal(false)}
                onCredentialAdded={fetchCredentials}
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
