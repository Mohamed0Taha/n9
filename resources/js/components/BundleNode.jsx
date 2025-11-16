import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function BundleNode({ data, selected, id, onOpenSettings }) {
  const nodeCount = data.bundledNodes?.length || 0;

  return (
    <>
      {/* Input Handle */}
      <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)' }}>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-bold bg-lime-400 px-2 py-0.5 rounded border-2 border-black text-black whitespace-nowrap" style={{ boxShadow: '1px 1px 0px #000' }}>
            INPUT
          </span>
          <Handle
            type="target"
            position={Position.Top}
            id="input-0"
            className="w-5 h-5 !bg-lime-400 !border-3 !border-black !rounded-full"
            style={{ position: 'relative', top: 0, left: 0, transform: 'none', boxShadow: '2px 2px 0px #000' }}
          />
        </div>
      </div>

      {/* Bundle Node - Comic Book Style (matching regular nodes) */}
      <div
        className={`relative cursor-pointer border-4 ${
          selected ? 'border-lime-400' : 'border-black'
        }`}
        style={{
          minWidth: '240px',
          maxWidth: '280px',
          boxShadow: '4px 4px 0px #000',
          fontFamily: "'Comic Neue', cursive",
          borderRadius: '16px',
          // WinRAR-style multi‑color stack background for the whole bundle
          background:
            'linear-gradient(to bottom, ' +
            '#22c55e 0%, #22c55e 16%, ' + // green
            '#eab308 16%, #eab308 32%, ' + // yellow
            '#f97316 32%, #f97316 48%, ' + // orange
            '#ef4444 48%, #ef4444 64%, ' + // red
            '#a855f7 64%, #a855f7 80%, ' + // purple
            '#3b82f6 80%, #3b82f6 100%)' // blue
        }}
      >
        {/* Header with icon and name sitting on top of the stacked bundle */}
        <div 
          className="flex items-center gap-3 px-4 py-3 border-b-3 border-black"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          }}
        >
          <div
            className="flex items-center justify-center w-14 h-14 rounded-lg border-3 border-black"
            style={{
              backgroundColor: '#1e293b',
              color: '#000',
              boxShadow: '2px 2px 0px #000'
            }}
          >
            {/* WinRAR-style archive icon - Stacked books with belt */}
            <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
              {/* Stacked colored layers */}
              <g>
                {/* Green layer */}
                <rect x="8" y="10" width="48" height="7" rx="1" fill="#22c55e"/>
                <rect x="8" y="10" width="48" height="7" rx="1" fill="url(#greenGrad)"/>
                <line x1="10" y1="11" x2="10" y2="16" stroke="#4ade80" strokeWidth="1" opacity="0.5"/>
                
                {/* Yellow layer */}
                <rect x="8" y="18" width="48" height="7" rx="1" fill="#eab308"/>
                <rect x="8" y="18" width="48" height="7" rx="1" fill="url(#yellowGrad)"/>
                <line x1="10" y1="19" x2="10" y2="24" stroke="#fde047" strokeWidth="1" opacity="0.5"/>
                
                {/* Orange layer */}
                <rect x="8" y="26" width="48" height="7" rx="1" fill="#f97316"/>
                <rect x="8" y="26" width="48" height="7" rx="1" fill="url(#orangeGrad)"/>
                <line x1="10" y1="27" x2="10" y2="32" stroke="#fb923c" strokeWidth="1" opacity="0.5"/>
                
                {/* Red layer */}
                <rect x="8" y="34" width="48" height="7" rx="1" fill="#ef4444"/>
                <rect x="8" y="34" width="48" height="7" rx="1" fill="url(#redGrad)"/>
                <line x1="10" y1="35" x2="10" y2="40" stroke="#f87171" strokeWidth="1" opacity="0.5"/>
                
                {/* Purple layer */}
                <rect x="8" y="42" width="48" height="7" rx="1" fill="#a855f7"/>
                <rect x="8" y="42" width="48" height="7" rx="1" fill="url(#purpleGrad)"/>
                <line x1="10" y1="43" x2="10" y2="48" stroke="#c084fc" strokeWidth="1" opacity="0.5"/>
                
                {/* Blue layer */}
                <rect x="8" y="50" width="48" height="7" rx="1" fill="#3b82f6"/>
                <rect x="8" y="50" width="48" height="7" rx="1" fill="url(#blueGrad)"/>
                <line x1="10" y1="51" x2="10" y2="56" stroke="#60a5fa" strokeWidth="1" opacity="0.5"/>
              </g>
              
              {/* Belt strap */}
              <g>
                {/* Main belt */}
                <rect x="6" y="26" width="52" height="12" rx="2" fill="#d97706"/>
                <rect x="6" y="26" width="52" height="12" rx="2" fill="url(#beltGrad)"/>
                
                {/* Stitching */}
                <path d="M 8 28 L 10 28 M 12 28 L 14 28 M 16 28 L 18 28" stroke="#92400e" strokeWidth="0.5" strokeDasharray="1,1"/>
                <path d="M 8 36 L 10 36 M 12 36 L 14 36 M 16 36 L 18 36" stroke="#92400e" strokeWidth="0.5" strokeDasharray="1,1"/>
                
                {/* Belt buckle */}
                <rect x="26" y="28" width="12" height="8" rx="1" fill="#d4d4d4" stroke="#737373" strokeWidth="1"/>
                <rect x="28" y="29.5" width="8" height="5" rx="0.5" fill="none" stroke="#525252" strokeWidth="1"/>
                <circle cx="32" cy="32" r="1" fill="#404040"/>
                
                {/* Buckle pin */}
                <rect x="30" y="31.5" width="4" height="1" rx="0.5" fill="#525252"/>
              </g>
              
              {/* Gradients */}
              <defs>
                <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#15803d" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#a16207" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#c2410c" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="redGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="beltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4"/>
                  <stop offset="50%" stopColor="#d97706" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#78350f" stopOpacity="0.4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base text-black truncate" style={{ fontFamily: "'Comic Neue', cursive" }}>
              {(data.label || 'UNNAMED BUNDLE').toUpperCase()}
            </div>
            <div className="text-xs text-black font-bold truncate">
              Bundle • {nodeCount} nodes
            </div>
          </div>
          
          {/* Settings button - Same position as regular nodes */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenSettings) {
                onOpenSettings({ id, data });
              }
            }}
            className="p-1 bg-yellow-300 border-2 border-black rounded-lg"
            style={{ boxShadow: '2px 2px 0px #000' }}
            title="Configure bundle"
          >
            <svg className="w-4 h-4 text-black stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Body - Bundle Info */}
        <div
          className="px-4 py-3"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
          }}
        >
          {/* Bundle nodes list preview */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-black mb-2">BUNDLED NODES:</div>
            {data.bundledNodes?.slice(0, 3).map((node, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs bg-white p-2 rounded border-2 border-black" style={{ boxShadow: '1px 1px 0px #000' }}>
                <span className="text-sm">{node.data?.icon || '⚙️'}</span>
                <span className="font-bold text-black truncate flex-1">{node.data?.label || node.data?.name || 'Node'}</span>
              </div>
            ))}
            {nodeCount > 3 && (
              <div className="text-xs font-bold text-black text-center py-1">
                +{nodeCount - 3} more...
              </div>
            )}
          </div>

          {/* Bundle status badge */}
          <div className="mt-3 flex items-center justify-center">
            <div className="bg-lime-400 px-4 py-2 rounded-lg border-3 border-black inline-flex items-center gap-2" style={{ boxShadow: '2px 2px 0px #000' }}>
              <span className="text-xl">💼</span>
              <span className="font-bold text-black text-sm" style={{ fontFamily: "'Bangers', cursive" }}>
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
            className="w-5 h-5 !bg-cyan-400 !border-3 !border-black !rounded-full"
            style={{ position: 'relative', bottom: 0, left: 0, transform: 'none', boxShadow: '2px 2px 0px #000' }}
          />
          <span className="text-[9px] font-bold bg-cyan-400 px-2 py-0.5 rounded border-2 border-black text-black whitespace-nowrap" style={{ boxShadow: '1px 1px 0px #000' }}>
            OUTPUT
          </span>
        </div>
      </div>
    </>
  );
}

export default memo(BundleNode);
