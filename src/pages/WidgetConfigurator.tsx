import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Save,
  Eye,
  Settings,
  Palette,
  MessageSquare,
  Code,
  BarChart3,
  Play,
  Pause,
  Download,
  ChevronRight,
  Layers,
  Sparkles,
  Zap,
  Check,
  ArrowRight,
  Sliders,
  PanelLeft,
  PanelRight,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { WidgetAppearanceTab } from "@/components/widget-configurator/WidgetAppearanceTab";
import { WidgetBehaviorTab } from "@/components/widget-configurator/WidgetBehaviorTab";
import { WidgetContentTab } from "@/components/widget-configurator/WidgetContentTab";
import { WidgetEmbeddingTab } from "@/components/widget-configurator/WidgetEmbeddingTab";
import ModernWidgetPreview from "@/components/widget-configurator/ModernWidgetPreview";
import { WidgetTestingPlatform } from "@/components/widget-configurator/testing/WidgetTestingPlatform";
import widgetService, { WidgetData } from "@/services/widgetService";

interface ConfigState {
  id: any;
  widget_id: any;
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
  };
  content_config: {
    welcomeMessage: string;
    botName: string;
    inputPlaceholder: string;
    chatButtonText: string;
    headerTitle: string;
    enablePreChatForm: boolean;
    preChatFormFields: {
      id: string;
      label: string;
      type: string;
      placeholder: string;
      required: boolean;
    }[];
    preChatFormTitle: string;
    preChatFormSubtitle: string;
    enableFeedback: boolean;
    feedbackPosition: string;
    feedbackOptions: {
      id: string;
      type: string;
      question: string;
      required: boolean;
    }[];
    showTypingIndicator: boolean;
    showAvatar: boolean;
  };
  embedding_config: {
    allowedDomains: string;
    widgetId: string;
    enableAnalytics: boolean;
    gdprCompliance: boolean;
  };
}

const WidgetConfigurator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id: widgetId } = useParams();
  const [activeTab, setActiveTab] = useState("widget-config");
  const [configTab, setConfigTab] = useState("appearance");
  const [previewUpdateTrigger, setPreviewUpdateTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [config, setConfig] = useState<ConfigState>({
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
          required: true,
        },
        {
          id: "field-email",
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
          required: true,
        },
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
          required: true,
        },
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

  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (
      isSaving ||
      window.location.pathname === "/widgets/new" ||
      justSaved ||
      (widgetId && lastSavedId === widgetId)
    ) {
      return;
    }

    if (widgetId && typeof widgetId === "string" && widgetId.trim() !== "") {
      loadWidget(widgetId);
    }
  }, [widgetId, navigate, isSaving, justSaved, lastSavedId]);

  const loadWidget = async (id: string) => {
    if (!id || id === "undefined" || id === "null") {
      toast({
        title: "Invalid Widget ID",
        description: "Cannot load widget: Invalid ID provided.",
        variant: "destructive",
      });
      navigate("/widgets/new");
      return;
    }

    setLoading(true);
    try {
      const widgetData = await widgetService.getWidget(id);

      if (!widgetData || !widgetData.id) {
        throw new Error("Received invalid widget data from server");
      }

      setConfig({
        id: widgetData.id,
        widget_id: widgetData.widget_id,
        name: widgetData.name,
        description: widgetData.description,
       is_active: widgetData.is_active,
        is_published: widgetData.is_published,
        status: widgetData.status,
        appearance_config: {
          ...config.appearance_config,
          ...widgetData.appearance_config,
        },
        behavior_config: {
          ...config.behavior_config,
          ...widgetData.behavior_config,
        },
        content_config: {
          ...config.content_config,
          ...widgetData.content_config,
        },
        embedding_config: {
          ...config.embedding_config,
          ...widgetData.embedding_config,
          widgetId: widgetData.widget_id || "",
        },
      });

      toast({
        title: "Widget Loaded",
        description: "Widget configuration has been loaded successfully.",
      });
    } catch (error) {
      console.error("Error loading widget:", error);

      toast({
        title: "Error",
        description: "Failed to load widget configuration. Please try again.",
        variant: "destructive",
      });

      setTimeout(() => {
        navigate("/widgets/new");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPreviewUpdateTrigger((prev) => prev + 1);
  }, [config]);

  const loadFormTemplate = async (
    formType: "preChatForm" | "postChatForm" | "feedback",
  ) => {
    try {
      toast({
        title: "Loading Template",
        description: `Loading default ${formType === "preChatForm" ? "pre-chat" : formType === "postChatForm" ? "post-chat" : "feedback"} form template...`,
      });

      const currentConfig: WidgetData = {
        name: config.name,
        description: config.description,
        appearance_config: config.appearance_config,
        behavior_config: config.behavior_config,
        content_config: config.content_config,
        embedding_config: config.embedding_config,
      };

      const updatedConfig = await widgetService.loadDefaultFormTemplate(
        currentConfig,
        formType,
      );

      setConfig((prev) => ({
        ...prev,
        content_config: {
          ...prev.content_config,
          ...updatedConfig.content_config,
        },
      }));

      toast({
        title: "Template Loaded",
        description: `Default ${formType === "preChatForm" ? "pre-chat" : formType === "postChatForm" ? "post-chat" : "feedback"} form template has been loaded.`,
      });
    } catch (error) {
      console.error(`Error loading form template for ${formType}:`, error);
      toast({
        title: "Template Error",
        description:
          "Could not load the default template. You can still configure the form manually.",
        variant: "destructive",
      });
    }
  };

  const handleConfigChange = useCallback(
    (section: string, key: string, value: any) => {
      setConfig((prev) => ({
        ...prev,
        [`${section}_config`]: {
          ...prev[`${section}_config` as keyof ConfigState],
          [key]: value,
        },
      }));

      if (section === "content" && value === true) {
        if (key === "enablePreChatForm") {
          loadFormTemplate("preChatForm");
        } else if (key === "enablePostChatForm") {
          loadFormTemplate("postChatForm");
        } else if (key === "enableFeedback") {
          loadFormTemplate("feedback");
        }
      }
    },
    [config],
  );

  const handleSaveConfiguration = async () => {
    setSaving(true);
    setIsSaving(true);
    setJustSaved(false);

    try {
      let savedWidget;

      const widgetData: widgetService.WidgetData = {
        name: config.name,
        description: config.description,
        appearance_config: config.appearance_config as widgetService.AppearanceConfig,
        behavior_config: config.behavior_config as widgetService.BehaviorConfig,
        content_config: config.content_config as widgetService.ContentConfig,
        embedding_config: {
          ...config.embedding_config,
          widgetId: undefined
        } as widgetService.EmbeddingConfig,
      };

      if (config.id) {
        savedWidget = await widgetService.updateWidget(config.id, widgetData);
        setLastSavedId(String(savedWidget.id));
      } else {
        savedWidget = await widgetService.createWidget(widgetData);
        setLastSavedId(String(savedWidget.id));
        setJustSaved(true);

        setConfig((prev) => ({
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

        setTimeout(() => {
          navigate(`/widgets/${savedWidget.id}`);
        }, 300);

        toast({
          title: "Widget Created",
          description:
            "Your widget has been created successfully and is being loaded.",
        });

        return;
      }

      setConfig((prev) => ({
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

      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to save widget configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);

      setTimeout(() => {
        setIsSaving(false);

        setTimeout(() => {
          setJustSaved(false);
        }, 500);
      }, 300);
    }
  };

  const handleResetToDefault = () => {
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

    setConfig((prev) => ({
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
    if (!config.id) {
      toast({
        title: "Save Required",
        description: "Please save the widget before publishing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const publishedWidget = await widgetService.publishWidget(config.id);

      setConfig((prev) => ({
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
    if (!config.id) {
      return;
    }

    try {
      const unpublishedWidget = await widgetService.unpublishWidget(config.id);

      setConfig((prev) => ({
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
    const configToExport = {
      name: config.name,
      description: config.description,
      appearance: config.appearance_config,
      behavior: config.behavior_config,
      content: config.content_config,
      embedding: {
        allowedDomains: config.embedding_config.allowedDomains,
        enableAnalytics: config.embedding_config.enableAnalytics,
        gdprCompliance: config.embedding_config.gdprCompliance,
      },
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(configToExport, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `widget-${config.widget_id || "new"}.json`,
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const isMobile = useIsMobile();
  const [previewDevice, setPreviewDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  return (
    <div className="pb-10">
      {/* Top navigation tabs - Modern design with gradient background */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center space-x-1 overflow-auto py-3 px-4">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className="flex items-center gap-2 rounded-full"
            size="sm"
          >
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </Button>
          <Button
            variant={activeTab === "widget-config" ? "default" : "ghost"}
            onClick={() => setActiveTab("widget-config")}
            className="flex items-center gap-2 rounded-full"
            size="sm"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Widget Config</span>
          </Button>
          <Button
            variant={activeTab === "testing" ? "default" : "ghost"}
            onClick={() => setActiveTab("testing")}
            className="flex items-center gap-2 rounded-full"
            size="sm"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            variant={activeTab === "context-rules" ? "default" : "ghost"}
            onClick={() => setActiveTab("context-rules")}
            className="flex items-center gap-2 rounded-full"
            size="sm"
          >
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Context Rules</span>
          </Button>
          <Button
            variant={activeTab === "templates" ? "default" : "ghost"}
            onClick={() => setActiveTab("templates")}
            className="flex items-center gap-2 rounded-full"
            size="sm"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </Button>
          <Button
            variant={activeTab === "embed-code" ? "default" : "ghost"}
            onClick={() => setActiveTab("embed-code")}
            className="flex items-center gap-2 rounded-full"
            size="sm"
          >
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Embed Code</span>
          </Button>
          <Button
            variant={activeTab === "analytics" ? "default" : "ghost"}
            onClick={() => setActiveTab("analytics")}
            className="flex items-center gap-2 rounded-full"
            size="sm"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {config.name || "Widget Configurator"}
              </h2>
              {config.id && (
                <Badge
                  variant={
                    config.status === "published" ? "success" : "default"
                  }
                  className="ml-2"
                >
                  <span
                    className={`inline-flex h-2 w-2 rounded-full mr-2 ${config.is_active ? "bg-green-500" : "bg-red-500"}`}
                  ></span>
                  {config.status === "published" ? "Published" : "Draft"}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              {config.description ||
                "Customize your chat widget appearance and behavior"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportConfig}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Export Config</span>
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

            {config.id && (
              <>
                {config.is_published ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUnpublishWidget}
                    className="flex items-center gap-2"
                  >
                    <Pause size={16} />
                    <span className="hidden sm:inline">Unpublish</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePublishWidget}
                    className="flex items-center gap-2"
                  >
                    <Play size={16} />
                    <span className="hidden sm:inline">Publish</span>
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
              <Eye size={16} />
              <span className="hidden sm:inline">Preview</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleSaveConfiguration}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save size={16} />
                  <span className="hidden sm:inline">Save Configuration</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {activeTab === "widget-config" && (
        <div className="px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-6 relative">
            {/* Configuration Panel */}
            <div
              className={`${isPanelCollapsed ? "lg:w-0 overflow-hidden" : "lg:w-2/3"} transition-all duration-300 ease-in-out`}
            >
              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                <div className="flex justify-between items-center border-b border-slate-200 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    <h3 className="font-medium text-sm">Configuration</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full lg:flex hidden items-center justify-center"
                    onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                  >
                    {isPanelCollapsed ? (
                      <PanelRight className="h-4 w-4" />
                    ) : (
                      <PanelLeft className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <Tabs
                  value={configTab}
                  onValueChange={setConfigTab}
                  className="w-full"
                >
                  <div className="border-b border-slate-200 bg-slate-50">
                    <TabsList className="p-0 bg-transparent border-b-0 h-auto justify-start gap-0 w-full">
                      <TabsTrigger
                        value="appearance"
                        className={`px-4 py-3 rounded-none border-b-2 flex-1 ${configTab === "appearance" ? "border-primary text-primary bg-white" : "border-transparent bg-slate-50"} data-[state=active]:bg-white data-[state=active]:shadow-none flex items-center justify-center gap-2`}
                      >
                        <Palette className="h-4 w-4" />
                        <span className="hidden sm:inline">Appearance</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="behavior"
                        className={`px-4 py-3 rounded-none border-b-2 flex-1 ${configTab === "behavior" ? "border-primary text-primary bg-white" : "border-transparent bg-slate-50"} data-[state=active]:bg-white data-[state=active]:shadow-none flex items-center justify-center gap-2`}
                      >
                        <Sliders className="h-4 w-4" />
                        <span className="hidden sm:inline">Behavior</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="content"
                        className={`px-4 py-3 rounded-none border-b-2 flex-1 ${configTab === "content" ? "border-primary text-primary bg-white" : "border-transparent bg-slate-50"} data-[state=active]:bg-white data-[state=active]:shadow-none flex items-center justify-center gap-2`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">Content</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="embedding"
                        className={`px-4 py-3 rounded-none border-b-2 flex-1 ${configTab === "embedding" ? "border-primary text-primary bg-white" : "border-transparent bg-slate-50"} data-[state=active]:bg-white data-[state=active]:shadow-none flex items-center justify-center gap-2`}
                      >
                        <Code className="h-4 w-4" />
                        <span className="hidden sm:inline">Embedding</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <CardContent className="pt-6 max-h-[calc(100vh-240px)] overflow-y-auto">
                    <TabsContent value="appearance" className="space-y-6 mt-0">
                      <WidgetAppearanceTab
                        config={config.appearance_config}
                        onChange={(key, value) =>
                          handleConfigChange("appearance", key, value)
                        }
                      />
                    </TabsContent>

                    <TabsContent value="behavior" className="space-y-4 mt-0">
                      <WidgetBehaviorTab
                        config={config.behavior_config}
                        onChange={(key, value) =>
                          handleConfigChange("behavior", key, value)
                        }
                      />
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4 mt-0">
                      <WidgetContentTab
                        config={config.content_config}
                        onChange={(key, value) =>
                          handleConfigChange("content", key, value)
                        }
                      />
                    </TabsContent>

                    <TabsContent value="embedding" className="space-y-4 mt-0">
                      <WidgetEmbeddingTab
                        config={config.embedding_config}
                        widgetId={config.widget_id || ""}
                        onChange={(key, value) =>
                          handleConfigChange("embedding", key, value)
                        }
                      />
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
            </div>

            {/* Preview Panel */}
            <div
              className={`${isPanelCollapsed ? "lg:w-full" : "lg:w-1/3"} transition-all duration-300 ease-in-out`}
            >
              <Card className="border-slate-200 shadow-sm bg-white sticky top-20">
                <div className="flex justify-between items-center border-b border-slate-200 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <h3 className="font-medium text-sm">Live Preview</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant={
                        previewDevice === "desktop" ? "secondary" : "ghost"
                      }
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => setPreviewDevice("desktop")}
                      title="Desktop View"
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        previewDevice === "tablet" ? "secondary" : "ghost"
                      }
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => setPreviewDevice("tablet")}
                      title="Tablet View"
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        previewDevice === "mobile" ? "secondary" : "ghost"
                      }
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => setPreviewDevice("mobile")}
                      title="Mobile View"
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-50 to-white">
                  <ModernWidgetPreview
                    config={{
                      appearance: config.appearance_config,
                      behavior: config.behavior_config,
                      content: config.content_config,
                      embedding: config.embedding_config,
                    }}
                    deviceType={previewDevice}
                    forceOpen={true}
                    key={previewUpdateTrigger}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {activeTab === "testing" && (
        <WidgetTestingPlatform
          widgetId={config.widget_id || config.embedding_config.widgetId}
          config={{
            appearance: config.appearance_config,
            behavior: config.behavior_config,
            content: config.content_config,
            embedding: config.embedding_config,
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
