
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  Upload, 
  Download, 
  BarChart2, 
  Settings, 
  Play, 
  Pause, 
  Trash2,
  Eye
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'training' | 'error';
  provider: string;
  type: string;
  accuracy?: number;
  lastTrained?: string;
  deployedAt?: string;
}

interface ModelMetrics {
  totalModels: number;
  activeModels: number;
  totalRequests: number;
  averageResponseTime: number;
}

const AIModelManagement = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics>({
    totalModels: 0,
    activeModels: 0,
    totalRequests: 0,
    averageResponseTime: 0
  });

  useEffect(() => {
    loadModels();
    loadMetrics();
  }, []);

  const loadModels = async () => {
    try {
      // Mock data for now
      setModels([
        {
          id: '1',
          name: 'GPT-4 Turbo',
          version: '1.0.0',
          status: 'active',
          provider: 'OpenAI',
          type: 'Chat',
          accuracy: 94.5,
          lastTrained: '2024-01-15',
          deployedAt: '2024-01-20'
        },
        {
          id: '2',
          name: 'Claude 3.5 Sonnet',
          version: '2.1.0',
          status: 'active',
          provider: 'Anthropic',
          type: 'Chat',
          accuracy: 92.8,
          lastTrained: '2024-01-10',
          deployedAt: '2024-01-18'
        }
      ]);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      setMetrics({
        totalModels: 12,
        activeModels: 8,
        totalRequests: 15420,
        averageResponseTime: 1.2
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const handleModelAction = (action: string, modelId: string) => {
    console.log(`${action} model:`, modelId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Model Management</h1>
          <p className="text-muted-foreground">Manage and monitor your AI models</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => loadModels()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Model
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalModels}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.activeModels}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResponseTime}s</div>
          </CardContent>
        </Card>
      </div>

      {/* Models Table */}
      <Card>
        <CardHeader>
          <CardTitle>AI Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {models.map((model) => (
              <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {model.provider} • {model.type} • v{model.version}
                    </p>
                  </div>
                  <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                    {model.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleModelAction('view', model.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleModelAction('settings', model.id)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleModelAction(model.status === 'active' ? 'pause' : 'play', model.id)}
                  >
                    {model.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModelManagement;
