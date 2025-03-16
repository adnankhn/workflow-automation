"use client";

import { create } from "zustand";
import { Node, Edge, Connection, addEdge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from "reactflow";
import { nanoid } from "nanoid";

export interface WorkflowNode extends Node {
  data: {
    label: string;
    code: string;
    type: "standard" | "trigger" | "output";
    triggerInterval?: number; // in minutes, for trigger nodes
    isRunning?: boolean;
    output?: string;
  };
}

type RFState = {
  nodes: WorkflowNode[];
  edges: Edge[];
  activeNodeId: string | null;
  workflowName: string;
  workflowId: string;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  addNode: (type: "standard" | "trigger" | "output", position: { x: number; y: number }) => void;
  setActiveNodeId: (nodeId: string | null) => void;
  updateWorkflowName: (name: string) => void;
  setWorkflowId: (id: string) => void;
  setNodeRunning: (nodeId: string, isRunning: boolean) => void;
  setNodeOutput: (nodeId: string, output: string) => void;
};

// Initial nodes and edges
const initialNodes: WorkflowNode[] = [];
const initialEdges: Edge[] = [];

export const useWorkflowStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  activeNodeId: null,
  workflowName: "Untitled Workflow",
  workflowId: "",

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
    // Only allow one outgoing edge from trigger nodes
    if (connection.source) {
      const sourceNode = get().nodes.find(node => node.id === connection.source);
      if (sourceNode?.data.type === "trigger") {
        const existingEdge = get().edges.find(edge => edge.source === connection.source);
        if (existingEdge) {
          return; // Don't add a new edge if a trigger already has an outgoing connection
        }
      }
    }

    set({
      edges: addEdge({
        ...connection,
        type: 'smoothstep',
        animated: true,
      }, get().edges),
    });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      }),
    });
  },

  addNode: (type, position) => {
    const newNode: WorkflowNode = {
      id: nanoid(),
      type: "customNode",
      position,
      data: {
        label: type === "trigger"
          ? "Trigger Node"
          : type === "output"
            ? "Output Node"
            : "Process Node",
        code: type === "trigger"
          ? "# This node will trigger the workflow\n# You can access the trigger data with `trigger_data`\n\noutput = {'message': 'Workflow started'}"
          : "# Enter your Python code here\n# You can access the input data with `input_data`\n\noutput = input_data",
        type,
        isRunning: false,
        output: "",
      }
    };

    set({
      nodes: [...get().nodes, newNode],
      activeNodeId: newNode.id,
    });

    return newNode.id;
  },

  setActiveNodeId: (nodeId) => {
    set({ activeNodeId: nodeId });
  },

  updateWorkflowName: (name) => {
    set({ workflowName: name });
  },

  setWorkflowId: (id) => {
    set({ workflowId: id });
  },

  setNodeRunning: (nodeId, isRunning) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              isRunning,
            },
          };
        }
        return node;
      }),
    });
  },

  setNodeOutput: (nodeId, output) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              output,
              isRunning: false,
            },
          };
        }
        return node;
      }),
    });
  },
}));
