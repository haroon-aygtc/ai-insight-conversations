import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Play, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface TestScenario {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "passed" | "failed";
  duration?: number;
}

interface TestScenarioProps {
  onRunTest: (scenarioId: string) => void;
  previewUrl?: string;
}

export const TestScenarios = ({ onRunTest, previewUrl }: TestScenarioProps) => {
  const [scenarios, setScenarios] = useState<TestScenario[]>([
    {
      id: "load",
      name: "Initial Load",
      description: "Tests widget loading and initialization",
      status: "pending",
    },
    {
      id: "open-close",
      name: "Open/Close Cycle",
      description: "Tests opening and closing the widget",
      status: "pending",
    },
    {
      id: "message",
      name: "Send Message",
      description: "Tests sending and receiving messages",
      status: "pending",
    },
    {
      id: "responsive",
      name: "Responsive Behavior",
      description: "Tests widget behavior on different screen sizes",
      status: "pending",
    },
    {
      id: "accessibility",
      name: "Accessibility",
      description: "Tests keyboard navigation and screen reader compatibility",
      status: "pending",
    },
  ]);

  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

  const toggleScenario = (id: string) => {
    setSelectedScenarios((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const runSelectedTests = () => {
    if (selectedScenarios.length === 0) return;

    // Update status to running for selected scenarios
    setScenarios((prev) =>
      prev.map((scenario) => ({
        ...scenario,
        status: selectedScenarios.includes(scenario.id)
          ? "running"
          : scenario.status,
      })),
    );

    // Simulate test runs with timeouts
    selectedScenarios.forEach((id) => {
      const testDuration = Math.floor(Math.random() * 2000) + 500;

      setTimeout(() => {
        setScenarios((prev) =>
          prev.map((scenario) =>
            scenario.id === id
              ? {
                  ...scenario,
                  status: Math.random() > 0.2 ? "passed" : "failed",
                  duration: testDuration,
                }
              : scenario,
          ),
        );
      }, testDuration);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "running":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <div className="h-5 w-5 rounded-full border border-slate-300" />;
    }
  };

  const allSelected = scenarios.length === selectedScenarios.length;
  const someSelected = selectedScenarios.length > 0 && !allSelected;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Scenarios</CardTitle>
        <CardDescription>Validate your widget functionality</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={() => {
                if (allSelected) {
                  setSelectedScenarios([]);
                } else {
                  setSelectedScenarios(scenarios.map((s) => s.id));
                }
              }}
            />
            <Label htmlFor="select-all" className="font-medium">
              {allSelected
                ? "Deselect All"
                : someSelected
                  ? "Select All"
                  : "Select All"}
            </Label>
          </div>

          <div className="space-y-2">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50"
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`scenario-${scenario.id}`}
                    checked={selectedScenarios.includes(scenario.id)}
                    onCheckedChange={() => toggleScenario(scenario.id)}
                    disabled={scenario.status === "running"}
                  />
                  <div>
                    <Label
                      htmlFor={`scenario-${scenario.id}`}
                      className="font-medium"
                    >
                      {scenario.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {scenario.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {scenario.duration && scenario.status !== "running" && (
                    <span className="text-xs text-muted-foreground">
                      {(scenario.duration / 1000).toFixed(1)}s
                    </span>
                  )}
                  {getStatusIcon(scenario.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={runSelectedTests}
          disabled={
            selectedScenarios.length === 0 ||
            scenarios.some((s) => s.status === "running")
          }
          className="w-full"
        >
          <Play className="h-4 w-4 mr-2" />
          Run {selectedScenarios.length} Selected Tests
        </Button>
      </CardFooter>
    </Card>
  );
};
