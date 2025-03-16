"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import { PlusCircle, Activity, Settings } from "lucide-react";
import { FiFile } from "react-icons/fi";
import { Separator } from "@/components/ui/separator";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Define a type for workflow data
interface Workflow {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load workflows from localStorage or an API in a production app
    const storedWorkflows = localStorage.getItem("workflows");
    if (storedWorkflows) {
      try {
        setWorkflows(JSON.parse(storedWorkflows));
      } catch (e) {
        console.error("Failed to parse workflows from localStorage");
      }
    }
  }, []);

  // Save workflows to localStorage whenever they change
  useEffect(() => {
    if (isClient && workflows.length > 0) {
      localStorage.setItem("workflows", JSON.stringify(workflows));
    }
  }, [workflows, isClient]);

  const createNewWorkflow = () => {
    const id = nanoid();
    const newWorkflow: Workflow = {
      id,
      name: `New Workflow ${workflows.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkflows([...workflows, newWorkflow]);
    toast.success("New workflow created");
    router.push(`/dashboard/workflow/${id}`);
  };

  const isWorkflowPath = pathname.startsWith("/dashboard/workflow/");
  const currentWorkflowId = isWorkflowPath ? pathname.split("/").pop() : null;

  return (
    <Sidebar className="border-r">
      <div className="flex h-14 items-center px-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-semibold">Flow Automator</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-muted-foreground">
              WORKFLOWS
            </h2>
            <Button size="icon" variant="ghost" className="h-5 w-5" onClick={createNewWorkflow}>
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">New workflow</span>
            </Button>
          </div>
          <Button
            variant="default"
            className="w-full justify-start mb-3"
            onClick={createNewWorkflow}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
          <Separator className="my-2" />
          <div className="space-y-1 mt-3">
            {workflows.map((workflow) => (
              <Link
                key={workflow.id}
                href={`/dashboard/workflow/${workflow.id}`}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors",
                  currentWorkflowId === workflow.id ? "bg-muted" : "transparent"
                )}
              >
                <FiFile className="h-4 w-4" />
                <span className="truncate">{workflow.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto border-t p-2">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>
    </Sidebar>
  );
}
