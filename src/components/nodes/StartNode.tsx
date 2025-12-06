import { BaseNode } from './BaseNode';
import type { StartNodeData } from '../../types';

interface StartNodeProps {
  id: string;
  data: StartNodeData;
  selected?: boolean;
}

export function StartNode({ id, data, selected }: StartNodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      data={data}
      icon="▶"
      color="#22c55e"
      showTargetHandle={false}
    >
      <p className="node-title">{data.title || 'Start'}</p>
      {Object.keys(data.metadata).length > 0 && (
        <p className="node-subtitle">
          {Object.keys(data.metadata).length} metadata fields
        </p>
      )}
    </BaseNode>
  );
}
