import { useState } from 'react';

/**
 * NodeDataPanel - Displays INPUT/OUTPUT data for a node (like n8n)
 * Shows execution data in Schema, Table, and JSON views
 */
export default function NodeDataPanel({ node, type = 'input', executionData }) {
  const [viewMode, setViewMode] = useState('schema'); // 'schema', 'table', 'json'
  const [selectedItem, setSelectedItem] = useState(0);

  if (!node) {
    return null;
  }

  // Get data based on type
  const data = type === 'input' 
    ? executionData?.inputData || []
    : executionData?.outputData || [];

  const items = data[0]?.items || [];
  const totalItems = items.length;

  // Render empty state
  if (totalItems === 0) {
    return (
      <div className="h-full bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center text-slate-400">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm">No {type} data</p>
          <p className="text-xs mt-1">
            {type === 'input' 
              ? 'This node has no input data yet'
              : 'Execute the workflow to see output'}
          </p>
        </div>
      </div>
    );
  }

  const currentItem = items[selectedItem] || {};
  const jsonData = currentItem.json || {};
  const binaryData = currentItem.binary || {};
  const pairedItem = currentItem.pairedItem;

  // Extract schema from JSON data
  const getSchema = (obj, prefix = '') => {
    const schema = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const type = Array.isArray(value) ? 'array' : typeof value;
      
      schema.push({
        key: fullKey,
        type,
        value: type === 'object' && value !== null ? '[Object]' : 
               type === 'array' ? `[Array(${value.length})]` :
               String(value)
      });

      // Recurse for objects
      if (type === 'object' && value !== null && !Array.isArray(value)) {
        schema.push(...getSchema(value, fullKey));
      }
    }
    return schema;
  };

  const schema = getSchema(jsonData);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-slate-900 uppercase tracking-wide">
              {type === 'input' ? 'INPUT' : 'OUTPUT'}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className={`px-2 py-1 rounded ${type === 'input' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          {/* Item selector */}
          {totalItems > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedItem(Math.max(0, selectedItem - 1))}
                disabled={selectedItem === 0}
                className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-xs text-slate-600 font-mono">
                {selectedItem + 1} of {totalItems}
              </span>
              <button
                onClick={() => setSelectedItem(Math.min(totalItems - 1, selectedItem + 1))}
                disabled={selectedItem === totalItems - 1}
                className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* View mode tabs */}
        <div className="flex border-t border-slate-200">
          <button
            onClick={() => setViewMode('schema')}
            className={`flex-1 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              viewMode === 'schema'
                ? 'border-blue-500 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Schema
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex-1 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              viewMode === 'table'
                ? 'border-blue-500 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`flex-1 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              viewMode === 'json'
                ? 'border-blue-500 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            JSON
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Schema View */}
        {viewMode === 'schema' && (
          <div className="p-4">
            <div className="space-y-1">
              {schema.map((field, index) => (
                <div key={index} className="flex items-start gap-2 py-1 px-2 hover:bg-slate-50 rounded text-xs font-mono">
                  <span className="text-slate-500 shrink-0">#</span>
                  <span className="text-slate-900 font-medium break-all">{field.key}</span>
                  <span className="text-slate-400 shrink-0">:</span>
                  <span className="text-blue-600 shrink-0">{field.type}</span>
                  {field.value && (
                    <>
                      <span className="text-slate-400 shrink-0">=</span>
                      <span className="text-slate-600 break-all truncate">{field.value}</span>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Binary data indicator */}
            {Object.keys(binaryData).length > 0 && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded">
                <div className="text-xs font-semibold text-purple-900 mb-1">Binary Data</div>
                {Object.keys(binaryData).map((key) => (
                  <div key={key} className="text-xs text-purple-700 font-mono">
                    {key}: {binaryData[key].mimeType || 'unknown'}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">#</th>
                    <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">Key</th>
                    <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(jsonData).map(([key, value], index) => (
                    <tr key={key} className="hover:bg-slate-50">
                      <td className="border border-slate-200 px-3 py-2 text-slate-500">{index + 1}</td>
                      <td className="border border-slate-200 px-3 py-2 font-mono text-slate-900">{key}</td>
                      <td className="border border-slate-200 px-3 py-2 font-mono text-slate-700 break-all">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* JSON View */}
        {viewMode === 'json' && (
          <div className="p-4">
            <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded overflow-auto">
              {JSON.stringify(currentItem, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Footer - Paired Item Info */}
      {pairedItem && (
        <div className="border-t border-slate-200 px-4 py-2 bg-slate-50">
          <div className="text-xs text-slate-600">
            <span className="font-medium">Paired with:</span> Item {pairedItem.item || 0}
          </div>
        </div>
      )}
    </div>
  );
}
