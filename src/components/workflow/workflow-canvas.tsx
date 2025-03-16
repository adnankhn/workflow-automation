"use client";

import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  Node,
  SelectionMode
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Zap, FileOutput, Trash2 } from "lucide-react";
import CustomNode from "./custom-node";
import { useWorkflowStore } from "@/lib/store";
import { toast } from "sonner";

// Define node types
const nodeTypes = {
  customNode: CustomNode,
};

function WorkflowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useWorkflowStore();
  const { project } = useReactFlow();

  // Function to add a new node on canvas click
  const onAddNode = useCallback(
    (type: "standard" | "trigger" | "output") => {
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      // Calculate the center of the viewport
      const position = project({
        x: reactFlowBounds.width / 2,
        y: reactFlowBounds.height / 2,
      });

      addNode(type, position);
      toast.success(`New ${type} node added`);
    },
    [project, addNode]
  );

  // Handle node selection
  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    setSelectedNodes(nodes.map((node) => node.id));
  }, []);

  // Delete selected nodes
  const deleteSelectedNodes = useCallback(() => {
    if (selectedNodes.length === 0) return;

    // In a real app, we'd delete the nodes from the store
    // For now, let's just show a toast
    toast.success(`${selectedNodes.length} node(s) deleted`);
  }, [selectedNodes]);

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={["Backspace", "Delete"]}
        selectionMode={SelectionMode.Partial}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />

        <Panel position="top-left" className="p-2">
          <TooltipProvider>
            <div className="bg-background border shadow-md rounded-lg p-1.5 flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md"
                    onClick={() => onAddNode("standard")}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Process Node</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md"
                    onClick={() => onAddNode("trigger")}
                  >
                    <Zap className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Trigger Node</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md"
                    onClick={() => onAddNode("output")}
                  >
                    <FileOutput className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Output Node</TooltipContent>
              </Tooltip>

              <div className="border-r mx-1 h-6"></div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md text-red-500"
                    onClick={deleteSelectedNodes}
                    disabled={selectedNodes.length === 0}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Selected</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
}
