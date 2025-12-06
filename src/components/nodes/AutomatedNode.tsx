import { BaseNode } from './BaseNode';
import type { AutomatedNodeData } from '../../types';
import { automationActions } from '../../api';

interface AutomatedNodeProps {
  id: string;
  data: AutomatedNodeData;
  selected?: boolean;
}

export function AutomatedNode({ id, data, selected }: AutomatedNodeProps) {
  const action = automationActions.find((a) => a.id === data.actionId);

  return (
    <BaseNode id={id} selected={selected} data={data} icon="⚡" color="#8b5cf6">
      <p className="node-title">{data.title || 'Automated Step'}</p>
      {action ? (
        <span className="node-badge action">🔧 {action.label}</span>
      ) : (
        <p className="node-subtitle">No action configured</p>
      )}
    </BaseNode>
  );
}
