import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Send, ChevronRight, Download } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { WidgetAppearanceTab } from '@/components/widget-configurator/WidgetAppearanceTab';
import { WidgetBehaviorTab } from '@/components/widget-configurator/WidgetBehaviorTab';
import { WidgetContentTab } from '@/components/widget-configurator/WidgetContentTab';
import { WidgetEmbeddingTab } from '@/components/widget-configurator/WidgetEmbeddingTab';
import { WidgetPreview } from '@/components/widget-configurator/WidgetPreview';
import { useToast } from '@/components/ui/use-toast';

const WidgetConfigurator = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("widget-config");
  const [configTab, setConfigTab] = useState("appearance");
  
  // Widget configuration state
  const [widgetConfig, setWidgetConfig] = useState({
    appearance: {
      primaryColor: "#6366f1",
      secondaryColor: "#ffffff",
      borderRadius: 8,
      chatIconSize: 40,
      fontFamily: "inter",
    },
    behavior: {
      autoOpen: "no",
      delay: 5,
      position: "bottom-right",
      animation: "fade",
      mobileBehavior: "responsive",
      showAfterPageViews: 1,
    },
    content: {
      welcomeMessage: "Hello! How can I help you today?",
      botName: "AI Assistant",
      inputPlaceholder: "Type a message...",
      chatButtonText: "Chat with us",
      headerTitle: "Chat Support",
      enablePreChatForm: false,
      preChatFormFields: [],
      preChatFormRequired: false,
      enableFeedback: false,
      feedbackPosition: "after-bot",
    },
    embedding: {
      allowedDomains: "*",
      widgetId: "widget-" + Math.random().toString(36).substring(2, 10),
    }
  });

  const handleConfigChange = (section, key, value) => {
    setWidgetConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSaveConfiguration = () => {
    toast({
      title: "Configuration Saved",
      description: "Your widget configuration has been saved successfully.",
    });
  };

  const handleResetToDefault = () => {
    // Would typically reset to defaults
    toast({
      title: "Reset to Defaults",
      description: "Your widget configuration has been reset to default values.",
    });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Top navigation tabs */}
      <div className="flex items-center space-x-4 overflow-auto pb-2 border-b border-slate-200">
        <Button 
          variant={activeTab === "overview" ? "default" : "ghost"} 
          onClick={() => setActiveTab("overview")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
          Overview
        </Button>
        <Button 
          variant={activeTab === "widget-config" ? "default" : "ghost"} 
          onClick={() => setActiveTab("widget-config")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
          Widget Config
        </Button>
        <Button 
          variant={activeTab === "context-rules" ? "default" : "ghost"} 
          onClick={() => setActiveTab("context-rules")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          Context Rules
        </Button>
        <Button 
          variant={activeTab === "templates" ? "default" : "ghost"} 
          onClick={() => setActiveTab("templates")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          Templates
        </Button>
        <Button 
          variant={activeTab === "embed-code" ? "default" : "ghost"} 
          onClick={() => setActiveTab("embed-code")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Embed Code
        </Button>
        <Button 
          variant={activeTab === "analytics" ? "default" : "ghost"} 
          onClick={() => setActiveTab("analytics")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          Analytics
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Widget Configurator</h2>
          <p className="text-slate-500 mt-1">Customize your chat widget appearance and behavior</p>
        </div>
        <div className="flex gap-3">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download size={16} />
                Export Config
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Export Configuration</h4>
                <p className="text-xs text-muted-foreground">Export your current widget configuration as a JSON file to save or share.</p>
              </div>
            </HoverCardContent>
          </HoverCard>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            Preview
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm">
            <Tabs value={configTab} onValueChange={setConfigTab} className="w-full">
              <div className="border-b border-slate-200">
                <TabsList className="p-0 bg-transparent border-b-0 h-auto justify-start gap-2">
                  <TabsTrigger 
                    value="appearance" 
                    className={`px-4 py-3 rounded-none border-b-2 ${configTab === 'appearance' ? 'border-primary text-primary' : 'border-transparent'} data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="behavior" 
                    className={`px-4 py-3 rounded-none border-b-2 ${configTab === 'behavior' ? 'border-primary text-primary' : 'border-transparent'} data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    Behavior
                  </TabsTrigger>
                  <TabsTrigger 
                    value="content" 
                    className={`px-4 py-3 rounded-none border-b-2 ${configTab === 'content' ? 'border-primary text-primary' : 'border-transparent'} data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                    Content
                  </TabsTrigger>
                  <TabsTrigger 
                    value="embedding" 
                    className={`px-4 py-3 rounded-none border-b-2 ${configTab === 'embedding' ? 'border-primary text-primary' : 'border-transparent'} data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 7 10 10"/><path d="M15 7h2v2"/><path d="M9 17H7v-2"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                    Embedding
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="pt-6">
                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <WidgetAppearanceTab 
                    config={widgetConfig.appearance} 
                    onChange={(key, value) => handleConfigChange('appearance', key, value)} 
                  />
                </TabsContent>
                
                <TabsContent value="behavior" className="space-y-4 mt-0">
                  <WidgetBehaviorTab 
                    config={widgetConfig.behavior} 
                    onChange={(key, value) => handleConfigChange('behavior', key, value)} 
                  />
                </TabsContent>
                
                <TabsContent value="content" className="space-y-4 mt-0">
                  <WidgetContentTab 
                    config={widgetConfig.content} 
                    onChange={(key, value) => handleConfigChange('content', key, value)} 
                  />
                </TabsContent>
                
                <TabsContent value="embedding" className="space-y-4 mt-0">
                  <WidgetEmbeddingTab 
                    config={widgetConfig.embedding} 
                    widgetId={widgetConfig.embedding.widgetId}
                    onChange={(key, value) => handleConfigChange('embedding', key, value)} 
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <WidgetPreview config={widgetConfig} />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleResetToDefault}>Reset to Default</Button>
        <Button onClick={handleSaveConfiguration}>Save Configuration</Button>
      </div>
    </div>
  );
};

export default WidgetConfigurator;
