"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FolderOpen, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();

  const createNewWorkflow = () => {
    const id = nanoid();

    // In a real app, we'd create the workflow in the database or a central store
    // For now, we'll just create a workflow in localStorage
    const existingWorkflows = localStorage.getItem("workflows");
    const workflows = existingWorkflows ? JSON.parse(existingWorkflows) : [];

    const newWorkflow = {
      id,
      name: `New Workflow ${workflows.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("workflows", JSON.stringify([...workflows, newWorkflow]));
    toast.success("New workflow created");
    router.push(`/dashboard/workflow/${id}`);
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome to Flow Automator</h1>
      <p className="text-muted-foreground mb-8 max-w-3xl">
        Create powerful Python automation workflows with a visual, drag-and-drop interface.
        Connect nodes together to build complex automation processes without writing code directly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card className="p-1">
          <CardContent className="p-6 space-y-4">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center">
              <PlusCircle className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Create New Workflow</h2>
            <p className="text-muted-foreground">
              Start with a blank canvas and build your workflow from scratch.
            </p>
            <Button className="w-full" onClick={createNewWorkflow}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </CardContent>
        </Card>

        <Card className="p-1">
          <CardContent className="p-6 space-y-4">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center">
              <FolderOpen className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Start from Template</h2>
            <p className="text-muted-foreground">
              Choose from pre-built templates to jumpstart your workflow.
            </p>
            <Button className="w-full" variant="outline">
              <FolderOpen className="mr-2 h-4 w-4" />
              Browse Templates
            </Button>
          </CardContent>
        </Card>

        <Card className="p-1">
          <CardContent className="p-6 space-y-4">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center">
              <Zap className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Run Sample Workflow</h2>
            <p className="text-muted-foreground">
              See how it works with a demonstration workflow.
            </p>
            <Button className="w-full" variant="outline">
              <Zap className="mr-2 h-4 w-4" />
              Try Demo
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex gap-3">
          <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <span className="font-bold">1</span>
          </div>
          <div>
            <h3 className="font-medium">Visual Workflow Builder</h3>
            <p className="text-sm text-muted-foreground">Create workflows by dragging and connecting nodes on a canvas.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <span className="font-bold">2</span>
          </div>
          <div>
            <h3 className="font-medium">Python Code Execution</h3>
            <p className="text-sm text-muted-foreground">Run Python code within each node with syntax highlighting.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <span className="font-bold">3</span>
          </div>
          <div>
            <h3 className="font-medium">Scheduled Triggers</h3>
            <p className="text-sm text-muted-foreground">Set workflows to run automatically on a schedule.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <span className="font-bold">4</span>
          </div>
          <div>
            <h3 className="font-medium">Data Flow Between Nodes</h3>
            <p className="text-sm text-muted-foreground">Pass data from one node to another in sequence.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <span className="font-bold">5</span>
          </div>
          <div>
            <h3 className="font-medium">Real-time Execution</h3>
            <p className="text-sm text-muted-foreground">Run and test your workflow in real-time with visual feedback.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <span className="font-bold">6</span>
          </div>
          <div>
            <h3 className="font-medium">Execution History</h3>
            <p className="text-sm text-muted-foreground">Track the history and logs of workflow executions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
