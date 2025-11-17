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

  return <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />;
}

export default memo(ComicEdge);
