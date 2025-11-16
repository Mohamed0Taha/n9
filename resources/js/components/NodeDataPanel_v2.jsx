import { useState } from 'react';

/**
 * Simplified NodeDataPanel based on n8n's actual NDV (Node Detail View)
 * This is the working version used in the 3‑panel INPUT / SETTINGS / OUTPUT layout
 */
export default function NodeDataPanel({ node, type = 'input', executionData, graph }) {
  // Default to Schema view like the n8n-style spec
  const [viewMode, setViewMode] = useState('schema'); // 'schema' | 'table' | 'json'
  const [selectedItem, setSelectedItem] = useState(0);

  // Generate sample data based on node type
  const generateSampleData = () => {
    const nodeType = node?.data?.type || 'Unknown';
    const sampleData = {
      'Start': { trigger: 'manual', timestamp: new Date().toISOString() },
      'HTTP Request': { statusCode: 200, body: { message: 'Sample response', data: [1, 2, 3] } },
      'Code': { result: 'Sample output', processed: true },
      'IF': { condition: true, value: 'sample' },
      'Slack': { channel: '#general', message: 'Sample message' },
      'Gmail': { to: 'user@example.com', subject: 'Sample email' },
      'Database': { rows: 5, operation: 'SELECT' },
    };
    return sampleData[nodeType] || { sampleData: true, nodeType, value: 'Sample value' };
  };

  // If no execution data
  if (!executionData) {
    if (type === 'output') {
      // OUTPUT: Show sample data when no execution
      const sampleData = generateSampleData();
      const items = [{ json: sampleData }];
      const totalItems = 1;
      const currentItem = items[0];
      const jsonData = currentItem.json;
      
      const renderSampleData = () => {
        const entries = [];
        for (const [key, value] of Object.entries(jsonData)) {
          entries.push({ 
            key, 
            value: typeof value === 'object' ? JSON.stringify(value) : String(value), 
            type: typeof value 
          });
        }
        return entries;
      };
      
      const keyValuePairs = renderSampleData();
      
      return (
        <div className="h-full flex flex-col bg-white">
          {/* Header */}
          <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50">
            <div className="px-4 py-3">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">OUTPUT</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-600 font-medium">📝 Sample Data (no execution yet)</span>
              </div>
            </div>
            <div className="flex border-t border-slate-200 bg-white">
              <button className="flex-1 px-3 py-2 text-xs font-medium border-b-2 border-blue-500 text-blue-600">Schema</button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {keyValuePairs.map((pair, idx) => (
                <div key={idx} className="px-4 py-2 hover:bg-slate-50">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-semibold text-slate-700 min-w-[100px]">{pair.key}</span>
                    <span className="text-xs text-slate-900 font-mono break-all flex-1">{pair.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      // INPUT: Check if node is connected to another node
      const edges = graph?.edges || [];
      const nodes = graph?.nodes || [];
      const nodeId = node?.id;
      
      // Find incoming edges
      const incomingEdges = edges.filter(edge => edge.target === nodeId);
      
      if (incomingEdges.length > 0) {
        // Node is connected - show predecessor's output
        const predecessorNode = nodes.find(n => n.id === incomingEdges[0].source);
        const predecessorData = predecessorNode?.data || {};
        
        // Check if predecessor has execution data
        const predecessorExecutionData = predecessorData.executionData?.output;
        
        let dataToShow;
        let headerMessage;
        
        if (predecessorExecutionData) {
          // Show real execution data from predecessor
          dataToShow = predecessorExecutionData;
          headerMessage = `✅ From "${predecessorData.label || predecessorData.name || 'Previous Node'}" (last execution)`;
        } else {
          // Show sample data from predecessor's node type
          const predecessorSample = {
            'Start': { trigger: 'manual', timestamp: new Date().toISOString() },
            'HTTP Request': { statusCode: 200, body: { message: 'Sample response', data: [1, 2, 3] } },
            'Code': { result: 'Sample output', processed: true },
            'IF': { condition: true, value: 'sample' },
            'Slack': { channel: '#general', message: 'Sample message' },
            'Gmail': { to: 'user@example.com', subject: 'Sample email' },
            'Database': { rows: 5, operation: 'SELECT' },
          };
          const predecessorType = predecessorData.type || 'Unknown';
          dataToShow = predecessorSample[predecessorType] || { sampleData: true, nodeType: predecessorType };
          headerMessage = `📝 Sample from "${predecessorData.label || predecessorData.name || 'Previous Node'}" (no execution yet)`;
        }
        
        return (
          <div className="h-full flex flex-col bg-white">
            <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">INPUT</h3>
              <span className="text-xs text-blue-600 font-medium">{headerMessage}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {Object.entries(dataToShow).map(([key, value]) => (
                  <div key={key} className="border border-slate-200 rounded p-2 bg-slate-50">
                    <div className="text-xs font-semibold text-slate-700 mb-1">{key}</div>
                    <div className="text-xs text-slate-900 font-mono break-all">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      } else {
        // No connection - show sample data for this node type
        const sampleData = generateSampleData();
        
        return (
          <div className="h-full flex flex-col bg-white">
            <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">INPUT</h3>
              <span className="text-xs text-amber-600 font-medium">📝 Sample Data (no incoming connection)</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {Object.entries(sampleData).map(([key, value]) => (
                  <div key={key} className="border border-slate-200 rounded p-2 bg-slate-50">
                    <div className="text-xs font-semibold text-slate-700 mb-1">{key}</div>
                    <div className="text-xs text-slate-900 font-mono break-all">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
    }
  }

  // Get data based on type - executionData has 'input' and 'output' fields from backend
  const rawData = type === 'input' ? executionData.input : executionData.output;
  
  if (!rawData) {
    return (
      <div className="h-full bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center text-slate-400">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm font-semibold">No {type} data</p>
          <p className="text-xs mt-1">
            {type === 'input' 
              ? 'This node receives no input (trigger node or no incoming connections)' 
              : 'This node produced no output'}
          </p>
        </div>
      </div>
    );
  }

  // Convert rawData to items array format
  // The data structure is: rawData is the actual output/input object
  let items = [];
  if (Array.isArray(rawData)) {
    items = rawData.map(item => ({ json: item }));
  } else {
    // Single object, wrap it
    items = [{ json: rawData }];
  }

  const totalItems = items.length;

  if (totalItems === 0) {
    return (
      <div className="h-full bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center text-slate-400">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm font-semibold">Empty data</p>
          <p className="text-xs mt-1">0 items in {type}</p>
        </div>
      </div>
    );
  }

  const currentItem = items[selectedItem] || {};
  const jsonData = currentItem.json || {};

  // Render key-value pairs in a simple list
  const renderKeyValue = (obj, prefix = '') => {
    const entries = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (value === null) {
        entries.push({ key: fullKey, value: 'null', type: 'null' });
      } else if (Array.isArray(value)) {
        entries.push({ key: fullKey, value: `Array(${value.length})`, type: 'array' });
      } else if (typeof value === 'object') {
        entries.push({ key: fullKey, value: '[Object]', type: 'object' });
        // Recursively add nested properties
        const nested = renderKeyValue(value, fullKey);
        entries.push(...nested);
      } else {
        entries.push({ 
          key: fullKey, 
          value: String(value), 
          type: typeof value 
        });
      }
    }
    
    return entries;
  };

  const keyValuePairs = renderKeyValue(jsonData);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50">
        <div className="px-4 py-3">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
            {type === 'input' ? 'INPUT' : 'OUTPUT'}
          </h3>
          
          {/* Item counter */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
            
            {/* Item navigation */}
            {totalItems > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedItem(Math.max(0, selectedItem - 1))}
                  disabled={selectedItem === 0}
                  className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-600"
                  title="Previous item"
                >
                  ◀
                </button>
                <span className="text-xs font-mono text-slate-700 min-w-[60px] text-center">
                  {selectedItem + 1} of {totalItems}
                </span>
                <button
                  onClick={() => setSelectedItem(Math.min(totalItems - 1, selectedItem + 1))}
                  disabled={selectedItem === totalItems - 1}
                  className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-600"
                  title="Next item"
                >
                  ▶
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View tabs - Schema | Table | JSON to match n8n-style layout */}
        <div className="flex border-t border-slate-200 bg-white">
          <button
            onClick={() => setViewMode('schema')}
            className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              viewMode === 'schema'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Schema
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              viewMode === 'table'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              viewMode === 'json'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            JSON
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto bg-white">
        {/* JSON View */}
        {viewMode === 'json' && (
          <div className="p-4">
            <pre className="text-xs font-mono bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto whitespace-pre-wrap break-words">
{JSON.stringify(currentItem, null, 2)}
            </pre>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="p-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-300">
                  <th className="px-3 py-2 text-left font-semibold text-slate-700 border-r border-slate-200 w-10">#</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700 border-r border-slate-200">Key</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Value</th>
                </tr>
              </thead>
              <tbody>
                {keyValuePairs.map((entry, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono text-slate-500 border-r border-slate-200 align-top">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-900 font-medium border-r border-slate-200 align-top">
                      {entry.key}
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-700 break-all align-top">
                      {entry.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Schema View */}
        {viewMode === 'schema' && (
          <div className="p-4">
            <div className="space-y-1">
              {keyValuePairs.map((entry, index) => (
                <div key={index} className="flex items-start gap-2 py-1 px-2 hover:bg-slate-50 rounded text-xs">
                  <span className="text-slate-400 shrink-0">#</span>
                  <span className="text-blue-600 font-mono font-medium flex-1 break-all">
                    {entry.key}
                  </span>
                  <span className="text-slate-400 shrink-0">:</span>
                  <span className="text-purple-600 font-mono shrink-0">
                    {entry.type}
                  </span>
                  <span className="text-slate-400 shrink-0">=</span>
                  <span className="text-slate-700 font-mono truncate max-w-[200px]">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-2">
        <div className="text-xs text-slate-500">
          Viewing item <span className="font-semibold text-slate-700">{selectedItem + 1}</span> of <span className="font-semibold text-slate-700">{totalItems}</span>
        </div>
      </div>
    </div>
  );
}
