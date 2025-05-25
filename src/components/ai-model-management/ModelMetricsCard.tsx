import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";

interface MetricProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

const Metric: React.FC<MetricProps> = ({ label, value, change, trend }) => {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-semibold">{value}</p>
        {change && (
          <div
            className={`flex items-center text-xs ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"}`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {change}
          </div>
        )}
      </div>
    </div>
  );
};

interface ModelMetricsCardProps {
  modelId: string;
}

const ModelMetricsCard: React.FC<ModelMetricsCardProps> = ({ modelId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="text-xs">
              <BarChart className="mr-1 h-3.5 w-3.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="text-xs">
              <PieChart className="mr-1 h-3.5 w-3.5" />
              Accuracy
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              <LineChart className="mr-1 h-3.5 w-3.5" />
              History
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Metric
                  label="Accuracy"
                  value="94.2%"
                  change="+2.1%"
                  trend="up"
                />
                <Metric
                  label="Precision"
                  value="91.5%"
                  change="+1.8%"
                  trend="up"
                />
                <Metric
                  label="Recall"
                  value="89.7%"
                  change="-0.5%"
                  trend="down"
                />
                <Metric
                  label="F1 Score"
                  value="90.6%"
                  change="+1.2%"
                  trend="up"
                />
              </div>

              <div className="rounded-md bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-xs font-medium">Inference Time</h4>
                  <span className="text-xs text-muted-foreground">
                    Last 7 days
                  </span>
                </div>
                <div className="h-[120px] w-full">
                  {/* Placeholder for chart */}
                  <div className="flex h-full w-full items-center justify-center rounded border border-dashed">
                    <p className="text-xs text-muted-foreground">
                      Chart visualization
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="accuracy">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Metric label="Training Accuracy" value="96.3%" />
                  <Metric label="Validation Accuracy" value="94.2%" />
                  <Metric label="Test Accuracy" value="93.8%" />
                  <Metric label="Cross-Validation" value="94.1%" />
                </div>

                <div className="rounded-md bg-slate-50 p-3">
                  <div className="mb-2">
                    <h4 className="text-xs font-medium">Confusion Matrix</h4>
                  </div>
                  <div className="h-[200px] w-full">
                    {/* Placeholder for confusion matrix */}
                    <div className="flex h-full w-full items-center justify-center rounded border border-dashed">
                      <p className="text-xs text-muted-foreground">
                        Confusion matrix visualization
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Metric label="Version Count" value="8" />
                  <Metric label="Days Since First Version" value="124" />
                  <Metric
                    label="Accuracy Improvement"
                    value="+7.2%"
                    trend="up"
                  />
                  <Metric
                    label="Inference Time Change"
                    value="-42ms"
                    trend="up"
                  />
                </div>

                <div className="rounded-md bg-slate-50 p-3">
                  <div className="mb-2">
                    <h4 className="text-xs font-medium">Performance History</h4>
                  </div>
                  <div className="h-[200px] w-full">
                    {/* Placeholder for history chart */}
                    <div className="flex h-full w-full items-center justify-center rounded border border-dashed">
                      <p className="text-xs text-muted-foreground">
                        Performance history chart
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ModelMetricsCard;
