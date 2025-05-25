import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const PerformanceMetrics = () => {
  // Sample performance data
  const metrics = {
    loadTime: "0.8s",
    firstInteraction: "1.2s",
    messageLatency: "0.3s",
    memoryUsage: "5.2 MB",
    cpuUsage: "2%",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          Monitor widget performance and resource usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Load Time"
                value={metrics.loadTime}
                description="Time to fully load widget"
              />
              <MetricCard
                title="First Interaction"
                value={metrics.firstInteraction}
                description="Time until widget is interactive"
              />
              <MetricCard
                title="Message Latency"
                value={metrics.messageLatency}
                description="Average response time"
              />
              <MetricCard
                title="Memory Usage"
                value={metrics.memoryUsage}
                description="Browser memory consumption"
              />
            </div>
          </TabsContent>

          <TabsContent value="charts" className="pt-4">
            <div className="h-[200px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
              <p className="text-muted-foreground">
                Performance charts will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const MetricCard = ({ title, value, description }) => (
  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
    <h4 className="text-sm font-medium">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
);
