"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { useWorkflowStore, WorkflowNode } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const CustomNode = memo(({ id, data, selected }: NodeProps<WorkflowNode["data"]>) => {
  const setActiveNodeId = useWorkflowStore((state) => state.setActiveNodeId);
  const isRunning = data.isRunning || false;

  const handleClick = () => {
    setActiveNodeId(id);
  };

  // Determine the node background color based on type
  const getBgColor = () => {
    switch (data.type) {
      case "trigger":
        return "bg-violet-100 dark:bg-violet-900/20 border-violet-400 dark:border-violet-600";
      case "output":
        return "bg-green-100 dark:bg-green-900/20 border-green-400 dark:border-green-600";
      default:
        return "bg-blue-100 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600";
    }
  };

  // Determine the node header color based on type
  const getHeaderColor = () => {
    switch (data.type) {
      case "trigger":
        return "bg-violet-200 dark:bg-violet-800";
      case "output":
        return "bg-green-200 dark:bg-green-800";
      default:
        return "bg-blue-200 dark:bg-blue-800";
    }
  };

  return (
    <div
      className={cn(
        "rounded-md border shadow-md w-[200px] transition-all",
        getBgColor(),
        selected ? "ring-2 ring-primary ring-offset-2" : "",
      )}
      onClick={handleClick}
    >
      {/* Node Header */}
      <div
        className={cn(
          "px-4 py-2 rounded-t-md font-medium flex items-center gap-2",
          getHeaderColor()
        )}
      >
        {isRunning ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : null}
        <div className="truncate">{data.label}</div>
      </div>

      {/* Node Body */}
      <div className="p-3 text-xs">
        <div className="truncate text-muted-foreground">
          {data.code.split("\n")[0]}...
        </div>
      </div>

      {/* Input Handle - only for non-trigger nodes */}
      {data.type !== "trigger" && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-primary border-2 border-background"
        />
      )}

      {/* Output Handle - only for non-output nodes */}
      {data.type !== "output" && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-primary border-2 border-background"
        />
      )}
    </div>
  );
});

CustomNode.displayName = "CustomNode";

export default CustomNode;
