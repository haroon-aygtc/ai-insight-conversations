import React, { useState, useEffect } from "react";
import { Widget, WidgetData } from "@/services/widgetService";

// Define local Widget interface if needed
interface LocalWidget {
  id: string | number;
  widget_id: string;
  name: string;
  description: string;
  is_active: boolean;
  is_published: boolean;
  status: string;
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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Send,
  ChevronRight,
  Download,
  Settings,
  Layers,
  Code,
  BarChart,
  Save,
  Play,
  Pause,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { WidgetAppearanceTab } from "@/components/widget-configurator/WidgetAppearanceTab";
import { WidgetBehaviorTab } from "@/components/widget-configurator/WidgetBehaviorTab";
import { WidgetContentTab } from "@/components/widget-configurator/WidgetContentTab";
import { WidgetEmbeddingTab } from "@/components/widget-configurator/WidgetEmbeddingTab";
import { WidgetPreview } from "@/components/widget-configurator/WidgetPreview";
import { WidgetTestingPlatform } from "@/components/widget-configurator/testing/WidgetTestingPlatform";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { widgetService } from "@/services/widgetService";

const WidgetConfigurator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id: widgetId } = useParams();
  const [activeTab, setActiveTab] = useState("widget-config");
  const [configTab, setConfigTab] = useState("appearance");
  const [previewUpdateTrigger, setPreviewUpdateTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Widget configuration state
  const [widgetConfig, setWidgetConfig] = useState({
    id: null,
    widget_id: null,
    name: "New Widget",
    description: "My chat widget",
    is_active: true,
    is_published: false,
    status: "draft",
    appearance_config: {
      primaryColor: "#6366f1",
      secondaryColor: "#ffffff",
      borderRadius: 8,
      chatIconSize: 40,
      fontFamily: "inter",
      fontSize: "medium",
      fontWeight: "normal",
      textColor: "#333333",
      headerTextColor: "#ffffff",
      theme: "light",
      iconStyle: "circle",
      customCSS: "",
    },
    behavior_config: {
      autoOpen: "no",
      delay: 5,
      position: "bottom-right",
      animation: "fade",
      mobileBehavior: "responsive",
      showAfterPageViews: 1,
      persistState: true,
      showNotifications: true,
    },
    content_config: {
      welcomeMessage: "Hello! How can I help you today?",
      botName: "AI Assistant",
      inputPlaceholder: "Type a message...",
      chatButtonText: "Chat with us",
      headerTitle: "Chat Support",
      enablePreChatForm: false,
      preChatFormFields: [
        {
          id: "field-name",
          label: "Name",
          type: "text",
          placeholder: "Enter your name",
          required: true
        },
        {
          id: "field-email",
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
          required: true
        }
      ],
      preChatFormTitle: "Before we start chatting...",
      preChatFormSubtitle: "Please provide the following information:",
      enableFeedback: false,
      feedbackPosition: "after-bot",
      feedbackOptions: [
        {
          id: "feedback-helpful",
          type: "thumbs",
          question: "Was this helpful?",
          required: true
        }
      ],
      showTypingIndicator: true,
      showAvatar: true,
    },
    embedding_config: {
      allowedDomains: "*",
      widgetId: "",
      enableAnalytics: true,
      gdprCompliance: true,
    },
  });

  // Track if we're in the middle of saving a widget
  const [isSaving, setIsSaving] = useState(false);
  
  // Track if we've just successfully saved a widget and are navigating
  const [justSaved, setJustSaved] = useState(false);
  
  // Track the last successfully saved widget ID to prevent unnecessary reloads
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  
  // Load widget data if editing an existing widget
  useEffect(() => {
    // Skip this check in the following cases:
    // 1. If we're in the process of saving a widget
    // 2. If we're on the new widget page
    // 3. If we've just successfully saved a widget and are navigating
    // 4. If the current widgetId matches the last successfully saved ID
    if (isSaving || 
        window.location.pathname === '/widgets/new' || 
        justSaved || 
        (widgetId && lastSavedId === widgetId)) {
      return;
    }
    
    // Only load if widgetId is a valid string (not undefined, null, or empty)
    if (widgetId && typeof widgetId === 'string' && widgetId.trim() !== '') {
      loadWidget(widgetId);
    } else if (widgetId === undefined && 
              window.location.pathname.includes('/widgets/') && 
              window.location.pathname !== '/widgets/new') {
      
      // Store the current path to check if navigation occurs during the timeout
      const currentPath = window.location.pathname;
      
      // If we're on a widget edit page but the ID is undefined, show an error
      // Add a longer delay to ensure this isn't a transient state during navigation
      const timeoutId = setTimeout(() => {
        // Only show the error and redirect if we're still on the same path
        // This prevents the error from showing during navigation
        if (window.location.pathname === currentPath && !justSaved) {
          toast({
            title: "Invalid Widget ID",
            description: "No widget ID was provided. Creating a new widget instead.",
            variant: "destructive",
          });
          
          // Redirect to new widget page
          navigate('/widgets/new');
        }
      }, 500); // Increased timeout to give more time for navigation to complete
      
      // Clean up timeout if component unmounts or dependencies change
      return () => clearTimeout(timeoutId);
    }
  }, [widgetId, navigate, isSaving, justSaved, lastSavedId]);

  // Load widget data from the API
  const loadWidget = async (id: string) => {
    // Validate the ID before making the API call
    if (!id || id === 'undefined' || id === 'null') {
      toast({
        title: "Invalid Widget ID",
        description: "Cannot load widget: Invalid ID provided.",
        variant: "destructive",
      });
      navigate('/widgets/new');
      return;
    }
    
    setLoading(true);
    try {
      const widgetData = await widgetService.getWidget(id) as Widget;
      
      // Additional validation to ensure we got valid data back
      if (!widgetData || !widgetData.id) {
        throw new Error('Received invalid widget data from server');
      }
      
      setWidgetConfig({
        id: widgetData.id,
        widget_id: widgetData.widget_id,
        name: widgetData.name,
        description: widgetData.description,
        is_active: widgetData.is_active,
        is_published: widgetData.is_published,
        status: widgetData.status,
        appearance_config: widgetData.appearance_config,
        behavior_config: widgetData.behavior_config,
        content_config: widgetData.content_config,
        embedding_config: {
          ...widgetData.embedding_config,
          widgetId: widgetData.widget_id,
        },
      });

      toast({
        title: "Widget Loaded",
        description: "Widget configuration has been loaded successfully.",
      });
    } catch (error) {
      console.error("Error loading widget:", error);
      
      // Check if it's a 404 Not Found error
      if (error.response && error.response.status === 404) {
        toast({
          title: "Widget Not Found",
          description: "The widget you're trying to access doesn't exist or has been deleted.",
          variant: "destructive",
        });
        
        // Redirect to widget list or new widget page after a short delay
        setTimeout(() => {
          navigate('/widgets/new');
        }, 1500);
        return;
      }
      
      // Handle other errors
      toast({
        title: "Error",
        description: error.message || "Failed to load widget configuration. Please try again.",
        variant: "destructive",
      });
      
      // Redirect to new widget page for any error
      setTimeout(() => {
        navigate('/widgets/new');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  // Force preview update when configuration changes
  useEffect(() => {
    setPreviewUpdateTrigger(prev => prev + 1);
  }, [widgetConfig]);

  const handleConfigChange = async (section, key, value) => {
    // First update the config with the new value
    setWidgetConfig((prev) => ({
      ...prev,
      [`${section}_config`]: {
        ...prev[`${section}_config`],
        [key]: value,
      },
    }));
    
    // If we're enabling a form feature, load the default template
    if (section === 'content' && value === true) {
      try {
        // Handle form template loading for different form types
        if (key === 'enablePreChatForm') {
          // Show loading toast
          toast({
            title: "Loading Template",
            description: "Loading default pre-chat form template...",
          });
          
          // Get current widget config as WidgetData
          const currentConfig: widgetService.WidgetData = {
            name: widgetConfig.name,
            description: widgetConfig.description,
            appearance_config: widgetConfig.appearance_config,
            behavior_config: widgetConfig.behavior_config,
            content_config: widgetConfig.content_config,
            embedding_config: widgetConfig.embedding_config,
          };
          
          // Load default pre-chat form template
          const updatedConfig = await widgetService.loadDefaultFormTemplate(
            currentConfig,
            'preChatForm'
          );
          
          // Update widget config with template data
          setWidgetConfig(prev => ({
            ...prev,
            content_config: updatedConfig.content_config || prev.content_config
          }));
          
          toast({
            title: "Template Loaded",
            description: "Default pre-chat form template has been loaded.",
          });
        } 
        else if (key === 'enablePostChatForm') {
          // Show loading toast
          toast({
            title: "Loading Template",
            description: "Loading default post-chat form template...",
          });
          
          // Get current widget config as WidgetData
          const currentConfig: widgetService.WidgetData = {
            name: widgetConfig.name,
            description: widgetConfig.description,
            appearance_config: widgetConfig.appearance_config,
            behavior_config: widgetConfig.behavior_config,
            content_config: widgetConfig.content_config,
            embedding_config: widgetConfig.embedding_config,
          };
          
          // Load default post-chat form template
          const updatedConfig = await widgetService.loadDefaultFormTemplate(
            currentConfig,
            'postChatForm'
          );
          
          // Update widget config with template data
          setWidgetConfig(prev => ({
            ...prev,
            content_config: updatedConfig.content_config || prev.content_config
          }));
          
          toast({
            title: "Template Loaded",
            description: "Default post-chat form template has been loaded.",
          });
        } 
        else if (key === 'enableFeedback') {
          // Show loading toast
          toast({
            title: "Loading Template",
            description: "Loading default feedback form template...",
          });
          
          // Get current widget config as WidgetData
          const currentConfig: widgetService.WidgetData = {
            name: widgetConfig.name,
            description: widgetConfig.description,
            appearance_config: widgetConfig.appearance_config,
            behavior_config: widgetConfig.behavior_config,
            content_config: widgetConfig.content_config,
            embedding_config: widgetConfig.embedding_config,
          };
          
          // Load default feedback form template
          const updatedConfig = await widgetService.loadDefaultFormTemplate(
            currentConfig,
            'feedback'
          );
          
          // Update widget config with template data
          setWidgetConfig(prev => ({
            ...prev,
            content_config: updatedConfig.content_config || prev.content_config
          }));
          
          toast({
            title: "Template Loaded",
            description: "Default feedback form template has been loaded.",
          });
        }
      } catch (error) {
        console.error(`Error loading form template for ${key}:`, error);
        toast({
          title: "Template Error",
          description: "Could not load the default template. You can still configure the form manually.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveConfiguration = async () => {
    // Set all saving-related states
    setSaving(true);
    setIsSaving(true);
    setJustSaved(false); // Reset justSaved state at the start of save operation
    
    try {
      let savedWidget;

      // Prepare widget data
      const widgetData = {
        name: widgetConfig.name,
        description: widgetConfig.description,
        appearance_config: widgetConfig.appearance_config,
        behavior_config: widgetConfig.behavior_config,
        content_config: widgetConfig.content_config,
        embedding_config: {
          ...widgetConfig.embedding_config,
          // Remove widgetId as it's managed by the backend
          widgetId: undefined
        },
      };

      if (widgetConfig.id) {
        // Update existing widget
        savedWidget = await widgetService.updateWidget(widgetConfig.id, widgetData);
        
        // Store the saved widget ID to prevent unnecessary reloads
        setLastSavedId(String(savedWidget.id));
      } else {
        // Create new widget
        savedWidget = await widgetService.createWidget(widgetData);
        
        // Store the saved widget ID to prevent unnecessary reloads
        setLastSavedId(String(savedWidget.id));
        
        // Mark that we've just saved a widget and are about to navigate
        setJustSaved(true);
        
        // First update the state before navigating
        setWidgetConfig(prev => ({
          ...prev,
          id: savedWidget.id,
          widget_id: savedWidget.widget_id,
          is_active: savedWidget.is_active,
          is_published: savedWidget.is_published,
          status: savedWidget.status,
          embedding_config: {
            ...savedWidget.embedding_config,
            widgetId: savedWidget.widget_id,
          },
        }));
        
        // Use setTimeout with a longer delay to ensure state is updated before navigation
        setTimeout(() => {
          navigate(`/widgets/${savedWidget.id}`);
        }, 300);
        
        // Show success toast before navigation
        toast({
          title: "Widget Created",
          description: "Your widget has been created successfully and is being loaded.",
        });
        
        // Return early to prevent duplicate state update
        return;
      }

      // Update local state with saved data
      setWidgetConfig(prev => ({
        ...prev,
        id: savedWidget.id,
        widget_id: savedWidget.widget_id,
        is_active: savedWidget.is_active,
        is_published: savedWidget.is_published,
        status: savedWidget.status,
        embedding_config: {
          ...savedWidget.embedding_config,
          widgetId: savedWidget.widget_id,
        },
      }));

      toast({
        title: "Configuration Saved",
        description: "Your widget configuration has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving widget:", error);
      
      // Handle validation errors specifically
      if (error.response && error.response.data && error.response.data.errors) {
        // Format validation errors for display
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]) => {
            // Format the field name for better readability
            const formattedField = field
              .replace('_config', '')
              .replace(/\./g, ' → ')
              .replace(/_/g, ' ');
              
            return `${formattedField}: ${Array.isArray(messages) ? messages[0] : messages}`;
          })
          .join('\n');

        toast({
          title: "Validation Error",
          description: (
            <div className="max-h-[300px] overflow-y-auto">
              <p className="font-semibold mb-2">Please fix the following issues:</p>
              <ul className="list-disc pl-4 space-y-1">
                {Object.entries(validationErrors).map(([field, messages]) => {
                  // Format the field name for better readability
                  const formattedField = field
                    .replace('_config', '')
                    .replace(/\./g, ' → ')
                    .replace(/_/g, ' ');
                    
                  return (
                    <li key={field}>
                      <span className="font-medium">{formattedField}:</span>{' '}
                      {Array.isArray(messages) ? messages[0] : messages}
                    </li>
                  );
                })}
              </ul>
            </div>
          ),
          variant: "destructive",
          duration: 10000, // Show longer for validation errors
        });
      } else if (error.message && error.message.includes('CSRF')) {
        // Handle CSRF token errors
        toast({
          title: "Authentication Error",
          description: "Your session may have expired. Please refresh the page and try again.",
          variant: "destructive",
        });
      } else {
        // Handle other errors
        toast({
          title: "Error",
          description: error.message || "Failed to save widget configuration. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      // Immediately set saving to false to update UI
      setSaving(false);
      
      // Reset other state flags with appropriate delays
      setTimeout(() => {
        // Reset isSaving first
        setIsSaving(false);
        
        // Then reset justSaved after navigation should be complete
        setTimeout(() => {
          setJustSaved(false);
        }, 500);
      }, 300);
    }
  };

  const handleResetToDefault = () => {
    // Get default config from the Widget model
    const defaultConfig = {
      appearance_config: {
        primaryColor: "#6366f1",
        secondaryColor: "#ffffff",
        borderRadius: 8,
        chatIconSize: 40,
        fontFamily: "inter",
        fontSize: "medium",
        fontWeight: "normal",
        textColor: "#333333",
        headerTextColor: "#ffffff",
        theme: "light",
        iconStyle: "circle",
        customCSS: "",
      },
      behavior_config: {
        autoOpen: "no",
        delay: 5,
        position: "bottom-right",
        animation: "fade",
        mobileBehavior: "responsive",
        showAfterPageViews: 1,
        persistState: true,
        showNotifications: true,
      },
      content_config: {
        welcomeMessage: "Hello! How can I help you today?",
        botName: "AI Assistant",
        inputPlaceholder: "Type a message...",
        chatButtonText: "Chat with us",
        headerTitle: "Chat Support",
        enablePreChatForm: false,
        preChatFormFields: [],
        preChatFormTitle: "Before we start chatting...",
        preChatFormSubtitle: "Please provide the following information:",
        enableFeedback: false,
        feedbackPosition: "after-bot",
        feedbackOptions: [],
        showTypingIndicator: true,
        showAvatar: true,
      },
      embedding_config: {
        allowedDomains: "*",
        enableAnalytics: true,
        gdprCompliance: true,
      },
    };

    // Keep existing ID and other metadata
    setWidgetConfig(prev => ({
      ...prev,
      appearance_config: defaultConfig.appearance_config,
      behavior_config: defaultConfig.behavior_config,
      content_config: defaultConfig.content_config,
      embedding_config: {
        ...defaultConfig.embedding_config,
        widgetId: prev.widget_id,
      },
    }));

    toast({
      title: "Reset to Defaults",
      description:
        "Your widget configuration has been reset to default values.",
    });
  };

  const handlePublishWidget = async () => {
    if (!widgetConfig.id) {
      toast({
        title: "Save Required",
        description: "Please save the widget before publishing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const publishedWidget = await widgetService.publishWidget(widgetConfig.id);

      setWidgetConfig(prev => ({
        ...prev,
        is_published: true,
        status: "published",
      }));

      toast({
        title: "Widget Published",
        description: "Your widget has been published and is now live.",
      });
    } catch (error) {
      console.error("Error publishing widget:", error);
      toast({
        title: "Error",
        description: "Failed to publish widget. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnpublishWidget = async () => {
    if (!widgetConfig.id) {
      return;
    }

    try {
      const unpublishedWidget = await widgetService.unpublishWidget(widgetConfig.id);

      setWidgetConfig(prev => ({
        ...prev,
        is_published: false,
        status: "draft",
      }));

      toast({
        title: "Widget Unpublished",
        description: "Your widget has been unpublished and is no longer live.",
      });
    } catch (error) {
      console.error("Error unpublishing widget:", error);
      toast({
        title: "Error",
        description: "Failed to unpublish widget. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportConfig = () => {
    // Export widget configuration as JSON
    const configToExport = {
      name: widgetConfig.name,
      description: widgetConfig.description,
      appearance: widgetConfig.appearance_config,
      behavior: widgetConfig.behavior_config,
      content: widgetConfig.content_config,
      embedding: {
        allowedDomains: widgetConfig.embedding_config.allowedDomains,
        enableAnalytics: widgetConfig.embedding_config.enableAnalytics,
        gdprCompliance: widgetConfig.embedding_config.gdprCompliance,
      },
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configToExport, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `widget-${widgetConfig.widget_id || 'new'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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
          <Layers className="h-4 w-4" />
          Overview
        </Button>
        <Button
          variant={activeTab === "widget-config" ? "default" : "ghost"}
          onClick={() => setActiveTab("widget-config")}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Widget Config
        </Button>
        <Button
          variant={activeTab === "testing" ? "default" : "ghost"}
          onClick={() => setActiveTab("testing")}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Testing
        </Button>
        <Button
          variant={activeTab === "context-rules" ? "default" : "ghost"}
          onClick={() => setActiveTab("context-rules")}
          className="flex items-center gap-2"
        >
          <Code className="h-4 w-4" />
          Context Rules
        </Button>
        <Button
          variant={activeTab === "templates" ? "default" : "ghost"}
          onClick={() => setActiveTab("templates")}
          className="flex items-center gap-2"
        >
          <Layers className="h-4 w-4" />
          Templates
        </Button>
        <Button
          variant={activeTab === "embed-code" ? "default" : "ghost"}
          onClick={() => setActiveTab("embed-code")}
          className="flex items-center gap-2"
        >
          <Code className="h-4 w-4" />
          Embed Code
        </Button>
        <Button
          variant={activeTab === "analytics" ? "default" : "ghost"}
          onClick={() => setActiveTab("analytics")}
          className="flex items-center gap-2"
        >
          <BarChart className="h-4 w-4" />
          Analytics
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {widgetConfig.name || "Widget Configurator"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {widgetConfig.description || "Customize your chat widget appearance and behavior"}
          </p>
        </div>
        <div className="flex gap-3">
          {widgetConfig.id && (
            <div className="flex items-center mr-2">
              <span className={`inline-flex h-2 w-2 rounded-full mr-2 ${widgetConfig.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm text-muted-foreground">
                {widgetConfig.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
          )}

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportConfig}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export Config
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Export Configuration</h4>
                <p className="text-xs text-muted-foreground">
                  Export your current widget configuration as a JSON file to
                  save or share.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          {widgetConfig.id && (
            <>
              {widgetConfig.is_published ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUnpublishWidget}
                  className="flex items-center gap-2"
                >
                  <Pause size={16} />
                  Unpublish
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePublishWidget}
                  className="flex items-center gap-2"
                >
                  <Play size={16} />
                  Publish
                </Button>
              )}
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setActiveTab("testing")}
          >
            Preview
            <ChevronRight size={16} />
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleSaveConfiguration}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? "Saving..." : (
              <>
                <Save size={16} />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </div>

      {activeTab === "widget-config" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-sm">
              <Tabs
                value={configTab}
                onValueChange={setConfigTab}
                className="w-full"
              >
                <div className="border-b border-slate-200">
                  <TabsList className="p-0 bg-transparent border-b-0 h-auto justify-start gap-2">
                    <TabsTrigger
                      value="appearance"
                      className={`px-4 py-3 rounded-none border-b-2 ${configTab === "appearance" ? "border-primary text-primary" : "border-transparent"} data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger
                      value="behavior"
                      className={`px-4 py-3 rounded-none border-b-2 ${configTab === "behavior" ? "border-primary text-primary" : "border-transparent"} data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Behavior
                    </TabsTrigger>
                    <TabsTrigger
                      value="content"
                      className={`px-4 py-3 rounded-none border-b-2 ${configTab === "content" ? "border-primary text-primary" : "border-transparent"} data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                        <path d="M16 13H8" />
                        <path d="M16 17H8" />
                        <path d="M10 9H8" />
                      </svg>
                      Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="embedding"
                      className={`px-4 py-3 rounded-none border-b-2 ${configTab === "embedding" ? "border-primary text-primary" : "border-transparent"} data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m7 7 10 10" />
                        <path d="M15 7h2v2" />
                        <path d="M9 17H7v-2" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                      Embedding
                    </TabsTrigger>
                  </TabsList>
                </div>

                <CardContent className="pt-6">
                  <TabsContent value="appearance" className="space-y-6 mt-0">
                    <WidgetAppearanceTab
                      config={widgetConfig.appearance_config}
                      onChange={(key, value) =>
                        handleConfigChange("appearance", key, value)
                      }
                    />
                  </TabsContent>

                  <TabsContent value="behavior" className="space-y-4 mt-0">
                    <WidgetBehaviorTab
                      config={widgetConfig.behavior_config}
                      onChange={(key, value) =>
                        handleConfigChange("behavior", key, value)
                      }
                    />
                  </TabsContent>

                  <TabsContent value="content" className="space-y-4 mt-0">
                    <WidgetContentTab
                      config={widgetConfig.content_config}
                      onChange={(key, value) =>
                        handleConfigChange("content", key, value)
                      }
                    />
                  </TabsContent>

                  <TabsContent value="embedding" className="space-y-4 mt-0">
                    <WidgetEmbeddingTab
                      config={widgetConfig.embedding_config}
                      widgetId={widgetConfig.widget_id || widgetConfig.embedding_config.widgetId}
                      onChange={(key, value) =>
                        handleConfigChange("embedding", key, value)
                      }
                    />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <WidgetPreview
              config={{
                appearance: widgetConfig.appearance_config,
                behavior: widgetConfig.behavior_config,
                content: widgetConfig.content_config,
                embedding: widgetConfig.embedding_config
              }}
              key={`preview-${previewUpdateTrigger}`}
            />
          </div>
        </div>
      )}

      {activeTab === "testing" && (
        <WidgetTestingPlatform
          widgetId={widgetConfig.widget_id || widgetConfig.embedding_config.widgetId}
          config={{
            appearance: widgetConfig.appearance_config,
            behavior: widgetConfig.behavior_config,
            content: widgetConfig.content_config,
            embedding: widgetConfig.embedding_config
          }}
        />
      )}

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleResetToDefault}>
          Reset to Default
        </Button>
      </div>
    </div>
  );
};

export default WidgetConfigurator;
