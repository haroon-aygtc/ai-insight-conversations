import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MessageSquare, X, Maximize2, Minimize2 } from "lucide-react";
import PreChatForm from "../widget-preview/PreChatForm";
import ChatInterface from "../widget-preview/ChatInterface";
import PostChatForm from "../widget-preview/PostChatForm";
import FeedbackForm from "../widget-preview/FeedbackForm";

interface ModernWidgetPreviewProps {
  config: any;
  deviceType?: "desktop" | "tablet" | "mobile";
  forceOpen?: boolean;
}

const ModernWidgetPreview: React.FC<ModernWidgetPreviewProps> = ({
  config,
  deviceType = "desktop",
  forceOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(
    forceOpen || deviceType === "mobile" || deviceType === "tablet",
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentView, setCurrentView] = useState<
    "pre-chat" | "chat" | "post-chat" | "feedback"
  >(config.content?.enablePreChatForm ? "pre-chat" : "chat");
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [preChatData, setPreChatData] = useState<Record<string, any>>({});
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Initialize chat with welcome message when opened
  useEffect(() => {
    if (isOpen && currentView === "chat" && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            config.content?.welcomeMessage ||
            "Hello! How can I help you today?",
        },
      ]);
    }
  }, [isOpen, currentView, messages.length, config.content?.welcomeMessage]);

  // Update widget state when device type changes
  useEffect(() => {
    setIsOpen(forceOpen || deviceType === "mobile" || deviceType === "tablet");
    setIsExpanded(false);
  }, [deviceType, forceOpen]);

  // Handle forceOpen prop changes
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  // Reset view when configuration changes
  useEffect(() => {
    if (config.content?.enablePreChatForm) {
      setCurrentView("pre-chat");
    } else {
      setCurrentView("chat");
    }
    setPreChatData({});
  }, [config.content?.enablePreChatForm, config.content?.preChatFormFields]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (isExpanded && !isOpen) {
      setIsExpanded(false);
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Handle chat message submission
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);

    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Thank you for your message! How else can I assist you today?",
        },
      ]);
    }, 1000);
  };

  // Handle pre-chat form submission
  const handlePreChatSubmit = (data: Record<string, any>) => {
    setPreChatData(data);
    setCurrentView("chat");
  };

  // Handle end chat
  const handleEndChat = () => {
    if (config.content?.enablePostChatForm) {
      setCurrentView("post-chat");
    } else if (config.content?.enableFeedback) {
      setCurrentView("feedback");
    } else {
      setIsOpen(false);
    }
  };

  // Handle post-chat form submission
  const handlePostChatSubmit = (data: Record<string, any>) => {
    if (config.content?.enableFeedback) {
      setCurrentView("feedback");
    } else {
      setIsOpen(false);
    }
  };

  // Handle feedback submission
  const handleFeedbackSubmit = (data: Record<string, any>) => {
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  // Extract styles from config with better defaults
  const {
    primaryColor = "#6366f1",
    secondaryColor = "#ffffff",
    borderRadius = 16,
    chatIconSize = 56,
    fontFamily = "Inter, system-ui, sans-serif",
    textColor = "#1f2937",
    headerTextColor = "#ffffff",
    avatarUrl = "",
    theme = "light",
  } = config.appearance || {};

  const isDarkMode = theme === "dark";

  // Device-responsive sizing with better proportions
  const deviceSizing = {
    desktop: {
      widgetWidth: "380px",
      widgetHeight: "550px",
      iconSize: `${chatIconSize}px`,
      position: "bottom-6 right-6",
    },
    tablet: {
      widgetWidth: "360px",
      widgetHeight: "500px",
      iconSize: `${Math.max(60, chatIconSize * 1.1)}px`,
      position: "bottom-5 right-5",
    },
    mobile: {
      widgetWidth: "340px",
      widgetHeight: "480px",
      iconSize: `${Math.max(60, chatIconSize * 1.1)}px`,
      position: "bottom-4 right-4",
    },
  };

  const currentSizing = deviceSizing[deviceType];

  // Render the chat window content based on state
  const renderChatContent = () => {
    if (currentView === "pre-chat" && config.content?.enablePreChatForm) {
      return (
        <PreChatForm
          fields={config.content.preChatFormFields || []}
          title={config.content.preChatFormTitle || "Before we start"}
          subtitle={
            config.content.preChatFormSubtitle ||
            "Please provide the following information"
          }
          primaryColor={primaryColor}
          onSubmit={handlePreChatSubmit}
        />
      );
    } else if (currentView === "chat") {
      return (
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          onEndChat={handleEndChat}
          primaryColor={primaryColor}
          botName={config.content?.botName || "AI Assistant"}
          inputPlaceholder={
            config.content?.inputPlaceholder || "Type a message..."
          }
          showTypingIndicator={config.content?.showTypingIndicator}
          avatarUrl={avatarUrl}
        />
      );
    } else if (currentView === "post-chat") {
      return (
        <PostChatForm
          fields={config.content?.postChatFormFields || []}
          title={config.content?.postChatFormTitle || "Before you go"}
          subtitle={
            config.content?.postChatFormSubtitle ||
            "Please provide some feedback about your experience"
          }
          primaryColor={primaryColor}
          onSubmit={handlePostChatSubmit}
        />
      );
    } else if (currentView === "feedback") {
      return (
        <FeedbackForm
          options={config.content?.feedbackOptions || []}
          primaryColor={primaryColor}
          onSubmit={handleFeedbackSubmit}
          submitted={feedbackSubmitted}
        />
      );
    }

    return null;
  }

  // Apply theme colors
  const primaryColor = config.appearance.primaryColor;
  const borderRadius = `${config.appearance.borderRadius}px`;
  const iconSize = `${config.appearance.chatIconSize}px`;
  const fontFamily = config.appearance.fontFamily || "system-ui";

  // Extract typography settings with defaults
  const fontSize = config.appearance.fontSize || "medium";
  const fontWeight = config.appearance.fontWeight || "normal";
  const textColor = config.appearance.textColor || "#333333";
  const headerTextColor = config.appearance.headerTextColor || "#ffffff";

  // Extract layout settings with defaults
  const headerStyle = config.appearance.headerStyle || "solid";
  const buttonStyle = config.appearance.buttonStyle || "rounded";
  const gradientEnabled = config.appearance.gradientEnabled || false;
  const shadowIntensity = config.appearance.shadowIntensity || 2;
  const backgroundOpacity = config.appearance.backgroundOpacity || 100;

  // Font size mapping
  const fontSizeMap = {
    small: {
      header: "text-xs",
      message: "text-xs",
      input: "text-xs",
    },
    medium: {
      header: "text-sm",
      message: "text-sm",
      input: "text-sm",
    },
    large: {
      header: "text-base",
      message: "text-base",
      input: "text-base",
    }
  };

  // Font weight mapping
  const fontWeightMap = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold"
  };

  // Get font classes
  const getTypographyClasses = (element) => {
    const size = fontSizeMap[fontSize] || fontSizeMap.medium;
    const weight = fontWeightMap[fontWeight] || fontWeightMap.normal;
    return `${size[element]} ${weight}`;
  };

  // Device-responsive sizing
  const deviceSizing = {
    desktop: {
      widgetWidth: "w-80",
      widgetHeight: "h-96",
      iconSize: iconSize,
      fontSize: "text-sm",
      padding: "p-4",
      gap: "gap-4",
      position: "bottom-4 right-4"
    },
    tablet: {
      widgetWidth: "w-72",
      widgetHeight: "h-80",
      iconSize: `${Math.max(48, parseInt(iconSize) * 1.1)}px`,
      fontSize: "text-sm",
      padding: "p-3",
      gap: "gap-3",
      position: "bottom-4 right-4"
    },
    mobile: {
      widgetWidth: "w-64",
      widgetHeight: "h-72",
      iconSize: `${Math.max(48, parseInt(iconSize) * 1.1)}px`,
      fontSize: "text-sm",
      padding: "p-3",
      gap: "gap-3",
      position: "bottom-3 right-3"
    }
  };

  const currentSizing = deviceSizing[deviceType];

  // Adjust widget size for mobile/tablet to fit in device frame
  const getWidgetConstraints = () => {
    if (deviceType === 'mobile') {
      return {
        maxWidth: '95%',
        maxHeight: '90%',
        width: '320px',
        height: '500px'
      };
    }
    if (deviceType === 'tablet') {
      return {
        maxWidth: '90%',
        maxHeight: '85%',
        width: '480px',
        height: '600px'
      };
    }
    return {
      maxWidth: '320px',
      maxHeight: '384px',
      width: '320px',
      height: '384px'
    };
  };

  const widgetConstraints = getWidgetConstraints();

  // Animation classes
  const animationClasses =
    {
      fade: "transition-opacity duration-300",
      slide: "transition-transform duration-300",
      bounce: "animate-bounce",
      none: "",
    }[config.behavior.animation] || "fade";

  // Apply theme mode
  const themeMode = config.appearance.theme || 'light';
  const isDarkMode = themeMode === 'dark' || (themeMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Theme-aware colors
  const backgroundColors = {
    light: 'bg-slate-50',
    dark: 'bg-slate-900'
  };

  const mockContentColors = {
    light: 'bg-white',
    dark: 'bg-slate-800'
  };

  const browserBarColors = {
    light: 'bg-slate-200',
    dark: 'bg-slate-700'
  };

  // Get button style classes
  const getButtonStyleClasses = (style = buttonStyle) => {
    switch (style) {
      case 'pill':
        return 'rounded-full';
      case 'square':
        return 'rounded-sm';
      case 'minimal':
        return 'rounded-md border-0 shadow-none';
      case 'rounded':
      default:
        return 'rounded-md';
    }
  };

  // Get header style properties
  const getHeaderStyleProps = () => {
    let styles: React.CSSProperties = { 
      backgroundColor: primaryColor, 
      fontFamily,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
    };

    if (headerStyle === 'gradient') {
      styles = {
        ...styles,
        backgroundImage: `linear-gradient(to right, ${primaryColor}, ${adjustColor(primaryColor, 30)})`,
      };
    } else if (headerStyle === 'glass') {
      styles = {
        ...styles,
        backgroundColor: `${primaryColor}CC`, // Add transparency
        backdropFilter: 'blur(10px)',
      };
    } else if (headerStyle === 'flat') {
      styles = {
        ...styles,
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      };
    }

    return styles;
  };

  // Get shadow class based on intensity
  const getShadowClass = (intensity = shadowIntensity) => {
    const shadowMap = {
      0: 'shadow-none',
      1: 'shadow-sm',
      2: 'shadow',
      3: 'shadow-md',
      4: 'shadow-lg',
      5: 'shadow-xl',
    };
    return shadowMap[intensity] || 'shadow';
  };

  // Helper function to adjust a color's brightness
  const adjustColor = (color, amount) => {
    // Simple color adjustment for demo purposes
    return color;
  };

  return (
    <div
      className={cn(
        "relative w-full h-[600px] rounded-xl border overflow-hidden transition-all duration-300 shadow-lg",
        isDarkMode
          ? "bg-slate-900"
          : "bg-gradient-to-br from-slate-50 to-slate-100",
      )}
    >
      {/* Modern browser frame */}
      <div
        className={cn(
          "h-10 flex items-center px-4 gap-2 border-b transition-colors duration-300",
          isDarkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200",
        )}
      >
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div
          className={cn(
            "ml-4 h-6 w-72 rounded-md flex items-center px-3 text-xs transition-colors duration-300",
            isDarkMode
              ? "bg-slate-700 text-slate-300"
              : "bg-slate-100 text-slate-600",
          )}
        >
          https://example.com
        </div>
      </div>

      {/* Mock website content with modern design */}
      <div
        className={cn(
          "h-[calc(100%-2.5rem)] relative overflow-y-auto",
          deviceType === "mobile"
            ? "p-3"
            : deviceType === "tablet"
              ? "p-4"
              : "p-6",
        )}
      >
        {/* Modern header */}
        <div
          className={cn(
            "w-full rounded-xl shadow-sm mb-4 p-6 transition-colors duration-300",
            isDarkMode ? "bg-slate-800" : "bg-white",
            deviceType === "mobile"
              ? "h-16 p-4"
              : deviceType === "tablet"
                ? "h-20 p-5"
                : "h-24",
          )}
        >
          <div className="flex items-center justify-between h-full">
            <div
              className={cn(
                "rounded-lg transition-colors duration-300",
                isDarkMode ? "bg-slate-700" : "bg-slate-100",
                deviceType === "mobile"
                  ? "w-24 h-6"
                  : deviceType === "tablet"
                    ? "w-32 h-8"
                    : "w-40 h-10",
              )}
            ></div>
            <div className="flex gap-2">
              <div
                className={cn(
                  "rounded-lg transition-colors duration-300",
                  isDarkMode ? "bg-slate-700" : "bg-slate-100",
                  deviceType === "mobile"
                    ? "w-16 h-6"
                    : deviceType === "tablet"
                      ? "w-20 h-8"
                      : "w-24 h-10",
                )}
              ></div>
              <div
                className={cn(
                  "rounded-lg transition-colors duration-300",
                  isDarkMode ? "bg-slate-700" : "bg-slate-100",
                  deviceType === "mobile"
                    ? "w-16 h-6"
                    : deviceType === "tablet"
                      ? "w-20 h-8"
                      : "w-24 h-10",
                )}
              ></div>
            </div>
          </div>
        </div>

        {/* Modern content grid */}
        <div
          className={cn(
            "grid gap-4 mb-4",
            deviceType === "mobile"
              ? "grid-cols-1"
              : deviceType === "tablet"
                ? "grid-cols-2"
                : "grid-cols-3",
          )}
        >
          {Array.from({
            length:
              deviceType === "mobile" ? 2 : deviceType === "tablet" ? 4 : 6,
          }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl shadow-sm transition-colors duration-300",
                isDarkMode ? "bg-slate-800" : "bg-white",
                deviceType === "mobile"
                  ? "h-32"
                  : deviceType === "tablet"
                    ? "h-36"
                    : "h-40",
              )}
            ></div>
          ))}
        </div>

        {/* Main content section */}
        <div
          className={cn(
            "w-full rounded-xl shadow-sm mb-4 transition-colors duration-300",
            isDarkMode ? "bg-slate-800" : "bg-white",
            deviceType === "mobile"
              ? "h-48"
              : deviceType === "tablet"
                ? "h-56"
                : "h-64",
          )}
        ></div>

        {/* Additional content for scrolling */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-full rounded-xl shadow-sm mb-4 transition-colors duration-300",
              isDarkMode ? "bg-slate-800" : "bg-white",
              deviceType === "mobile"
                ? "h-24"
                : deviceType === "tablet"
                  ? "h-28"
                  : "h-32",
            )}
          ></div>
        ))}
      </div>

      {/* Modern widget button */}
      <div
        className={cn(
          "absolute cursor-pointer transition-all duration-300 hover:scale-105",
          currentSizing.position,
        )}
        onClick={toggleWidget}
        style={{ fontFamily, zIndex: 999 }}
      >
        {!isOpen ? (
          <div
            className="rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
            style={{
              backgroundColor: primaryColor,
              width: currentSizing.iconSize,
              height: currentSizing.iconSize,
              borderRadius:
                config.appearance?.iconStyle === "square"
                  ? "16px"
                  : config.appearance?.iconStyle === "rounded"
                    ? "20px"
                    : "50%",
              boxShadow: `0 8px 32px ${primaryColor}40`,
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Chat Avatar"
                className="w-full h-full object-cover"
                style={{
                  borderRadius:
                    config.appearance?.iconStyle === "square"
                      ? "14px"
                      : config.appearance?.iconStyle === "rounded"
                        ? "18px"
                        : "50%",
                }}
              />
            ) : (
              <MessageSquare size={parseInt(currentSizing.iconSize) * 0.4} />
            )}
          </div>
        ) : (
          <div
            className={cn(
              "rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300",
              getShadowClass(),
              isExpanded ? "fixed inset-4 h-auto" : "",
              deviceType === "mobile" && !isExpanded
                ? "fixed bottom-4 right-4 left-4"
                : "",
              deviceType === "tablet" && !isExpanded
                ? "fixed bottom-5 right-5 left-5"
                : "",
              isDarkMode
                ? "bg-slate-800 border border-slate-700"
                : "bg-white border border-slate-200",
            )}
            style={{
              width: isExpanded
                ? "auto"
                : deviceType === "mobile" || deviceType === "tablet"
                  ? "auto"
                  : currentSizing.widgetWidth,
              height: isExpanded ? "auto" : currentSizing.widgetHeight,
              maxHeight: deviceType === "mobile" ? "90vh" : "85vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modern header with gradient */}
            <div
              className={cn(
                "flex items-center justify-between",
                deviceType === 'mobile' ? 'p-3' : deviceType === 'tablet' ? 'p-3.5' : 'p-4'
              )}
              style={{
                ...getHeaderStyleProps(),
                borderTopLeftRadius: deviceType === 'mobile' ? '12px' : borderRadius,
                borderTopRightRadius: deviceType === 'mobile' ? '12px' : borderRadius,
              }}
            >
              <div className="flex items-center gap-2.5">
                {config.appearance.theme === "modern" && (
                  <div className="bg-white bg-opacity-20 p-1.5 rounded-md flex items-center justify-center">
                    <MessageSquare size={18} className="text-white" />
                  </div>
                )}
                <div>
                  <h3 className={cn(
                    "font-semibold text-white tracking-tight",
                    getTypographyClasses('header')
                  )}>
                    {config.content.headerTitle || 'Chat Support'}
                  </h3>
                  <p className={cn(
                    "text-white text-opacity-90 flex items-center gap-1.5",
                    fontSize === "small" ? "text-[10px]" : "text-xs"
                  )}>
                    <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleExpand}
                  className="p-1.5 rounded-md hover:bg-white hover:bg-opacity-10 text-white transition-colors duration-150"
                >
                  {isExpanded ? (
                    <Minimize2 size={16} />
                  ) : (
                    <Maximize2 size={16} />
                  )}
                </button>
                <button
                  onClick={toggleWidget}
                  className="p-1.5 rounded-md hover:bg-white hover:bg-opacity-10 text-white transition-colors duration-150"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {renderChatContent()}

            {/* Branding */}
            {config.appearance.theme === "modern" && (
              <div className={cn(
                "py-1.5 px-3 border-t text-center transition-colors duration-300",
                isDarkMode
                  ? "bg-slate-900 border-slate-700/50"
                  : "bg-slate-50 border-slate-200/70"
              )}>
                <p className={cn(
                  "text-[10px] transition-colors duration-300 flex items-center justify-center gap-1",
                  isDarkMode ? "text-slate-500" : "text-slate-400"
                )}
                  style={{ fontFamily }}
                >
                  <span>Powered by</span>
                  <span className="font-semibold">AI Insight</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernWidgetPreview;
