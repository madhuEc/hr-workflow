import { BaseNode } from './BaseNode';
import type { TaskNodeData } from '../../types';

interface TaskNodeProps {
  id: string;
  data: TaskNodeData;
  selected?: boolean;
}

export function TaskNode({ id, data, selected }: TaskNodeProps) {
  return (
    <BaseNode id={id} selected={selected} data={data} icon="📋" color="#3b82f6">
      <p className="node-title">{data.title || 'Task'}</p>
      {data.assignee && (
        <span className="node-badge assignee">👤 {data.assignee}</span>
      )}
      {data.dueDate && (
        <p className="node-subtitle">Due: {data.dueDate}</p>
      )}
    </BaseNode>
  );
}
