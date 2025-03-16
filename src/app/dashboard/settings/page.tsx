"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {
  const handleSaveSettings = () => {
    toast.success("Settings saved");
  };

  const handleClearData = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      toast.success("All data has been cleared");
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <p className="text-muted-foreground mb-8">
        Configure your workflow automation preferences
      </p>

      <div className="grid grid-cols-1 gap-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-save">Auto Save</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save workflows as you edit
                </p>
              </div>
              <Switch id="auto-save" defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch id="dark-mode" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Python Execution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="timeout">Execution Timeout</Label>
                <p className="text-sm text-muted-foreground">
                  Maximum time in seconds a node can run
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="timeout"
                  className="w-20 h-10 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  defaultValue={30}
                  min={1}
                  max={300}
                />
                <span className="text-sm">seconds</span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="memory-limit">Memory Limit</Label>
                <p className="text-sm text-muted-foreground">
                  Maximum memory a node can use
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="memory-limit"
                  className="w-20 h-10 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  defaultValue={256}
                  min={64}
                  max={1024}
                />
                <span className="text-sm">MB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Manage your workflow data and storage
            </p>

            <div className="flex flex-col gap-2">
              <Button variant="destructive" onClick={handleClearData}>
                Clear All Data
              </Button>

              <p className="text-xs text-muted-foreground">
                This will remove all locally stored workflows. This action cannot be undone.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
