import type { Node, Edge } from '@xyflow/react';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';


export interface BaseNodeData {
    label: string;
    type: NodeType;
    [key: string]: unknown;
}

export interface StartNodeData extends BaseNodeData {
    type: 'start';
    title: string;
    metadata: Record<string, string>;
}


export interface TaskNodeData extends BaseNodeData {
    type: 'task';
    title: string;
    description: string;
    assignee: string;
    dueDate: string;
    customFields: Record<string, string>;
}


export interface ApprovalNodeData extends BaseNodeData {
    type: 'approval';
    title: string;
    approverRole: 'Manager' | 'HRBP' | 'Director' | string;
    autoApproveThreshold: number;
}


export interface AutomatedNodeData extends BaseNodeData {
    type: 'automated';
    title: string;
    actionId: string;
    actionParams: Record<string, string>;
}


export interface EndNodeData extends BaseNodeData {
    type: 'end';
    endMessage: string;
    showSummary: boolean;
}


export type WorkflowNodeData =
    | StartNodeData
    | TaskNodeData
    | ApprovalNodeData
    | AutomatedNodeData
    | EndNodeData;


export type WorkflowNode = Node<WorkflowNodeData>;


export type WorkflowEdge = Edge;


export interface Workflow {
    id: string;
    name: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    createdAt: string;
    updatedAt: string;
}


export interface AutomationAction {
    id: string;
    label: string;
    params: string[];
}


export interface SimulationStep {
    nodeId: string;
    nodeType: NodeType;
    nodeTitle: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    message: string;
    timestamp: number;
}

export interface SimulationResult {
    success: boolean;
    steps: SimulationStep[];
    errors: ValidationError[];
    duration: number;
}


export interface ValidationError {
    nodeId?: string;
    type: 'error' | 'warning';
    message: string;
}


export const createStartNodeData = (): StartNodeData => ({
    type: 'start',
    label: 'Start',
    title: 'Workflow Start',
    metadata: {},
});

export const createTaskNodeData = (): TaskNodeData => ({
    type: 'task',
    label: 'Task',
    title: 'New Task',
    description: '',
    assignee: '',
    dueDate: '',
    customFields: {},
});

export const createApprovalNodeData = (): ApprovalNodeData => ({
    type: 'approval',
    label: 'Approval',
    title: 'Approval Step',
    approverRole: 'Manager',
    autoApproveThreshold: 0,
});

export const createAutomatedNodeData = (): AutomatedNodeData => ({
    type: 'automated',
    label: 'Automated',
    title: 'Automated Step',
    actionId: '',
    actionParams: {},
});

export const createEndNodeData = (): EndNodeData => ({
    type: 'end',
    label: 'End',
    endMessage: 'Workflow completed successfully',
    showSummary: true,
});
