
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TestEnvironmentSelector } from './TestEnvironmentSelector';
import { LiveEmbedPreview } from './LiveEmbedPreview';
import { TestScenarios } from './TestScenarios';
import { PerformanceMetrics } from './PerformanceMetrics';
import { DeviceSimulator } from './DeviceSimulator';

interface WidgetTestingPlatformProps {
  config: any;
  widgetId: string;
}

export const WidgetTestingPlatform: React.FC<WidgetTestingPlatformProps> = ({
  config,
  widgetId
}) => {
  const [activeTest, setActiveTest] = useState("live-preview");
  const [testEnvironment, setTestEnvironment] = useState("development");
  const [selectedDevice, setSelectedDevice] = useState("desktop");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Widget Testing Platform</h3>
        <p className="text-sm text-slate-500 mb-4">
          Test your widget embed code in different environments and scenarios
        </p>
      </div>

      <TestEnvironmentSelector
        environment={testEnvironment}
        onEnvironmentChange={setTestEnvironment}
      />

      <Tabs value={activeTest} onValueChange={setActiveTest} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live-preview">Live Preview</TabsTrigger>
          <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
          <TabsTrigger value="devices">Device Testing</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="live-preview" className="space-y-4">
          <LiveEmbedPreview
            config={config}
            widgetId={widgetId}
            environment={testEnvironment}
          />
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <TestScenarios
            config={config}
            widgetId={widgetId}
            environment={testEnvironment}
          />
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <DeviceSimulator
            config={config}
            widgetId={widgetId}
            selectedDevice={selectedDevice}
            onDeviceChange={setSelectedDevice}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetrics
            config={config}
            widgetId={widgetId}
            environment={testEnvironment}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
