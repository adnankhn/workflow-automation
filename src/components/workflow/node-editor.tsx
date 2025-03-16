"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { PlayIcon, Clock, X } from "lucide-react";
import { useWorkflowStore } from "@/lib/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { toast } from "sonner";
import { executePython } from "@/lib/python-executor";

export function NodeEditor() {
  const {
    nodes,
    activeNodeId,
    setActiveNodeId,
    updateNodeData,
    setNodeRunning,
    setNodeOutput
  } = useWorkflowStore();

  const activeNode = nodes.find((node) => node.id === activeNodeId);
  const [nodeName, setNodeName] = useState("");
  const [nodeCode, setNodeCode] = useState("");
  const [triggerInterval, setTriggerInterval] = useState<number | undefined>(undefined);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // This is used to populate the editor when a node is selected
  useEffect(() => {
    if (activeNode) {
      setNodeName(activeNode.data.label);
      setNodeCode(activeNode.data.code);
      setTriggerInterval(activeNode.data.triggerInterval);
      setOutput(activeNode.data.output || "");
    } else {
      setNodeName("");
      setNodeCode("");
      setTriggerInterval(undefined);
      setOutput("");
    }
  }, [activeNode]);

  // This is used to save to the store when node data changes in the editor
  useEffect(() => {
    if (activeNodeId && (nodeName !== activeNode?.data.label || nodeCode !== activeNode?.data.code ||
        triggerInterval !== activeNode?.data.triggerInterval)) {
      const debounce = setTimeout(() => {
        updateNodeData(activeNodeId, {
          label: nodeName,
          code: nodeCode,
          triggerInterval,
        });
      }, 500);

      return () => clearTimeout(debounce);
    }
  }, [nodeName, nodeCode, triggerInterval, activeNodeId, updateNodeData, activeNode?.data.label, activeNode?.data.code, activeNode?.data.triggerInterval]);

  // Handle running the node
  const runNode = () => {
    if (!activeNodeId || !activeNode) return;

    // Show running state
    setIsRunning(true);
    setNodeRunning(activeNodeId, true);
    setOutput("");

    // In a real app, we'd send the code to a server to run
    try {
      executePython(nodeCode)
        .then((result) => {
          const outputText = `Code executed successfully!\n\nOutput:\n\`\`\`json\n${result}\`\`\``;
          setOutput(outputText);
          setNodeOutput(activeNodeId, outputText);
          toast.success("Node executed successfully");
        })
        .catch((error) => {
          const errorOutput = `Execution failed!\n\nError:\n${error}`;
          setOutput(errorOutput);
          setNodeOutput(activeNodeId, errorOutput);
          toast.error("Failed to execute node");
        })
        .finally(() => {
          setIsRunning(false);
          setNodeRunning(activeNodeId, false);
        });
    } catch (error: any) {
      const errorOutput = `Execution failed!\n\nError:\n${error}`;
      setOutput(errorOutput);
      setNodeOutput(activeNodeId, errorOutput);
      toast.error("Failed to execute node");
      setIsRunning(false);
      setNodeRunning(activeNodeId, false);
    }
  };

  if (!activeNode) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Select a node to edit</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between py-3 px-4 border-b">
        <div className="font-semibold">Node Editor</div>
        <Button variant="ghost" size="icon" onClick={() => setActiveNodeId(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="node-name">Node Name</Label>
          <Input
            id="node-name"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Enter node name"
          />
        </div>

        {activeNode.data.type === "trigger" && (
          <div className="space-y-2">
            <Label htmlFor="trigger-interval">Trigger Interval (minutes)</Label>
            <Select
              value={triggerInterval?.toString() || ""}
              onValueChange={(value) => setTriggerInterval(parseInt(value) || undefined)}
            >
              <SelectTrigger id="trigger-interval" className="w-full">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Every 5 minutes</SelectItem>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every hour</SelectItem>
                <SelectItem value="360">Every 6 hours</SelectItem>
                <SelectItem value="720">Every 12 hours</SelectItem>
                <SelectItem value="1440">Every day</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
              <Clock className="h-3 w-3" />
              {triggerInterval
                ? `Runs every ${triggerInterval} minutes`
                : "No automatic schedule"
              }
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <Label>Python Code</Label>
            <Button
              onClick={runNode}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <PlayIcon className="mr-1 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <PlayIcon className="mr-1 h-4 w-4" />
                  Test Run
                </>
              )}
            </Button>
          </div>

          <div className="relative border rounded-md overflow-hidden">
            <CodeMirror
              value={nodeCode}
              onChange={setNodeCode}
              height="240px"
              extensions={[python()]}
              theme="dark"
            />
          </div>
        </div>

        {(isRunning || output) && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label>Output</Label>
              <Card className="p-4 bg-black font-mono text-sm overflow-auto h-60 whitespace-pre-wrap">
              {isRunning ? (
                <div className="flex items-center gap-2 text-green-400">
                  <PlayIcon className="h-4 w-4 animate-spin" />
                  Executing code...
                </div>
              ) : (
                <div className="text-green-400">
                  {output.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
