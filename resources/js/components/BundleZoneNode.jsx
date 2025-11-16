import { memo } from 'react';
import { NodeResizer } from 'reactflow';

function BundleZoneNode({ data, onZip, selected }) {
  const {
    label = 'Bundle',
  } = data || {};

  return (
    <>
      {/* Resizer handles - only visible when selected */}
      <NodeResizer
        color="#ef4444"
        isVisible={selected}
        minWidth={300}
        minHeight={200}
        lineStyle={{
          borderWidth: 3,
          borderColor: '#ef4444',
        }}
        handleStyle={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: '#ef4444',
          border: '3px solid #000',
          boxShadow: '2px 2px 0px #000',
        }}
      />
      
      <div
        className="relative border-4 border-red-500 bg-cyan-200/70"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '22px',
          boxShadow: '4px 4px 0px #000',
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.6) 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
        }}
      >
      {/* Label */}
      <div
        className="absolute left-4 top-2 px-3 py-1 rounded-full border-3 border-black bg-yellow-300 text-[11px] font-bold text-black"
        style={{ fontFamily: "'Comic Neue', cursive", boxShadow: '2px 2px 0px #000' }}
      >
        {label.toUpperCase()}
      </div>

      {/* ZIP button */}
      <button
        type="button"
        className="tactile-button absolute -top-4 right-4 px-3 py-1 rounded-full border-3 border-black bg-red-500 text-[10px] font-bold text-white tracking-wide"
        style={{ boxShadow: '3px 3px 0px #000' }}
        onClick={(e) => {
          e.stopPropagation();
          if (onZip) {
            onZip();
          }
        }}
        title="Zip this bundle back up"
      >
        ZIP
      </button>
    </div>
    </>
  );
}

export default memo(BundleZoneNode);
