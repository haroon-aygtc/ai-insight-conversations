import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceSimulator } from "./DeviceSimulator";
import { LiveEmbedPreview } from "./LiveEmbedPreview";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { TestScenarios } from "./TestScenarios";
import { TestEnvironmentSelector } from "./TestEnvironmentSelector";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface WidgetTestingPlatformProps {
  widgetId: string;
  config: any;
}

export const WidgetTestingPlatform = ({
  widgetId,
  config,
}: WidgetTestingPlatformProps) => {
  const [activeTab, setActiveTab] = useState("preview");
  const [environment, setEnvironment] = useState("development");
  const [previewUrl, setPreviewUrl] = useState(
    `https://${environment}-preview.chatadmin.com/preview/${widgetId}?t=${Date.now()}`,
  );

  const handleEnvironmentChange = (env: string) => {
    setEnvironment(env);
    setPreviewUrl(
      `https://${env}-preview.chatadmin.com/preview/${widgetId}?t=${Date.now()}`,
    );
  };

  const handleRunTest = (scenarioId: string) => {
    console.log(`Running test scenario: ${scenarioId}`);
    // In a real implementation, this would trigger actual test scenarios
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Widget Testing Platform</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList>
                  <TabsTrigger value="preview">Live Preview</TabsTrigger>
                  <TabsTrigger value="devices">Device Testing</TabsTrigger>
                  <TabsTrigger value="embed">Embed Code</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <TabsContent value="preview" className="m-0">
                <div className="p-6">
                  <LiveEmbedPreview
                    config={config}
                    widgetId={widgetId}
                    environment={environment}
                  />
                </div>
              </TabsContent>
              <TabsContent value="devices" className="m-0">
                <div className="p-6">
                  <DeviceSimulator previewUrl={previewUrl} />
                </div>
              </TabsContent>
              <TabsContent value="embed" className="m-0">
                <div className="p-6">
                  <LiveEmbedPreview
                    config={config}
                    widgetId={widgetId}
                    environment={environment}
                  />
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <TestEnvironmentSelector
            environment={environment}
            onEnvironmentChange={handleEnvironmentChange}
          />
          <PerformanceMetrics previewUrl={previewUrl} />
          <TestScenarios onRunTest={handleRunTest} previewUrl={previewUrl} />
        </div>
      </div>
    </div>
  );
};
