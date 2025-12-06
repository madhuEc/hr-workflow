import type {
  AutomationAction,
  SimulationResult,
  SimulationStep,
  ValidationError,
  WorkflowNode,
  WorkflowEdge,
  NodeType,
} from '../types';
import { automationActions } from './mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300);
  return automationActions;
}


export async function simulateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): Promise<SimulationResult> {
  await delay(500);

  const errors = validateWorkflow(nodes, edges);
  if (errors.some((e) => e.type === 'error')) {
    return {
      success: false,
      steps: [],
      errors,
      duration: 0,
    };
  }


  const executionOrder = getExecutionOrder(nodes, edges);
  const steps: SimulationStep[] = [];
  const startTime = Date.now();

  for (const node of executionOrder) {
    const nodeData = node.data;
    const step: SimulationStep = {
      nodeId: node.id,
      nodeType: nodeData.type as NodeType,
      nodeTitle: getNodeTitle(node),
      status: 'completed',
      message: getSimulationMessage(node),
      timestamp: Date.now(),
    };


    if (Math.random() < 0.1 && nodeData.type !== 'start' && nodeData.type !== 'end') {
      step.status = 'failed';
      step.message = `Simulation failed: ${getRandomFailureReason(nodeData.type as NodeType)}`;
    }

    steps.push(step);


    await delay(200);
  }

  const hasFailure = steps.some((s) => s.status === 'failed');

  return {
    success: !hasFailure,
    steps,
    errors,
    duration: Date.now() - startTime,
  };
}

function getNodeTitle(node: WorkflowNode): string {
  const data = node.data;
  if ('title' in data && typeof data.title === 'string') return data.title;
  if ('endMessage' in data) return 'End';
  return (data.label as string) || 'Unknown';
}

function getSimulationMessage(node: WorkflowNode): string {
  const data = node.data;
  switch (data.type) {
    case 'start':
      return `Workflow started: ${data.title}`;
    case 'task':
      return `Task "${data.title}" assigned to ${data.assignee || 'unassigned'}`;
    case 'approval':
      return `Approval requested from ${data.approverRole}`;
    case 'automated':
      return `Executing automated action: ${data.actionId || 'none configured'}`;
    case 'end':
      return data.endMessage || 'Workflow completed';
    default:
      return 'Step executed';
  }
}

function getRandomFailureReason(type: NodeType): string {
  const reasons: Record<NodeType, string[]> = {
    start: ['Failed to initialize workflow'],
    task: [
      'Assignee not available',
      'Task timed out',
      'Required fields missing',
    ],
    approval: [
      'Approver rejected request',
      'Approval timeout exceeded',
      'Insufficient permissions',
    ],
    automated: [
      'External service unavailable',
      'Invalid parameters',
      'Rate limit exceeded',
    ],
    end: ['Failed to complete workflow'],
  };
  const typeReasons = reasons[type];
  return typeReasons[Math.floor(Math.random() * typeReasons.length)];
}


export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  const startNodes = nodes.filter((n) => n.data.type === 'start');
  if (startNodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'Workflow must have a Start node',
    });
  } else if (startNodes.length > 1) {
    errors.push({
      type: 'error',
      message: 'Workflow can only have one Start node',
    });
  }


  const endNodes = nodes.filter((n) => n.data.type === 'end');
  if (endNodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'Workflow must have at least one End node',
    });
  }


  if (startNodes.length > 0) {
    const startNode = startNodes[0];
    const hasIncoming = edges.some((e) => e.target === startNode.id);
    if (hasIncoming) {
      errors.push({
        nodeId: startNode.id,
        type: 'error',
        message: 'Start node cannot have incoming connections',
      });
    }
  }


  for (const endNode of endNodes) {
    const hasOutgoing = edges.some((e) => e.source === endNode.id);
    if (hasOutgoing) {
      errors.push({
        nodeId: endNode.id,
        type: 'error',
        message: 'End node cannot have outgoing connections',
      });
    }
  }


  const connectedNodeIds = new Set<string>();
  edges.forEach((e) => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });

  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id) && nodes.length > 1) {
      errors.push({
        nodeId: node.id,
        type: 'warning',
        message: `Node "${getNodeTitle(node)}" is not connected to the workflow`,
      });
    }
  }


  if (hasCycle(nodes, edges)) {
    errors.push({
      type: 'error',
      message: 'Workflow contains a cycle, which is not allowed',
    });
  }


  for (const node of nodes) {
    const data = node.data;
    if (data.type === 'task' && !data.title) {
      errors.push({
        nodeId: node.id,
        type: 'warning',
        message: 'Task node is missing a title',
      });
    }
    if (data.type === 'automated' && !data.actionId) {
      errors.push({
        nodeId: node.id,
        type: 'warning',
        message: 'Automated node has no action configured',
      });
    }
  }

  return errors;
}


function hasCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adjacencyList = new Map<string, string[]>();

  nodes.forEach((n) => adjacencyList.set(n.id, []));
  edges.forEach((e) => {
    const sources = adjacencyList.get(e.source);
    if (sources) sources.push(e.target);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}


function getExecutionOrder(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): WorkflowNode[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const inDegree = new Map<string, number>();
  const adjacencyList = new Map<string, string[]>();

  nodes.forEach((n) => {
    inDegree.set(n.id, 0);
    adjacencyList.set(n.id, []);
  });

  edges.forEach((e) => {
    const sources = adjacencyList.get(e.source);
    if (sources) sources.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
  });


  const queue: string[] = [];
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) queue.push(nodeId);
  });

  const result: WorkflowNode[] = [];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodeMap.get(nodeId);
    if (node) result.push(node);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      const newDegree = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    }
  }

  return result;
}

export { automationActions };
