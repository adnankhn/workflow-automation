"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useWorkflowStore } from "@/lib/store";
import WorkflowCanvas from "@/components/workflow/workflow-canvas";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, PlayIcon } from "lucide-react";
import { toast } from "sonner";

const NodeEditor = dynamic(() => import("@/components/workflow/node-editor").then((mod) => mod.NodeEditor), {
  ssr: false,
});

interface WorkflowData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function WorkflowPage() {
  const params = useParams();
  const workflowId = params.id as string;
  const { workflowName, updateWorkflowName, setWorkflowId, activeNodeId } = useWorkflowStore();
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [nameInput, setNameInput] = React.useState("");

  useEffect(() => {
    // Set current workflow ID in the store
    setWorkflowId(workflowId);

    // Load workflow data from localStorage
    const storedWorkflows = localStorage.getItem("workflows");
    if (storedWorkflows) {
      try {
        const workflows = JSON.parse(storedWorkflows) as WorkflowData[];
        const currentWorkflow = workflows.find((w) => w.id === workflowId);
        if (currentWorkflow) {
          updateWorkflowName(currentWorkflow.name);
          setNameInput(currentWorkflow.name);
        }
      } catch (e) {
        console.error("Failed to parse workflows");
      }
    }
  }, [workflowId, setWorkflowId, updateWorkflowName]);

  const handleEditName = () => {
    setIsEditingName(true);
    setNameInput(workflowName);
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateWorkflowName(nameInput.trim());

      // Also update the workflow name in localStorage
      const storedWorkflows = localStorage.getItem("workflows");
      if (storedWorkflows) {
        try {
          const workflows = JSON.parse(storedWorkflows) as WorkflowData[];
          const updatedWorkflows = workflows.map((w) => {
            if (w.id === workflowId) {
              return { ...w, name: nameInput.trim(), updatedAt: new Date().toISOString() };
            }
            return w;
          });
          localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));
        } catch (e) {
          console.error("Failed to update workflow name");
        }
      }
    }
    setIsEditingName(false);
  };

  const saveWorkflow = React.useCallback(() => {
    // In a real app, we would save to a database
    toast.success("Workflow saved successfully");
  }, []);

  const runWorkflow = React.useCallback(() => {
    // In a real app, we would run the workflow on the server
    toast.success("Workflow execution started");
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="h-9 w-60"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveName}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{workflowName}</h1>
              <Button variant="ghost" size="icon" onClick={handleEditName}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={saveWorkflow}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button onClick={runWorkflow}>
            <PlayIcon className="h-4 w-4 mr-1" />
            Run Workflow
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 ${activeNodeId ? "lg:flex-2" : ""} transition-all duration-200`}>
          <WorkflowCanvas />
        </div>

        {activeNodeId && (
          <div className="hidden lg:block border-l w-[400px] shrink-0">
            <NodeEditor />
          </div>
        )}
      </div>
    </div>
  );
}
