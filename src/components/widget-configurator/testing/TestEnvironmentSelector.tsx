import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Laptop, Server, Globe } from "lucide-react";

export const TestEnvironmentSelector = ({
  environment,
  setEnvironment,
  widgetId,
  setWidgetId,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Environment</CardTitle>
        <CardDescription>Select where to test your widget</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="environment">Environment</Label>
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger id="environment" className="w-full">
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">
                <div className="flex items-center">
                  <Laptop className="mr-2 h-4 w-4" />
                  <span>Development</span>
                </div>
              </SelectItem>
              <SelectItem value="staging">
                <div className="flex items-center">
                  <Server className="mr-2 h-4 w-4" />
                  <span>Staging</span>
                </div>
              </SelectItem>
              <SelectItem value="production">
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  <span>Production</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="widgetId">Widget ID</Label>
          <div className="flex space-x-2">
            <Input
              id="widgetId"
              value={widgetId}
              onChange={(e) => setWidgetId(e.target.value)}
              placeholder="Enter widget ID"
            />
            <Button variant="outline">Generate</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            This is the unique identifier for your widget instance
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
