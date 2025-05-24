
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Zap, Clock, Download } from 'lucide-react';

interface PerformanceMetricsProps {
  config: any;
  widgetId: string;
  environment: string;
}

interface Metric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'poor';
  description: string;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  config,
  widgetId,
  environment
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      name: 'Load Time',
      value: 0,
      unit: 'ms',
      status: 'good',
      description: 'Time to fully load the widget'
    },
    {
      name: 'Bundle Size',
      value: 0,
      unit: 'KB',
      status: 'good',
      description: 'Total size of widget assets'
    },
    {
      name: 'First Paint',
      value: 0,
      unit: 'ms',
      status: 'good',
      description: 'Time to first visual element'
    },
    {
      name: 'Interactive',
      value: 0,
      unit: 'ms',
      status: 'good',
      description: 'Time until widget is interactive'
    }
  ]);

  const runPerformanceTest = async () => {
    setIsLoading(true);
    
    // Simulate performance testing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate realistic metrics
    const newMetrics = metrics.map(metric => {
      let value: number;
      let status: 'good' | 'warning' | 'poor';
      
      switch (metric.name) {
        case 'Load Time':
          value = Math.floor(Math.random() * 1000) + 500;
          status = value < 800 ? 'good' : value < 1200 ? 'warning' : 'poor';
          break;
        case 'Bundle Size':
          value = Math.floor(Math.random() * 100) + 50;
          status = value < 80 ? 'good' : value < 120 ? 'warning' : 'poor';
          break;
        case 'First Paint':
          value = Math.floor(Math.random() * 500) + 200;
          status = value < 400 ? 'good' : value < 600 ? 'warning' : 'poor';
          break;
        case 'Interactive':
          value = Math.floor(Math.random() * 800) + 400;
          status = value < 600 ? 'good' : value < 1000 ? 'warning' : 'poor';
          break;
        default:
          value = 0;
          status = 'good';
      }
      
      return { ...metric, value, status };
    });
    
    setMetrics(newMetrics);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  useEffect(() => {
    runPerformanceTest();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap size={20} />
              Performance Metrics
            </CardTitle>
            <Button 
              onClick={runPerformanceTest} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Run Test
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {metrics.map((metric, index) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{metric.name}</h4>
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        {isLoading ? '...' : `${metric.value}${metric.unit}`}
                      </span>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Progress 
                  value={isLoading ? 0 : Math.min((metric.value / (metric.name === 'Bundle Size' ? 150 : 1500)) * 100, 100)} 
                  className="h-2"
                />
              </div>
            ))}
          </div>

          {!isLoading && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Performance Score</h4>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-green-600">
                  {Math.floor(metrics.filter(m => m.status === 'good').length / metrics.length * 100)}
                </div>
                <div className="flex-1">
                  <Progress 
                    value={metrics.filter(m => m.status === 'good').length / metrics.length * 100} 
                    className="h-4"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Overall performance score based on all metrics
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} />
            Performance Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.filter(m => m.status !== 'good').map((metric) => (
              <div key={metric.name} className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
                <h5 className="font-medium text-yellow-800">{metric.name} Optimization</h5>
                <p className="text-sm text-yellow-700 mt-1">
                  {metric.name === 'Load Time' && 'Consider reducing the number of features or optimizing the embed code.'}
                  {metric.name === 'Bundle Size' && 'Remove unnecessary features or use the iframe embed for smaller size.'}
                  {metric.name === 'First Paint' && 'Optimize CSS loading and reduce blocking resources.'}
                  {metric.name === 'Interactive' && 'Defer non-critical JavaScript and optimize event handlers.'}
                </p>
              </div>
            ))}
            
            {metrics.every(m => m.status === 'good') && (
              <div className="p-3 border-l-4 border-green-400 bg-green-50">
                <h5 className="font-medium text-green-800">Excellent Performance!</h5>
                <p className="text-sm text-green-700 mt-1">
                  Your widget is performing well across all metrics. Great job!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
