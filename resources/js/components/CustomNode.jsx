import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data, selected }) {
  const nodeColor = data.color || '#3b82f6';
  const nodeIcon = data.icon || '⚙️';
  const nodeName = data.label || data.name || 'Node';

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 bg-white shadow-lg transition-all duration-200 ${
        selected
          ? 'border-blue-500 shadow-xl scale-105'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-xl'
      }`}
      style={{
        minWidth: '180px',
        maxWidth: '220px',
      }}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-slate-400 !border-2 !border-white"
        style={{ top: -6 }}
      />

      {/* Node Content */}
      <div className="flex items-center gap-3 mb-1">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg text-xl flex-shrink-0 cursor-pointer"
          style={{
            backgroundColor: `${nodeColor}15`,
            color: nodeColor,
          }}
          onClick={handleSettingsClick}
        >
          {nodeIcon}
        </div>
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={handleSettingsClick}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleSettingsClick(event);
            }
          }}
        >
          <div className="font-semibold text-sm text-slate-900 truncate">
            {nodeName}
          </div>
          {data.description && (
            <div className="text-xs text-slate-500 truncate">
              {data.description}
            </div>
          )}
        </div>
        <button
          type="button"
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="Open node settings"
          onClick={handleSettingsClick}
        >
          <span className="material-symbols-outlined text-base">settings</span>
        </button>
      </div>

      {/* Status Indicator */}
      {data.status && (
        <div className="mt-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs">
            <div
              className={`w-2 h-2 rounded-full ${
                data.status === 'success'
                  ? 'bg-green-500'
                  : data.status === 'error'
                  ? 'bg-red-500'
                  : data.status === 'running'
                  ? 'bg-blue-500 animate-pulse'
                  : 'bg-slate-300'
              }`}
            />
            <span className="text-slate-600 capitalize">{data.status}</span>
          </div>
        </div>
      )}

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-slate-400 !border-2 !border-white"
        style={{ bottom: -6 }}
      />

      {/* Left Handle (for additional connections) */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 !bg-slate-400 !border-2 !border-white opacity-0 hover:opacity-100"
        style={{ left: -6 }}
      />

      {/* Right Handle (for additional connections) */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 !bg-slate-400 !border-2 !border-white opacity-0 hover:opacity-100"
        style={{ right: -6 }}
      />
    </div>
  );
}

export default memo(CustomNode);
