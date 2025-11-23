import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext.jsx';

const CREDENTIAL_SCHEMAS = {
    'openaiApi': {
        name: 'OpenAI API',
        icon: '🤖',
        fields: [
            { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-...' }
        ]
    },
    'anthropicApi': {
        name: 'Anthropic API',
        icon: '🧠',
        fields: [
            { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-ant-...' }
        ]
    },
    'googleSheetsOAuth2': {
        name: 'Google Sheets OAuth2',
        icon: '📊',
        fields: [
            { key: 'clientId', label: 'Client ID', type: 'text' },
            { key: 'clientSecret', label: 'Client Secret', type: 'password' },
            { key: 'redirectUri', label: 'Redirect URI', type: 'text', default: 'https://your-app.com/callback' }
        ]
    },
    'gmailOAuth2': {
        name: 'Gmail OAuth2',
        icon: '📧',
        fields: [
            { key: 'clientId', label: 'Client ID', type: 'text' },
            { key: 'clientSecret', label: 'Client Secret', type: 'password' },
            { key: 'redirectUri', label: 'Redirect URI', type: 'text', default: 'https://your-app.com/callback' }
        ]
    },
    'slackApi': {
        name: 'Slack API',
        icon: '💬',
        fields: [
            { key: 'botToken', label: 'Bot Token', type: 'password', placeholder: 'xoxb-...' },
            { key: 'signingSecret', label: 'Signing Secret', type: 'password' }
        ]
    },
    'discordApi': {
        name: 'Discord Bot',
        icon: '🎮',
        fields: [
            { key: 'botToken', label: 'Bot Token', type: 'password' },
            { key: 'clientId', label: 'Client ID', type: 'text' }
        ]
    },
    'notionApi': {
        name: 'Notion API',
        icon: '📓',
        fields: [
            { key: 'apiKey', label: 'Internal Integration Token', type: 'password', placeholder: 'secret_...' }
        ]
    },
    'airtableApi': {
        name: 'Airtable API',
        icon: '📅',
        fields: [
            { key: 'apiKey', label: 'Personal Access Token', type: 'password' }
        ]
    },
    'telegramApi': {
        name: 'Telegram API',
        icon: '✈️',
        fields: [
            { key: 'botToken', label: 'Bot Token', type: 'password' }
        ]
    },
    'postgres': {
        name: 'PostgreSQL',
        icon: '🐘',
        fields: [
            { key: 'host', label: 'Host', type: 'text', default: 'localhost' },
            { key: 'port', label: 'Port', type: 'number', default: 5432 },
            { key: 'database', label: 'Database', type: 'text' },
            { key: 'user', label: 'User', type: 'text' },
            { key: 'password', label: 'Password', type: 'password' },
            { key: 'ssl', label: 'SSL', type: 'checkbox', default: false }
        ]
    },
    'mysql': {
        name: 'MySQL',
        icon: '🐬',
        fields: [
            { key: 'host', label: 'Host', type: 'text', default: 'localhost' },
            { key: 'port', label: 'Port', type: 'number', default: 3306 },
            { key: 'database', label: 'Database', type: 'text' },
            { key: 'user', label: 'User', type: 'text' },
            { key: 'password', label: 'Password', type: 'password' }
        ]
    },
    'mongoDb': {
        name: 'MongoDB',
        icon: '🍃',
        fields: [
            { key: 'connectionString', label: 'Connection String', type: 'password', placeholder: 'mongodb://...' }
        ]
    },
    'genericApi': {
        name: 'Generic API Key',
        icon: '🔑',
        fields: [
            { key: 'apiKey', label: 'API Key', type: 'password' },
            { key: 'headerName', label: 'Header Name', type: 'text', default: 'Authorization' }
        ]
    }
};

export default function CredentialsModal({ isOpen, onClose, onCredentialAdded }) {
    const { theme, isComic, isProfessional, THEMES } = useTheme();
    const [credentials, setCredentials] = useState([]);
    
    const styles = useMemo(() => {
        const baseInput = "w-full px-4 py-2 outline-none transition";
        const baseButton = "p-2 rounded-lg transition";
        
        // Helper to get theme specific styles
        // We can reuse the logic or just define specific objects
        // For brevity, I'll use a simplified switch here tailored for this modal
        
        if (isComic) {
            return {
                container: 'bg-yellow-50 border-4 border-black rounded-xl font-comic shadow-[8px_8px_0px_#000]',
                header: 'border-b-4 border-black bg-gradient-to-r from-purple-400 to-pink-400',
                headerTitle: 'font-black text-black',
                closeButton: 'bg-white border-2 border-black hover:bg-red-100 text-black shadow-[2px_2px_0px_#000]',
                searchContainer: 'bg-white border-b-4 border-black',
                searchInput: `${baseInput} border-3 border-black rounded-lg`,
                createButton: 'bg-green-400 text-black border-3 border-black hover:bg-green-500 shadow-[2px_2px_0px_#000]',
                card: 'bg-white border-3 border-black hover:bg-yellow-50 shadow-[4px_4px_0px_#000]',
                cardIcon: 'bg-white border-2 border-black',
                cardTitle: 'font-bold',
                editButton: 'hover:bg-blue-200 border-2 border-transparent hover:border-black',
                deleteButton: 'text-red-700 hover:bg-red-100',
                typeButton: 'bg-white border-3 border-black hover:bg-cyan-100 shadow-[4px_4px_0px_#000] hover:-translate-y-1',
                formContainer: 'border-4 border-black bg-white shadow-[6px_6px_0px_#000]',
                inputField: `${baseInput} border-3 border-black rounded-lg focus:bg-yellow-50`,
                cancelButton: 'bg-slate-200 border-2 border-black hover:bg-slate-300',
                saveButton: 'bg-green-400 text-black border-3 border-black hover:bg-green-500 shadow-[3px_3px_0px_#000]'
            };
        }
        
        // Professional / Dark / Hacker / Terminal
        const isDarkTheme = theme !== 'professional'; // Professional is the only light theme in this group
        const isHacker = theme === 'hacker';
        const isTerminal = theme === 'terminal';
        
        const bg = isHacker ? 'bg-black' : isTerminal ? 'bg-slate-950' : isDarkTheme ? 'bg-gray-800' : 'bg-white';
        const text = isHacker ? 'text-green-500' : isTerminal ? 'text-amber-500' : isDarkTheme ? 'text-gray-100' : 'text-slate-900';
        const border = isHacker ? 'border-green-900' : isTerminal ? 'border-amber-900' : isDarkTheme ? 'border-gray-700' : 'border-slate-200';
        const inputBg = isHacker ? 'bg-black' : isTerminal ? 'bg-slate-900' : isDarkTheme ? 'bg-gray-900' : 'bg-slate-50';
        const accent = isHacker ? 'text-green-400' : isTerminal ? 'text-amber-400' : isDarkTheme ? 'text-blue-400' : 'text-blue-600';
        
        return {
            container: `${bg} border ${border} shadow-2xl font-sans rounded-xl ${text}`,
            header: `border-b ${border} ${isHacker || isTerminal ? bg : isDarkTheme ? 'bg-gray-800' : 'bg-slate-50'}`,
            headerTitle: 'font-bold',
            closeButton: `hover:bg-opacity-10 hover:bg-gray-500 ${text}`,
            searchContainer: `p-4 border-b ${border} ${isHacker || isTerminal ? bg : isDarkTheme ? 'bg-gray-800' : 'bg-slate-50'}`,
            searchInput: `${baseInput} ${inputBg} border ${border} rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent`,
            createButton: `${isHacker ? 'bg-green-900 text-green-400' : isTerminal ? 'bg-amber-900 text-amber-400' : 'bg-blue-600 text-white'} hover:bg-opacity-90 shadow-sm`,
            card: `${isHacker || isTerminal ? 'bg-transparent' : isDarkTheme ? 'bg-gray-900' : 'bg-white'} border ${border} shadow-sm hover:shadow-md hover:border-opacity-80`,
            cardIcon: `${isHacker || isTerminal ? 'bg-opacity-10 bg-white' : isDarkTheme ? 'bg-gray-800' : 'bg-slate-100'}`,
            cardTitle: 'font-bold',
            editButton: `hover:bg-opacity-10 hover:bg-gray-500 ${text}`,
            deleteButton: 'text-red-500 hover:bg-red-900/20',
            typeButton: `${isHacker || isTerminal ? 'bg-transparent' : isDarkTheme ? 'bg-gray-900' : 'bg-white'} border ${border} hover:border-opacity-80 hover:shadow-md`,
            formContainer: '', // No container style needed for clean themes
            inputField: `${baseInput} ${inputBg} border ${border} rounded-lg focus:ring-2 focus:ring-opacity-50`,
            cancelButton: `hover:bg-opacity-10 hover:bg-gray-500 ${text}`,
            saveButton: `${isHacker ? 'bg-green-900 text-green-400' : isTerminal ? 'bg-amber-900 text-amber-400' : 'bg-blue-600 text-white'} hover:bg-opacity-90 shadow-md`
        };
    }, [theme, isComic]);

    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('list'); // 'list', 'select', 'form'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [credentialName, setCredentialName] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchCredentials();
            setView('list');
            setSearchQuery('');
        }
    }, [isOpen]);

    const fetchCredentials = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/app/credentials');
            setCredentials(data.credentials || []);
        } catch (error) {
            console.error('Failed to fetch credentials', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartCreate = () => {
        setSelectedType(null);
        setEditingId(null);
        setFormData({});
        setCredentialName('');
        setView('select');
    };

    const handleSelectType = (typeKey) => {
        setSelectedType(typeKey);
        const schema = CREDENTIAL_SCHEMAS[typeKey];
        // Initialize defaults
        const defaults = {};
        schema.fields.forEach(f => {
            if (f.default !== undefined) defaults[f.key] = f.default;
        });
        setFormData(defaults);
        setView('form');
    };

    const handleStartEdit = (cred) => {
        setSelectedType(cred.type);
        setEditingId(cred.id);
        setCredentialName(cred.name);
        setFormData(cred.data || {});
        setView('form');
    };

    const handleSave = async () => {
        if (!credentialName.trim()) {
            alert('Please enter a name for this credential');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: credentialName,
                type: selectedType,
                data: formData
            };

            if (editingId) {
                await axios.put(`/app/credentials/${editingId}`, payload);
            } else {
                await axios.post('/app/credentials', payload);
            }

            await fetchCredentials();
            if (onCredentialAdded) onCredentialAdded();
            setView('list');
        } catch (error) {
            console.error('Failed to save credential', error);
            alert('Failed to save credential. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this credential? This cannot be undone.')) return;
        
        setLoading(true);
        try {
            await axios.delete(`/app/credentials/${id}`);
            await fetchCredentials();
            if (onCredentialAdded) onCredentialAdded();
        } catch (error) {
            console.error('Failed to delete', error);
            alert('Failed to delete credential');
        } finally {
            setLoading(false);
        }
    };

    const filteredCredentials = credentials.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredTypes = Object.entries(CREDENTIAL_SCHEMAS).filter(([key, schema]) =>
        schema.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    const themeClasses = isProfessional 
        ? 'bg-white rounded-xl shadow-2xl border border-slate-200 font-sans' 
        : 'bg-yellow-50 border-4 border-black rounded-xl font-comic shadow-[8px_8px_0px_#000]';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className={`w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden ${styles.container}`}>
                
                {/* Header */}
                <div className={`px-6 py-4 flex items-center justify-between flex-shrink-0 ${styles.header}`}>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🔐</span>
                        <h2 className={`text-xl ${styles.headerTitle}`}>
                            Credentials Manager
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className={`p-2 rounded-lg transition ${styles.closeButton}`}
                        style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative bg-transparent">
                    
                    {/* LIST VIEW */}
                    {view === 'list' && (
                        <div className="absolute inset-0 flex flex-col">
                            <div className={`p-4 flex gap-3 ${styles.searchContainer}`}>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                                    <input 
                                        type="text" 
                                        placeholder="Search credentials..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`pl-10 ${styles.searchInput}`}
                                    />
                                </div>
                                <button 
                                    onClick={handleStartCreate}
                                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${styles.createButton}`}
                                >
                                    <span>+</span>
                                    <span>Create New</span>
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4">
                                {loading && credentials.length === 0 ? (
                                    <div className="flex justify-center py-8">
                                        <span className="animate-spin text-3xl">⏳</span>
                                    </div>
                                ) : filteredCredentials.length === 0 ? (
                                    <div className="text-center py-12 opacity-50">
                                        <div className="text-4xl mb-3">📭</div>
                                        <p className="font-medium">No credentials found</p>
                                        {searchQuery && <button onClick={() => setSearchQuery('')} className="text-blue-500 hover:underline mt-2">Clear search</button>}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredCredentials.map(cred => {
                                            const schema = CREDENTIAL_SCHEMAS[cred.type] || { name: cred.type, icon: '❓' };
                                            return (
                                                <div 
                                                    key={cred.id}
                                                    className={`group relative p-4 rounded-xl transition hover:-translate-y-1 ${styles.card}`}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl ${styles.cardIcon}`}>
                                                                {schema.icon}
                                                            </div>
                                                            <div>
                                                                <h3 className={`leading-tight ${styles.cardTitle}`}>{cred.name}</h3>
                                                                <p className="text-xs opacity-60 font-medium">{schema.name}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleStartEdit(cred)}
                                                            className={`opacity-0 group-hover:opacity-100 p-1.5 rounded transition ${styles.editButton}`}
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-dashed border-gray-300 border-opacity-30">
                                                        <span className="text-xs opacity-40 font-mono">ID: {cred.id.substring(0, 8)}...</span>
                                                        <button 
                                                            onClick={() => handleDelete(cred.id)}
                                                            className={`text-xs font-bold px-2 py-1 rounded transition ${styles.deleteButton}`}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SELECT TYPE VIEW */}
                    {view === 'select' && (
                        <div className="absolute inset-0 flex flex-col animate-slide-in-right">
                            <div className={`p-4 flex items-center gap-3 ${styles.searchContainer}`}>
                                <button onClick={() => setView('list')} className="opacity-60 hover:opacity-100 transition">← Back</button>
                                <h3 className={`text-lg ${styles.headerTitle}`}>Select Credential Type</h3>
                            </div>
                            <div className={`p-4 border-b border-opacity-10 ${styles.searchContainer}`}>
                                <input 
                                    type="text" 
                                    placeholder="Search types..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={styles.searchInput}
                                    autoFocus
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {filteredTypes.map(([key, schema]) => (
                                        <button 
                                            key={key}
                                            onClick={() => handleSelectType(key)}
                                            className={`flex items-center gap-4 p-4 text-left transition rounded-xl ${styles.typeButton}`}
                                        >
                                            <span className="text-3xl">{schema.icon}</span>
                                            <div>
                                                <div className="font-bold">{schema.name}</div>
                                                <div className="text-xs opacity-60">Click to configure</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FORM VIEW */}
                    {view === 'form' && (
                        <div className="absolute inset-0 flex flex-col animate-slide-in-right">
                            <div className={`p-4 flex items-center gap-3 ${styles.searchContainer}`}>
                                <button onClick={() => setView(editingId ? 'list' : 'select')} className="opacity-60 hover:opacity-100 transition">← Back</button>
                                <h3 className={`text-lg ${styles.headerTitle}`}>
                                    {editingId ? 'Edit Credential' : 'New Credential'}
                                </h3>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 sm:px-12 lg:px-24">
                                <div className={`max-w-2xl mx-auto p-6 rounded-xl ${styles.formContainer}`}>
                                    
                                    {/* Header Info */}
                                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-300 border-opacity-20">
                                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-4xl ${styles.cardIcon}`}>
                                            {CREDENTIAL_SCHEMAS[selectedType]?.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{CREDENTIAL_SCHEMAS[selectedType]?.name}</h2>
                                            <p className="opacity-60 text-sm">Configure connection details</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Name Field */}
                                        <div>
                                            <label className="block font-bold mb-2 text-sm uppercase tracking-wide opacity-60">Credential Name</label>
                                            <input 
                                                type="text" 
                                                value={credentialName}
                                                onChange={(e) => setCredentialName(e.target.value)}
                                                placeholder="e.g. My Personal API Key"
                                                className={styles.inputField}
                                            />
                                        </div>

                                        {/* Dynamic Fields */}
                                        {CREDENTIAL_SCHEMAS[selectedType]?.fields.map(field => (
                                            <div key={field.key}>
                                                <label className="block font-bold mb-2 text-sm uppercase tracking-wide opacity-60">
                                                    {field.label}
                                                </label>
                                                
                                                {field.type === 'textarea' ? (
                                                    <textarea
                                                        value={formData[field.key] || ''}
                                                        onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                                                        placeholder={field.placeholder}
                                                        rows={3}
                                                        className={styles.inputField}
                                                    />
                                                ) : field.type === 'checkbox' ? (
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input 
                                                            type="checkbox"
                                                            checked={formData[field.key] || false}
                                                            onChange={(e) => setFormData({...formData, [field.key]: e.target.checked})}
                                                            className="w-5 h-5"
                                                        />
                                                        <span>Enabled</span>
                                                    </label>
                                                ) : (
                                                    <div className="relative">
                                                        <input 
                                                            type={field.type || 'text'}
                                                            value={formData[field.key] || ''}
                                                            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                                                            placeholder={field.placeholder}
                                                            className={styles.inputField}
                                                        />
                                                        {field.type === 'password' && (
                                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 text-xs">
                                                                Encrypted
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-8 pt-6 border-t border-gray-300 border-opacity-20 flex justify-end gap-3">
                                        <button 
                                            onClick={() => setView('list')}
                                            className={`px-6 py-2 rounded-lg font-bold transition ${styles.cancelButton}`}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSave}
                                            disabled={loading}
                                            className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition ${styles.saveButton}`}
                                        >
                                            {loading ? (
                                                <span className="animate-spin">⏳</span>
                                            ) : (
                                                <span>💾</span>
                                            )}
                                            <span>{editingId ? 'Update Credential' : 'Save Credential'}</span>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <style>{`
                @keyframes slide-in-right {
                    from { transform: translateX(20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
