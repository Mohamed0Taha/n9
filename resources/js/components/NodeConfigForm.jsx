import { useState, useEffect } from 'react';

/**
 * Dynamic Node Configuration Form
 * Renders form fields based on node schema
 */
export default function NodeConfigForm({ schema, values = {}, onChange, credentials = [] }) {
    const [formValues, setFormValues] = useState(values);

    useEffect(() => {
        setFormValues(values);
    }, [values]);

    const handleChange = (fieldName, value) => {
        const newValues = { ...formValues, [fieldName]: value };
        setFormValues(newValues);
        if (onChange) {
            onChange(newValues);
        }
    };

    const shouldShowField = (field) => {
        if (!field.showWhen) return true;
        
        const conditions = field.showWhen;
        for (const [key, allowedValues] of Object.entries(conditions)) {
            const currentValue = formValues[key];
            if (Array.isArray(allowedValues)) {
                if (!allowedValues.includes(currentValue)) return false;
            } else if (currentValue !== allowedValues) {
                return false;
            }
        }
        return true;
    };

    const renderField = (field) => {
        const value = formValues[field.name] ?? field.default ?? '';
        const fieldId = `field-${field.name}`;

        switch (field.type) {
            case 'text':
                return (
                    <input
                        id={fieldId}
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required={field.required}
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        id={fieldId}
                        value={value}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        rows={field.rows || 4}
                        className="w-full px-3 py-2 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono text-sm"
                        required={field.required}
                    />
                );

            case 'select':
                return (
                    <select
                        id={fieldId}
                        value={value}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required={field.required}
                    >
                        {field.placeholder && (
                            <option value="">{field.placeholder}</option>
                        )}
                        {field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'number':
                return (
                    <input
                        id={fieldId}
                        type="number"
                        value={value}
                        onChange={(e) => handleChange(field.name, parseFloat(e.target.value) || 0)}
                        min={field.min}
                        max={field.max}
                        step={field.step || 1}
                        className="w-full px-3 py-2 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required={field.required}
                    />
                );

            case 'slider':
                return (
                    <div className="space-y-2">
                        <input
                            id={fieldId}
                            type="range"
                            value={value}
                            onChange={(e) => handleChange(field.name, parseFloat(e.target.value))}
                            min={field.min}
                            max={field.max}
                            step={field.step || 0.1}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        />
                        <div className="text-center text-sm font-bold text-black">
                            {value}
                        </div>
                    </div>
                );

            case 'code':
                return (
                    <textarea
                        id={fieldId}
                        value={value}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        rows={field.rows || 10}
                        className="w-full px-3 py-2 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono text-sm bg-gray-900 text-green-400"
                        required={field.required}
                        spellCheck={false}
                    />
                );

            case 'keyValue':
                return (
                    <KeyValueEditor
                        value={value}
                        onChange={(newValue) => handleChange(field.name, newValue)}
                    />
                );

            case 'conditions':
                return (
                    <ConditionsEditor
                        value={value}
                        onChange={(newValue) => handleChange(field.name, newValue)}
                        defaultCondition={field.defaultCondition}
                    />
                );

            case 'credential':
                return (
                    <CredentialSelector
                        value={value}
                        credentialType={field.credentialType}
                        credentials={credentials}
                        onChange={(newValue) => handleChange(field.name, newValue)}
                    />
                );

            default:
                return (
                    <input
                        id={fieldId}
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 border-3 border-black rounded-lg"
                    />
                );
        }
    };

    if (!schema || !schema.fields) {
        return (
            <div className="p-4 text-center text-gray-500">
                No configuration available for this node type.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {schema.fields.map((field) => {
                if (!shouldShowField(field)) return null;

                return (
                    <div key={field.name} className="space-y-2">
                        <label
                            htmlFor={`field-${field.name}`}
                            className="block text-sm font-bold text-black"
                        >
                            {field.label}
                            {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                            {field.supportsVariables && (
                                <span className="ml-2 text-xs bg-purple-200 px-2 py-1 rounded border-2 border-black">
                                    Supports {'{{ }}'} variables
                                </span>
                            )}
                        </label>
                        
                        {renderField(field)}
                        
                        {field.description && (
                            <p className="text-xs text-gray-600 italic">
                                {field.description}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/**
 * Key-Value Pair Editor
 */
function KeyValueEditor({ value = [], onChange }) {
    const [pairs, setPairs] = useState(Array.isArray(value) ? value : []);

    const addPair = () => {
        const newPairs = [...pairs, { key: '', value: '' }];
        setPairs(newPairs);
        onChange(newPairs);
    };

    const updatePair = (index, field, newValue) => {
        const newPairs = [...pairs];
        newPairs[index] = { ...newPairs[index], [field]: newValue };
        setPairs(newPairs);
        onChange(newPairs);
    };

    const removePair = (index) => {
        const newPairs = pairs.filter((_, i) => i !== index);
        setPairs(newPairs);
        onChange(newPairs);
    };

    return (
        <div className="space-y-2">
            {pairs.map((pair, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="text"
                        value={pair.key}
                        onChange={(e) => updatePair(index, 'key', e.target.value)}
                        placeholder="Key"
                        className="flex-1 px-2 py-1 border-2 border-black rounded"
                    />
                    <input
                        type="text"
                        value={pair.value}
                        onChange={(e) => updatePair(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1 px-2 py-1 border-2 border-black rounded"
                    />
                    <button
                        type="button"
                        onClick={() => removePair(index)}
                        className="px-3 py-1 bg-red-400 border-2 border-black rounded hover:bg-red-500"
                    >
                        ✕
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addPair}
                className="w-full px-3 py-2 bg-green-300 border-3 border-black rounded-lg hover:bg-green-400 font-bold"
            >
                + Add Pair
            </button>
        </div>
    );
}

/**
 * Conditions Editor (for IF node)
 */
function ConditionsEditor({ value = [], onChange, defaultCondition }) {
    const [conditions, setConditions] = useState(Array.isArray(value) ? value : []);

    const addCondition = () => {
        const newConditions = [...conditions, defaultCondition || { value1: '', operation: 'equal', value2: '' }];
        setConditions(newConditions);
        onChange(newConditions);
    };

    const updateCondition = (index, field, newValue) => {
        const newConditions = [...conditions];
        newConditions[index] = { ...newConditions[index], [field]: newValue };
        setConditions(newConditions);
        onChange(newConditions);
    };

    const removeCondition = (index) => {
        const newConditions = conditions.filter((_, i) => i !== index);
        setConditions(newConditions);
        onChange(newConditions);
    };

    const operations = [
        { value: 'equal', label: 'Equals' },
        { value: 'notEqual', label: 'Not Equal' },
        { value: 'contains', label: 'Contains' },
        { value: 'notContains', label: 'Not Contains' },
        { value: 'startsWith', label: 'Starts With' },
        { value: 'endsWith', label: 'Ends With' },
        { value: 'regex', label: 'Regex Match' },
        { value: 'greaterThan', label: 'Greater Than' },
        { value: 'lessThan', label: 'Less Than' }
    ];

    return (
        <div className="space-y-3">
            {conditions.map((condition, index) => (
                <div key={index} className="p-3 border-3 border-black rounded-lg bg-yellow-50 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">Condition {index + 1}</span>
                        <button
                            type="button"
                            onClick={() => removeCondition(index)}
                            className="px-2 py-1 bg-red-400 border-2 border-black rounded hover:bg-red-500 text-xs"
                        >
                            Remove
                        </button>
                    </div>
                    <input
                        type="text"
                        value={condition.value1 || ''}
                        onChange={(e) => updateCondition(index, 'value1', e.target.value)}
                        placeholder="Value 1 (e.g., {{ $json.status }})"
                        className="w-full px-2 py-1 border-2 border-black rounded"
                    />
                    <select
                        value={condition.operation || 'equal'}
                        onChange={(e) => updateCondition(index, 'operation', e.target.value)}
                        className="w-full px-2 py-1 border-2 border-black rounded"
                    >
                        {operations.map((op) => (
                            <option key={op.value} value={op.value}>
                                {op.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={condition.value2 || ''}
                        onChange={(e) => updateCondition(index, 'value2', e.target.value)}
                        placeholder="Value 2"
                        className="w-full px-2 py-1 border-2 border-black rounded"
                    />
                </div>
            ))}
            <button
                type="button"
                onClick={addCondition}
                className="w-full px-3 py-2 bg-blue-300 border-3 border-black rounded-lg hover:bg-blue-400 font-bold"
            >
                + Add Condition
            </button>
        </div>
    );
}

/**
 * Credential Selector
 */
function CredentialSelector({ value, credentialType, credentials, onChange }) {
    const filteredCredentials = credentials.filter(c => c.type === credentialType);

    return (
        <div className="space-y-2">
            <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
                <option value="">Select credential...</option>
                {filteredCredentials.map((cred) => (
                    <option key={cred.id} value={cred.id}>
                        {cred.name}
                    </option>
                ))}
            </select>
            {filteredCredentials.length === 0 && (
                <p className="text-xs text-orange-600 font-bold">
                    ⚠️ No credentials found. Create one in Settings → Credentials
                </p>
            )}
        </div>
    );
}
