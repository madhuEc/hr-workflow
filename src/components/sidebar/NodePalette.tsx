import type { DragEvent } from 'react';
import type { NodeType } from '../../types';
import './sidebar.css';

interface NodePaletteItem {
  type: NodeType;
  label: string;
  icon: string;
  color: string;
  description: string;
}

const nodeItems: NodePaletteItem[] = [
  {
    type: 'start',
    label: 'Start',
    icon: '▶',
    color: '#22c55e',
    description: 'Workflow entry point',
  },
  {
    type: 'task',
    label: 'Task',
    icon: '📋',
    color: '#3b82f6',
    description: 'Human task assignment',
  },
  {
    type: 'approval',
    label: 'Approval',
    icon: '✓',
    color: '#f59e0b',
    description: 'Manager/HR approval step',
  },
  {
    type: 'automated',
    label: 'Automated',
    icon: '⚡',
    color: '#8b5cf6',
    description: 'System-triggered action',
  },
  {
    type: 'end',
    label: 'End',
    icon: '⏹',
    color: '#ef4444',
    description: 'Workflow completion',
  },
];

export function NodePalette() {
  const onDragStart = (event: DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="node-palette">
      <h3 className="palette-title">Node Types</h3>
      <p className="palette-hint">Drag nodes to the canvas</p>
      <div className="palette-items">
        {nodeItems.map((item) => (
          <div
            key={item.type}
            className="palette-item"
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            style={{ '--item-color': item.color } as React.CSSProperties}
          >
            <div className="palette-item-icon" style={{ backgroundColor: item.color }}>
              {item.icon}
            </div>
            <div className="palette-item-info">
              <span className="palette-item-label">{item.label}</span>
              <span className="palette-item-desc">{item.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
