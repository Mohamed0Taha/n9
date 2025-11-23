import { Handle, Position } from 'reactflow';
import { getNodeConfiguration } from '../data/nodeConfigurations.js';
import { useTheme, THEMES } from '../contexts/ThemeContext.jsx';
import { useMemo } from 'react';

const N8nStyleNode = ({ data, selected, id, onOpenSettings }) => {
  const { theme, isComic } = useTheme();
  const isBundle = data.isBundle || Array.isArray(data.bundledNodes);
  const nodeName = data.label || data.name || 'Node';
  const nodeType = data.type || nodeName; // Get the node type for configuration lookup
  
  // Theme-based styles configuration
  const themeStyles = useMemo(() => {
    if (isComic) {
        return {
            container: `border-4 border-black ${isBundle ? 'rounded-2xl' : 'rounded-lg bg-white'}`,
            style: { 
                boxShadow: '4px 4px 0px #000', 
                fontFamily: "'Comic Neue', cursive" 
            },
            header: `border-b-3 border-black`,
            headerBg: (gradient) => ({}), // Use gradient class
            iconWrapper: "bg-white border-3 border-black shadow-lg",
            titleFont: "font-bold text-sm truncate text-white drop-shadow-lg",
            titleStyle: { fontFamily: "'Comic Neue', cursive", textShadow: '1px 1px 2px rgba(0,0,0,0.5)' },
            categoryText: "text-xs text-white font-semibold truncate",
            settingsBtn: "bg-white border-3 border-black hover:bg-yellow-200",
            body: "bg-white/90",
            textMain: "text-slate-900",
            textDim: "text-slate-500",
            handle: "!bg-slate-400 !border-2 !border-white hover:!bg-blue-500",
            triggerBtn: "tactile-button bg-gradient-to-r from-lime-400 to-emerald-400 text-black border-3 border-black",
            triggerBtnStyle: { boxShadow: '3px 3px 0px #000', fontFamily: "'Bangers', cursive", letterSpacing: '1px' },
            bundleGradient: 'linear-gradient(to bottom, #22c55e 0%, #22c55e 16%, #eab308 16%, #eab308 32%, #f97316 32%, #f97316 48%, #ef4444 48%, #ef4444 64%, #a855f7 64%, #a855f7 80%, #3b82f6 80%, #3b82f6 100%)'
        };
    }

    switch(theme) {
        case THEMES.HACKER: return {
            container: `border border-green-500 ${isBundle ? 'rounded-lg' : 'rounded-sm bg-black'}`,
            style: { 
                boxShadow: '0 0 15px rgba(0, 255, 0, 0.1)', 
                fontFamily: 'monospace' 
            },
            header: "border-b border-green-900 bg-black",
            headerBg: (gradient) => ({ background: '#000' }), // Override gradient
            iconWrapper: "bg-black border border-green-500 text-green-500",
            titleFont: "font-bold text-sm truncate text-green-500",
            titleStyle: { fontFamily: 'monospace' },
            categoryText: "text-xs text-green-700 font-mono",
            settingsBtn: "bg-black border border-green-700 text-green-500 hover:bg-green-900/30",
            body: "bg-black",
            textMain: "text-green-400",
            textDim: "text-green-700",
            handle: "!bg-black !border !border-green-500 hover:!bg-green-500",
            triggerBtn: "bg-green-900/30 text-green-500 border border-green-500 hover:bg-green-900/50",
            triggerBtnStyle: { fontFamily: 'monospace' },
            bundleGradient: 'linear-gradient(to bottom, #052e16 0%, #14532d 100%)'
        };
        case THEMES.TERMINAL: return {
            container: `border border-amber-600 ${isBundle ? 'rounded-lg' : 'rounded-sm bg-slate-950'}`,
            style: { 
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.1)', 
                fontFamily: 'monospace' 
            },
            header: "border-b border-amber-900 bg-slate-950",
            headerBg: (gradient) => ({ background: '#020617' }),
            iconWrapper: "bg-slate-950 border border-amber-600 text-amber-500",
            titleFont: "font-bold text-sm truncate text-amber-500",
            titleStyle: { fontFamily: 'monospace' },
            categoryText: "text-xs text-amber-700 font-mono",
            settingsBtn: "bg-slate-950 border border-amber-700 text-amber-500 hover:bg-amber-900/30",
            body: "bg-slate-950",
            textMain: "text-amber-500",
            textDim: "text-amber-800",
            handle: "!bg-slate-950 !border !border-amber-600 hover:!bg-amber-600",
            triggerBtn: "bg-amber-900/30 text-amber-500 border border-amber-600 hover:bg-amber-900/50",
            triggerBtnStyle: { fontFamily: 'monospace' },
            bundleGradient: 'linear-gradient(to bottom, #451a03 0%, #78350f 100%)'
        };
        case THEMES.DARK: return {
            container: `border border-gray-600 ${isBundle ? 'rounded-xl' : 'rounded-lg bg-gray-800'}`,
            style: { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' },
            header: "border-b border-gray-700 bg-gray-900",
            headerBg: (gradient) => ({}), // Use gradient but maybe dimmed?
            iconWrapper: "bg-gray-800 border border-gray-600 text-gray-200 shadow-md",
            titleFont: "font-semibold text-sm truncate text-gray-100",
            titleStyle: {},
            categoryText: "text-xs text-gray-400 font-medium",
            settingsBtn: "bg-gray-800 border border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white",
            body: "bg-gray-800",
            textMain: "text-gray-200",
            textDim: "text-gray-500",
            handle: "!bg-gray-600 !border-2 !border-gray-800 hover:!bg-blue-500",
            triggerBtn: "bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 rounded",
            triggerBtnStyle: {},
            bundleGradient: 'linear-gradient(to bottom, #1e3a8a 0%, #172554 100%)'
        };
        default: // PROFESSIONAL
            return {
                container: `border border-slate-200 ${isBundle ? 'rounded-xl' : 'rounded-lg bg-white'} shadow-sm`,
                style: { boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' },
                header: "border-b border-slate-100",
                headerBg: (gradient) => ({}),
                iconWrapper: "bg-white border border-slate-200 text-slate-700 shadow-sm",
                titleFont: "font-semibold text-sm truncate text-slate-700",
                titleStyle: {},
                categoryText: "text-xs text-slate-500 font-medium",
                settingsBtn: "bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600",
                body: "bg-white",
                textMain: "text-slate-700",
                textDim: "text-slate-400",
                handle: "!bg-slate-400 !border-2 !border-white hover:!bg-blue-500",
                triggerBtn: "bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 rounded shadow-sm",
                triggerBtnStyle: {},
                bundleGradient: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)'
            };
    }
  }, [theme, isComic, isBundle]);

  // Node-specific styling based on type (like n8n)
  const getNodeStyle = (type) => {
    const styles = {
      'Start': { color: '#10b981', icon: '▶️', bgGradient: 'from-emerald-400 to-emerald-500' },
      'HTTP Request': { color: '#3b82f6', icon: '🌐', bgGradient: 'from-blue-400 to-blue-500' },
      'Webhook': { color: '#8b5cf6', icon: '🪝', bgGradient: 'from-violet-400 to-violet-500' },
      'Code': { color: '#f59e0b', icon: '⚙️', bgGradient: 'from-amber-400 to-amber-500' },
      'IF': { color: '#14b8a6', icon: '🔀', bgGradient: 'from-teal-400 to-teal-500' },
      'Switch': { color: '#06b6d4', icon: '🎚️', bgGradient: 'from-cyan-400 to-cyan-500' },
      'Merge': { color: '#a855f7', icon: '🔗', bgGradient: 'from-purple-400 to-purple-500' },
      'Split': { color: '#ec4899', icon: '✂️', bgGradient: 'from-pink-400 to-pink-500' },
      'Slack': { color: '#e01e5a', icon: '💬', bgGradient: 'from-rose-500 to-rose-600' },
      'Discord': { color: '#5865f2', icon: '🎮', bgGradient: 'from-indigo-500 to-indigo-600' },
      'Gmail': { color: '#ea4335', icon: '📧', bgGradient: 'from-red-500 to-red-600' },
      'Telegram': { color: '#0088cc', icon: '✈️', bgGradient: 'from-sky-500 to-sky-600' },
      'OpenAI': { color: '#10a37f', icon: '🤖', bgGradient: 'from-emerald-500 to-emerald-600' },
      'Database': { color: '#7c3aed', icon: '🗄️', bgGradient: 'from-violet-600 to-violet-700' },
    };
    return styles[type] || { color: data.color || '#64748b', icon: data.icon || '⚙️', bgGradient: 'from-slate-400 to-slate-500' };
  };
  
  const nodeStyle = getNodeStyle(nodeType);
  const nodeColor = isBundle ? '#f97316' : nodeStyle.color;
  const nodeIcon = isBundle ? '📦' : nodeStyle.icon;
  const nodeBgGradient = nodeStyle.bgGradient;
  
  // Execution status from real-time data
  const executionStatus = data.executionStatus;
  const isExecuting = executionStatus === 'running';
  const hasExecuted = executionStatus === 'success';
  const hasError = executionStatus === 'error' || executionStatus === 'failed';
  const executionTime = data.executionTime;
  const executionData = data.executionData;
  
  // DEBUG: Log execution status for this node
  if (executionStatus) {
    console.log(`🎨 N8nStyleNode [${id}] rendering with status:`, executionStatus, {
      isExecuting,
      hasExecuted,
      hasError,
      nodeName
    });
  }

  // Get node configuration to determine inputs/outputs
  const nodeConfig = getNodeConfiguration(nodeName, nodeType, data.category);
  const inputs = nodeConfig?.inputs || [{ type: 'main', required: false }];
  const outputs = nodeConfig?.outputs || [{ type: 'main', label: 'Output' }];

  // Helper function to render handles
  const renderHandles = () => {
    const handles = [];

    // Render input handles with labels
    inputs.forEach((input, index) => {
      if (input.type === 'main') {
        const leftPos = inputs.length === 1 ? '50%' : `${(index + 1) * 100 / (inputs.length + 1)}%`;
        const inputLabel = input.label || (inputs.length > 1 ? `Input ${index + 1}` : 'INPUT');
        
        handles.push(
          <div key={`input-wrapper-${index}`} style={{ position: 'absolute', top: -32, left: leftPos, transform: 'translateX(-50%)', zIndex: 1000 }}>
            {/* Connection circle (on top, outer side) */}
            <Handle
              type="target"
              position={Position.Top}
              id={`input-${index}`}
              style={{ 
                position: 'relative',
                width: '14px',
                height: '14px',
                left: '50%',
                transform: 'translateX(-50%)',
                cursor: 'crosshair',
                marginBottom: '0px',
                zIndex: 1001,
                ...(isComic ? { border: '3px solid #000', backgroundColor: '#bef264', boxShadow: '2px 2px 0px #000' } : {}),
                ...(!isComic ? { borderRadius: '50%' } : { borderRadius: '50%' })
              }}
              className={themeStyles.handle}
            />
            {/* Label (below circle, touching) */}
            <div 
              style={{ 
                borderRadius: isComic ? '4px' : '2px',
                border: isComic ? '3px solid #000' : theme === THEMES.HACKER || theme === THEMES.TERMINAL ? '1px solid currentColor' : '1px solid #e2e8f0',
                boxShadow: isComic ? '2px 2px 0px #000' : 'none',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                backgroundColor: isComic ? '#bef264' : theme === THEMES.HACKER ? '#000' : theme === THEMES.TERMINAL ? '#020617' : '#fff',
                color: isComic ? '#000' : theme === THEMES.HACKER ? '#4ade80' : theme === THEMES.TERMINAL ? '#f59e0b' : '#1e293b',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                marginTop: '-3px',
              }}
            >
              {inputLabel}
            </div>
          </div>
        );
      }
    });

    // Render output handles with labels
    outputs.forEach((output, index) => {
      if (output.type === 'main') {
        const leftPos = outputs.length === 1 ? '50%' : `${(index + 1) * 100 / (outputs.length + 1)}%`;
        const outputLabel = output.label || (outputs.length > 1 ? `Output ${index}` : 'OUTPUT');
        
        handles.push(
          <div key={`output-wrapper-${index}`} style={{ position: 'absolute', bottom: -32, left: leftPos, transform: 'translateX(-50%)', zIndex: 1000 }}>
            {/* Label (above circle, touching) */}
            <div 
              style={{ 
                borderRadius: isComic ? '4px' : '2px',
                border: isComic ? '3px solid #000' : theme === THEMES.HACKER || theme === THEMES.TERMINAL ? '1px solid currentColor' : '1px solid #e2e8f0',
                boxShadow: isComic ? '2px 2px 0px #000' : 'none',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                backgroundColor: isComic ? '#67e8f9' : theme === THEMES.HACKER ? '#000' : theme === THEMES.TERMINAL ? '#020617' : '#fff',
                color: isComic ? '#000' : theme === THEMES.HACKER ? '#4ade80' : theme === THEMES.TERMINAL ? '#f59e0b' : '#1e293b',
                whiteSpace: 'nowrap',
                marginBottom: '-3px',
                pointerEvents: 'none',
              }}
            >
              {outputLabel}
            </div>
            {/* Connection circle (on bottom, outer side) */}
            <Handle
              type="source"
              position={Position.Bottom}
              id={`output-${index}`}
              style={{ 
                position: 'relative',
                width: '14px',
                height: '14px',
                left: '50%',
                transform: 'translateX(-50%)',
                cursor: 'crosshair',
                zIndex: 1001,
                ...(isComic ? { border: '3px solid #000', backgroundColor: '#67e8f9', boxShadow: '2px 2px 0px #000' } : {}),
                ...(!isComic ? { borderRadius: '50%' } : { borderRadius: '50%' })
              }}
              className={themeStyles.handle}
            />
          </div>
        );
      }
    });

    return handles;
  };

  return (
    <>
      {renderHandles()}
      <div
        className={`relative ${isBundle ? 'cursor-pointer' : 'cursor-move'} ${themeStyles.container} ${
          isExecuting
            ? 'border-blue-500 animate-pulse'
            : selected
            ? isComic ? 'border-lime-400' : 'border-blue-500 ring-2 ring-blue-200'
            : hasError
            ? 'border-red-500'
            : ''
        }`}
        title={isBundle ? 'Double-click to unzip bundle' : undefined}
        onDoubleClick={(e) => {
          if (isBundle) {
            console.log('🖱️ Bundle node double-clicked directly!', data.label);
          }
        }}
        style={{
          minWidth: '200px',
          maxWidth: '240px',
          ...themeStyles.style,
          ...(isExecuting ? { boxShadow: '0 0 20px 5px rgba(59, 130, 246, 0.8)' } : {}),
          zIndex: 10,
          backgroundImage: isBundle
            ? themeStyles.bundleGradient
            : undefined,
          overflow: isBundle ? 'hidden' : undefined,
          pointerEvents: 'auto',
        }}
      >
        {/* Header with icon and name */}
        <div 
          className={`flex items-center gap-3 px-4 py-3 ${themeStyles.header} ${!isBundle ? (isComic ? `bg-gradient-to-r ${nodeBgGradient}` : '') : ''}`}
          style={
            isBundle
              ? {
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  borderTopLeftRadius: '14px',
                  borderTopRightRadius: '14px',
                }
              : themeStyles.headerBg(nodeBgGradient)
          }
        >
          <div
            className={`flex items-center justify-center ${
              isBundle ? 'w-12 h-12' : 'w-14 h-14'
            } rounded-xl text-3xl flex-shrink-0 relative ${themeStyles.iconWrapper}`}
          >
            {isBundle ? (
              <svg className="w-10 h-10" viewBox="0 0 64 64" fill="none">
                <g>
                  <rect x="8" y="10" width="48" height="7" rx="1" fill="#22c55e" />
                  <rect x="8" y="18" width="48" height="7" rx="1" fill="#eab308" />
                  <rect x="8" y="26" width="48" height="7" rx="1" fill="#f97316" />
                  <rect x="8" y="34" width="48" height="7" rx="1" fill="#ef4444" />
                  <rect x="8" y="42" width="48" height="7" rx="1" fill="#a855f7" />
                  <rect x="8" y="50" width="48" height="7" rx="1" fill="#3b82f6" />
                </g>
                <g>
                  <rect x="6" y="26" width="52" height="12" rx="2" fill="#d97706" />
                  <rect x="26" y="28" width="12" height="8" rx="1" fill="#e5e5e5" stroke="#737373" strokeWidth="1" />
                  <rect x="28" y="29.5" width="8" height="5" rx="0.5" fill="none" stroke="#525252" strokeWidth="1" />
                  <circle cx="32" cy="32" r="1" fill="#404040" />
                  <rect x="30" y="31.5" width="4" height="1" rx="0.5" fill="#525252" />
                </g>
              </svg>
            ) : (
              nodeIcon
            )}
            
            {/* Spinner overlay when executing */}
            {isExecuting && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500/95 rounded-xl border-2 border-blue-700">
                <svg className="animate-spin h-10 w-10 text-white drop-shadow-lg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            
            {/* Success checkmark */}
            {hasExecuted && !isExecuting && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-black" style={{ boxShadow: '2px 2px 0px #000' }}>
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {/* Error indicator */}
            {hasError && !isExecuting && (
              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 border-2 border-black" style={{ boxShadow: '2px 2px 0px #000' }}>
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className={themeStyles.titleFont} style={themeStyles.titleStyle}>
              {nodeName.toUpperCase()}
            </div>
            {data.category && !isBundle && (
              <div className={themeStyles.categoryText}>
                {data.category}
              </div>
            )}
          </div>
          
          {/* Settings button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenSettings) {
                onOpenSettings({ id, data });
              }
            }}
            className={`p-2 rounded-lg transition-colors ${themeStyles.settingsBtn}`}
            style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
            title="Configure node"
          >
            <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Body - Parameters/Settings Preview / Bundle contents / Trigger Button */}
        <div className={`px-4 py-3 ${themeStyles.body}`}>
          {nodeName === 'Manual Trigger' || nodeType === 'Manual Trigger' ? (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Trigger the workflow execution
                  const executeBtn = document.querySelector('[data-execute-workflow]');
                  if (executeBtn) {
                    console.log('🎬 Manual Trigger button clicked - executing workflow');
                    executeBtn.click();
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg font-bold transition-colors ${themeStyles.triggerBtn}`}
                style={themeStyles.triggerBtnStyle}
              >
                <span className="flex items-center justify-center gap-2 text-base">
                  <span className="text-xl">👆</span>
                  TRIGGER WORKFLOW!
                </span>
              </button>
              {data.parameters?.description && (
                <div className={`text-xs text-center italic px-2 ${themeStyles.textDim}`}>
                  {data.parameters.description}
                </div>
              )}
            </div>
          ) : isBundle ? (
            <div className="space-y-2">
              <div className={`text-xs font-bold mb-1 ${themeStyles.textMain}`}>BUNDLED NODES:</div>
              {data.bundledNodes?.slice(0, 3).map((node, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs bg-white p-2 rounded border-2 border-black"
                  style={{ boxShadow: '1px 1px 0px #000' }}
                >
                  <span className="text-sm">{node.data?.icon || '⚙️'}</span>
                  <span className="font-bold text-black truncate flex-1">
                    {node.data?.label || node.data?.name || 'Node'}
                  </span>
                </div>
              ))}
              {data.bundledNodes && data.bundledNodes.length > 3 && (
                <div className={`text-xs font-bold text-center py-1 ${themeStyles.textMain}`}>
                  +{data.bundledNodes.length - 3} more...
                </div>
              )}
              <div className="mt-2 flex items-center justify-center">
                <div
                  className="bg-lime-400 px-3 py-1.5 rounded-lg border-3 border-black inline-flex items-center gap-2"
                  style={{ boxShadow: '2px 2px 0px #000' }}
                >
                  <span className="text-sm">💼</span>
                  <span
                    className="font-bold text-black text-xs"
                    style={{ fontFamily: "'Bangers', cursive" }}
                  >
                    {data.bundledNodes?.length || 0} NODES BUNDLED!
                  </span>
                </div>
              </div>
            </div>
          ) : data.parameters && Object.keys(data.parameters).length > 0 ? (
            <div className="space-y-1.5">
              {Object.entries(data.parameters).slice(0, 2).map(([key, value]) => (
                <div key={key} className="flex items-start gap-2 text-xs">
                  <span className={`font-medium min-w-[60px] ${themeStyles.textDim}`}>{key}:</span>
                  <span className={`truncate flex-1 ${themeStyles.textMain}`}>{String(value)}</span>
                </div>
              ))}
              {Object.keys(data.parameters).length > 2 && (
                <div className={`text-xs italic ${themeStyles.textDim}`}>
                  +{Object.keys(data.parameters).length - 2} more...
                </div>
              )}
            </div>
          ) : (
            <div className={`text-xs italic ${themeStyles.textDim}`}>Click settings to configure</div>
          )}
        </div>

        {/* Left Handle */}
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className={`w-3 h-3 transition-colors ${themeStyles.handle}`}
          style={{ left: -7 }}
        />

        {/* Right Handle */}
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className={`w-3 h-3 transition-colors ${themeStyles.handle}`}
          style={{ right: -7 }}
        />
        
        {/* Execution count badge (like n8n) */}
        {data.executions > 0 && !isExecuting && !hasExecuted && (
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
            {data.executions}
          </div>
        )}
      </div>
    </>
  );
};

export default N8nStyleNode;
