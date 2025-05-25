
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  Shield,
  Eye
} from 'lucide-react';

const WidgetTesting = () => {
  const { toast } = useToast();
  const [selectedDevice, setSelectedDevice] = useState('desktop');
  const [environment, setEnvironment] = useState('development');
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState({});

  const devices = {
    mobile: { width: '375px', height: '667px', icon: <Smartphone size={16} /> },
    tablet: { width: '768px', height: '1024px', icon: <Tablet size={16} /> },
    desktop: { width: '100%', height: '600px', icon: <Monitor size={16} /> }
  };

  const testScenarios = [
    {
      id: 'functional',
      name: 'Functional Tests',
      icon: <CheckCircle size={16} />,
      tests: [
        'Widget loads correctly',
        'Chat window opens/closes',
        'Messages can be sent',
        'Response time is acceptable',
        'Error handling works'
      ]
    },
    {
      id: 'visual',
      name: 'Visual Tests',
      icon: <Eye size={16} />,
      tests: [
        'Widget appears in correct position',
        'Colors match configuration',
        'Fonts render correctly',
        'Responsive design works',
        'Animations are smooth'
      ]
    },
    {
      id: 'performance',
      name: 'Performance Tests',
      icon: <Zap size={16} />,
      tests: [
        'Load time under 3 seconds',
        'Memory usage is optimal',
        'No JavaScript errors',
        'Smooth scrolling',
        'Efficient API calls'
      ]
    },
    {
      id: 'security',
      name: 'Security Tests',
      icon: <Shield size={16} />,
      tests: [
        'XSS protection active',
        'HTTPS connections only',
        'Data sanitization works',
        'No sensitive data exposure',
        'CORS policies enforced'
      ]
    }
  ];

  const runTest = async (scenarioId) => {
    setIsTestRunning(true);
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = {
      ...testResults,
      [scenarioId]: {
        status: Math.random() > 0.2 ? 'passed' : 'failed',
        score: Math.floor(Math.random() * 30) + 70,
        timestamp: new Date()
      }
    };
    
    setTestResults(results);
    setIsTestRunning(false);
    
    toast({
      title: "Test Completed",
      description: `${scenarioId} tests have finished running.`,
    });
  };

  const runAllTests = async () => {
    for (const scenario of testScenarios) {
      await runTest(scenario.id);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Widget Testing Platform</h2>
          <p className="text-slate-500 mt-1">Test your chat widget in different environments and scenarios</p>
        </div>
        <div className="flex gap-3">
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="production">Production</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runAllTests} disabled={isTestRunning}>
            {isTestRunning ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Run All Tests
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
              <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Widget Preview
                    <div className="flex items-center gap-2">
                      {Object.entries(devices).map(([key, device]) => (
                        <Button
                          key={key}
                          variant={selectedDevice === key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDevice(key)}
                          className="flex items-center gap-1"
                        >
                          {device.icon}
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg bg-slate-50 p-4">
                    <div 
                      className="mx-auto bg-white border rounded-lg shadow-sm relative"
                      style={{
                        width: devices[selectedDevice].width,
                        height: devices[selectedDevice].height,
                        maxWidth: '100%'
                      }}
                    >
                      <div className="p-4 h-full flex items-center justify-center text-slate-500">
                        <div className="text-center">
                          <Monitor className="mx-auto mb-2" size={32} />
                          <p>Widget Preview Area</p>
                          <p className="text-sm">Environment: {environment}</p>
                        </div>
                      </div>
                      
                      {/* Mock Widget Button */}
                      <div className="absolute bottom-4 right-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-blue-600 transition-colors">
                          💬
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-4">
              <div className="grid gap-4">
                {testScenarios.map((scenario) => (
                  <Card key={scenario.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {scenario.icon}
                          {scenario.name}
                        </div>
                        <div className="flex items-center gap-2">
                          {testResults[scenario.id] && (
                            <Badge variant={testResults[scenario.id].status === 'passed' ? 'default' : 'destructive'}>
                              {testResults[scenario.id].status === 'passed' ? <CheckCircle size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
                              {testResults[scenario.id].status}
                            </Badge>
                          )}
                          <Button 
                            size="sm" 
                            onClick={() => runTest(scenario.id)}
                            disabled={isTestRunning}
                          >
                            {isTestRunning ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                            Run Test
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {scenario.tests.map((test, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-50">
                            <span className="text-sm">{test}</span>
                            {testResults[scenario.id] && (
                              <Badge variant="outline" className="text-xs">
                                {Math.random() > 0.1 ? 'Pass' : 'Fail'}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Load Time</span>
                  <span>2.1s</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>4.2MB</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Response Time</span>
                  <span>0.8s</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Error Rate</span>
                  <span>0.1%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Test History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(testResults).map(([scenarioId, result]) => (
                <div key={scenarioId} className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span className="text-sm capitalize">{scenarioId}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.status === 'passed' ? 'default' : 'destructive'} className="text-xs">
                      {result.score}%
                    </Badge>
                  </div>
                </div>
              ))}
              
              {Object.keys(testResults).length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No tests run yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WidgetTesting;
