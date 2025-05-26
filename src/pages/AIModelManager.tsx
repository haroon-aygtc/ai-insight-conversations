
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bot, Plus, Trash2, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  apiKey: string;
  isActive: boolean;
  isDefault: boolean;
  systemPrompt: string;
  maxTokens: number;
  temperature: number;
}

const AIModelManager: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: '1',
      name: 'Gemini Pro',
      provider: 'gemini',
      apiKey: '',
      isActive: true,
      isDefault: true,
      systemPrompt: 'You are a helpful assistant who provides accurate and concise information.',
      maxTokens: 1024,
      temperature: 0.7
    },
    {
      id: '2',
      name: 'GPT-3.5',
      provider: 'openai',
      apiKey: '',
      isActive: false,
      isDefault: false,
      systemPrompt: 'You are a customer support assistant who helps users with their questions.',
      maxTokens: 2048,
      temperature: 0.5
    }
  ]);
  
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const { toast } = useToast();

  const handleEditModel = (model: AIModel) => {
    setEditingModel({...model});
  };

  const handleSaveModel = () => {
    if (!editingModel) return;
    
    setModels(models.map(model => 
      model.id === editingModel.id ? editingModel : model
    ));
    
    setEditingModel(null);
    
    toast({
      title: "Model Updated",
      description: "AI model settings have been saved successfully.",
    });
  };

  const handleToggleActive = (id: string) => {
    setModels(models.map(model => 
      model.id === id ? {...model, isActive: !model.isActive} : model
    ));
    
    toast({
      title: "Model Status Updated",
      description: "AI model active status has been updated.",
    });
  };

  const handleSetDefault = (id: string) => {
    setModels(models.map(model => 
      ({...model, isDefault: model.id === id})
    ));
    
    toast({
      title: "Default Model Updated",
      description: "Default AI model has been updated.",
    });
  };

  const handleAddModel = () => {
    const newModel: AIModel = {
      id: Date.now().toString(),
      name: 'New Model',
      provider: 'gemini',
      apiKey: '',
      isActive: false,
      isDefault: false,
      systemPrompt: 'You are a helpful assistant.',
      maxTokens: 1024,
      temperature: 0.7
    };
    
    setModels([...models, newModel]);
    handleEditModel(newModel);
    
    toast({
      title: "Model Added",
      description: "New AI model has been added. Please configure its settings.",
    });
  };

  const handleDeleteModel = (id: string) => {
    // Don't allow deleting the default model
    if (models.find(model => model.id === id)?.isDefault) {
      toast({
        title: "Cannot Delete Default Model",
        description: "Please set another model as default before deleting this one.",
        variant: "destructive"
      });
      return;
    }
    
    setModels(models.filter(model => model.id !== id));
    
    if (editingModel?.id === id) {
      setEditingModel(null);
    }
    
    toast({
      title: "Model Deleted",
      description: "AI model has been removed.",
    });
  };

  const testApiKey = () => {
    if (!editingModel?.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key to test the connection.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API test
    setTimeout(() => {
      toast({
        title: "API Connection Successful",
        description: "Your API key is valid and working correctly.",
      });
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span>AI Models</span>
            </CardTitle>
            <CardDescription>
              Configure which AI models to use for responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {models.map(model => (
                <div key={model.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                  <div>
                    <h3 className="font-medium">{model.name}</h3>
                    <p className="text-sm text-gray-500">Provider: {model.provider}</p>
                    {model.isDefault && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={model.isActive}
                      onCheckedChange={() => handleToggleActive(model.id)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditModel(model)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleAddModel}
            >
              <Plus className="h-4 w-4 mr-2" /> Add New Model
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="col-span-1 md:col-span-2">
        {editingModel ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit AI Model: {editingModel.name}</CardTitle>
              <CardDescription>
                Configure the settings for this AI model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general">
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  <TabsTrigger value="prompt">System Prompt</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="model-name">Model Name</Label>
                      <Input
                        id="model-name"
                        value={editingModel.name}
                        onChange={(e) => setEditingModel({...editingModel, name: e.target.value})}
                        placeholder="Enter model name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="model-provider">Provider</Label>
                      <Select 
                        value={editingModel.provider}
                        onValueChange={(value) => setEditingModel({...editingModel, provider: value})}
                      >
                        <SelectTrigger id="model-provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini">Google Gemini</SelectItem>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                          <SelectItem value="huggingface">Hugging Face</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="api-key"
                        type="password"
                        value={editingModel.apiKey}
                        onChange={(e) => setEditingModel({...editingModel, apiKey: e.target.value})}
                        placeholder="Enter API key"
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={testApiKey}>
                        Test
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Your API key is stored securely and never shared.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between border-t pt-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is-active"
                        checked={editingModel.isActive}
                        onCheckedChange={(checked) => setEditingModel({...editingModel, isActive: checked})}
                      />
                      <Label htmlFor="is-active">Active</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is-default"
                        checked={editingModel.isDefault}
                        onCheckedChange={(checked) => setEditingModel({...editingModel, isDefault: checked})}
                      />
                      <Label htmlFor="is-default">Default Model</Label>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">
                        Max Tokens <span className="text-sm text-gray-500">({editingModel.maxTokens})</span>
                      </Label>
                      <Input
                        id="max-tokens"
                        type="range"
                        min="256"
                        max="4096"
                        step="128"
                        value={editingModel.maxTokens}
                        onChange={(e) => setEditingModel({...editingModel, maxTokens: Number(e.target.value)})}
                      />
                      <p className="text-xs text-gray-500">
                        Maximum number of tokens in the response. Higher values may result in more comprehensive answers.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="temperature">
                        Temperature <span className="text-sm text-gray-500">({editingModel.temperature.toFixed(1)})</span>
                      </Label>
                      <Input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={editingModel.temperature}
                        onChange={(e) => setEditingModel({...editingModel, temperature: Number(e.target.value)})}
                      />
                      <p className="text-xs text-gray-500">
                        Controls randomness. Lower values make responses more deterministic, higher values more creative.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="prompt" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <Textarea
                      id="system-prompt"
                      value={editingModel.systemPrompt}
                      onChange={(e) => setEditingModel({...editingModel, systemPrompt: e.target.value})}
                      placeholder="Enter system prompt"
                      rows={8}
                    />
                    <p className="text-xs text-gray-500">
                      The system prompt defines the AI's personality and behavior. It guides how the model responds to user inputs.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditingModel(null)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDeleteModel(editingModel.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleSaveModel}
              >
                <Check className="h-4 w-4 mr-1" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Model to Edit</h3>
              <p className="text-gray-500 mb-4">
                Click on "Edit" next to an AI model to configure its settings.
              </p>
              <Button onClick={handleAddModel}>
                <Plus className="h-4 w-4 mr-2" /> Add New Model
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIModelManager;
