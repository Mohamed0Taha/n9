import { useState, useMemo } from 'react';
import { useTheme, THEMES } from '../contexts/ThemeContext.jsx';

/**
 * Simplified NodeDataPanel based on n8n's actual NDV (Node Detail View)
 * This is the working version used in the 3‑panel INPUT / SETTINGS / OUTPUT layout
 */
export default function NodeDataPanel({ node, type = 'input', executionData, graph }) {
  const { theme, isComic } = useTheme();
  // Default to Schema view like the n8n-style spec
  const [viewMode, setViewMode] = useState('schema'); // 'schema' | 'table' | 'json'
  const [selectedItem, setSelectedItem] = useState(0);

  // Theme-based styles
  const styles = useMemo(() => {
    if (isComic) {
      return {
        container: "h-full flex flex-col bg-yellow-50",
        header: "flex-shrink-0 border-b-4 border-black bg-gradient-to-r from-pink-200 to-purple-200",
        headerStyle: { boxShadow: '0px 4px 0px #000' },
        headerTitle: "font-bold text-xs text-black uppercase tracking-wider mb-2",
        headerText: "text-xs font-bold",
        itemCounter: "text-xs text-black font-bold",
        navButton: "p-1 hover:bg-yellow-200 rounded disabled:opacity-30 text-black border-2 border-black",
        navButtonStyle: { boxShadow: '1px 1px 0px #000' },
        navText: "text-xs font-mono text-black font-bold min-w-[60px] text-center",
        tabsContainer: "flex border-t-4 border-black bg-yellow-100",
        tabActive: "flex-1 px-3 py-2 text-xs font-bold border-b-4 border-lime-400 text-black bg-lime-200",
        tabInactive: "flex-1 px-3 py-2 text-xs font-bold border-b-4 border-transparent text-black hover:bg-yellow-200",
        content: "flex-1 overflow-auto bg-yellow-50",
        jsonPre: "text-xs font-mono bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto whitespace-pre-wrap break-words border-3 border-black",
        jsonPreStyle: { boxShadow: '3px 3px 0px #000' },
        keyValueItem: "flex items-start gap-2 py-1 px-2 hover:bg-yellow-100 rounded text-xs border-2 border-black mb-1",
        keyValueItemStyle: { boxShadow: '2px 2px 0px #000' },
        footer: "flex-shrink-0 border-t-4 border-black bg-gradient-to-r from-yellow-200 to-orange-200 px-4 py-2",
        footerStyle: { boxShadow: '0px -4px 0px #000' },
        footerText: "text-xs text-black font-bold",
        emptyContainer: "h-full bg-yellow-50 flex items-center justify-center p-4 border-4 border-black",
        emptyText: "text-center text-black font-bold"
      };
    }

    switch(theme) {
      case THEMES.PROFESSIONAL: return {
        container: "h-full flex flex-col bg-white",
        header: "flex-shrink-0 border-b border-slate-200 bg-slate-50",
        headerStyle: {},
        headerTitle: "font-bold text-xs text-slate-900 uppercase tracking-wider mb-2",
        headerText: "text-xs font-medium",
        itemCounter: "text-xs text-slate-600 font-medium",
        navButton: "p-1 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-600",
        navButtonStyle: {},
        navText: "text-xs font-mono text-slate-700 min-w-[60px] text-center",
        tabsContainer: "flex border-t border-slate-200 bg-white",
        tabActive: "flex-1 px-3 py-2 text-xs font-medium border-b-2 border-blue-500 text-blue-600",
        tabInactive: "flex-1 px-3 py-2 text-xs font-medium border-b-2 border-transparent text-slate-600 hover:text-slate-900",
        content: "flex-1 overflow-auto bg-white",
        jsonPre: "text-xs font-mono bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto whitespace-pre-wrap break-words",
        jsonPreStyle: {},
        keyValueItem: "flex items-start gap-2 py-1 px-2 hover:bg-slate-50 rounded text-xs",
        keyValueItemStyle: {},
        footer: "flex-shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-2",
        footerStyle: {},
        footerText: "text-xs text-slate-500",
        emptyContainer: "h-full bg-slate-50 flex items-center justify-center p-4",
        emptyText: "text-center text-slate-400"
      };

      case THEMES.HACKER: return {
        container: "h-full flex flex-col bg-black",
        header: "flex-shrink-0 border-b border-green-900 bg-black",
        headerStyle: {},
        headerTitle: "font-bold text-xs text-green-500 uppercase tracking-wider mb-2 font-mono",
        headerText: "text-xs font-bold font-mono",
        itemCounter: "text-xs text-green-400 font-bold font-mono",
        navButton: "p-1 hover:bg-green-900/20 rounded disabled:opacity-30 text-green-500 border border-green-700",
        navButtonStyle: {},
        navText: "text-xs font-mono text-green-400 font-bold min-w-[60px] text-center",
        tabsContainer: "flex border-t border-green-900 bg-green-900/10",
        tabActive: "flex-1 px-3 py-2 text-xs font-bold border-b-2 border-green-500 text-green-400 font-mono",
        tabInactive: "flex-1 px-3 py-2 text-xs font-bold border-b-2 border-transparent text-green-600 hover:text-green-400 font-mono",
        content: "flex-1 overflow-auto bg-black",
        jsonPre: "text-xs font-mono bg-black text-green-400 p-4 rounded-lg overflow-auto whitespace-pre-wrap break-words border border-green-700",
        jsonPreStyle: {},
        keyValueItem: "flex items-start gap-2 py-1 px-2 hover:bg-green-900/20 rounded text-xs",
        keyValueItemStyle: {},
        footer: "flex-shrink-0 border-t border-green-900 bg-black px-4 py-2",
        footerStyle: {},
        footerText: "text-xs text-green-600 font-mono",
        emptyContainer: "h-full bg-black flex items-center justify-center p-4 border border-green-900",
        emptyText: "text-center text-green-600 font-mono"
      };

      case THEMES.TERMINAL: return {
        container: "h-full flex flex-col bg-slate-950",
        header: "flex-shrink-0 border-b border-amber-900 bg-slate-950",
        headerStyle: {},
        headerTitle: "font-bold text-xs text-amber-500 uppercase tracking-wider mb-2 font-mono",
        headerText: "text-xs font-bold font-mono",
        itemCounter: "text-xs text-amber-400 font-bold font-mono",
        navButton: "p-1 hover:bg-amber-900/20 rounded disabled:opacity-30 text-amber-500 border border-amber-700",
        navButtonStyle: {},
        navText: "text-xs font-mono text-amber-400 font-bold min-w-[60px] text-center",
        tabsContainer: "flex border-t border-amber-900 bg-amber-900/10",
        tabActive: "flex-1 px-3 py-2 text-xs font-bold border-b-2 border-amber-500 text-amber-400 font-mono",
        tabInactive: "flex-1 px-3 py-2 text-xs font-bold border-b-2 border-transparent text-amber-600 hover:text-amber-400 font-mono",
        content: "flex-1 overflow-auto bg-slate-950",
        jsonPre: "text-xs font-mono bg-slate-950 text-amber-400 p-4 rounded-lg overflow-auto whitespace-pre-wrap break-words border border-amber-700",
        jsonPreStyle: {},
        keyValueItem: "flex items-start gap-2 py-1 px-2 hover:bg-amber-900/20 rounded text-xs",
        keyValueItemStyle: {},
        footer: "flex-shrink-0 border-t border-amber-900 bg-slate-950 px-4 py-2",
        footerStyle: {},
        footerText: "text-xs text-amber-600 font-mono",
        emptyContainer: "h-full bg-slate-950 flex items-center justify-center p-4 border border-amber-900",
        emptyText: "text-center text-amber-600 font-mono"
      };

      case THEMES.DARK: return {
        container: "h-full flex flex-col bg-gray-800",
        header: "flex-shrink-0 border-b border-gray-700 bg-gray-800",
        headerStyle: {},
        headerTitle: "font-bold text-xs text-gray-100 uppercase tracking-wider mb-2",
        headerText: "text-xs font-medium",
        itemCounter: "text-xs text-gray-300 font-medium",
        navButton: "p-1 hover:bg-gray-700 rounded disabled:opacity-30 text-gray-300",
        navButtonStyle: {},
        navText: "text-xs font-mono text-gray-200 min-w-[60px] text-center",
        tabsContainer: "flex border-t border-gray-700 bg-gray-900",
        tabActive: "flex-1 px-3 py-2 text-xs font-medium border-b-2 border-blue-500 text-blue-400",
        tabInactive: "flex-1 px-3 py-2 text-xs font-medium border-b-2 border-transparent text-gray-400 hover:text-gray-200",
        content: "flex-1 overflow-auto bg-gray-900",
        jsonPre: "text-xs font-mono bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto whitespace-pre-wrap break-words border border-gray-700",
        jsonPreStyle: {},
        keyValueItem: "flex items-start gap-2 py-1 px-2 hover:bg-gray-800 rounded text-xs",
        keyValueItemStyle: {},
        footer: "flex-shrink-0 border-t border-gray-700 bg-gray-800 px-4 py-2",
        footerStyle: {},
        footerText: "text-xs text-gray-400",
        emptyContainer: "h-full bg-gray-900 flex items-center justify-center p-4",
        emptyText: "text-center text-gray-400"
      };

      default: return {
        container: "h-full flex flex-col bg-white",
        header: "flex-shrink-0 border-b border-slate-200 bg-slate-50",
        headerStyle: {},
        headerTitle: "font-bold text-xs text-slate-900 uppercase tracking-wider mb-2",
        headerText: "text-xs font-medium",
        itemCounter: "text-xs text-slate-600 font-medium",
        navButton: "p-1 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-600",
        navButtonStyle: {},
        navText: "text-xs font-mono text-slate-700 min-w-[60px] text-center",
        tabsContainer: "flex border-t border-slate-200 bg-white",
        tabActive: "flex-1 px-3 py-2 text-xs font-medium border-b-2 border-blue-500 text-blue-600",
        tabInactive: "flex-1 px-3 py-2 text-xs font-medium border-b-2 border-transparent text-slate-600 hover:text-slate-900",
        content: "flex-1 overflow-auto bg-white",
        jsonPre: "text-xs font-mono bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto whitespace-pre-wrap break-words",
        jsonPreStyle: {},
        keyValueItem: "flex items-start gap-2 py-1 px-2 hover:bg-slate-50 rounded text-xs",
        keyValueItemStyle: {},
        footer: "flex-shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-2",
        footerStyle: {},
        footerText: "text-xs text-slate-500",
        emptyContainer: "h-full bg-slate-50 flex items-center justify-center p-4",
        emptyText: "text-center text-slate-400"
      };
    }
  }, [theme, isComic]);

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
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header} style={styles.headerStyle}>
            <div className="px-4 py-3">
              <h3 className={styles.headerTitle}>OUTPUT</h3>
              <div className="flex items-center justify-between">
                <span className={`${styles.headerText} ${isComic ? 'text-orange-600' : theme === THEMES.PROFESSIONAL ? 'text-amber-600' : theme === THEMES.HACKER ? 'text-green-600' : theme === THEMES.TERMINAL ? 'text-amber-600' : 'text-amber-500'}`}>📝 Sample Data (no execution yet)</span>
              </div>
            </div>
            <div className={styles.tabsContainer}>
              <button className={styles.tabActive}>Schema</button>
            </div>
          </div>
          
          {/* Content */}
          <div className={styles.content}>
            <div className="p-4 space-y-1">
              {keyValuePairs.map((pair, idx) => (
                <div key={idx} className={styles.keyValueItem} style={styles.keyValueItemStyle}>
                  <span className={`${isComic ? 'text-black font-bold' : theme === THEMES.PROFESSIONAL ? 'text-slate-700 font-semibold' : theme === THEMES.HACKER ? 'text-green-500 font-bold' : theme === THEMES.TERMINAL ? 'text-amber-500 font-bold' : 'text-gray-300 font-semibold'} min-w-[100px] text-xs`}>{pair.key}</span>
                  <span className={`${isComic ? 'text-black' : theme === THEMES.PROFESSIONAL ? 'text-slate-900' : theme === THEMES.HACKER ? 'text-green-400' : theme === THEMES.TERMINAL ? 'text-amber-400' : 'text-gray-200'} font-mono break-all flex-1 text-xs`}>{pair.value}</span>
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
          <div className={styles.container}>
            <div className={styles.header} style={styles.headerStyle}>
              <div className="px-4 py-3">
                <h3 className={styles.headerTitle}>INPUT</h3>
                <span className={`${styles.headerText} ${isComic ? 'text-blue-600' : theme === THEMES.PROFESSIONAL ? 'text-blue-600' : theme === THEMES.HACKER ? 'text-green-500' : theme === THEMES.TERMINAL ? 'text-amber-500' : 'text-blue-400'}`}>{headerMessage}</span>
              </div>
            </div>
            <div className={styles.content}>
              <div className="p-4 space-y-2">
                {Object.entries(dataToShow).map(([key, value]) => (
                  <div key={key} className={styles.keyValueItem} style={styles.keyValueItemStyle}>
                    <div className="w-full">
                      <div className={`${isComic ? 'text-black font-bold' : theme === THEMES.PROFESSIONAL ? 'text-slate-700 font-semibold' : theme === THEMES.HACKER ? 'text-green-500 font-bold' : theme === THEMES.TERMINAL ? 'text-amber-500 font-bold' : 'text-gray-300 font-semibold'} text-xs mb-1`}>{key}</div>
                      <div className={`${isComic ? 'text-black' : theme === THEMES.PROFESSIONAL ? 'text-slate-900' : theme === THEMES.HACKER ? 'text-green-400' : theme === THEMES.TERMINAL ? 'text-amber-400' : 'text-gray-200'} font-mono break-all text-xs`}>
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
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
          <div className={styles.container}>
            <div className={styles.header} style={styles.headerStyle}>
              <div className="px-4 py-3">
                <h3 className={styles.headerTitle}>INPUT</h3>
                <span className={`${styles.headerText} ${isComic ? 'text-orange-600' : theme === THEMES.PROFESSIONAL ? 'text-amber-600' : theme === THEMES.HACKER ? 'text-green-600' : theme === THEMES.TERMINAL ? 'text-amber-600' : 'text-amber-500'}`}>📝 Sample Data (no incoming connection)</span>
              </div>
            </div>
            <div className={styles.content}>
              <div className="p-4 space-y-2">
                {Object.entries(sampleData).map(([key, value]) => (
                  <div key={key} className={styles.keyValueItem} style={styles.keyValueItemStyle}>
                    <div className="w-full">
                      <div className={`${isComic ? 'text-black font-bold' : theme === THEMES.PROFESSIONAL ? 'text-slate-700 font-semibold' : theme === THEMES.HACKER ? 'text-green-500 font-bold' : theme === THEMES.TERMINAL ? 'text-amber-500 font-bold' : 'text-gray-300 font-semibold'} text-xs mb-1`}>{key}</div>
                      <div className={`${isComic ? 'text-black' : theme === THEMES.PROFESSIONAL ? 'text-slate-900' : theme === THEMES.HACKER ? 'text-green-400' : theme === THEMES.TERMINAL ? 'text-amber-400' : 'text-gray-200'} font-mono break-all text-xs`}>
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
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
      <div className={styles.emptyContainer}>
        <div className={styles.emptyText}>
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
      <div className={styles.emptyContainer}>
        <div className={styles.emptyText}>
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
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header} style={styles.headerStyle}>
        <div className="px-4 py-3">
          <h3 className={styles.headerTitle}>
            {type === 'input' ? 'INPUT' : 'OUTPUT'}
          </h3>
          
          {/* Item counter */}
          <div className="flex items-center justify-between">
            <span className={styles.itemCounter}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
            
            {/* Item navigation */}
            {totalItems > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedItem(Math.max(0, selectedItem - 1))}
                  disabled={selectedItem === 0}
                  className={styles.navButton}
                  style={styles.navButtonStyle}
                  title="Previous item"
                >
                  ◀
                </button>
                <span className={styles.navText}>
                  {selectedItem + 1} of {totalItems}
                </span>
                <button
                  onClick={() => setSelectedItem(Math.min(totalItems - 1, selectedItem + 1))}
                  disabled={selectedItem === totalItems - 1}
                  className={styles.navButton}
                  style={styles.navButtonStyle}
                  title="Next item"
                >
                  ▶
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View tabs - Schema | Table | JSON to match n8n-style layout */}
        <div className={styles.tabsContainer}>
          <button
            onClick={() => setViewMode('schema')}
            className={viewMode === 'schema' ? styles.tabActive : styles.tabInactive}
          >
            Schema
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? styles.tabActive : styles.tabInactive}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={viewMode === 'json' ? styles.tabActive : styles.tabInactive}
          >
            JSON
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className={styles.content}>
        {/* JSON View */}
        {viewMode === 'json' && (
          <div className="p-4">
            <pre className={styles.jsonPre} style={styles.jsonPreStyle}>
{JSON.stringify(currentItem, null, 2)}
            </pre>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="p-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className={isComic ? "bg-yellow-100 border-b-4 border-black" : theme === THEMES.PROFESSIONAL ? "bg-slate-50 border-b-2 border-slate-300" : theme === THEMES.HACKER ? "bg-green-900/20 border-b-2 border-green-700" : theme === THEMES.TERMINAL ? "bg-amber-900/20 border-b-2 border-amber-700" : "bg-gray-800 border-b-2 border-gray-600"}>
                  <th className={`px-3 py-2 text-left font-semibold w-10 ${isComic ? "text-black border-r-2 border-black" : theme === THEMES.PROFESSIONAL ? "text-slate-700 border-r border-slate-200" : theme === THEMES.HACKER ? "text-green-500 border-r border-green-800 font-mono" : theme === THEMES.TERMINAL ? "text-amber-500 border-r border-amber-800 font-mono" : "text-gray-300 border-r border-gray-700"}`}>#</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isComic ? "text-black border-r-2 border-black" : theme === THEMES.PROFESSIONAL ? "text-slate-700 border-r border-slate-200" : theme === THEMES.HACKER ? "text-green-500 border-r border-green-800 font-mono" : theme === THEMES.TERMINAL ? "text-amber-500 border-r border-amber-800 font-mono" : "text-gray-300 border-r border-gray-700"}`}>Key</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isComic ? "text-black" : theme === THEMES.PROFESSIONAL ? "text-slate-700" : theme === THEMES.HACKER ? "text-green-500 font-mono" : theme === THEMES.TERMINAL ? "text-amber-500 font-mono" : "text-gray-300"}`}>Value</th>
                </tr>
              </thead>
              <tbody>
                {keyValuePairs.map((entry, index) => (
                  <tr key={index} className={isComic ? "border-b-2 border-black hover:bg-yellow-100" : theme === THEMES.PROFESSIONAL ? "border-b border-slate-100 hover:bg-slate-50" : theme === THEMES.HACKER ? "border-b border-green-900 hover:bg-green-900/10" : theme === THEMES.TERMINAL ? "border-b border-amber-900 hover:bg-amber-900/10" : "border-b border-gray-700 hover:bg-gray-800"}>
                    <td className={`px-3 py-2 font-mono align-top ${isComic ? "text-gray-600 border-r-2 border-black" : theme === THEMES.PROFESSIONAL ? "text-slate-500 border-r border-slate-200" : theme === THEMES.HACKER ? "text-green-600 border-r border-green-800" : theme === THEMES.TERMINAL ? "text-amber-600 border-r border-amber-800" : "text-gray-500 border-r border-gray-700"}`}>
                      {index + 1}
                    </td>
                    <td className={`px-3 py-2 font-mono font-medium align-top ${isComic ? "text-black border-r-2 border-black" : theme === THEMES.PROFESSIONAL ? "text-slate-900 border-r border-slate-200" : theme === THEMES.HACKER ? "text-green-400 border-r border-green-800" : theme === THEMES.TERMINAL ? "text-amber-400 border-r border-amber-800" : "text-gray-200 border-r border-gray-700"}`}>
                      {entry.key}
                    </td>
                    <td className={`px-3 py-2 font-mono break-all align-top ${isComic ? "text-black" : theme === THEMES.PROFESSIONAL ? "text-slate-700" : theme === THEMES.HACKER ? "text-green-300" : theme === THEMES.TERMINAL ? "text-amber-300" : "text-gray-300"}`}>
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
                <div key={index} className={styles.keyValueItem} style={styles.keyValueItemStyle}>
                  <span className={isComic ? "text-gray-600 shrink-0" : theme === THEMES.PROFESSIONAL ? "text-slate-400 shrink-0" : theme === THEMES.HACKER ? "text-green-700 shrink-0" : theme === THEMES.TERMINAL ? "text-amber-700 shrink-0" : "text-gray-500 shrink-0"}>#</span>
                  <span className={`${isComic ? "text-blue-600" : theme === THEMES.PROFESSIONAL ? "text-blue-600" : theme === THEMES.HACKER ? "text-green-500" : theme === THEMES.TERMINAL ? "text-amber-500" : "text-blue-400"} font-mono font-medium flex-1 break-all`}>
                    {entry.key}
                  </span>
                  <span className={isComic ? "text-gray-600 shrink-0" : theme === THEMES.PROFESSIONAL ? "text-slate-400 shrink-0" : theme === THEMES.HACKER ? "text-green-700 shrink-0" : theme === THEMES.TERMINAL ? "text-amber-700 shrink-0" : "text-gray-500 shrink-0"}>:</span>
                  <span className={`${isComic ? "text-purple-600" : theme === THEMES.PROFESSIONAL ? "text-purple-600" : theme === THEMES.HACKER ? "text-green-400" : theme === THEMES.TERMINAL ? "text-amber-400" : "text-purple-400"} font-mono shrink-0`}>
                    {entry.type}
                  </span>
                  <span className={isComic ? "text-gray-600 shrink-0" : theme === THEMES.PROFESSIONAL ? "text-slate-400 shrink-0" : theme === THEMES.HACKER ? "text-green-700 shrink-0" : theme === THEMES.TERMINAL ? "text-amber-700 shrink-0" : "text-gray-500 shrink-0"}>=</span>
                  <span className={`${isComic ? "text-black" : theme === THEMES.PROFESSIONAL ? "text-slate-700" : theme === THEMES.HACKER ? "text-green-300" : theme === THEMES.TERMINAL ? "text-amber-300" : "text-gray-200"} font-mono truncate max-w-[200px]`}>
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className={styles.footer} style={styles.footerStyle}>
        <div className={styles.footerText}>
          Viewing item <span className={isComic ? "font-bold text-black" : theme === THEMES.PROFESSIONAL ? "font-semibold text-slate-700" : theme === THEMES.HACKER ? "font-bold text-green-400" : theme === THEMES.TERMINAL ? "font-bold text-amber-400" : "font-semibold text-gray-200"}>{selectedItem + 1}</span> of <span className={isComic ? "font-bold text-black" : theme === THEMES.PROFESSIONAL ? "font-semibold text-slate-700" : theme === THEMES.HACKER ? "font-bold text-green-400" : theme === THEMES.TERMINAL ? "font-bold text-amber-400" : "font-semibold text-gray-200"}>{totalItems}</span>
        </div>
      </div>
    </div>
  );
}
