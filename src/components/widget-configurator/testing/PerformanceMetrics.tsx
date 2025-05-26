
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type MetricStatus = "good" | "warning" | "critical";

interface MetricProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  status: MetricStatus;
}

const Metric = ({ label, value, max, unit, status }: MetricProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "good":
        return <Badge className="bg-green-500">Good</Badge>;
      case "warning":
        return <Badge className="bg-amber-500">Warning</Badge>;
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        {getStatusBadge()}
      </div>
      <Progress value={(value / max) * 100} className="h-2" />
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>
          {value} {unit}
        </span>
        <span>
          Max: {max} {unit}
        </span>
      </div>
    </div>
  );
};

export const PerformanceMetrics = ({ previewUrl }: { previewUrl?: string }) => {
  const [metrics, setMetrics] = useState({
    loadTime: { value: 0, max: 2000, status: "good" as MetricStatus },
    renderTime: { value: 0, max: 100, status: "good" as MetricStatus },
    memoryUsage: { value: 0, max: 50, status: "good" as MetricStatus },
    networkRequests: { value: 0, max: 10, status: "good" as MetricStatus },
  });

  useEffect(() => {
    // Simulate metrics calculation when preview URL changes
    if (previewUrl) {
      // In a real implementation, you would measure actual performance
      // For now, we'll simulate with random values
      const loadTime = Math.floor(Math.random() * 1500) + 200;
      const renderTime = Math.floor(Math.random() * 80) + 10;
      const memoryUsage = Math.floor(Math.random() * 40) + 5;
      const networkRequests = Math.floor(Math.random() * 8) + 1;

      setMetrics({
        loadTime: {
          value: loadTime,
          max: 2000,
          status: loadTime < 800 ? "good" : loadTime < 1500 ? "warning" : "critical",
        },
        renderTime: {
          value: renderTime,
          max: 100,
          status: renderTime < 30 ? "good" : renderTime < 70 ? "warning" : "critical",
        },
        memoryUsage: {
          value: memoryUsage,
          max: 50,
          status: memoryUsage < 20 ? "good" : memoryUsage < 40 ? "warning" : "critical",
        },
        networkRequests: {
          value: networkRequests,
          max: 10,
          status: networkRequests < 5 ? "good" : networkRequests < 8 ? "warning" : "critical",
        },
      });
    }
  }, [previewUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Monitor your widget's performance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics">
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <Metric
              label="Load Time"
              value={metrics.loadTime.value}
              max={metrics.loadTime.max}
              unit="ms"
              status={metrics.loadTime.status}
            />
            <Metric
              label="Render Time"
              value={metrics.renderTime.value}
              max={metrics.renderTime.max}
              unit="ms"
              status={metrics.renderTime.status}
            />
            <Metric
              label="Memory Usage"
              value={metrics.memoryUsage.value}
              max={metrics.memoryUsage.max}
              unit="MB"
              status={metrics.memoryUsage.status}
            />
            <Metric
              label="Network Requests"
              value={metrics.networkRequests.value}
              max={metrics.networkRequests.max}
              unit="requests"
              status={metrics.networkRequests.status}
            />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-2">
            <p className="text-sm text-muted-foreground mb-2">
              Based on current metrics:
            </p>
            <ul className="space-y-2 text-sm">
              {metrics.loadTime.status !== "good" && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>
                    Consider optimizing widget initialization to improve load
                    time.
                  </span>
                </li>
              )}
              {metrics.renderTime.status !== "good" && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>
                    Reduce DOM complexity to improve rendering performance.
                  </span>
                </li>
              )}
              {metrics.memoryUsage.status !== "good" && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>
                    Check for memory leaks or optimize resource usage.
                  </span>
                </li>
              )}
              {metrics.networkRequests.status !== "good" && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Reduce API calls or implement request batching.</span>
                </li>
              )}
              {Object.values(metrics).every((m) => m.status === "good") && (
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>
                    All metrics look good! Your widget is performing well.
                  </span>
                </li>
              )}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
