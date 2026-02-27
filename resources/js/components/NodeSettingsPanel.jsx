import { Fragment, useState, useEffect, useMemo } from 'react';
import { getNodeSchema } from '../data/allNodeSchemas.js';
import NodeDataPanel from './NodeDataPanel_v2.jsx';
import NodeConfigForm from './NodeConfigForm.jsx';
import { useTheme, THEMES } from '../contexts/ThemeContext.jsx';

export default function NodeSettingsPanel({ node, onClose, onUpdate, executionData, graph, credentials = [] }) {
    const { theme, isComic } = useTheme();
    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'input', 'output'

    if (!node) {
        return null;
    }

    const { data = {} } = node;
    const nodeName = data.label || data.name || 'Node';
    // Use data.type (business logic type) if available, otherwise fall back to name or ReactFlow type
    const nodeType = data.type || nodeName || node.type;
    const nodeCategory = data.category || '';
    const schema = getNodeSchema(nodeType);

    // Theme-based styles
    const styles = useMemo(() => {
        if (isComic) {
            return {
                container: "fixed inset-0 z-50 flex bg-yellow-100",
                containerStyle: { fontFamily: "'Comic Neue', cursive" },
                leftPanel: "w-64 border-r-4 border-black bg-yellow-50 flex-shrink-0 overflow-hidden",
                leftPanelStyle: { boxShadow: '4px 0px 0px #000' },
                middlePanel: "flex flex-col flex-1 bg-yellow-50 border-r-4 border-black overflow-hidden",
                middlePanelStyle: { boxShadow: '4px 0px 0px #000' },
                header: "flex-shrink-0 border-b-4 border-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500",
                headerStyle: { boxShadow: '0px 4px 0px #000' },
                title: "text-xl font-bold text-black",
                titleStyle: { fontFamily: "'Bangers', cursive", letterSpacing: '1px' },
                tabsContainer: "flex border-t-4 border-black bg-pink-200",
                tabActive: "flex-1 px-4 py-3 text-sm font-bold transition-all border-r-2 border-black bg-lime-400 text-black",
                tabActiveStyle: { boxShadow: 'inset 0px 3px 0px rgba(0,0,0,0.2)' },
                tabInactive: "flex-1 px-4 py-3 text-sm font-bold transition-all border-r-2 border-black text-black hover:bg-yellow-200",
                content: "flex-1 overflow-y-auto px-5 py-4",
                footer: "flex-shrink-0 px-5 py-4 border-t-4 border-black bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-end gap-3",
                footerStyle: { boxShadow: '0px -4px 0px #000' },
                rightPanel: "w-64 bg-white flex-shrink-0 overflow-hidden",
                closeButton: "p-2 rounded-lg bg-red-400 border-3 border-black",
                closeButtonStyle: { boxShadow: '2px 2px 0px #000' }
            };
        }

        switch(theme) {
            case THEMES.PROFESSIONAL: return {
                container: "fixed inset-0 z-50 flex bg-slate-100",
                containerStyle: {},
                leftPanel: "w-64 border-r border-slate-200 bg-white flex-shrink-0 overflow-hidden",
                leftPanelStyle: {},
                middlePanel: "flex flex-col flex-1 bg-white border-r border-slate-200 overflow-hidden",
                middlePanelStyle: {},
                header: "flex-shrink-0 border-b border-slate-200 bg-white",
                headerStyle: {},
                title: "text-xl font-semibold text-slate-900",
                titleStyle: {},
                tabsContainer: "flex border-t border-slate-200 bg-slate-50",
                tabActive: "flex-1 px-4 py-3 text-sm font-medium transition-all border-r border-slate-200 bg-white text-blue-600 border-b-2 border-b-blue-600",
                tabActiveStyle: {},
                tabInactive: "flex-1 px-4 py-3 text-sm font-medium transition-all border-r border-slate-200 text-slate-600 hover:bg-slate-100",
                content: "flex-1 overflow-y-auto px-5 py-4 bg-slate-50",
                footer: "flex-shrink-0 px-5 py-4 border-t border-slate-200 bg-white flex items-center justify-end gap-3",
                footerStyle: {},
                rightPanel: "w-64 bg-white flex-shrink-0 overflow-hidden border-l border-slate-200",
                closeButton: "p-2 rounded-lg hover:bg-slate-100 text-slate-600",
                closeButtonStyle: {}
            };

            case THEMES.HACKER: return {
                container: "fixed inset-0 z-50 flex bg-black",
                containerStyle: { fontFamily: "monospace" },
                leftPanel: "w-64 border-r border-green-900 bg-black flex-shrink-0 overflow-hidden",
                leftPanelStyle: {},
                middlePanel: "flex flex-col flex-1 bg-black border-r border-green-900 overflow-hidden",
                middlePanelStyle: {},
                header: "flex-shrink-0 border-b border-green-900 bg-black",
                headerStyle: {},
                title: "text-xl font-bold text-green-500",
                titleStyle: { fontFamily: "monospace" },
                tabsContainer: "flex border-t border-green-900 bg-green-900/10",
                tabActive: "flex-1 px-4 py-3 text-sm font-bold transition-all border-r border-green-900 bg-green-900/30 text-green-400",
                tabActiveStyle: {},
                tabInactive: "flex-1 px-4 py-3 text-sm font-bold transition-all border-r border-green-900 text-green-600 hover:bg-green-900/20",
                content: "flex-1 overflow-y-auto px-5 py-4 bg-black",
                footer: "flex-shrink-0 px-5 py-4 border-t border-green-900 bg-black flex items-center justify-end gap-3",
                footerStyle: {},
                rightPanel: "w-64 bg-black flex-shrink-0 overflow-hidden border-l border-green-900",
                closeButton: "p-2 rounded-lg hover:bg-green-900/20 text-green-500",
                closeButtonStyle: {}
            };

            case THEMES.TERMINAL: return {
                container: "fixed inset-0 z-50 flex bg-slate-950",
                containerStyle: { fontFamily: "monospace" },
                leftPanel: "w-64 border-r border-amber-900 bg-slate-950 flex-shrink-0 overflow-hidden",
                leftPanelStyle: {},
                middlePanel: "flex flex-col flex-1 bg-slate-950 border-r border-amber-900 overflow-hidden",
                middlePanelStyle: {},
                header: "flex-shrink-0 border-b border-amber-900 bg-slate-950",
                headerStyle: {},
                title: "text-xl font-bold text-amber-500",
                titleStyle: { fontFamily: "monospace" },
                tabsContainer: "flex border-t border-amber-900 bg-amber-900/10",
                tabActive: "flex-1 px-4 py-3 text-sm font-bold transition-all border-r border-amber-900 bg-amber-900/30 text-amber-400",
                tabActiveStyle: {},
                tabInactive: "flex-1 px-4 py-3 text-sm font-bold transition-all border-r border-amber-900 text-amber-600 hover:bg-amber-900/20",
                content: "flex-1 overflow-y-auto px-5 py-4 bg-slate-950",
                footer: "flex-shrink-0 px-5 py-4 border-t border-amber-900 bg-slate-950 flex items-center justify-end gap-3",
                footerStyle: {},
                rightPanel: "w-64 bg-slate-950 flex-shrink-0 overflow-hidden border-l border-amber-900",
                closeButton: "p-2 rounded-lg hover:bg-amber-900/20 text-amber-500",
                closeButtonStyle: {}
            };

            case THEMES.DARK: return {
                container: "fixed inset-0 z-50 flex bg-gray-900",
                containerStyle: {},
                leftPanel: "w-64 border-r border-gray-700 bg-gray-800 flex-shrink-0 overflow-hidden",
                leftPanelStyle: {},
                middlePanel: "flex flex-col flex-1 bg-gray-800 border-r border-gray-700 overflow-hidden",
                middlePanelStyle: {},
                header: "flex-shrink-0 border-b border-gray-700 bg-gray-800",
                headerStyle: {},
                title: "text-xl font-semibold text-gray-100",
                titleStyle: {},
                tabsContainer: "flex border-t border-gray-700 bg-gray-900",
                tabActive: "flex-1 px-4 py-3 text-sm font-medium transition-all border-r border-gray-700 bg-gray-700 text-blue-400",
                tabActiveStyle: {},
                tabInactive: "flex-1 px-4 py-3 text-sm font-medium transition-all border-r border-gray-700 text-gray-400 hover:bg-gray-800",
                content: "flex-1 overflow-y-auto px-5 py-4 bg-gray-900",
                footer: "flex-shrink-0 px-5 py-4 border-t border-gray-700 bg-gray-800 flex items-center justify-end gap-3",
                footerStyle: {},
                rightPanel: "w-64 bg-gray-800 flex-shrink-0 overflow-hidden border-l border-gray-700",
                closeButton: "p-2 rounded-lg hover:bg-gray-700 text-gray-300",
                closeButtonStyle: {}
            };

            default: return {
                container: "fixed inset-0 z-50 flex bg-yellow-100",
                containerStyle: { fontFamily: "'Comic Neue', cursive" },
                leftPanel: "w-64 border-r-4 border-black bg-yellow-50 flex-shrink-0 overflow-hidden",
                leftPanelStyle: { boxShadow: '4px 0px 0px #000' },
                middlePanel: "flex flex-col flex-1 bg-yellow-50 border-r-4 border-black overflow-hidden",
                middlePanelStyle: { boxShadow: '4px 0px 0px #000' },
                header: "flex-shrink-0 border-b-4 border-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500",
                headerStyle: { boxShadow: '0px 4px 0px #000' },
                title: "text-xl font-bold text-black",
                titleStyle: { fontFamily: "'Bangers', cursive", letterSpacing: '1px' },
                tabsContainer: "flex border-t-4 border-black bg-pink-200",
                tabActive: "flex-1 px-4 py-3 text-sm font-bold transition-all border-r-2 border-black bg-lime-400 text-black",
                tabActiveStyle: { boxShadow: 'inset 0px 3px 0px rgba(0,0,0,0.2)' },
                tabInactive: "flex-1 px-4 py-3 text-sm font-bold transition-all border-r-2 border-black text-black hover:bg-yellow-200",
                content: "flex-1 overflow-y-auto px-5 py-4",
                footer: "flex-shrink-0 px-5 py-4 border-t-4 border-black bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-end gap-3",
                footerStyle: { boxShadow: '0px -4px 0px #000' },
                rightPanel: "w-64 bg-white flex-shrink-0 overflow-hidden",
                closeButton: "p-2 rounded-lg bg-red-400 border-3 border-black",
                closeButtonStyle: { boxShadow: '2px 2px 0px #000' }
            };
        }
    }, [theme, isComic]);

    // Initialize form data from node parameters
    useEffect(() => {
        setFormData(data.parameters || {});
    }, [node.id]);

    const handleFormChange = (newFormData) => {
        setFormData(newFormData);
    };

    const handleSave = () => {
        if (onUpdate) {
            const updatedNode = {
                ...node,
                data: {
                    ...node.data,
                    parameters: formData
                }
            };
            console.log('💾 Saving node configuration:', updatedNode);
            onUpdate(updatedNode);
        }
        onClose();
    };

    return (
        <div className={styles.container} style={styles.containerStyle}>
            {/* Left Panel - INPUT */}
            <div className={styles.leftPanel} style={styles.leftPanelStyle}>
                <NodeDataPanel 
                    node={node} 
                    type="input" 
                    executionData={executionData}
                    graph={graph}
                />
            </div>

            {/* Middle Panel - Settings */}
            <div className={styles.middlePanel} style={styles.middlePanelStyle}>
                {/* Header */}
                <div className={styles.header} style={styles.headerStyle}>
                    <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div
                                className={isComic ? "w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-3 border-black" : "w-12 h-12 rounded-lg flex items-center justify-center text-2xl"}
                                style={{ backgroundColor: data.color ?? '#3b82f6', color: '#ffffff', ...(isComic ? { boxShadow: '2px 2px 0px #000' } : {}) }}
                            >
                                {data.icon ?? '⚙️'}
                            </div>
                            <div>
                                <h3 className={styles.title} style={styles.titleStyle}>{isComic ? nodeName.toUpperCase() : nodeName}</h3>
                                <p className={isComic ? "text-sm text-black font-bold capitalize" : theme === THEMES.PROFESSIONAL ? "text-sm text-slate-600 capitalize" : theme === THEMES.HACKER ? "text-sm text-green-600 capitalize font-mono" : theme === THEMES.TERMINAL ? "text-sm text-amber-600 capitalize font-mono" : "text-sm text-gray-400 capitalize"}>{nodeType}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={onClose}
                            style={styles.closeButtonStyle}
                            aria-label="Close node settings"
                        >
                            <svg className={isComic ? "w-6 h-6 text-black stroke-[3]" : "w-6 h-6 stroke-2"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isComic ? 3 : 2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className={styles.tabsContainer}>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={activeTab === 'settings' ? styles.tabActive : styles.tabInactive}
                            style={activeTab === 'settings' ? styles.tabActiveStyle : {}}
                        >
                            {isComic ? '⚙️ SETTINGS' : '⚙️ Settings'}
                        </button>
                        <button
                            onClick={() => setActiveTab('conditions')}
                            className={activeTab === 'conditions' ? styles.tabActive : styles.tabInactive}
                            style={activeTab === 'conditions' ? styles.tabActiveStyle : {}}
                        >
                            {isComic ? '📋 PARAMETERS' : '📋 Parameters'}
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className={styles.content}>
                    {/* Render schema-based configuration form */}
                    {activeTab === 'settings' && (
                        <NodeConfigForm
                            schema={schema}
                            values={formData}
                            onChange={handleFormChange}
                            credentials={credentials}
                        />
                    )}

                    {activeTab === 'conditions' && (
                        <div className="p-4 border-3 border-black rounded-lg bg-yellow-50">
                            <p className="text-sm text-gray-600">Advanced parameters and conditions will appear here.</p>
                        </div>
                    )}

                    {/* Legacy config rendering (fallback) */}
                    {false && config.sections?.map((section, sectionIdx) => {
                        const isExpanded = expandedSections[section.title] !== false;
                        
                        return (
                            <div key={sectionIdx} className="border-4 border-black rounded-xl overflow-hidden mb-3" style={{ boxShadow: '3px 3px 0px #000' }}>
                                {/* Section Header */}
                                <button
                                    type="button"
                                    onClick={() => toggleSection(section.title)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-pink-200 to-purple-200 hover:from-pink-300 hover:to-purple-300 transition border-b-3 border-black"
                                >
                                    <span className="text-base font-bold text-black">{section.title.toUpperCase()}</span>
                                    <svg 
                                        className={`w-5 h-5 text-black stroke-[3] transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Section Content */}
                            {isExpanded && (
                                <div className="px-4 py-4 space-y-4 bg-yellow-50">
                                    {section.fields.map((field, fieldIdx) => (
                                        <div key={fieldIdx}>
                                            <label className="block text-sm font-bold text-black mb-2">
                                                {field.label}
                                                {field.required && <span className="text-red-500 ml-1">*</span>}
                                            </label>
                                            
                                            {/* Text Input */}
                                            {field.type === 'text' && (
                                                <>
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-lg border-3 border-black px-4 py-2 text-base font-semibold focus:ring-2 focus:ring-yellow-400 bg-white transition"
                                                        style={{ boxShadow: '2px 2px 0px #000' }}
                                                        placeholder={field.placeholder}
                                                        defaultValue={data.parameters?.[field.name] || field.default || ''}
                                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                        readOnly={field.readOnly}
                                                    />
                                                    {field.description && (
                                                        <p className="mt-2 text-xs text-black font-semibold">{field.description}</p>
                                                    )}
                                                </>
                                            )}

                                            {/* Password Input */}
                                            {field.type === 'password' && (
                                                <>
                                                    <input
                                                        type="password"
                                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                        placeholder={field.placeholder}
                                                        defaultValue={data.parameters?.[field.name] || ''}
                                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                    />
                                                    {field.description && (
                                                        <p className="mt-2 text-xs text-black font-semibold">{field.description}</p>
                                                    )}
                                                </>
                                            )}

                                            {/* Number Input */}
                                            {field.type === 'number' && (
                                                <>
                                                    <input
                                                        type="number"
                                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                        placeholder={field.placeholder}
                                                        min={field.min}
                                                        max={field.max}
                                                        step={field.step}
                                                        defaultValue={data.parameters?.[field.name] || field.default || ''}
                                                        onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value))}
                                                    />
                                                    {field.description && (
                                                        <p className="mt-2 text-xs text-black font-semibold">{field.description}</p>
                                                    )}
                                                </>
                                            )}

                                            {/* Select Dropdown */}
                                            {field.type === 'select' && (
                                                <>
                                                    <select
                                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                        defaultValue={data.parameters?.[field.name] || field.default || field.options?.[0]}
                                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                    >
                                                        {field.options?.map((option, optionIdx) => (
                                                            <option key={optionIdx} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {field.description && (
                                                        <p className="mt-2 text-xs text-black font-semibold">{field.description}</p>
                                                    )}
                                                </>
                                            )}

                                            {/* Textarea */}
                                            {field.type === 'textarea' && (
                                                <>
                                                    <textarea
                                                        rows={field.rows || 3}
                                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                                                        placeholder={field.placeholder}
                                                        defaultValue={data.parameters?.[field.name] || ''}
                                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                    />
                                                    {field.description && (
                                                        <p className="mt-2 text-xs text-black font-semibold">{field.description}</p>
                                                    )}
                                                </>
                                            )}

                                            {/* Code Editor (styled textarea) */}
                                            {(field.type === 'code' || field.type === 'json') && (
                                                <>
                                                    <textarea
                                                        rows={field.rows || 6}
                                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none bg-slate-50"
                                                        placeholder={field.placeholder}
                                                        defaultValue={data.parameters?.[field.name] || ''}
                                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                        spellCheck="false"
                                                    />
                                                    {field.description && (
                                                        <p className="mt-2 text-xs text-black font-semibold">{field.description}</p>
                                                    )}
                                                </>
                                            )}

                                            {/* Checkbox */}
                                            {field.type === 'checkbox' && (
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                                        defaultChecked={data.parameters?.[field.name] || field.default}
                                                        onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                                                    />
                                                    <span className="text-sm text-slate-700">{field.label}</span>
                                                </label>
                                            )}

                                            {/* Credential Selector */}
                                            {field.type === 'credential' && (
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                        defaultValue={data.parameters?.[field.name] || ''}
                                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                    >
                                                        <option value="">Select credential...</option>
                                                        <option value="credential-1">My Credential</option>
                                                    </select>
                                                    <button
                                                        type="button"
                                                        className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 rounded-md transition"
                                                    >
                                                        + New
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
                </div>

                {/* Footer Actions */}
                <div className={styles.footer} style={styles.footerStyle}>
                    <button
                        type="button"
                        className={isComic ? "px-4 py-2 text-sm font-bold text-black bg-white border-3 border-black rounded-lg hover:bg-gray-100 transition tactile-button" : theme === THEMES.PROFESSIONAL ? "px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition" : theme === THEMES.HACKER ? "px-4 py-2 text-sm font-bold text-green-500 bg-black border border-green-700 rounded-lg hover:bg-green-900/20 transition font-mono" : theme === THEMES.TERMINAL ? "px-4 py-2 text-sm font-bold text-amber-500 bg-slate-950 border border-amber-700 rounded-lg hover:bg-amber-900/20 transition font-mono" : "px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition"}
                        onClick={onClose}
                        style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={isComic ? "px-5 py-2 text-sm font-bold text-white bg-green-500 border-3 border-black rounded-lg hover:bg-green-600 transition tactile-button" : theme === THEMES.PROFESSIONAL ? "px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition" : theme === THEMES.HACKER ? "px-5 py-2 text-sm font-bold text-black bg-green-500 border border-green-700 rounded-lg hover:bg-green-600 transition font-mono" : theme === THEMES.TERMINAL ? "px-5 py-2 text-sm font-bold text-black bg-amber-500 border border-amber-700 rounded-lg hover:bg-amber-600 transition font-mono" : "px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"}
                        onClick={handleSave}
                        style={isComic ? { boxShadow: '3px 3px 0px #000' } : {}}
                    >
                        {isComic ? '💾 SAVE CHANGES' : '💾 Save Changes'}
                    </button>
                </div>
            </div>

            {/* Right Panel - OUTPUT */}
            <div className={styles.rightPanel}>
                <NodeDataPanel 
                    node={node} 
                    type="output" 
                    executionData={executionData}
                    graph={graph}
                />
            </div>
        </div>
    );
}
