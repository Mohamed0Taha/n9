import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { getNodeConfiguration } from '../data/nodeConfigurations.js';

function N8nStyleNode({ data, selected, id, onOpenSettings }) {
  const isBundle = data.isBundle || Array.isArray(data.bundledNodes);
  const nodeName = data.label || data.name || 'Node';
  const nodeType = data.type || nodeName; // Get the node type for configuration lookup
  
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
  
  const hasError = data.status === 'error';
  const isRunning = data.status === 'running';
  const isSuccess = data.status === 'success';
  
  // Execution status from real-time data
  const executionStatus = data.executionStatus;
  const isExecuting = executionStatus === 'running';
  const hasExecuted = executionStatus === 'success';
  const executionTime = data.executionTime;
  const executionData = data.executionData;

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
          <div key={`input-wrapper-${index}`} style={{ position: 'absolute', top: -38, left: leftPos, transform: 'translateX(-50%)', zIndex: 1000 }}>
            {/* Connection circle (on top, outer side) */}
            <Handle
              type="target"
              position={Position.Top}
              id={`input-${index}`}
              style={{ 
                position: 'relative',
                width: '14px',
                height: '14px',
                border: '3px solid #000',
                backgroundColor: '#bef264',
                borderRadius: '50%',
                left: '50%',
                transform: 'translateX(-50%)',
                cursor: 'crosshair',
                boxShadow: '2px 2px 0px #000',
                transition: 'all 0.2s',
                marginBottom: '4px',
                zIndex: 1001,
              }}
              className="hover:!w-[20px] hover:!h-[20px] hover:!shadow-[3px_3px_0px_#000]"
            />
            {/* Label (below circle) */}
            <div 
              style={{ 
                borderRadius: '4px',
                border: '3px solid #000',
                boxShadow: '2px 2px 0px #000',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                backgroundColor: '#bef264',
                color: '#000',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
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
          <div key={`output-wrapper-${index}`} style={{ position: 'absolute', bottom: -38, left: leftPos, transform: 'translateX(-50%)', zIndex: 1000 }}>
            {/* Label (above circle) */}
            <div 
              style={{ 
                borderRadius: '4px',
                border: '3px solid #000',
                boxShadow: '2px 2px 0px #000',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                backgroundColor: '#67e8f9',
                color: '#000',
                whiteSpace: 'nowrap',
                marginBottom: '4px',
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
                border: '3px solid #000',
                backgroundColor: '#67e8f9',
                borderRadius: '50%',
                left: '50%',
                transform: 'translateX(-50%)',
                cursor: 'crosshair',
                boxShadow: '2px 2px 0px #000',
                transition: 'all 0.2s',
                zIndex: 1001,
              }}
              className="hover:!w-[20px] hover:!h-[20px] hover:!shadow-[3px_3px_0px_#000]"
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
        className={`relative ${isBundle ? 'cursor-pointer' : 'cursor-move'} border-4 ${
          selected
            ? 'border-lime-400'
            : hasError
            ? 'border-red-500'
            : 'border-black'
        } ${isBundle ? 'rounded-2xl' : 'rounded-lg bg-white'}`}
        title={isBundle ? 'Double-click to unzip bundle' : undefined}
        onDoubleClick={(e) => {
          if (isBundle) {
            console.log('🖱️ Bundle node double-clicked directly!', data.label);
          }
        }}
        style={{
          minWidth: '200px',
          maxWidth: '240px',
          boxShadow: '4px 4px 0px #000',
          fontFamily: "'Comic Neue', cursive",
          zIndex: 10,
          borderRadius: isBundle ? '16px' : undefined,
          backgroundColor: isBundle ? 'transparent' : undefined,
          backgroundImage: isBundle
            ? 'linear-gradient(to bottom, ' +
              '#22c55e 0%, #22c55e 16%, ' +
              '#eab308 16%, #eab308 32%, ' +
              '#f97316 32%, #f97316 48%, ' +
              '#ef4444 48%, #ef4444 64%, ' +
              '#a855f7 64%, #a855f7 80%, ' +
              '#3b82f6 80%, #3b82f6 100%)'
            : undefined,
          overflow: isBundle ? 'hidden' : undefined,
          pointerEvents: 'auto',
        }}
      >
        {/* Header with icon and name */}
        <div 
          className={`flex items-center gap-3 px-4 py-3 border-b-3 border-black ${!isBundle ? `bg-gradient-to-r ${nodeBgGradient}` : ''}`}
          style={
            isBundle
              ? {
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  borderTopLeftRadius: '14px',
                  borderTopRightRadius: '14px',
                }
              : {}
          }
        >
          <div
            className={`flex items-center justify-center ${
              isBundle ? 'w-12 h-12' : 'w-14 h-14'
            } rounded-xl text-3xl flex-shrink-0 border-3 border-black shadow-lg`}
            style={{
              backgroundColor: 'white',
              color: '#000',
            }}
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
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-bold text-sm truncate ${isBundle ? 'text-black' : 'text-white drop-shadow-lg'}`} style={{ fontFamily: "'Comic Neue', cursive", textShadow: isBundle ? 'none' : '1px 1px 2px rgba(0,0,0,0.5)' }}>
              {nodeName.toUpperCase()}
            </div>
            {data.category && !isBundle && (
              <div className="text-xs text-white font-semibold truncate" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
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
            className="p-2 bg-white border-3 border-black rounded-lg hover:bg-yellow-200 transition-colors"
            style={{ boxShadow: '2px 2px 0px #000' }}
            title="Configure node"
          >
            <svg className="w-4 h-4 text-black stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Body - Parameters/Settings Preview / Bundle contents */}
        <div className="px-4 py-3 bg-white/90">
          {isBundle ? (
            <div className="space-y-2">
              <div className="text-xs font-bold text-black mb-1">BUNDLED NODES:</div>
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
                <div className="text-xs font-bold text-black text-center py-1">
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
                  <span className="text-slate-500 font-medium min-w-[60px]">{key}:</span>
                  <span className="text-slate-900 truncate flex-1">{String(value)}</span>
                </div>
              ))}
              {Object.keys(data.parameters).length > 2 && (
                <div className="text-xs text-slate-400 italic">
                  +{Object.keys(data.parameters).length - 2} more...
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">Click settings to configure</div>
          )}
        </div>

        {/* Left Handle */}
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="w-3 h-3 !bg-slate-400 !border-2 !border-white hover:!bg-blue-500 transition-colors"
          style={{ left: -7 }}
        />

        {/* Right Handle */}
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="w-3 h-3 !bg-slate-400 !border-2 !border-white hover:!bg-blue-500 transition-colors"
          style={{ right: -7 }}
        />

        {/* Execution status badge */}
        {isExecuting && (
          <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md border-2 border-black animate-spin" style={{ boxShadow: '2px 2px 0px #000' }}>
            ⚡
          </div>
        )}
        
        {hasExecuted && executionStatus === 'success' && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md border-2 border-black" style={{ boxShadow: '2px 2px 0px #000' }}>
            ✓
          </div>
        )}
        
        {executionStatus === 'failed' && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md border-2 border-black" style={{ boxShadow: '2px 2px 0px #000' }}>
            ✗
          </div>
        )}
        
        {/* Execution count badge (like n8n) */}
        {data.executions > 0 && !isExecuting && !hasExecuted && (
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
            {data.executions}
          </div>
        )}
      </div>
    </>
  );
}

export default memo(N8nStyleNode);
