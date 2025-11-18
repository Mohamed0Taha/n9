import { memo } from 'react';
import { BaseEdge, getBezierPath, Position } from 'reactflow';

// Add CSS animation for flowing data effect
if (typeof document !== 'undefined') {
  const styleId = 'comic-edge-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes flowPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.7; }
      }
      @keyframes flowDash {
        0% { stroke-dashoffset: 24; }
        100% { stroke-dashoffset: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

function ComicEdge(props) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style,
    markerEnd,
    source,
    target,
    data,
  } = props;
  
  // Get execution status from edge data
  const sourceStatus = data?.sourceStatus;
  const targetStatus = data?.targetStatus;
  
  // Determine if data is flowing through this edge
  const sourceCompleted = sourceStatus === 'success';
  const targetActive = targetStatus === 'running' || targetStatus === 'success';
  const isActive = sourceCompleted && targetActive;
  
  // Log for debugging
  if (isActive) {
    console.log(`🔗 Edge ${source} -> ${target} is ACTIVE (data flowing)`, { sourceStatus, targetStatus });
  }

  let adjustedSourceX = sourceX;
  let adjustedSourceY = sourceY;
  let adjustedTargetX = targetX;
  let adjustedTargetY = targetY;

  // Adjust arrow to touch the connection circles
  // Circle is 14px + 3px border = 17px radius, adjusted for arrow to touch circle edge
  const handleOffset = 2; // Distance to pull back so arrow tip touches circle
  
  // Adjust source (output circle)
  if (sourcePosition === Position.Bottom) {
    adjustedSourceY += handleOffset;
  } else if (sourcePosition === Position.Top) {
    adjustedSourceY -= handleOffset;
  } else if (sourcePosition === Position.Right) {
    adjustedSourceX += handleOffset;
  } else if (sourcePosition === Position.Left) {
    adjustedSourceX -= handleOffset;
  }
  
  // Adjust target (input circle)
  if (targetPosition === Position.Top) {
    adjustedTargetY -= handleOffset;
  } else if (targetPosition === Position.Bottom) {
    adjustedTargetY += handleOffset;
  } else if (targetPosition === Position.Left) {
    adjustedTargetX -= handleOffset;
  } else if (targetPosition === Position.Right) {
    adjustedTargetX += handleOffset;
  }

  const [edgePath] = getBezierPath({
    sourceX: adjustedSourceX,
    sourceY: adjustedSourceY,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    sourcePosition,
    targetPosition,
  });
  
  // Dynamic edge styling based on execution status
  const edgeStyle = {
    ...style,
    stroke: isActive ? '#22c55e' : (style?.stroke || '#bef264'),
    strokeWidth: isActive ? 4 : (style?.strokeWidth || 2.5),
    filter: isActive ? 'drop-shadow(0 0 8px #22c55e)' : 'none',
  };
  
  // Dynamic marker color
  const dynamicMarker = isActive 
    ? { ...markerEnd, color: '#22c55e' }
    : markerEnd;

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={edgeStyle} markerEnd={dynamicMarker} />
      {isActive && (
        <>
          {/* Pulsing glow effect */}
          <BaseEdge 
            id={`${id}-glow`} 
            path={edgePath} 
            style={{
              stroke: '#86efac',
              strokeWidth: 8,
              opacity: 0.5,
              animation: 'flowPulse 1.5s ease-in-out infinite',
            }} 
          />
          {/* Animated dashed line to show flow direction */}
          <BaseEdge 
            id={`${id}-flow`} 
            path={edgePath} 
            style={{
              stroke: '#ffffff',
              strokeWidth: 2,
              opacity: 0.6,
              strokeDasharray: '8 8',
              animation: 'flowDash 1s linear infinite',
            }} 
          />
        </>
      )}
    </>
  );
}

export default memo(ComicEdge);
