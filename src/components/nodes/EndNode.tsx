import { BaseNode } from './BaseNode';
import type { EndNodeData } from '../../types';

interface EndNodeProps {
  id: string;
  data: EndNodeData;
  selected?: boolean;
}

export function EndNode({ id, data, selected }: EndNodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      data={data}
      icon="⏹"
      color="#ef4444"
      showSourceHandle={false}
    >
      <p className="node-title">End</p>
      {data.showSummary && (
        <p className="node-subtitle">Shows summary</p>
      )}
    </BaseNode>
  );
}
