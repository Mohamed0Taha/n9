import { memo } from 'react';
import { BaseEdge, getBezierPath, Position } from 'reactflow';

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
  } = props;

  let adjustedTargetX = targetX;
  let adjustedTargetY = targetY;

  // Adjust arrow tip to touch the border of the input tag/node
  // Fine-tuned to make arrow tip exactly touch the top border line with no gap
  // Handle + border + arrow tip = ~18px for perfect contact
  const handleOffset = 27; // Distance to pull back so arrow tip touches border
  
  if (targetPosition === Position.Top) {
    // Arrow coming from top - stop at top border of node
    adjustedTargetY -= handleOffset;
  } else if (targetPosition === Position.Bottom) {
    // Arrow coming from bottom - stop at bottom border
    adjustedTargetY += handleOffset;
  } else if (targetPosition === Position.Left) {
    // Arrow coming from left - stop at left border
    adjustedTargetX -= handleOffset;
  } else if (targetPosition === Position.Right) {
    // Arrow coming from right - stop at right border
    adjustedTargetX += handleOffset;
  }

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    sourcePosition,
    targetPosition,
  });

  return <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />;
}

export default memo(ComicEdge);
