import { useEffect, useState } from 'react';

export default function PromptPanel({ onSubmit, onAcceptDraft, draft, status, isOpen, onExpand, onCollapse, isSidebarOpen, isNodeSettingsOpen, selectedNodes = [] }) {
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        if (status.state === 'saved') {
            setPrompt('');
        }
    }, [status.state]);

    const disablePrompt = status.state === 'generating' || status.state === 'saving';

    function handleSubmit(event) {
        event.preventDefault();
        if (!prompt.trim()) {
            return;
        }
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
        fontFamily: "'Comic Neue', cursive"
    };

    return (
        <div className={containerClasses} style={containerStyle}>
            <div className="w-full max-w-5xl pb-4 pointer-events-auto" style={{ maxHeight: isOpen ? '85vh' : 'auto', overflowY: isOpen ? 'auto' : 'visible' }}>
                {/* Black Notch with Drawer Arrow - Above the box */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        className="bg-black rounded-t-md px-8 py-0.5 border-2 border-black border-b-0 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
                        onClick={isOpen ? onCollapse : onExpand}
                        style={{ 
                            boxShadow: '2px -1px 0px #000, -2px -1px 0px #000',
                            marginBottom: '-2px'
                        }}
                    >
                        {isOpen ? (
                            // Double arrow down
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" fill="white"/>
                                <path d="M7.41 13.84L12 18.42l4.59-4.58L18 15.25l-6 6-6-6z" fill="white"/>
                            </svg>
                        ) : (
                            // Double arrow up
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" fill="white"/>
                                <path d="M7.41 9.41L12 4.83l4.59 4.58L18 8l-6-6-6 6z" fill="white"/>
                            </svg>
                        )}
                    </button>
                </div>
                
                {/* Redesigned Prompt Box */}
                <div className="bg-yellow-50 rounded-2xl overflow-hidden border-4 border-black" style={{ boxShadow: '6px 6px 0px #000', marginTop: '0' }}>
                    
                    {/* Big Header Tab */}
                    <button
                        type="button"
                        className="w-full cursor-pointer bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-black px-8 py-4 flex items-center justify-center relative"
                        onClick={isOpen ? onCollapse : onExpand}
                        style={{ boxShadow: 'inset 0px -4px 0px rgba(0,0,0,0.2)' }}
                    >
                        {/* Center Text Only */}
                        <div className="text-center">
                            <div className="text-2xl font-bold" style={{ fontFamily: "'Bangers', cursive", letterSpacing: '2px', textShadow: '2px 2px 0px #fff' }}>
                                {isOpen ? 'AI WORKFLOW BUILDER' : 'CLICK TO BUILD WITH AI'}
                            </div>
                        </div>
                    </button>
                    
                    {isOpen && (
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Instructions Box */}
                                <div className="bg-gradient-to-r from-pink-200 to-purple-200 p-4 rounded-xl border-4 border-black" style={{ boxShadow: '3px 3px 0px #000' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">💡</div>
                                        <div className="flex-1">
                                            <p className="text-sm text-black font-bold">
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
                                    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-xl border-4 border-black" style={{ boxShadow: '3px 3px 0px #000' }}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xl">📦</span>
                                            <span className="text-sm font-bold text-black">
                                                SELECTED NODES ({selectedNodes.length}):
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedNodes.map((node, idx) => (
                                                <div 
                                                    key={node.id || idx}
                                                    className="bg-white px-3 py-2 rounded-lg border-3 border-black flex items-center gap-2"
                                                    style={{ boxShadow: '2px 2px 0px #000' }}
                                                >
                                                    <div className="text-lg">{node.data?.emoji || '📄'}</div>
                                                    <div className="text-xs font-bold text-black">
                                                        {node.data?.label || node.data?.type || node.type || 'Node'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Large Textarea */}
                                <div>
                                    <label className="block text-2xl font-bold text-black mb-3" style={{ fontFamily: "'Bangers', cursive", letterSpacing: '1px' }}>
                                        📝 DESCRIBE YOUR WORKFLOW:
                                    </label>
                                    <textarea
                                        value={prompt}
                                        onChange={(event) => setPrompt(event.target.value)}
                                        placeholder="When I get an email, send a Slack message"
                                        rows={4}
                                        className="w-full px-5 py-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg text-black placeholder-black/40 font-bold bg-white"
                                        style={{ boxShadow: '4px 4px 0px #000', fontFamily: "'Comic Neue', cursive", lineHeight: '1.5' }}
                                        disabled={disablePrompt}
                                    />
                                </div>

                                {/* Status Message */}
                                {status.message && (
                                    <div className="bg-cyan-200 p-4 rounded-xl border-4 border-black" style={{ boxShadow: '3px 3px 0px #000' }}>
                                        <p className="text-black font-bold text-base flex items-center gap-2">
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
                                            <div className="bg-green-200 px-4 py-2 rounded-lg border-3 border-black" style={{ boxShadow: '2px 2px 0px #000' }}>
                                                <p className="text-sm font-bold text-black flex items-center gap-2">
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
                                                className="px-6 py-3 rounded-xl border-4 border-black bg-cyan-400 text-black font-bold text-lg"
                                                onClick={() => {
                                                    onAcceptDraft();
                                                    onCollapse();
                                                }}
                                                style={{ boxShadow: '4px 4px 0px #000', fontFamily: "'Bangers', cursive", letterSpacing: '1px' }}
                                            >
                                                ✅ ACCEPT DRAFT
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-lime-400 to-green-400 text-black font-bold disabled:opacity-50 border-4 border-black text-xl"
                                            disabled={disablePrompt}
                                            style={{ boxShadow: '5px 5px 0px #000', fontFamily: "'Bangers', cursive", letterSpacing: '2px' }}
                                        >
                                            {status.state === 'generating' ? '⚡ THINKING...' : '🚀 GENERATE WORKFLOW!'}
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
