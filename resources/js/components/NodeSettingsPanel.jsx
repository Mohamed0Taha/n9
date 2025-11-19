import { Fragment, useState, useEffect } from 'react';
import { getNodeSchema } from '../data/nodeSchemas.js';
import NodeDataPanel from './NodeDataPanel_v2.jsx';
import NodeConfigForm from './NodeConfigForm.jsx';

export default function NodeSettingsPanel({ node, onClose, onUpdate, executionData, graph, credentials = [] }) {
    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'input', 'output'

    if (!node) {
        return null;
    }

    const { data = {} } = node;
    const nodeName = data.label || data.name || 'Node';
    const nodeType = node.type || nodeName;
    const nodeCategory = data.category || '';
    const schema = getNodeSchema(nodeType);

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
        <div className="fixed inset-0 z-50 flex bg-yellow-100" style={{ fontFamily: "'Comic Neue', cursive" }}>
            {/* Left Panel - INPUT */}
            <div className="w-64 border-r-4 border-black bg-yellow-50 flex-shrink-0 overflow-hidden" style={{ boxShadow: '4px 0px 0px #000' }}>
                <NodeDataPanel 
                    node={node} 
                    type="input" 
                    executionData={executionData}
                    graph={graph}
                />
            </div>

            {/* Middle Panel - Settings */}
            <div className="flex flex-col flex-1 bg-yellow-50 border-r-4 border-black overflow-hidden" style={{ boxShadow: '4px 0px 0px #000' }}>
                {/* Header */}
                <div className="flex-shrink-0 border-b-4 border-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500" style={{ boxShadow: '0px 4px 0px #000' }}>
                    <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-3 border-black"
                                style={{ backgroundColor: data.color ?? '#3b82f6', color: '#ffffff', boxShadow: '2px 2px 0px #000' }}
                            >
                                {data.icon ?? '⚙️'}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-black" style={{ fontFamily: "'Bangers', cursive", letterSpacing: '1px' }}>{nodeName.toUpperCase()}</h3>
                                <p className="text-sm text-black font-bold capitalize">{nodeType}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="p-2 rounded-lg bg-red-400 border-3 border-black"
                            onClick={onClose}
                            style={{ boxShadow: '2px 2px 0px #000' }}
                            aria-label="Close node settings"
                        >
                            <svg className="w-6 h-6 text-black stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-t-4 border-black bg-pink-200">
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 px-4 py-3 text-sm font-bold transition-all border-r-2 border-black ${
                                activeTab === 'settings'
                                    ? 'bg-lime-400 text-black'
                                    : 'text-black hover:bg-yellow-200'
                            }`}
                            style={activeTab === 'settings' ? { boxShadow: 'inset 0px 3px 0px rgba(0,0,0,0.2)' } : {}}
                        >
                            ⚙️ SETTINGS
                        </button>
                        <button
                            onClick={() => setActiveTab('conditions')}
                            className={`flex-1 px-4 py-3 text-sm font-bold transition-all ${
                                activeTab === 'conditions'
                                    ? 'bg-lime-400 text-black'
                                    : 'text-black hover:bg-yellow-200'
                            }`}
                            style={activeTab === 'conditions' ? { boxShadow: 'inset 0px 3px 0px rgba(0,0,0,0.2)' } : {}}
                        >
                            📋 PARAMETERS
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
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
                <div className="flex-shrink-0 px-5 py-4 border-t-4 border-black bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-end gap-3" style={{ boxShadow: '0px -4px 0px #000' }}>
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-bold text-black bg-white border-3 border-black rounded-lg hover:bg-gray-100 transition tactile-button"
                        onClick={onClose}
                        style={{ boxShadow: '2px 2px 0px #000' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-5 py-2 text-sm font-bold text-white bg-green-500 border-3 border-black rounded-lg hover:bg-green-600 transition tactile-button"
                        onClick={handleSave}
                        style={{ boxShadow: '3px 3px 0px #000' }}
                    >
                        💾 SAVE CHANGES
                    </button>
                </div>
            </div>

            {/* Right Panel - OUTPUT */}
            <div className="w-64 bg-white flex-shrink-0 overflow-hidden">
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
