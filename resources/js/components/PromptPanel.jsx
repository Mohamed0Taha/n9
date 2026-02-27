import { useEffect, useState, useMemo } from 'react';
import { useTheme, THEMES } from '../contexts/ThemeContext.jsx';
import { n8nNodes } from '../data/n8nNodes.js';
import { getNodeSchema } from '../data/allNodeSchemas.js';

export default function PromptPanel({ 
    onSubmit, 
    onAcceptDraft, 
    draft, 
    status, 
    isOpen, 
    onExpand, 
    onCollapse, 
    isSidebarOpen, 
    isNodeSettingsOpen, 
    selectedNodes = [],
    missingFields = [],
    onConfigSubmit
}) {
    const [prompt, setPrompt] = useState('');
    const [fieldValues, setFieldValues] = useState({});
    const { theme, isComic } = useTheme();

    const isCollecting = missingFields.length > 0;

    const styles = useMemo(() => {
        if (isComic) {
            return {
                containerFont: "'Comic Neue', cursive",
                notch: {
                    className: "bg-black rounded-t-md px-8 py-0.5 border-2 border-black border-b-0 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors",
                    style: { boxShadow: '2px -1px 0px #000, -2px -1px 0px #000', marginBottom: '-2px' }
                },
                panel: {
                    className: "bg-yellow-50 rounded-2xl overflow-hidden border-4 border-black",
                    style: { boxShadow: '6px 6px 0px #000', marginTop: '0' }
                },
                headerTab: {
                    className: "w-full cursor-pointer bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-black px-8 py-4 flex items-center justify-center relative",
                    style: { boxShadow: 'inset 0px -4px 0px rgba(0,0,0,0.2)' }
                },
                headerTitle: {
                    className: "text-2xl font-bold",
                    style: { fontFamily: "'Bangers', cursive", letterSpacing: '2px', textShadow: '2px 2px 0px #fff' }
                },
                instructionsBox: {
                    className: "bg-gradient-to-r from-pink-200 to-purple-200 p-4 rounded-xl border-4 border-black",
                    style: { boxShadow: '3px 3px 0px #000' },
                    text: "text-sm text-black font-bold"
                },
                selectedNodesBox: {
                    className: "bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-xl border-4 border-black",
                    style: { boxShadow: '3px 3px 0px #000' },
                    title: "text-sm font-bold text-black",
                    node: "bg-white px-3 py-2 rounded-lg border-3 border-black flex items-center gap-2",
                    nodeStyle: { boxShadow: '2px 2px 0px #000' }
                },
                textareaLabel: {
                    className: "block text-2xl font-bold text-black mb-3",
                    style: { fontFamily: "'Bangers', cursive", letterSpacing: '1px' }
                },
                textarea: {
                    className: "w-full px-5 py-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg text-black placeholder-black/40 font-bold bg-white",
                    style: { boxShadow: '4px 4px 0px #000', fontFamily: "'Comic Neue', cursive", lineHeight: '1.5' }
                },
                statusBox: {
                    className: "bg-cyan-200 p-4 rounded-xl border-4 border-black",
                    style: { boxShadow: '3px 3px 0px #000' },
                    text: "text-black font-bold text-base flex items-center gap-2"
                },
                draftBadge: {
                    className: "bg-green-200 px-4 py-2 rounded-lg border-3 border-black",
                    style: { boxShadow: '2px 2px 0px #000' },
                    text: "text-sm font-bold text-black flex items-center gap-2"
                },
                acceptButton: {
                    className: "px-6 py-3 rounded-xl border-4 border-black bg-cyan-400 text-black font-bold text-lg",
                    style: { boxShadow: '4px 4px 0px #000', fontFamily: "'Bangers', cursive", letterSpacing: '1px' }
                },
                submitButton: {
                    className: "px-8 py-4 rounded-xl bg-gradient-to-r from-lime-400 to-green-400 text-black font-bold disabled:opacity-50 border-4 border-black text-xl",
                    style: { boxShadow: '5px 5px 0px #000', fontFamily: "'Bangers', cursive", letterSpacing: '2px' }
                },
                notchIconColor: "white",
                // New Bubble Styles
                aiBubble: { className: "bg-white border-4 border-black p-4 rounded-2xl rounded-tl-none", style: { boxShadow: '4px 4px 0px #000' } },
                userBubble: { className: "bg-yellow-200 border-4 border-black p-6 rounded-2xl rounded-tr-none", style: { boxShadow: '-4px 4px 0px #000' } },
                bubbleText: { className: "text-black font-bold text-lg", style: {} },
                formLabel: { className: "block text-lg font-bold text-black mb-2", style: { fontFamily: "'Bangers', cursive", letterSpacing: '1px' } }
            };
        }

        switch(theme) {
            case THEMES.HACKER: return {
                containerFont: "monospace",
                notch: {
                    className: "bg-black rounded-t-md px-8 py-1 border border-green-900 border-b-0 flex items-center justify-center cursor-pointer hover:bg-green-900/20 transition-colors",
                    style: { marginBottom: '-1px' }
                },
                panel: {
                    className: "bg-black rounded-t-xl border border-green-900 shadow-[0_-5px_20px_rgba(0,255,0,0.1)]",
                    style: {}
                },
                headerTab: {
                    className: "w-full cursor-pointer bg-black border-b border-green-900 text-green-500 px-8 py-4 flex items-center justify-center hover:bg-green-900/10",
                    style: {}
                },
                headerTitle: {
                    className: "text-xl font-mono font-bold tracking-widest flex items-center gap-2",
                    style: {}
                },
                instructionsBox: {
                    className: "bg-green-900/10 p-4 rounded border border-green-800",
                    style: {},
                    text: "text-sm text-green-400 font-mono"
                },
                selectedNodesBox: {
                    className: "bg-green-900/20 p-4 rounded border border-green-800",
                    style: {},
                    title: "text-sm font-bold text-green-500 font-mono",
                    node: "bg-black px-3 py-2 rounded border border-green-700 flex items-center gap-2",
                    nodeStyle: {}
                },
                textareaLabel: {
                    className: "block text-lg font-bold text-green-500 mb-2 font-mono",
                    style: {}
                },
                textarea: {
                    className: "w-full px-5 py-4 border border-green-700 rounded bg-black focus:outline-none focus:border-green-500 text-lg text-green-400 placeholder-green-800 font-mono",
                    style: {}
                },
                statusBox: {
                    className: "bg-green-900/30 p-4 rounded border border-green-600",
                    style: {},
                    text: "text-green-400 font-mono text-base flex items-center gap-2"
                },
                draftBadge: {
                    className: "bg-green-900/40 px-4 py-2 rounded border border-green-500",
                    style: {},
                    text: "text-sm font-bold text-green-400 flex items-center gap-2 font-mono"
                },
                acceptButton: {
                    className: "px-6 py-3 rounded border border-green-500 bg-green-900/40 text-green-400 font-bold text-lg hover:bg-green-900/60 font-mono",
                    style: {}
                },
                submitButton: {
                    className: "px-8 py-4 rounded bg-green-600 text-black font-bold disabled:opacity-50 border border-green-400 text-xl hover:bg-green-500 font-mono",
                    style: {}
                },
                notchIconColor: "#4ade80",
                // Hacker Bubbles
                aiBubble: { className: "bg-black border border-green-500 p-4 rounded-none", style: { boxShadow: '0 0 10px rgba(0,255,0,0.2)' } },
                userBubble: { className: "bg-green-900/20 border border-green-500 p-6 rounded-none", style: {} },
                bubbleText: { className: "text-green-500 font-mono text-sm", style: {} },
                formLabel: { className: "block text-green-400 font-mono font-bold mb-2", style: {} }
            };
            case THEMES.TERMINAL: return {
                containerFont: "monospace",
                notch: {
                    className: "bg-slate-950 rounded-t-md px-8 py-1 border border-amber-900 border-b-0 flex items-center justify-center cursor-pointer hover:bg-amber-900/20 transition-colors",
                    style: { marginBottom: '-1px' }
                },
                panel: {
                    className: "bg-slate-950 rounded-t-xl border border-amber-900 shadow-[0_-5px_20px_rgba(245,158,11,0.1)]",
                    style: {}
                },
                headerTab: {
                    className: "w-full cursor-pointer bg-slate-950 border-b border-amber-900 text-amber-500 px-8 py-4 flex items-center justify-center hover:bg-amber-900/10",
                    style: {}
                },
                headerTitle: {
                    className: "text-xl font-mono font-bold tracking-widest flex items-center gap-2",
                    style: {}
                },
                instructionsBox: {
                    className: "bg-amber-900/10 p-4 rounded border border-amber-800",
                    style: {},
                    text: "text-sm text-amber-500 font-mono"
                },
                selectedNodesBox: {
                    className: "bg-amber-900/20 p-4 rounded border border-amber-800",
                    style: {},
                    title: "text-sm font-bold text-amber-500 font-mono",
                    node: "bg-slate-950 px-3 py-2 rounded border border-amber-700 flex items-center gap-2",
                    nodeStyle: {}
                },
                textareaLabel: {
                    className: "block text-lg font-bold text-amber-500 mb-2 font-mono",
                    style: {}
                },
                textarea: {
                    className: "w-full px-5 py-4 border border-amber-700 rounded bg-slate-950 focus:outline-none focus:border-amber-500 text-lg text-amber-500 placeholder-amber-800 font-mono",
                    style: {}
                },
                statusBox: {
                    className: "bg-amber-900/30 p-4 rounded border border-amber-600",
                    style: {},
                    text: "text-amber-500 font-mono text-base flex items-center gap-2"
                },
                draftBadge: {
                    className: "bg-amber-900/40 px-4 py-2 rounded border border-amber-500",
                    style: {},
                    text: "text-sm font-bold text-amber-500 flex items-center gap-2 font-mono"
                },
                acceptButton: {
                    className: "px-6 py-3 rounded border border-amber-500 bg-amber-900/40 text-amber-500 font-bold text-lg hover:bg-amber-900/60 font-mono",
                    style: {}
                },
                submitButton: {
                    className: "px-8 py-4 rounded bg-amber-600 text-slate-950 font-bold disabled:opacity-50 border border-amber-400 text-xl hover:bg-amber-500 font-mono",
                    style: {}
                },
                notchIconColor: "#f59e0b",
                // Terminal Bubbles
                aiBubble: { className: "bg-slate-950 border border-amber-500 p-4 rounded-none", style: {} },
                userBubble: { className: "bg-amber-900/20 border border-amber-500 p-6 rounded-none", style: {} },
                bubbleText: { className: "text-amber-500 font-mono text-sm", style: {} },
                formLabel: { className: "block text-amber-400 font-mono font-bold mb-2", style: {} }
            };
            case THEMES.DARK: return {
                containerFont: "sans-serif",
                notch: {
                    className: "bg-gray-800 rounded-t-md px-8 py-1 border border-gray-700 border-b-0 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors",
                    style: { marginBottom: '-1px' }
                },
                panel: {
                    className: "bg-gray-900 rounded-t-xl border border-gray-700 shadow-2xl",
                    style: {}
                },
                headerTab: {
                    className: "w-full cursor-pointer bg-gray-800 border-b border-gray-700 text-gray-200 px-8 py-4 flex items-center justify-center hover:bg-gray-700",
                    style: {}
                },
                headerTitle: {
                    className: "text-xl font-semibold tracking-wide",
                    style: {}
                },
                instructionsBox: {
                    className: "bg-gray-800 p-4 rounded-lg border border-gray-700",
                    style: {},
                    text: "text-sm text-gray-300"
                },
                selectedNodesBox: {
                    className: "bg-gray-800 p-4 rounded-lg border border-gray-700",
                    style: {},
                    title: "text-sm font-bold text-gray-300",
                    node: "bg-gray-900 px-3 py-2 rounded border border-gray-600 flex items-center gap-2 text-gray-300",
                    nodeStyle: {}
                },
                textareaLabel: {
                    className: "block text-lg font-bold text-gray-200 mb-2",
                    style: {}
                },
                textarea: {
                    className: "w-full px-5 py-4 border border-gray-600 rounded-lg bg-gray-800 focus:outline-none focus:border-blue-500 text-lg text-gray-200 placeholder-gray-600",
                    style: {}
                },
                statusBox: {
                    className: "bg-blue-900/20 p-4 rounded-lg border border-blue-800",
                    style: {},
                    text: "text-blue-300 font-medium text-base flex items-center gap-2"
                },
                draftBadge: {
                    className: "bg-green-900/20 px-4 py-2 rounded-lg border border-green-800",
                    style: {},
                    text: "text-sm font-bold text-green-400 flex items-center gap-2"
                },
                acceptButton: {
                    className: "px-6 py-3 rounded-lg border border-blue-600 text-blue-400 font-bold text-lg hover:bg-blue-900/20",
                    style: {}
                },
                submitButton: {
                    className: "px-8 py-4 rounded-lg bg-blue-600 text-white font-bold disabled:opacity-50 hover:bg-blue-700 text-xl shadow-lg",
                    style: {}
                },
                notchIconColor: "#9ca3af",
                // Dark Bubbles
                aiBubble: { className: "bg-gray-800 border border-gray-700 p-4 rounded-2xl rounded-tl-none shadow-sm", style: {} },
                userBubble: { className: "bg-blue-900/20 border border-blue-800 p-6 rounded-2xl rounded-tr-none shadow-sm", style: {} },
                bubbleText: { className: "text-gray-200 font-medium", style: {} },
                formLabel: { className: "block text-blue-300 font-bold mb-2", style: {} }
            };
            default: // PROFESSIONAL
                return {
                    containerFont: "sans-serif",
                    notch: {
                        className: "bg-white rounded-t-md px-8 py-1 border border-slate-200 border-b-0 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-sm",
                        style: { marginBottom: '-1px' }
                    },
                    panel: {
                        className: "bg-white rounded-t-xl border border-slate-200 shadow-2xl",
                        style: {}
                    },
                    headerTab: {
                        className: "w-full cursor-pointer bg-slate-50 border-b border-slate-200 text-slate-700 px-8 py-4 flex items-center justify-center hover:bg-slate-100",
                        style: {}
                    },
                    headerTitle: {
                        className: "text-xl font-semibold tracking-wide text-slate-800",
                        style: {}
                    },
                    instructionsBox: {
                        className: "bg-slate-50 p-4 rounded-lg border border-slate-200",
                        style: {},
                        text: "text-sm text-slate-600"
                    },
                    selectedNodesBox: {
                        className: "bg-blue-50 p-4 rounded-lg border border-blue-100",
                        style: {},
                        title: "text-sm font-bold text-slate-700",
                        node: "bg-white px-3 py-2 rounded border border-slate-200 flex items-center gap-2 text-slate-700 shadow-sm",
                        nodeStyle: {}
                    },
                    textareaLabel: {
                        className: "block text-lg font-bold text-slate-800 mb-2",
                        style: {}
                    },
                    textarea: {
                        className: "w-full px-5 py-4 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-slate-800 placeholder-slate-400 transition-shadow",
                        style: {}
                    },
                    statusBox: {
                        className: "bg-blue-50 p-4 rounded-lg border border-blue-200",
                        style: {},
                        text: "text-blue-700 font-medium text-base flex items-center gap-2"
                    },
                    draftBadge: {
                        className: "bg-green-50 px-4 py-2 rounded-lg border border-green-200",
                        style: {},
                        text: "text-sm font-bold text-green-700 flex items-center gap-2"
                    },
                    acceptButton: {
                        className: "px-6 py-3 rounded-lg border border-slate-300 text-slate-600 font-bold text-lg hover:bg-slate-50 hover:text-slate-800 transition-colors",
                        style: {}
                    },
                    submitButton: {
                        className: "px-8 py-4 rounded-lg bg-blue-600 text-white font-bold disabled:opacity-50 hover:bg-blue-700 text-xl shadow-lg transition-all hover:shadow-xl",
                        style: {}
                    },
                    notchIconColor: "#64748b",
                    // Professional Bubbles
                    aiBubble: { className: "bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm", style: {} },
                    userBubble: { className: "bg-blue-50 border border-blue-100 p-6 rounded-2xl rounded-tr-none shadow-sm", style: {} },
                    bubbleText: { className: "text-slate-700 font-medium", style: {} },
                    formLabel: { className: "block text-slate-700 font-bold mb-2", style: {} }
                };
        }
    }, [theme, isComic]);

    useEffect(() => {
        if (status.state === 'saved') {
            setPrompt('');
        }
    }, [status.state]);

    const disablePrompt = status.state === 'generating' || status.state === 'saving';

    function handleSubmit(event) {
        event.preventDefault();
        
        if (isCollecting) {
             onConfigSubmit(fieldValues);
             setFieldValues({});
             return;
        }

        if (!prompt.trim()) return;
        
        onSubmit(prompt);
    }

    const hasDraft = draft?.graph?.nodes?.length;
    
    // Center the prompt panel based on sidebar visibility
    // When carousel is open (w-96 = 384px), offset by carousel width and center in remaining space
    // When carousel is closed, center in full viewport
    const sidebarWidth = isSidebarOpen ? 384 : 0;
    
    const containerClasses = `pointer-events-none fixed bottom-0 flex justify-center items-end transition-all duration-500 ease-out z-50 ${
        isOpen ? 'translate-y-0' : ''
    } ${
        isNodeSettingsOpen ? 'hidden' : ''
    }`;
    
    const containerStyle = {
        left: `${sidebarWidth}px`,
        right: 0,
        paddingLeft: '1rem',
        paddingRight: '1rem',
        fontFamily: styles.containerFont
    };

    return (
        <div className={containerClasses} style={containerStyle}>
            <div
                className="w-full max-w-5xl pb-4 pointer-events-auto"
                style={{ maxHeight: isOpen ? '85vh' : 'auto' }}
            >
                {/* Notch with Drawer Arrow */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        className={styles.notch.className}
                        onClick={isOpen ? onCollapse : onExpand}
                        style={styles.notch.style}
                    >
                        {isOpen ? (
                            // Double arrow down
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" fill={styles.notchIconColor}/>
                                <path d="M7.41 13.84L12 18.42l4.59-4.58L18 15.25l-6 6-6-6z" fill={styles.notchIconColor}/>
                            </svg>
                        ) : (
                            // Double arrow up
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" fill={styles.notchIconColor}/>
                                <path d="M7.41 9.41L12 4.83l4.59 4.58L18 8l-6-6-6 6z" fill={styles.notchIconColor}/>
                            </svg>
                        )}
                    </button>
                </div>
                
                {/* Prompt Box */}
                <div className={styles.panel.className} style={styles.panel.style}>
                    
                    {/* Header Tab */}
                    <button
                        type="button"
                        className={styles.headerTab.className}
                        onClick={isOpen ? onCollapse : onExpand}
                        style={styles.headerTab.style}
                    >
                        <div className="text-center">
                            <div className={styles.headerTitle.className} style={styles.headerTitle.style}>
                                {isOpen ? 'AI WORKFLOW BUILDER' : 'CLICK TO BUILD WITH AI'}
                            </div>
                        </div>
                    </button>
                    
                    <div
                        className={`p-8 overflow-y-auto transition-all duration-500 ease-out ${
                            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        style={{ maxHeight: isOpen ? 'calc(85vh - 80px)' : 0 }}
                    >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Instructions Box */}
                                <div className={styles.instructionsBox.className} style={styles.instructionsBox.style}>
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">💡</div>
                                        <div className="flex-1">
                                            <p className={styles.instructionsBox.text}>
                                                {selectedNodes.length > 0 
                                                    ? `✏️ Edit ${selectedNodes.length} selected node${selectedNodes.length > 1 ? 's' : ''} • Describe your changes • AI will modify them!`
                                                    : '⚡ Describe your automation in plain English • AI builds it • Click GENERATE!'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Nodes Preview */}
                                {selectedNodes.length > 0 && (
                                    <div className={styles.selectedNodesBox.className} style={styles.selectedNodesBox.style}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xl">📦</span>
                                            <span className={styles.selectedNodesBox.title}>
                                                SELECTED NODES ({selectedNodes.length}):
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedNodes.map((node, idx) => (
                                                <div 
                                                    key={node.id || idx}
                                                    className={styles.selectedNodesBox.node}
                                                    style={styles.selectedNodesBox.nodeStyle}
                                                >
                                                    <div className="text-lg">{node.data?.emoji || '📄'}</div>
                                                    <div className={`text-xs font-bold ${isComic ? 'text-black' : 'text-inherit'}`}>
                                                        {node.data?.label || node.data?.type || node.type || 'Node'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Dynamic Input Form */}
                                {isCollecting && missingFields.length > 0 ? (
                                    <div className="space-y-6 py-2">
                                        <div className="flex gap-4 items-start">
                                            {/* AI Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-md flex-shrink-0 border-2 border-white">
                                                🤖
                                            </div>
                                            
                                            {/* AI Messages Column */}
                                            <div className="space-y-4 w-full max-w-[85%]">
                                                {/* Introductory Text */}
                                                <div className={styles.aiBubble.className} style={styles.aiBubble.style}>
                                                    <p className={styles.bubbleText.className} style={styles.bubbleText.style}>
                                                        I've generated the structure, but I need a few configuration details to make it runnable:
                                                    </p>
                                                </div>

                                                {/* The Form Bubble - Grouped by Node */}
                                                <div className={styles.aiBubble.className} style={styles.aiBubble.style}>
                                                    <div className="space-y-6">
                                                        {(() => {
                                                            // Group fields by nodeId
                                                            const fieldsByNode = {};
                                                            missingFields.forEach(field => {
                                                                if (!field || !field.key) return;
                                                                const nodeId = field.nodeId || 'general';
                                                                if (!fieldsByNode[nodeId]) {
                                                                    fieldsByNode[nodeId] = {
                                                                        nodeName: field.label.split(':')[0].trim(),
                                                                        nodeMetadata: field.nodeMetadata || {
                                                                            color: '#3b82f6',
                                                                            icon: '🔧',
                                                                            type: 'unknown',
                                                                            category: 'Core'
                                                                        },
                                                                        fields: []
                                                                    };
                                                                }
                                                                fieldsByNode[nodeId].fields.push(field);
                                                            });
                                                            
                                                            return Object.entries(fieldsByNode).map(([nodeId, nodeGroup], nodeIdx) => {
                                                                const nodeColor = nodeGroup.nodeMetadata.color;
                                                                const nodeIcon = nodeGroup.nodeMetadata.icon;
                                                                
                                                                return (
                                                                <div
                                                                    key={nodeId}
                                                                    className="border-4 rounded-xl p-4 suggestion-card"
                                                                    style={{
                                                                        borderColor: nodeColor,
                                                                        backgroundColor: `${nodeColor}10`,
                                                                        boxShadow: `0 0 0 2px ${nodeColor}40`,
                                                                        animationDelay: `${nodeIdx * 120}ms`,
                                                                    }}
                                                                >
                                                                {/* Node Header with node-specific color and icon */}
                                                                <div className="mb-4 pb-3 border-b-3" style={{
                                                                    borderColor: nodeColor
                                                                }}>
                                                                    <h3 className="text-xl font-bold flex items-center gap-3" style={{
                                                                        color: nodeColor,
                                                                        fontFamily: 'Bangers, cursive',
                                                                        letterSpacing: '1px',
                                                                        textShadow: '1px 1px 0px rgba(0,0,0,0.1)'
                                                                    }}>
                                                                        <div className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl border-3 border-black" style={{
                                                                            backgroundColor: nodeColor,
                                                                            boxShadow: '2px 2px 0px #000'
                                                                        }}>
                                                                            {nodeIcon}
                                                                        </div>
                                                                        {nodeGroup.nodeName}
                                                                    </h3>
                                                                </div>
                                                                
                                                                {/* Node Fields */}
                                                                <div className="space-y-4">
                                                                    {nodeGroup.fields.map((field, fieldIdx) => {
                                                                        const currentValue = fieldValues[field.key] !== undefined 
                                                                            ? fieldValues[field.key] 
                                                                            : (field.value !== undefined ? field.value : '');
                                                                        
                                                                        // Extract just the field name (after the colon)
                                                                        const fieldLabel = field.label.includes(':') 
                                                                            ? field.label.split(':')[1].trim() 
                                                                            : field.label;
                                                                        
                                                                        return (
                                                                            <div key={field.key} className="space-y-2">
                                                                                <label className={styles.formLabel.className} style={styles.formLabel.style}>
                                                                                    <span className="mr-2 inline-block">{field.icon || '⚙️'}</span>
                                                                                    {fieldLabel}
                                                                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                                                                </label>
                                                                {field.description && (
                                                                    <p className="text-xs opacity-70 -mt-1 mb-2">{field.description}</p>
                                                                )}
                                                                        
                                                                {/* Adaptive Field Rendering */}
                                                                {field.fieldType === 'select' && field.options ? (
                                                                    <select
                                                                        value={currentValue}
                                                                        onChange={(e) => setFieldValues({...fieldValues, [field.key]: e.target.value})}
                                                                        className={`${styles.textarea.className} w-full transition-all focus:scale-[1.01]`}
                                                                        style={{...styles.textarea.style, height: 'auto', padding: '0.75rem', width: '100%', fontSize: '0.95rem'}}
                                                                        autoFocus={nodeIdx === 0 && fieldIdx === 0}
                                                                    >
                                                                        {!currentValue && <option value="">Select...</option>}
                                                                        {field.options.map(opt => (
                                                                            <option key={opt.value} value={opt.value}>
                                                                                {opt.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                ) : field.fieldType === 'textarea' ? (
                                                                    <textarea
                                                                        placeholder={field.placeholder}
                                                                        value={currentValue}
                                                                        onChange={(e) => setFieldValues({...fieldValues, [field.key]: e.target.value})}
                                                                        rows={field.rows || 4}
                                                                        className={`${styles.textarea.className} w-full transition-all focus:scale-[1.01]`}
                                                                        style={{...styles.textarea.style, width: '100%', fontSize: '0.95rem'}}
                                                                        autoFocus={nodeIdx === 0 && fieldIdx === 0}
                                                                    />
                                                                ) : field.fieldType === 'number' || field.fieldType === 'slider' ? (
                                                                    <div className="space-y-2">
                                                                        <input
                                                                            type="number"
                                                                                placeholder={field.placeholder}
                                                                                value={currentValue}
                                                                                onChange={(e) => setFieldValues({...fieldValues, [field.key]: e.target.value})}
                                                                                min={field.min}
                                                                                max={field.max}
                                                                                step={field.step || 1}
                                                                                className={`${styles.textarea.className} w-full transition-all focus:scale-[1.01]`}
                                                                                style={{...styles.textarea.style, height: 'auto', padding: '0.75rem', width: '100%', fontSize: '0.95rem'}}
                                                                                autoFocus={nodeIdx === 0 && fieldIdx === 0}
                                                                            />
                                                                            {field.fieldType === 'slider' && (
                                                                                <input
                                                                                    type="range"
                                                                                    value={currentValue}
                                                                                    onChange={(e) => setFieldValues({...fieldValues, [field.key]: e.target.value})}
                                                                                    min={field.min}
                                                                                    max={field.max}
                                                                                    step={field.step || 0.1}
                                                                                    className="w-full"
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    ) : field.fieldType === 'boolean' ? (
                                                                        <label className="flex items-center gap-3 cursor-pointer">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={currentValue === true || currentValue === 'true'}
                                                                                onChange={(e) => setFieldValues({...fieldValues, [field.key]: e.target.checked})}
                                                                                className="w-5 h-5 rounded"
                                                                                autoFocus={nodeIdx === 0 && fieldIdx === 0}
                                                                            />
                                                                            <span className="text-sm">Enable {field.label}</span>
                                                                        </label>
                                                                    ) : field.fieldType === 'json' ? (
                                                                        <textarea
                                                                            placeholder={field.placeholder || '{"key": "value"}'}
                                                                            value={typeof currentValue === 'object' ? JSON.stringify(currentValue, null, 2) : currentValue}
                                                                            onChange={(e) => {
                                                                                try {
                                                                                    const parsed = JSON.parse(e.target.value);
                                                                                    setFieldValues({...fieldValues, [field.key]: parsed});
                                                                                } catch {
                                                                                    setFieldValues({...fieldValues, [field.key]: e.target.value});
                                                                                }
                                                                            }}
                                                                            rows={field.rows || 6}
                                                                            className={`${styles.textarea.className} w-full transition-all focus:scale-[1.01] font-mono`}
                                                                            style={{...styles.textarea.style, width: '100%', fontSize: '0.85rem'}}
                                                                            autoFocus={nodeIdx === 0 && fieldIdx === 0}
                                                                        />
                                                                    ) : (
                                                                        <input
                                                                            type={field.inputType || 'text'}
                                                                            placeholder={field.placeholder}
                                                                            value={currentValue}
                                                                            onChange={(e) => setFieldValues({...fieldValues, [field.key]: e.target.value})}
                                                                            className={`${styles.textarea.className} w-full transition-all focus:scale-[1.01]`}
                                                                            style={{...styles.textarea.style, height: 'auto', padding: '0.75rem', width: '100%', fontSize: '0.95rem'}}
                                                                            autoFocus={nodeIdx === 0 && fieldIdx === 0}
                                                                        />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                );
                                            })
                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Original Textarea */
                                    <div>
                                        <label className={styles.textareaLabel.className} style={styles.textareaLabel.style}>
                                            📝 DESCRIBE YOUR WORKFLOW:
                                        </label>
                                        <textarea
                                            value={prompt}
                                            onChange={(event) => setPrompt(event.target.value)}
                                            placeholder="When I get an email, send a Slack message"
                                            rows={4}
                                            className={styles.textarea.className}
                                            style={styles.textarea.style}
                                            disabled={disablePrompt}
                                        />
                                    </div>
                                )}

                                {/* Status Message */}
                                {status.message && !isCollecting && (
                                    <div className={styles.statusBox.className} style={styles.statusBox.style}>
                                        <p className={styles.statusBox.text}>
                                            <span className="text-2xl">
                                                {status.state === 'generating' ? '⚡' : status.state === 'error' ? '❌' : '✅'}
                                            </span>
                                            {status.message}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    <div className="flex items-center gap-3">
                                        {hasDraft && (
                                            <div className={styles.draftBadge.className} style={styles.draftBadge.style}>
                                                <p className={styles.draftBadge.text}>
                                                    <span className="text-xl">✨</span>
                                                    <span>DRAFT READY!</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {hasDraft && (
                                            <button
                                                type="button"
                                                className={styles.acceptButton.className}
                                                onClick={() => {
                                                    onAcceptDraft();
                                                    onCollapse();
                                                }}
                                                style={styles.acceptButton.style}
                                            >
                                                ✅ ACCEPT DRAFT
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className={styles.submitButton.className}
                                            disabled={disablePrompt}
                                            style={styles.submitButton.style}
                                        >
                                            {isCollecting 
                                                ? '🚀 CONTINUE WITH DETAILS' 
                                                : (status.state === 'generating' ? '⚡ THINKING...' : '🚀 GENERATE WORKFLOW!')
                                            }
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
