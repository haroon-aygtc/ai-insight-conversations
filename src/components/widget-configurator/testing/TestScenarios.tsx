
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';

interface TestScenariosProps {
  config: any;
  widgetId: string;
  environment: string;
}

interface TestScenario {
  id: string;
  name: string;
  description: string;
  type: 'functional' | 'visual' | 'performance' | 'security';
  status: 'pending' | 'running' | 'passed' | 'failed';
  details?: string;
}

export const TestScenarios: React.FC<TestScenariosProps> = ({
  config,
  widgetId,
  environment
}) => {
  const [scenarios, setScenarios] = useState<TestScenario[]>([
    {
      id: 'basic-load',
      name: 'Basic Widget Load',
      description: 'Test if widget loads correctly on page',
      type: 'functional',
      status: 'pending'
    },
    {
      id: 'chat-interaction',
      name: 'Chat Interaction',
      description: 'Test sending and receiving messages',
      type: 'functional',
      status: 'pending'
    },
    {
      id: 'responsive-design',
      name: 'Responsive Design',
      description: 'Test widget on different screen sizes',
      type: 'visual',
      status: 'pending'
    },
    {
      id: 'auto-open',
      name: 'Auto-open Behavior',
      description: 'Test auto-open functionality',
      type: 'functional',
      status: 'pending'
    },
    {
      id: 'domain-validation',
      name: 'Domain Validation',
      description: 'Test domain restrictions',
      type: 'security',
      status: 'pending'
    },
    {
      id: 'performance',
      name: 'Load Performance',
      description: 'Test widget loading speed',
      type: 'performance',
      status: 'pending'
    },
    {
      id: 'cross-browser',
      name: 'Cross-browser Compatibility',
      description: 'Test across different browsers',
      type: 'functional',
      status: 'pending'
    },
    {
      id: 'color-scheme',
      name: 'Color Scheme',
      description: 'Test custom colors and branding',
      type: 'visual',
      status: 'pending'
    }
  ]);

  const runScenario = async (scenarioId: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === scenarioId ? { ...s, status: 'running' } : s
    ));

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random test results for demo
    const passed = Math.random() > 0.2;
    setScenarios(prev => prev.map(s => 
      s.id === scenarioId 
        ? { 
            ...s, 
            status: passed ? 'passed' : 'failed',
            details: passed ? 'Test completed successfully' : 'Test failed - check configuration'
          } 
        : s
    ));
  };

  const runAllScenarios = async () => {
    for (const scenario of scenarios) {
      await runScenario(scenario.id);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'failed':
        return <XCircle className="text-red-500" size={16} />;
      case 'running':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertCircle className="text-gray-400" size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'functional':
        return 'bg-blue-100 text-blue-800';
      case 'visual':
        return 'bg-green-100 text-green-800';
      case 'performance':
        return 'bg-yellow-100 text-yellow-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Test Scenarios</CardTitle>
            <Button onClick={runAllScenarios} className="flex items-center gap-2">
              <Play size={16} />
              Run All Tests
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(scenario.status)}
                    <h4 className="font-medium">{scenario.name}</h4>
                    <Badge className={getTypeColor(scenario.type)}>
                      {scenario.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{scenario.description}</p>
                  {scenario.details && (
                    <p className="text-xs text-gray-500">{scenario.details}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runScenario(scenario.id)}
                  disabled={scenario.status === 'running'}
                  className="flex items-center gap-2"
                >
                  <Play size={14} />
                  Run
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {scenarios.length}
              </div>
              <div className="text-sm text-gray-500">Total Tests</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {scenarios.filter(s => s.status === 'passed').length}
              </div>
              <div className="text-sm text-green-600">Passed</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {scenarios.filter(s => s.status === 'failed').length}
              </div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {scenarios.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
