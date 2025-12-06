import { BaseNode } from './BaseNode';
import type { ApprovalNodeData } from '../../types';

interface ApprovalNodeProps {
  id: string;
  data: ApprovalNodeData;
  selected?: boolean;
}

export function ApprovalNode({ id, data, selected }: ApprovalNodeProps) {
  return (
    <BaseNode id={id} selected={selected} data={data} icon="✓" color="#f59e0b">
      <p className="node-title">{data.title || 'Approval'}</p>
      <span className="node-badge role">🎯 {data.approverRole}</span>
      {data.autoApproveThreshold > 0 && (
        <p className="node-subtitle">
          Auto-approve if ≤ {data.autoApproveThreshold}
        </p>
      )}
    </BaseNode>
  );
}
