import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Bot, Check, Cloud, RefreshCw, ChevronRight, Server, Key, Lock, Settings, LucideIcon, Zap, Dices, BrainCircuit, BarChart, ArrowRight, History, Cpu, Shield, Globe, Star, PlusCircle, Loader2, Code } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface AIProvider {
    id: string;
    name: string;
    key: string;
    type: 'openai' | 'anthropic' | 'google' | 'huggingface' | 'mistral' | 'openrouter' | 'deepseek' | 'grok';
    enabled: boolean;
    isDefault: boolean;
    models: AIModel[];
    iconColor: string;
    configuration: Record<string, any>;
}

interface AIModel {
    id: string;
    name: string;
    enabled: boolean;
    maxTokens: number;
    temperature: number;
}

// Provider specific details
const providerDetails: Record<string, { icon: LucideIcon, name: string, color: string, configFields: any[] }> = {
    openai: {
        icon: Sparkles,
        name: "OpenAI",
        color: "from-green-500 to-blue-500",
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true },
            { name: 'organization', label: 'Organization ID', type: 'text', required: false }
        ]
    },
    anthropic: {
        icon: Bot,
        name: "Anthropic",
        color: "from-purple-500 to-pink-500",
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true }
        ]
    },
    google: {
        icon: Cloud,
        name: "Google AI",
        color: "from-blue-500 to-cyan-500",
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true },
            { name: 'projectId', label: 'Project ID', type: 'text', required: true },
            { name: 'location', label: 'Location', type: 'text', defaultValue: 'us-central1', required: true }
        ]
    },
    huggingface: {
        icon: Server,
        name: "HuggingFace",
        color: "from-yellow-500 to-orange-500",
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true }
        ]
    },
    mistral: {
        icon: Zap,
        name: "Mistral AI",
        color: "from-red-500 to-pink-500",
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true }
        ]
    },
    openrouter: {
        icon: RefreshCw,
        name: "OpenRouter",
        color: "from-blue-400 to-indigo-500",
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true }
        ]
    },
    deepseek: {
        icon: Bot,
        name: "DeepSeek",
        color: "from-teal-500 to-emerald-500",
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true }
        ]
    },
    grok: {
        icon: Sparkles,
        name: "Grok",
        color: "from-red-500 to-orange-500",
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true }
        ]
    }
};

// Generate models for each provider
const generateDefaultModels = (providerType: string): AIModel[] => {
    switch (providerType) {
        case 'openai':
            return [
                { id: '1', name: 'gpt-4o', enabled: true, maxTokens: 4096, temperature: 0.7 },
                { id: '2', name: 'gpt-4-turbo', enabled: true, maxTokens: 4096, temperature: 0.7 },
                { id: '3', name: 'gpt-4', enabled: true, maxTokens: 2048, temperature: 0.7 },
                { id: '4', name: 'gpt-3.5-turbo', enabled: true, maxTokens: 1024, temperature: 0.7 }
            ];
        case 'anthropic':
            return [
                { id: '1', name: 'claude-3-opus-20240229', enabled: true, maxTokens: 4096, temperature: 0.7 },
                { id: '2', name: 'claude-3-sonnet-20240229', enabled: true, maxTokens: 4096, temperature: 0.7 },
                { id: '3', name: 'claude-3-haiku-20240307', enabled: true, maxTokens: 2048, temperature: 0.7 },
                { id: '4', name: 'claude-2.1', enabled: true, maxTokens: 1024, temperature: 0.7 }
            ];
        case 'google':
            return [
                { id: '1', name: 'gemini-1.5-pro', enabled: true, maxTokens: 8192, temperature: 0.7 },
                { id: '2', name: 'gemini-1.5-flash', enabled: true, maxTokens: 4096, temperature: 0.7 },
                { id: '3', name: 'gemini-1.0-pro', enabled: true, maxTokens: 2048, temperature: 0.7 }
            ];
        case 'mistral':
            return [
                { id: '1', name: 'mistral-large-latest', enabled: true, maxTokens: 4096, temperature: 0.7 },
                { id: '2', name: 'mistral-medium-latest', enabled: true, maxTokens: 4096, temperature: 0.7 },
                { id: '3', name: 'mistral-small-latest', enabled: true, maxTokens: 2048, temperature: 0.7 },
                { id: '4', name: 'open-mixtral-8x7b', enabled: true, maxTokens: 2048, temperature: 0.7 }
            ];
        default:
            return [
                { id: '1', name: `${providerType}-default`, enabled: true, maxTokens: 2048, temperature: 0.7 }
            ];
    }
};

const AIProviderManager: React.FC = () => {
    // Generate some default providers
    const defaultProviders: AIProvider[] = [
        {
            id: '1',
            name: 'OpenAI',
            key: 'openai',
            type: 'openai',
            enabled: true,
            isDefault: true,
            models: generateDefaultModels('openai'),
            iconColor: 'from-green-500 to-blue-500',
            configuration: { apiKey: '', organization: '' }
        },
        {
            id: '2',
            name: 'Claude',
            key: 'anthropic',
            type: 'anthropic',
            enabled: false,
            isDefault: false,
            models: generateDefaultModels('anthropic'),
            iconColor: 'from-purple-500 to-pink-500',
            configuration: { apiKey: '' }
        },
        {
            id: '3',
            name: 'Google Gemini',
            key: 'google',
            type: 'google',
            enabled: false,
            isDefault: false,
            models: generateDefaultModels('google'),
            iconColor: 'from-blue-500 to-cyan-500',
            configuration: { apiKey: '', projectId: '', location: 'us-central1' }
        },
        {
            id: '4',
            name: 'HuggingFace',
            key: 'huggingface',
            type: 'huggingface',
            enabled: false,
            isDefault: false,
            models: generateDefaultModels('huggingface'),
            iconColor: 'from-yellow-500 to-orange-500',
            configuration: { apiKey: '' }
        },
        {
            id: '5',
            name: 'Mistral AI',
            key: 'mistral',
            type: 'mistral',
            enabled: false,
            isDefault: false,
            models: generateDefaultModels('mistral'),
            iconColor: 'from-red-500 to-pink-500',
            configuration: { apiKey: '' }
        },
        {
            id: '6',
            name: 'OpenRouter',
            key: 'openrouter',
            type: 'openrouter',
            enabled: false,
            isDefault: false,
            models: generateDefaultModels('openrouter'),
            iconColor: 'from-blue-400 to-indigo-500',
            configuration: { apiKey: '' }
        },
        {
            id: '7',
            name: 'DeepSeek',
            key: 'deepseek',
            type: 'deepseek',
            enabled: false,
            isDefault: false,
            models: generateDefaultModels('deepseek'),
            iconColor: 'from-teal-500 to-emerald-500',
            configuration: { apiKey: '' }
        },
        {
            id: '8',
            name: 'Grok',
            key: 'grok',
            type: 'grok',
            enabled: false,
            isDefault: false,
            models: generateDefaultModels('grok'),
            iconColor: 'from-red-500 to-orange-500',
            configuration: { apiKey: '' }
        }
    ];

    const [providers, setProviders] = useState<AIProvider[]>(defaultProviders);
    const [activeProvider, setActiveProvider] = useState<AIProvider | null>(null);
    const [activeTab, setActiveTab] = useState<string>('general');
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | null>(null);
    const { toast } = useToast();

    // Load providers from API (simulated)
    useEffect(() => {
        // In a real implementation, this would be an API call
        // For now, we'll use the default providers
        console.log("Loading providers...");
    }, []);

    const handleSelectProvider = (provider: AIProvider) => {
        setActiveProvider({ ...provider });
        setActiveTab('general');
        setConnectionStatus(null);
    };

    const handleToggleProviderEnabled = (providerId: string, enabled: boolean) => {
        const updatedProviders = providers.map(provider =>
            provider.id === providerId ? { ...provider, enabled } : provider
        );
        setProviders(updatedProviders);

        if (activeProvider && activeProvider.id === providerId) {
            setActiveProvider({ ...activeProvider, enabled });
        }

        toast({
            title: enabled ? "Provider Enabled" : "Provider Disabled",
            description: `${providers.find(p => p.id === providerId)?.name} has been ${enabled ? 'enabled' : 'disabled'}.`,
        });
    };

    const handleSetDefaultProvider = (providerId: string) => {
        const updatedProviders = providers.map(provider =>
            ({ ...provider, isDefault: provider.id === providerId })
        );
        setProviders(updatedProviders);

        if (activeProvider) {
            setActiveProvider({ ...activeProvider, isDefault: activeProvider.id === providerId });
        }

        toast({
            title: "Default Provider Updated",
            description: `${providers.find(p => p.id === providerId)?.name} is now the default provider.`,
        });
    };

    const handleUpdateProviderConfig = (field: string, value: any) => {
        if (!activeProvider) return;

        const updatedConfig = { ...activeProvider.configuration, [field]: value };
        const updatedProvider = { ...activeProvider, configuration: updatedConfig };

        setActiveProvider(updatedProvider);

        // Also update in the main providers list
        const updatedProviders = providers.map(provider =>
            provider.id === updatedProvider.id ? updatedProvider : provider
        );
        setProviders(updatedProviders);
    };

    const handleSaveProvider = () => {
        if (!activeProvider) return;

        // Check required fields
        const providerConfig = providerDetails[activeProvider.type].configFields;
        const missingFields = providerConfig
            .filter(field => field.required && !activeProvider.configuration[field.name])
            .map(field => field.label);

        if (missingFields.length > 0) {
            toast({
                title: "Missing Required Fields",
                description: `Please fill in the following fields: ${missingFields.join(', ')}`,
                variant: "destructive"
            });
            return;
        }

        // Update the provider in the list
        const updatedProviders = providers.map(provider =>
            provider.id === activeProvider.id ? activeProvider : provider
        );
        setProviders(updatedProviders);

        toast({
            title: "Provider Saved",
            description: `${activeProvider.name} configuration has been saved.`,
        });
    };

    const handleTestConnection = () => {
        if (!activeProvider) return;

        // Check required fields
        const providerConfig = providerDetails[activeProvider.type].configFields;
        const missingFields = providerConfig
            .filter(field => field.required && !activeProvider.configuration[field.name])
            .map(field => field.label);

        if (missingFields.length > 0) {
            toast({
                title: "Missing Required Fields",
                description: `Please fill in the following fields: ${missingFields.join(', ')}`,
                variant: "destructive"
            });
            return;
        }

        setIsTestingConnection(true);
        setConnectionStatus(null);

        // Simulate API call
        setTimeout(() => {
            // For demo purposes, let's randomly succeed or fail
            const success = Math.random() > 0.3;

            setConnectionStatus(success ? 'success' : 'error');
            setIsTestingConnection(false);

            toast({
                title: success ? "Connection Successful" : "Connection Failed",
                description: success
                    ? `Successfully connected to ${activeProvider.name}`
                    : `Failed to connect to ${activeProvider.name}. Please check your configuration.`,
                variant: success ? "default" : "destructive"
            });
        }, 2000);
    };

    const handleToggleModel = (modelId: string, enabled: boolean) => {
        if (!activeProvider) return;

        const updatedModels = activeProvider.models.map(model =>
            model.id === modelId ? { ...model, enabled } : model
        );

        const updatedProvider = { ...activeProvider, models: updatedModels };
        setActiveProvider(updatedProvider);

        // Also update in the main providers list
        const updatedProviders = providers.map(provider =>
            provider.id === updatedProvider.id ? updatedProvider : provider
        );
        setProviders(updatedProviders);
    };

    const handleUpdateModelConfig = (modelId: string, field: string, value: any) => {
        if (!activeProvider) return;

        const updatedModels = activeProvider.models.map(model =>
            model.id === modelId ? { ...model, [field]: value } : model
        );

        const updatedProvider = { ...activeProvider, models: updatedModels };
        setActiveProvider(updatedProvider);

        // Also update in the main providers list
        const updatedProviders = providers.map(provider =>
            provider.id === updatedProvider.id ? updatedProvider : provider
        );
        setProviders(updatedProviders);
    };

    const handleAddNewProvider = (type: string) => {
        const providerInfo = providerDetails[type];
        const newId = Date.now().toString();

        // Create default configuration based on provider type
        const defaultConfig: Record<string, any> = {};
        providerInfo.configFields.forEach(field => {
            defaultConfig[field.name] = field.defaultValue || '';
        });

        const newProvider: AIProvider = {
            id: newId,
            name: providerInfo.name,
            key: type,
            type: type as any,
            enabled: false,
            isDefault: false,
            models: generateDefaultModels(type),
            iconColor: providerInfo.color,
            configuration: defaultConfig
        };

        setProviders([...providers, newProvider]);
        setActiveProvider(newProvider);
        setActiveTab('general');

        toast({
            title: "Provider Added",
            description: `${providerInfo.name} has been added. Please configure it.`,
        });
    };

    // Get all available provider types that haven't been added yet
    const getAvailableProviderTypes = () => {
        const existingTypes = new Set(providers.map(p => p.type));
        return Object.keys(providerDetails).filter(type => !existingTypes.has(type as any));
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                            AI Provider Management
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Configure API connections for enterprise AI services
                        </p>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="default"
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Provider
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Add AI Provider</DialogTitle>
                                <DialogDescription>
                                    Select a provider to add to your service catalog.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                {getAvailableProviderTypes().map(type => {
                                    const provider = providerDetails[type];
                                    const ProviderIcon = provider.icon;

                                    return (
                                        <Card
                                            key={type}
                                            className="cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                                            onClick={() => handleAddNewProvider(type)}
                                        >
                                            <CardContent className="flex items-center p-4">
                                                <div className="p-2 rounded bg-blue-100 text-blue-700 mr-3">
                                                    <ProviderIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{provider.name}</h3>
                                                    <p className="text-sm text-gray-500">Add to service catalog</p>
                                                </div>
                                                <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                                            </CardContent>
                                        </Card>
                                    );
                                })}

                                {getAvailableProviderTypes().length === 0 && (
                                    <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <Check className="h-10 w-10 text-green-500 mb-3" />
                                        <h3 className="text-lg font-medium">All Available Providers Added</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            You've added all the available AI providers to your configuration.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 gap-6">
                {/* Display when no provider is selected */}
                {!activeProvider && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {providers.map(provider => {
                            const ProviderIcon = providerDetails[provider.type].icon;

                            return (
                                <Card
                                    key={provider.id}
                                    className="overflow-hidden hover:shadow-sm transition-all duration-200 cursor-pointer border-t-2 border-t-blue-600"
                                    onClick={() => handleSelectProvider(provider)}
                                >
                                    <CardHeader className="pb-2 flex justify-between items-start">
                                        <div className="flex items-center">
                                            <div className="p-2 rounded bg-blue-100 text-blue-700 mr-3">
                                                <ProviderIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{provider.name}</h3>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={provider.enabled}
                                            onCheckedChange={(checked) => handleToggleProviderEnabled(provider.id, checked)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {provider.isDefault && (
                                                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                                    Default
                                                </Badge>
                                            )}
                                            <Badge variant={provider.enabled ? "default" : "secondary"}>
                                                {provider.enabled ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {provider.models.length} {provider.models.length === 1 ? 'model' : 'models'} configured
                                        </div>

                                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                            <p className="text-sm text-gray-500">
                                                {provider.models.filter(m => m.enabled).length} active {provider.models.filter(m => m.enabled).length === 1 ? 'model' : 'models'}
                                            </p>
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0 h-8 w-8">
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {/* Add new provider card */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Card className="flex flex-col items-center justify-center p-6 cursor-pointer h-full border-dashed hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                                    <PlusCircle className="h-10 w-10 text-blue-300 mb-3" />
                                    <h3 className="font-medium text-blue-600">Add Provider</h3>
                                    <p className="text-sm text-gray-500 text-center mt-1">
                                        Connect a new AI service
                                    </p>
                                </Card>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add AI Provider</DialogTitle>
                                    <DialogDescription>Select a provider to add to your service catalog.</DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                    {getAvailableProviderTypes().map(type => {
                                        const provider = providerDetails[type];
                                        const ProviderIcon = provider.icon;

                                        return (
                                            <Card
                                                key={type}
                                                className="cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                                                onClick={() => handleAddNewProvider(type)}
                                            >
                                                <CardContent className="flex items-center p-4">
                                                    <div className="p-2 rounded bg-blue-100 text-blue-700 mr-3">
                                                        <ProviderIcon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium">{provider.name}</h3>
                                                        <p className="text-sm text-gray-500">Add to service catalog</p>
                                                    </div>
                                                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {/* Provider detail view */}
                {activeProvider && (
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-6">
                                <CardHeader className="pb-2">
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveProvider(null)}>
                                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                                        Back
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="border-t">
                                        <div
                                            className={`flex items-center p-3 space-x-2 cursor-pointer hover:bg-gray-50 ${activeTab === 'general' ? 'bg-gray-50 border-l-2 border-l-blue-600' : ''}`}
                                            onClick={() => setActiveTab('general')}
                                        >
                                            <Settings className="h-4 w-4 text-gray-500" />
                                            <span className={activeTab === 'general' ? 'font-medium text-blue-600' : ''}>General</span>
                                        </div>
                                        <div
                                            className={`flex items-center p-3 space-x-2 cursor-pointer hover:bg-gray-50 ${activeTab === 'authentication' ? 'bg-gray-50 border-l-2 border-l-blue-600' : ''}`}
                                            onClick={() => setActiveTab('authentication')}
                                        >
                                            <Key className="h-4 w-4 text-gray-500" />
                                            <span className={activeTab === 'authentication' ? 'font-medium text-blue-600' : ''}>Authentication</span>
                                        </div>
                                        <div
                                            className={`flex items-center p-3 space-x-2 cursor-pointer hover:bg-gray-50 ${activeTab === 'models' ? 'bg-gray-50 border-l-2 border-l-blue-600' : ''}`}
                                            onClick={() => setActiveTab('models')}
                                        >
                                            <Server className="h-4 w-4 text-gray-500" />
                                            <span className={activeTab === 'models' ? 'font-medium text-blue-600' : ''}>Models</span>
                                        </div>
                                        <div
                                            className={`flex items-center p-3 space-x-2 cursor-pointer hover:bg-gray-50 ${activeTab === 'advanced' ? 'bg-gray-50 border-l-2 border-l-blue-600' : ''}`}
                                            onClick={() => setActiveTab('advanced')}
                                        >
                                            <Cpu className="h-4 w-4 text-gray-500" />
                                            <span className={activeTab === 'advanced' ? 'font-medium text-blue-600' : ''}>Advanced</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main content */}
                        <div className="lg:col-span-5">
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center">
                                            {(() => {
                                                const ProviderIcon = providerDetails[activeProvider.type].icon;
                                                return (
                                                    <>
                                                        <div className="p-2 rounded bg-blue-100 text-blue-700 mr-3">
                                                            <ProviderIcon className="h-5 w-5" />
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                            <div>
                                                <CardTitle>{activeProvider.name}</CardTitle>
                                                <CardDescription>
                                                    Configure and manage {activeProvider.name} integration
                                                </CardDescription>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {!activeProvider.isDefault && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSetDefaultProvider(activeProvider.id)}
                                                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                                >
                                                    <Star className="h-4 w-4 mr-2" />
                                                    Set as Default
                                                </Button>
                                            )}
                                            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded">
                                                <span className="text-xs font-medium px-2 text-gray-500">
                                                    {activeProvider.enabled ? 'Enabled' : 'Disabled'}
                                                </span>
                                                <Switch
                                                    checked={activeProvider.enabled}
                                                    onCheckedChange={(checked) => handleToggleProviderEnabled(activeProvider.id, checked)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <TabsContent value="general" className="space-y-6 mt-0" hidden={activeTab !== 'general'}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="provider-name">Provider Name</Label>
                                                <Input
                                                    id="provider-name"
                                                    value={activeProvider.name}
                                                    onChange={(e) => setActiveProvider({ ...activeProvider, name: e.target.value })}
                                                />
                                                <p className="text-sm text-gray-500">
                                                    This name will be displayed throughout the application
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="provider-type">Provider Type</Label>
                                                <Input
                                                    id="provider-type"
                                                    value={providerDetails[activeProvider.type].name}
                                                    disabled
                                                    className="bg-gray-50"
                                                />
                                                <p className="text-sm text-gray-500">
                                                    The type cannot be changed after creation
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                            <Card className="bg-gray-50/50">
                                                <CardContent className="pt-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center space-x-2">
                                                            <Globe className="h-5 w-5 text-blue-500" />
                                                            <h3 className="font-medium">Provider Status</h3>
                                                        </div>
                                                        <Switch
                                                            id="provider-enabled"
                                                            checked={activeProvider.enabled}
                                                            onCheckedChange={(checked) => handleToggleProviderEnabled(activeProvider.id, checked)}
                                                        />
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        When disabled, this provider won't be used for AI requests. Any requests that would go to this provider will be redirected to the default provider.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-gray-50/50">
                                                <CardContent className="pt-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center space-x-2">
                                                            <Star className="h-5 w-5 text-blue-500" />
                                                            <h3 className="font-medium">Default Provider</h3>
                                                        </div>
                                                        <Switch
                                                            id="provider-default"
                                                            checked={activeProvider.isDefault}
                                                            disabled={activeProvider.isDefault}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) handleSetDefaultProvider(activeProvider.id);
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        The default provider will be used when no specific provider is requested in an API call.
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="authentication" className="space-y-6 mt-0" hidden={activeTab !== 'authentication'}>
                                        {connectionStatus === 'success' && (
                                            <Alert className="bg-green-50 text-green-800 border-green-200">
                                                <Check className="h-4 w-4" />
                                                <AlertTitle>Connection Successful</AlertTitle>
                                                <AlertDescription>
                                                    Successfully connected to {activeProvider.name} API.
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        {connectionStatus === 'error' && (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertTitle>Connection Failed</AlertTitle>
                                                <AlertDescription>
                                                    Failed to connect to {activeProvider.name} API. Please check your credentials.
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center">
                                                    <Lock className="h-5 w-5 mr-2 text-blue-500" />
                                                    Authentication Details
                                                </CardTitle>
                                                <CardDescription>
                                                    Provide your API credentials for {activeProvider.name}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {providerDetails[activeProvider.type].configFields.map((field) => (
                                                    <div key={field.name} className="space-y-2">
                                                        <Label htmlFor={`provider-${field.name}`}>
                                                            {field.label}
                                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                                        </Label>
                                                        <Input
                                                            id={`provider-${field.name}`}
                                                            type={field.type}
                                                            value={activeProvider.configuration[field.name] || ''}
                                                            onChange={(e) => handleUpdateProviderConfig(field.name, e.target.value)}
                                                            placeholder={`Enter ${field.label.toLowerCase()}`}
                                                        />
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="models" className="mt-0" hidden={activeTab !== 'models'}>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-lg font-medium">Available Models</h2>
                                                    <p className="text-sm text-gray-500">
                                                        Configure model settings and availability
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                                {activeProvider.models.map((model) => (
                                                    <Card key={model.id}>
                                                        <div className="flex items-center justify-between p-4 border-b bg-gray-50/80">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="p-2 rounded bg-blue-100 text-blue-700">
                                                                    <Server className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-medium">{model.name}</h3>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded border">
                                                                <span className="text-xs font-medium text-gray-500">
                                                                    {model.enabled ? 'Enabled' : 'Disabled'}
                                                                </span>
                                                                <Switch
                                                                    checked={model.enabled}
                                                                    onCheckedChange={(checked) => handleToggleModel(model.id, checked)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <CardContent className="p-4">
                                                            <div className="grid grid-cols-1 gap-6">
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center justify-between">
                                                                        <Label htmlFor={`model-${model.id}-max-tokens`} className="flex items-center">
                                                                            Max Tokens
                                                                            <HoverCard>
                                                                                <HoverCardTrigger>
                                                                                    <AlertCircle className="h-4 w-4 inline ml-1 text-gray-400" />
                                                                                </HoverCardTrigger>
                                                                                <HoverCardContent>
                                                                                    <p className="text-sm">
                                                                                        Maximum number of tokens to generate in the response.
                                                                                    </p>
                                                                                </HoverCardContent>
                                                                            </HoverCard>
                                                                        </Label>
                                                                        <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                                                                            {model.maxTokens}
                                                                        </span>
                                                                    </div>
                                                                    <Slider
                                                                        id={`model-${model.id}-max-tokens`}
                                                                        value={[model.maxTokens]}
                                                                        min={16}
                                                                        max={32768}
                                                                        step={16}
                                                                        onValueChange={(value) => handleUpdateModelConfig(model.id, 'maxTokens', value[0])}
                                                                        className="mt-2"
                                                                    />
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <div className="flex items-center justify-between">
                                                                        <Label htmlFor={`model-${model.id}-temperature`} className="flex items-center">
                                                                            Temperature
                                                                            <HoverCard>
                                                                                <HoverCardTrigger>
                                                                                    <AlertCircle className="h-4 w-4 inline ml-1 text-gray-400" />
                                                                                </HoverCardTrigger>
                                                                                <HoverCardContent>
                                                                                    <p className="text-sm">
                                                                                        Controls randomness: lower values are more deterministic, higher values are more creative.
                                                                                    </p>
                                                                                </HoverCardContent>
                                                                            </HoverCard>
                                                                        </Label>
                                                                        <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                                                                            {model.temperature.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                    <Slider
                                                                        id={`model-${model.id}-temperature`}
                                                                        value={[model.temperature * 100]}
                                                                        min={0}
                                                                        max={100}
                                                                        step={1}
                                                                        onValueChange={(value) => handleUpdateModelConfig(model.id, 'temperature', value[0] / 100)}
                                                                        className="mt-2"
                                                                    />
                                                                    <div className="flex justify-between text-xs text-gray-500 px-2">
                                                                        <span>Precise</span>
                                                                        <span>Creative</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="advanced" className="space-y-6 mt-0" hidden={activeTab !== 'advanced'}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg flex items-center">
                                                        <History className="h-5 w-5 mr-2 text-blue-500" />
                                                        Request Settings
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="request-timeout">Request Timeout (seconds)</Label>
                                                        <Input
                                                            id="request-timeout"
                                                            type="number"
                                                            defaultValue="60"
                                                        />
                                                        <p className="text-sm text-gray-500">
                                                            Maximum time to wait for a response from the API
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="api-version">API Version (if applicable)</Label>
                                                        <Input
                                                            id="api-version"
                                                            placeholder="Leave blank for default"
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg flex items-center">
                                                        <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                                                        Performance Settings
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor="cache-enabled">Enable Response Caching</Label>
                                                            <Switch
                                                                id="cache-enabled"
                                                                defaultChecked={true}
                                                            />
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            Cache responses to improve performance and reduce API costs
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="cache-ttl">Cache TTL (minutes)</Label>
                                                        <Input
                                                            id="cache-ttl"
                                                            type="number"
                                                            defaultValue="60"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                                                        <Input
                                                            id="rate-limit"
                                                            type="number"
                                                            defaultValue="60"
                                                        />
                                                        <p className="text-sm text-gray-500">
                                                            Maximum number of requests per minute to this provider
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>
                                </CardContent>

                                <CardFooter className="border-t p-4 flex justify-end space-x-2 bg-gray-50/50">
                                    <Button variant="outline" onClick={() => setActiveProvider(null)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={handleSaveProvider}
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIProviderManager; 