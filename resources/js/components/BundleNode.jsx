import { useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { useTheme, THEMES } from '../contexts/ThemeContext.jsx';

function BundleNode({ data, selected, id, onOpenSettings }) {
  const { theme, isComic } = useTheme();
  const nodeCount = data.bundledNodes?.length || 0;
  
  // Execution status from real-time data
  const executionStatus = data.executionStatus;
  const isExecuting = executionStatus === 'running';
  const hasExecuted = executionStatus === 'success';
  const hasError = executionStatus === 'error' || executionStatus === 'failed';

  const themeStyles = useMemo(() => {
    const baseHandle = "w-3 h-3";
    
    if (isComic) {
        return {
            container: `border-4 ${selected ? 'border-lime-400' : 'border-black'} rounded-2xl`,
            containerStyle: { 
                boxShadow: '4px 4px 0px #000', 
                fontFamily: "'Comic Neue', cursive",
                background: 'linear-gradient(to bottom, #22c55e 0%, #22c55e 16%, #eab308 16%, #eab308 32%, #f97316 32%, #f97316 48%, #ef4444 48%, #ef4444 64%, #a855f7 64%, #a855f7 80%, #3b82f6 80%, #3b82f6 100%)'
            },
            header: "border-b-3 border-black bg-white/90 rounded-t-xl",
            iconBox: "border-3 border-black bg-slate-800 text-black shadow-[2px_2px_0px_#000]",
            title: "text-black font-bold",
            font: "'Comic Neue', cursive",
            body: "bg-white/90 rounded-b-xl",
            nodeItem: "bg-white border-2 border-black shadow-[1px_1px_0px_#000]",
            badge: "bg-lime-400 border-3 border-black shadow-[2px_2px_0px_#000]",
            badgeText: "text-black font-bold font-bangers",
            handleInput: "w-5 h-5 !bg-lime-400 !border-3 !border-black !rounded-full shadow-[2px_2px_0px_#000]",
            handleOutput: "w-5 h-5 !bg-cyan-400 !border-3 !border-black !rounded-full shadow-[2px_2px_0px_#000]",
            labelInput: "bg-lime-400 border-2 border-black text-black shadow-[1px_1px_0px_#000]",
            labelOutput: "bg-cyan-400 border-2 border-black text-black shadow-[1px_1px_0px_#000]",
            settingsBtn: "bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_#000]"
        };
    }

    switch(theme) {
        case THEMES.HACKER: return {
            container: `border ${selected ? 'border-green-400' : 'border-green-600'} bg-black rounded-lg`,
            containerStyle: { boxShadow: '0 0 15px rgba(0, 255, 0, 0.1)', fontFamily: 'monospace' },
            header: "border-b border-green-900 bg-black rounded-t-lg",
            iconBox: "border border-green-500 bg-black text-green-500",
            title: "text-green-500 font-bold font-mono",
            font: "monospace",
            body: "bg-black rounded-b-lg",
            nodeItem: "bg-black border border-green-800 text-green-400",
            badge: "bg-green-900/30 border border-green-500 text-green-400",
            badgeText: "font-mono font-bold",
            handleInput: "w-3 h-3 !bg-black !border !border-green-500 !rounded-none hover:!bg-green-500",
            handleOutput: "w-3 h-3 !bg-black !border !border-green-500 !rounded-none hover:!bg-green-500",
            labelInput: "bg-black border border-green-500 text-green-500",
            labelOutput: "bg-black border border-green-500 text-green-500",
            settingsBtn: "bg-black border border-green-700 text-green-500 hover:bg-green-900/30"
        };
        case THEMES.TERMINAL: return {
            container: `border ${selected ? 'border-amber-400' : 'border-amber-600'} bg-slate-950 rounded-lg`,
            containerStyle: { boxShadow: '0 0 10px rgba(245, 158, 11, 0.1)', fontFamily: 'monospace' },
            header: "border-b border-amber-900 bg-slate-950 rounded-t-lg",
            iconBox: "border border-amber-600 bg-slate-950 text-amber-500",
            title: "text-amber-500 font-bold font-mono",
            font: "monospace",
            body: "bg-slate-950 rounded-b-lg",
            nodeItem: "bg-slate-950 border border-amber-800 text-amber-400",
            badge: "bg-amber-900/30 border border-amber-600 text-amber-400",
            badgeText: "font-mono font-bold",
            handleInput: "w-3 h-3 !bg-slate-950 !border !border-amber-600 !rounded-none hover:!bg-amber-600",
            handleOutput: "w-3 h-3 !bg-slate-950 !border !border-amber-600 !rounded-none hover:!bg-amber-600",
            labelInput: "bg-slate-950 border border-amber-600 text-amber-500",
            labelOutput: "bg-slate-950 border border-amber-600 text-amber-500",
            settingsBtn: "bg-slate-950 border border-amber-700 text-amber-500 hover:bg-amber-900/30"
        };
        case THEMES.DARK: return {
            container: `border ${selected ? 'border-blue-400' : 'border-gray-600'} bg-gray-800 rounded-xl`,
            containerStyle: { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' },
            header: "border-b border-gray-700 bg-gray-900 rounded-t-xl",
            iconBox: "border border-gray-600 bg-gray-800 text-gray-200",
            title: "text-gray-100 font-semibold",
            font: "inherit",
            body: "bg-gray-800 rounded-b-xl",
            nodeItem: "bg-gray-700 border border-gray-600 text-gray-200",
            badge: "bg-blue-900/50 border border-blue-700 text-blue-200",
            badgeText: "font-medium",
            handleInput: "w-4 h-4 !bg-gray-700 !border-2 !border-gray-500 !rounded-full hover:!bg-blue-500",
            handleOutput: "w-4 h-4 !bg-gray-700 !border-2 !border-gray-500 !rounded-full hover:!bg-blue-500",
            labelInput: "bg-gray-800 border border-gray-600 text-gray-300",
            labelOutput: "bg-gray-800 border border-gray-600 text-gray-300",
            settingsBtn: "bg-gray-800 border border-gray-600 text-gray-400 hover:bg-gray-700"
        };
        default: // PROFESSIONAL
            return {
                container: `border ${selected ? 'border-blue-400' : 'border-slate-200'} bg-white rounded-xl shadow-sm`,
                containerStyle: { boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' },
                header: "border-b border-slate-100 bg-white rounded-t-xl",
                iconBox: "border border-slate-200 bg-slate-50 text-slate-600",
                title: "text-slate-700 font-semibold",
                font: "inherit",
                body: "bg-white rounded-b-xl",
                nodeItem: "bg-slate-50 border border-slate-200 text-slate-600",
                badge: "bg-blue-50 border border-blue-200 text-blue-600",
                badgeText: "font-medium",
                handleInput: "w-3 h-3 !bg-white !border-2 !border-slate-400 !rounded-full hover:!bg-blue-500",
                handleOutput: "w-3 h-3 !bg-white !border-2 !border-slate-400 !rounded-full hover:!bg-blue-500",
                labelInput: "bg-white border border-slate-200 text-slate-600 shadow-sm",
                labelOutput: "bg-white border border-slate-200 text-slate-600 shadow-sm",
                settingsBtn: "bg-white border border-slate-200 text-slate-400 hover:bg-slate-50"
            };
    }
  }, [theme, isComic, selected]);
  
  return (
    <>
      {/* Input Handle */}
      <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)' }}>
        <div className="flex flex-col items-center gap-1">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${themeStyles.labelInput}`}>
            INPUT
          </span>
          <Handle
            type="target"
            position={Position.Top}
            id="input-0"
            className={themeStyles.handleInput}
            style={{ position: 'relative', top: 0, left: 0, transform: 'none' }}
          />
        </div>
      </div>

      {/* Bundle Node Container */}
      <div
        className={`relative cursor-pointer ${themeStyles.container}`}
        style={{
          minWidth: '240px',
          maxWidth: '280px',
          ...themeStyles.containerStyle
        }}
      >
        {/* Header */}
        <div className={`flex items-center gap-3 px-4 py-3 ${themeStyles.header}`}>
          <div className={`flex items-center justify-center w-14 h-14 rounded-lg relative ${themeStyles.iconBox}`}>
            {/* Icon SVG */}
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            
            {/* Spinner overlay when executing */}
            {isExecuting && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500/90 rounded-lg">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            
            {/* Status Indicators */}
            {hasExecuted && !isExecuting && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border border-black">
                <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {hasError && !isExecuting && (
              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 border border-black">
                <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`text-base truncate ${themeStyles.title}`} style={{ fontFamily: themeStyles.font }}>
              {(data.label || 'UNNAMED BUNDLE').toUpperCase()}
            </div>
            <div className={`text-xs truncate opacity-75 ${themeStyles.title}`}>
              Bundle • {nodeCount} nodes
            </div>
          </div>
          
          {/* Settings button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenSettings?.({ id, data });
            }}
            className={`p-1 rounded-lg transition-colors ${themeStyles.settingsBtn}`}
            title="Configure bundle"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={`px-4 py-3 ${themeStyles.body}`}>
          <div className="space-y-2">
            <div className={`text-xs font-bold mb-2 opacity-70 ${themeStyles.title}`}>BUNDLED NODES:</div>
            {data.bundledNodes?.slice(0, 3).map((node, idx) => (
              <div key={idx} className={`flex items-center gap-2 text-xs p-2 rounded ${themeStyles.nodeItem}`}>
                <span className="text-sm">{node.data?.icon || '⚙️'}</span>
                <span className="font-bold truncate flex-1">{node.data?.label || node.data?.name || 'Node'}</span>
              </div>
            ))}
            {nodeCount > 3 && (
              <div className={`text-xs font-bold text-center py-1 opacity-60 ${themeStyles.title}`}>
                +{nodeCount - 3} more...
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-center">
            <div className={`px-4 py-2 rounded-lg inline-flex items-center gap-2 ${themeStyles.badge}`}>
              <span className="text-xl">💼</span>
              <span className={`text-sm ${themeStyles.badgeText}`}>
                {nodeCount} NODES BUNDLED!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <div style={{ position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)' }}>
        <div className="flex flex-col items-center gap-1">
          <Handle
            type="source"
            position={Position.Bottom}
            id="output-0"
            className={themeStyles.handleOutput}
            style={{ position: 'relative', bottom: 0, left: 0, transform: 'none' }}
          />
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${themeStyles.labelOutput}`}>
            OUTPUT
          </span>
        </div>
      </div>
    </>
  );
}

export default BundleNode;
