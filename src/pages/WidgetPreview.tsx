import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as widgetService from '@/services/widgetService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import WidgetPreview from '@/components/widget-preview/WidgetPreview';
import { ArrowLeft, Monitor, Tablet, Smartphone, Code, Copy, CheckCheck } from 'lucide-react';

export interface Widget {
  id: string | number;
  widget_id: string;
  name: string;
  description: string;
  is_active: boolean;
  is_published: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  appearance_config: {
    primaryColor: string;
    secondaryColor: string;
    borderRadius: number;
    chatIconSize: number;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    textColor: string;
    headerTextColor: string;
    theme: string;
    iconStyle: string;
    customCSS: string;
    [key: string]: any;
  };
  behavior_config: {
    autoOpen: string;
    delay: number;
    position: string;
    animation: string;
    mobileBehavior: string;
    showAfterPageViews: number;
    persistState: boolean;
    showNotifications: boolean;
    [key: string]: any;
  };
  content_config: {
    welcomeMessage: string;
    botName: string;
    inputPlaceholder: string;
    chatButtonText: string;
    headerTitle: string;
    enablePreChatForm: boolean;
    preChatFormFields: Array<any>;
    preChatFormTitle: string;
    preChatFormSubtitle: string;
    enablePostChatForm: boolean;
    postChatFormFields: Array<any>;
    postChatFormTitle: string;
    postChatFormSubtitle: string;
    enableFeedback: boolean;
    feedbackPosition: string;
    feedbackOptions: Array<any>;
    showTypingIndicator: boolean;
    showAvatar: boolean;
    [key: string]: any;
  };
  embedding_config: {
    allowedDomains: string;
    enableAnalytics: boolean;
    gdprCompliance: boolean;
    widgetId?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

const WidgetPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [widget, setWidget] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      fetchWidget(id);
    }
  }, [id]);

  const fetchWidget = async (widgetId: string) => {
    try {
      setLoading(true);
      const data = await widgetService.getWidget(widgetId);
      setWidget(data as any);
      
      // Generate embed code
      const code = generateEmbedCode(data.widget_id || data.embedding_config.widgetId);
      setEmbedCode(code);
    } catch (error) {
      console.error("Error fetching widget:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!widget) {
    return <div>Widget not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/widgets')}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Widgets
        </Button>
        <div className="h-6 border-r border-slate-200"></div>
        <h1 className="text-2xl font-bold">{widget.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-slate-50 py-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Widget Preview</CardTitle>
                <Tabs value={device} onValueChange={(v) => setDevice(v as any)} className="ml-auto">
                  <TabsList className="bg-slate-100">
                    <TabsTrigger value="desktop" className="flex items-center gap-1 data-[state=active]:bg-white">
                      <Monitor size={14} />
                      <span className="hidden sm:inline">Desktop</span>
                    </TabsTrigger>
                    <TabsTrigger value="tablet" className="flex items-center gap-1 data-[state=active]:bg-white">
                      <Tablet size={14} />
                      <span className="hidden sm:inline">Tablet</span>
                    </TabsTrigger>
                    <TabsTrigger value="mobile" className="flex items-center gap-1 data-[state=active]:bg-white">
                      <Smartphone size={14} />
                      <span className="hidden sm:inline">Mobile</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative bg-slate-100 min-h-[600px] flex items-center justify-center p-4">
                <div className={`preview-container relative ${device === 'mobile' ? 'w-[375px]' : device === 'tablet' ? 'w-[768px]' : 'w-full max-w-[1024px]'} h-[600px] border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white flex items-center justify-center`}>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <WidgetPreview
                      widgetConfig={widget as any}
                      deviceType={device}
                      forceOpen={true}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Widget Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500">Description</h3>
                <p className="mt-1">{widget.description || "No description provided"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-500">Status</h3>
                <p className="mt-1 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${widget.is_active ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                  {widget.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-500">Widget ID</h3>
                <p className="mt-1 font-mono text-xs bg-slate-100 p-2 rounded">
                  {widget.widget_id || widget.embedding_config.widgetId}
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/widgets/edit/${widget.id}`)}
                >
                  Edit Widget
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Code size={16} />
                Embed Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <pre className="bg-slate-100 p-3 rounded text-xs overflow-x-auto max-h-[200px] whitespace-pre-wrap dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 text-slate-800">
                  {embedCode}
                </pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600"
                  onClick={copyEmbedCode}
                >
                  {copied ? (
                    <CheckCheck size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-slate-800 dark:text-white" />
                  )}
                </Button>
              </div>
              
              <div>
                <p className="text-xs text-slate-500">
                  Add this code to your website to display the widget. Place it just before the closing &lt;/body&gt; tag for optimal performance.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Features Enabled</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${widget.content_config.enablePreChatForm ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  Pre-Chat Form
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${widget.content_config.enablePostChatForm ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  Post-Chat Form
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${widget.content_config.enableFeedback ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  Feedback Form
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${widget.content_config.showTypingIndicator ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  Typing Indicator
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${widget.content_config.showAvatar ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  Show Avatars
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${widget.behavior_config.persistState ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  Persist State
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${widget.behavior_config.showNotifications ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  Show Notifications
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${widget.embedding_config.enableAnalytics ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  Analytics
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
