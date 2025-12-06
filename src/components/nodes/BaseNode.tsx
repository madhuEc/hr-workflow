import { Handle, Position } from '@xyflow/react';
import type { ReactNode } from 'react';
import { useWorkflowStore } from '../../store';
import type { WorkflowNodeData } from '../../types';
import './nodes.css';

interface BaseNodeProps {
  id: string;
  selected?: boolean;
  data: WorkflowNodeData;
  icon: ReactNode;
  color: string;
  children?: ReactNode;
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
}

export function BaseNode({
  id,
  selected,
  icon,
  color,
  children,
  showSourceHandle = true,
  showTargetHandle = true,
}: BaseNodeProps) {
  const { selectedNodeId, selectNode, validationErrors } = useWorkflowStore();

  const isSelected = selected || selectedNodeId === id;
  const nodeErrors = validationErrors.filter((e) => e.nodeId === id);
  const hasError = nodeErrors.some((e) => e.type === 'error');
  const hasWarning = nodeErrors.some((e) => e.type === 'warning');

  return (
    <div
      className={`workflow-node ${isSelected ? 'selected' : ''} ${hasError ? 'has-error' : ''} ${hasWarning ? 'has-warning' : ''}`}
      style={{ '--node-color': color } as React.CSSProperties}
      onClick={() => selectNode(id)}
    >
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="node-handle"
        />
      )}

      <div className="node-header" style={{ backgroundColor: color }}>
        <span className="node-icon">{icon}</span>
      </div>

      <div className="node-content">
        {children}
      </div>

      {hasError && (
        <div className="node-error-indicator" title={nodeErrors.map((e) => e.message).join('\n')}>
          !
        </div>
      )}

      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="node-handle"
        />
      )}
    </div>
  );
}
