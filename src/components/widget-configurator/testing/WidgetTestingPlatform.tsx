import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TestEnvironmentSelector } from "./TestEnvironmentSelector";
import { LiveEmbedPreview } from "./LiveEmbedPreview";
import { TestScenarios } from "./TestScenarios";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { DeviceSimulator } from "./DeviceSimulator";

export const WidgetTestingPlatform = ({ widgetConfig }) => {
  const [environment, setEnvironment] = useState("development");
  const [widgetId, setWidgetId] = useState("widget_123456789");
  const [activeTab, setActiveTab] = useState("preview");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Widget Testing Platform</CardTitle>
          <CardDescription>
            Test and validate your widget configuration across different
            environments and devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="preview"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
              <TabsTrigger value="devices">Device Testing</TabsTrigger>
              <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <TestEnvironmentSelector
                  environment={environment}
                  setEnvironment={setEnvironment}
                  widgetId={widgetId}
                  setWidgetId={setWidgetId}
                />
              </div>

              <div className="md:col-span-2">
                <TabsContent value="preview" className="m-0">
                  <LiveEmbedPreview
                    config={widgetConfig}
                    widgetId={widgetId}
                    environment={environment}
                  />
                </TabsContent>

                <TabsContent value="devices" className="m-0">
                  <DeviceSimulator
                    previewUrl={`https://${environment}-preview.chatadmin.com/preview/${widgetId}?t=${Date.now()}`}
                  />
                </TabsContent>

                <TabsContent value="scenarios" className="m-0">
                  <TestScenarios />
                </TabsContent>

                <TabsContent value="performance" className="m-0">
                  <PerformanceMetrics />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
