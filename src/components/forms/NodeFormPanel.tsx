import { useWorkflowStore } from '../../store';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  WorkflowNodeData,
} from '../../types';
import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedNodeForm } from './AutomatedNodeForm';
import { EndNodeForm } from './EndNodeForm';
import './forms.css';

const nodeConfig: Record<string, { icon: string; color: string; label: string }> = {
  start: { icon: '▶', color: '#22c55e', label: 'Start Node' },
  task: { icon: '📋', color: '#3b82f6', label: 'Task Node' },
  approval: { icon: '✓', color: '#f59e0b', label: 'Approval Node' },
  automated: { icon: '⚡', color: '#8b5cf6', label: 'Automated Step' },
  end: { icon: '⏹', color: '#ef4444', label: 'End Node' },
};

export function NodeFormPanel() {
  const { selectedNodeId, nodes, updateNodeData, deleteNode, selectNode } = useWorkflowStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="node-form-panel">
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-text">
            Select a node on the canvas to edit its properties
          </div>
        </div>
      </div>
    );
  }

  const nodeData = selectedNode.data;
  const config = nodeConfig[nodeData.type];

  const handleChange = (updates: Partial<WorkflowNodeData>) => {
    updateNodeData(selectedNode.id, updates);
  };

  const handleDelete = () => {
    deleteNode(selectedNode.id);
    selectNode(null);
  };

  const renderForm = () => {
    switch (nodeData.type) {
      case 'start':
        return (
          <StartNodeForm
            data={nodeData as StartNodeData}
            onChange={handleChange}
          />
        );
      case 'task':
        return (
          <TaskNodeForm
            data={nodeData as TaskNodeData}
            onChange={handleChange}
          />
        );
      case 'approval':
        return (
          <ApprovalNodeForm
            data={nodeData as ApprovalNodeData}
            onChange={handleChange}
          />
        );
      case 'automated':
        return (
          <AutomatedNodeForm
            data={nodeData as AutomatedNodeData}
            onChange={handleChange}
          />
        );
      case 'end':
        return (
          <EndNodeForm
            data={nodeData as EndNodeData}
            onChange={handleChange}
          />
        );
      default:
        return <div>Unknown node type</div>;
    }
  };

  return (
    <div className="node-form-panel">
      <div className="node-form-header">
        <div className="node-form-title">
          <div
            className="node-form-title-icon"
            style={{ backgroundColor: config.color }}
          >
            {config.icon}
          </div>
          <span className="node-form-title-text">{config.label}</span>
        </div>
      </div>

      {renderForm()}

      <div className="node-form-actions">
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          Delete Node
        </button>
      </div>
    </div>
  );
}
