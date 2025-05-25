import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Play, Plus } from "lucide-react";

export const TestScenarios = () => {
  const scenarios = [
    {
      id: "basic-conversation",
      name: "Basic Conversation Flow",
      description:
        "Tests the standard user conversation flow with simple queries",
    },
    {
      id: "error-handling",
      name: "Error Handling",
      description: "Tests how the widget handles errors and edge cases",
    },
    {
      id: "performance",
      name: "Performance Test",
      description: "Tests widget performance under load with multiple messages",
    },
    {
      id: "responsive",
      name: "Responsive Design",
      description: "Tests widget appearance across different screen sizes",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Scenarios</CardTitle>
        <CardDescription>
          Run automated tests to verify widget functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scenarios.map((scenario, index) => (
            <div key={scenario.id}>
              {index > 0 && <Separator className="my-4" />}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Checkbox id={scenario.id} />
                  <div>
                    <Label
                      htmlFor={scenario.id}
                      className="text-base font-medium"
                    >
                      {scenario.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {scenario.description}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-1" />
                  Run
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-1" />
            Create Custom Test Scenario
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
