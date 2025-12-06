import { create } from 'zustand';
import type { Connection, EdgeChange, NodeChange } from '@xyflow/react';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowNodeData,
  NodeType,
  ValidationError,
  SimulationResult,
} from '../types';
import {
  createStartNodeData,
  createTaskNodeData,
  createApprovalNodeData,
  createAutomatedNodeData,
  createEndNodeData,
} from '../types';
import { validateWorkflow, simulateWorkflow } from '../api';

interface WorkflowState {

  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  workflowName: string;
  selectedNodeId: string | null;
  validationErrors: ValidationError[];
  isSimulating: boolean;
  simulationResult: SimulationResult | null;

  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;

  selectNode: (nodeId: string | null) => void;
  getSelectedNode: () => WorkflowNode | null;

  validate: () => ValidationError[];
  simulate: () => Promise<SimulationResult>;
  clearSimulation: () => void;

  setWorkflowName: (name: string) => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => boolean;
  clearWorkflow: () => void;
}

const createNodeData = (type: NodeType): WorkflowNodeData => {
  switch (type) {
    case 'start':
      return createStartNodeData();
    case 'task':
      return createTaskNodeData();
    case 'approval':
      return createApprovalNodeData();
    case 'automated':
      return createAutomatedNodeData();
    case 'end':
      return createEndNodeData();
    default:
      return createTaskNodeData();
  }
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  workflowName: 'Untitled Workflow',
  selectedNodeId: null,
  validationErrors: [],
  isSimulating: false,
  simulationResult: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[],
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    const { nodes, edges } = get();


    const targetNode = nodes.find((n) => n.id === connection.target);
    if (targetNode?.data.type === 'start') {
      return;
    }


    const sourceNode = nodes.find((n) => n.id === connection.source);
    if (sourceNode?.data.type === 'end') {
      return;
    }

    set({
      edges: addEdge(
        {
          ...connection,
          id: uuidv4(),
          type: 'smoothstep',
          animated: true,
        },
        edges
      ),
    });
  },

  addNode: (type, position) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: type,
      position,
      data: createNodeData(type),
    };

    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } as WorkflowNodeData }
          : node
      ),
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((e) => e.id !== edgeId),
    });
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get();
    return nodes.find((n) => n.id === selectedNodeId) || null;
  },

  validate: () => {
    const { nodes, edges } = get();
    const errors = validateWorkflow(nodes, edges);
    set({ validationErrors: errors });
    return errors;
  },

  simulate: async () => {
    const { nodes, edges } = get();
    set({ isSimulating: true, simulationResult: null });

    try {
      const result = await simulateWorkflow(nodes, edges);
      set({ simulationResult: result, isSimulating: false });
      return result;
    } catch {
      const errorResult: SimulationResult = {
        success: false,
        steps: [],
        errors: [{ type: 'error', message: 'Simulation failed unexpectedly' }],
        duration: 0,
      };
      set({ simulationResult: errorResult, isSimulating: false });
      return errorResult;
    }
  },

  clearSimulation: () => {
    set({ simulationResult: null, isSimulating: false });
  },

  setWorkflowName: (name) => set({ workflowName: name }),

  exportWorkflow: () => {
    const { nodes, edges, workflowName } = get();
    return JSON.stringify(
      {
        id: uuidv4(),
        name: workflowName,
        nodes,
        edges,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    );
  },

  importWorkflow: (json) => {
    try {
      const workflow = JSON.parse(json);
      if (workflow.nodes && workflow.edges) {
        set({
          nodes: workflow.nodes,
          edges: workflow.edges,
          workflowName: workflow.name || 'Imported Workflow',
          selectedNodeId: null,
          validationErrors: [],
          simulationResult: null,
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      workflowName: 'Untitled Workflow',
      selectedNodeId: null,
      validationErrors: [],
      simulationResult: null,
    });
  },
}));
