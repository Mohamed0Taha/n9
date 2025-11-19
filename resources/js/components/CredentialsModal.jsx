import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CredentialsModal({ isOpen, onClose, onCredentialAdded }) {
    const [credentials, setCredentials] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        apiKey: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCredentials();
        }
    }, [isOpen]);

    const fetchCredentials = async () => {
        try {
            const { data } = await axios.get('/app/credentials');
            setCredentials(data.credentials || []);
        } catch (error) {
            console.error('Failed to fetch credentials', error);
        }
    };

    const handleAddCredential = async () => {
        if (!formData.name || !formData.type || !formData.apiKey) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/app/credentials', {
                name: formData.name,
                type: formData.type,
                data: {
                    apiKey: formData.apiKey
                }
            });

            // Reset form
            setFormData({ name: '', type: '', apiKey: '' });
            setShowAddForm(false);
            
            // Refresh list
            await fetchCredentials();
            
            // Notify parent
            if (onCredentialAdded) {
                onCredentialAdded();
            }
        } catch (error) {
            console.error('Failed to add credential', error);
            alert('Failed to add credential');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCredential = async (id) => {
        if (!confirm('Are you sure you want to delete this credential?')) {
            return;
        }

        try {
            await axios.delete(`/app/credentials/${id}`);
            await fetchCredentials();
            
            if (onCredentialAdded) {
                onCredentialAdded();
            }
        } catch (error) {
            console.error('Failed to delete credential', error);
            alert('Failed to delete credential');
        }
    };

    if (!isOpen) return null;

    const credentialTypes = [
        { value: 'openai_api', label: 'OpenAI API' },
        { value: 'gmail_oauth2', label: 'Gmail OAuth2' },
        { value: 'slack_oauth2', label: 'Slack OAuth2' },
        { value: 'generic_api', label: 'Generic API Key' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{ fontFamily: "'Comic Neue', cursive" }}>
            <div className="bg-yellow-50 border-4 border-black rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden" style={{ boxShadow: '8px 8px 0px #000' }}>
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-purple-400 to-pink-400 border-b-4 border-black">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-black" style={{ fontFamily: "'Bangers', cursive" }}>
                            🔐 CREDENTIALS MANAGER
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg bg-red-400 border-3 border-black hover:bg-red-500 transition"
                            style={{ boxShadow: '2px 2px 0px #000' }}
                        >
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
                    {/* Add New Button */}
                    {!showAddForm && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full px-4 py-3 mb-4 bg-green-400 border-3 border-black rounded-lg hover:bg-green-500 transition font-bold"
                            style={{ boxShadow: '3px 3px 0px #000' }}
                        >
                            + ADD NEW CREDENTIAL
                        </button>
                    )}

                    {/* Add Form */}
                    {showAddForm && (
                        <div className="mb-6 p-4 border-4 border-black rounded-xl bg-white" style={{ boxShadow: '3px 3px 0px #000' }}>
                            <h3 className="text-lg font-bold mb-4">Add New Credential</h3>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="My OpenAI Key"
                                        className="w-full px-3 py-2 border-2 border-black rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 border-2 border-black rounded-lg"
                                    >
                                        <option value="">Select type...</option>
                                        {credentialTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-1">API Key</label>
                                    <input
                                        type="password"
                                        value={formData.apiKey}
                                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                                        placeholder="sk-..."
                                        className="w-full px-3 py-2 border-2 border-black rounded-lg"
                                    />
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={handleAddCredential}
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-blue-400 border-2 border-black rounded-lg hover:bg-blue-500 transition font-bold disabled:opacity-50"
                                    >
                                        {loading ? 'Adding...' : 'Add Credential'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setFormData({ name: '', type: '', apiKey: '' });
                                        }}
                                        className="px-4 py-2 bg-gray-300 border-2 border-black rounded-lg hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Credentials List */}
                    <div className="space-y-3">
                        {credentials.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No credentials yet.</p>
                                <p className="text-sm">Add one to get started!</p>
                            </div>
                        ) : (
                            credentials.map((credential) => (
                                <div
                                    key={credential.id}
                                    className="p-4 border-3 border-black rounded-xl bg-white flex items-center justify-between"
                                    style={{ boxShadow: '2px 2px 0px #000' }}
                                >
                                    <div>
                                        <h4 className="font-bold text-lg">{credential.name}</h4>
                                        <p className="text-sm text-gray-600">{credential.type}</p>
                                        <p className="text-xs text-gray-400">
                                            Created: {new Date(credential.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCredential(credential.id)}
                                        className="px-3 py-2 bg-red-400 border-2 border-black rounded-lg hover:bg-red-500 transition text-sm font-bold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t-4 border-black bg-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border-3 border-black rounded-lg hover:bg-gray-100 transition font-bold"
                        style={{ boxShadow: '2px 2px 0px #000' }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
