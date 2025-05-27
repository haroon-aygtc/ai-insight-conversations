import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  X,
  Maximize2,
  Minimize2,
  Send,
  User,
  Bot,
  ChevronRight,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import PreChatForm from "../widget-preview/PreChatForm";
import ChatInterface from "../widget-preview/ChatInterface";
import PostChatForm from "../widget-preview/PostChatForm";
import FeedbackForm from "../widget-preview/FeedbackForm";

interface ModernWidgetPreviewProps {
  config: any;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  forceOpen?: boolean;
}

const ModernWidgetPreview: React.FC<ModernWidgetPreviewProps> = ({
  config,
  deviceType = 'desktop',
  forceOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(forceOpen || deviceType === 'mobile' || deviceType === 'tablet');
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentView, setCurrentView] = useState<'pre-chat' | 'chat' | 'post-chat' | 'feedback'>(
    config.content.enablePreChatForm ? 'pre-chat' : 'chat'
  );
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [inputValue, setInputValue] = useState("");
  const [preChatData, setPreChatData] = useState<Record<string, any>>({});
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  // Initialize chat with welcome message when opened
  useEffect(() => {
    if (isOpen && currentView === 'chat' && messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: config.content.welcomeMessage || 'Hello! How can I help you today?' 
        }
      ]);
    }
  }, [isOpen, currentView, messages.length, config.content.welcomeMessage]);

  // Update widget state when device type changes
  useEffect(() => {
    setIsOpen(forceOpen || deviceType === 'mobile' || deviceType === 'tablet');
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
    if (config.content.enablePreChatForm) {
      setCurrentView('pre-chat');
    } else {
      setCurrentView('chat');
    }
    setPreChatData({});
  }, [config.content.enablePreChatForm, config.content.preChatFormFields]);

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
    const newMessages = [
      ...messages,
      { role: "user", content: message }
    ];
    setMessages(newMessages);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Thank you for your message! How else can I assist you today?",
        },
      ]);
    }, 1000);
  };

  // Handle pre-chat form submission
  const handlePreChatSubmit = (data: Record<string, any>) => {
    setPreChatData(data);
    setCurrentView('chat');
  };

  // Handle end chat
  const handleEndChat = () => {
    if (config.content.enablePostChatForm) {
      setCurrentView('post-chat');
    } else if (config.content.enableFeedback) {
      setCurrentView('feedback');
    } else {
      setIsOpen(false);
    }
  };

  // Handle post-chat form submission
  const handlePostChatSubmit = (data: Record<string, any>) => {
    if (config.content.enableFeedback) {
      setCurrentView('feedback');
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

  // Render the chat window content based on state
  const renderChatContent = () => {
    // Extract styles from config
    const {
      primaryColor = '#6366f1',
      secondaryColor = '#ffffff',
      borderRadius = 8,
      chatIconSize = 40,
      fontFamily = 'Inter, sans-serif',
      textColor = '#1f2937',
      headerTextColor = '#ffffff',
      avatarUrl = '',
    } = config.appearance || {};
    
    if (currentView === 'pre-chat' && config.content.enablePreChatForm) {
      return (
        <PreChatForm 
          fields={config.content.preChatFormFields || []} 
          title={config.content.preChatFormTitle || 'Before we start'}
          subtitle={config.content.preChatFormSubtitle || 'Please provide the following information'}
          primaryColor={primaryColor}
          onSubmit={handlePreChatSubmit}
        />
      );
    } else if (currentView === 'chat') {
      return (
        <ChatInterface 
          messages={messages}
          onSendMessage={handleSendMessage}
          onEndChat={handleEndChat}
          primaryColor={primaryColor}
          botName={config.content.botName || 'AI Assistant'}
          inputPlaceholder={config.content.inputPlaceholder || 'Type a message...'}
          showTypingIndicator={config.content.showTypingIndicator}
          avatarUrl={avatarUrl}
        />
      );
    } else if (currentView === 'post-chat') {
      return (
        <PostChatForm 
          fields={config.content.postChatFormFields || []}
          title={config.content.postChatFormTitle || 'Before you go'}
          subtitle={config.content.postChatFormSubtitle || 'Please provide some feedback about your experience'}
          primaryColor={primaryColor}
          onSubmit={handlePostChatSubmit}
        />
      );
    } else if (currentView === 'feedback') {
      return (
        <FeedbackForm 
          options={config.content.feedbackOptions || []}
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
    let styles: React.CSSProperties = { backgroundColor: primaryColor, fontFamily };

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
    <div className={cn(
      "relative w-full h-[500px] rounded-lg border overflow-hidden transition-colors duration-300",
      isDarkMode ? backgroundColors.dark : backgroundColors.light
    )}>
      {/* Mock browser frame */}
      <div className={cn(
        "h-8 flex items-center px-3 gap-1.5 transition-colors duration-300",
        isDarkMode ? browserBarColors.dark : browserBarColors.light
      )}>
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <div className={cn(
          "ml-4 h-5 w-64 rounded-md transition-colors duration-300",
          isDarkMode ? "bg-slate-600" : "bg-white"
        )}></div>
      </div>

      {/* Mock website content */}
      <div className={cn(
        "h-[calc(100%-2rem)] relative overflow-y-auto",
        deviceType === 'mobile' ? 'p-2' : deviceType === 'tablet' ? 'p-3' : 'p-4'
      )}>
        {/* Header */}
        <div className={cn(
          "w-full rounded-md shadow-sm mb-3 transition-colors duration-300",
          isDarkMode ? mockContentColors.dark : mockContentColors.light,
          deviceType === 'mobile' ? 'h-8' : deviceType === 'tablet' ? 'h-10' : 'h-12'
        )}></div>

        {/* Content Grid */}
        <div className={cn(
          "grid gap-3 mb-3",
          deviceType === 'mobile' ? 'grid-cols-1' : deviceType === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'
        )}>
          <div className={cn(
            "rounded-md shadow-sm transition-colors duration-300",
            isDarkMode ? mockContentColors.dark : mockContentColors.light,
            deviceType === 'mobile' ? 'h-24' : deviceType === 'tablet' ? 'h-28' : 'h-32'
          )}></div>
          {deviceType !== 'mobile' && (
            <div className={cn(
              "rounded-md shadow-sm transition-colors duration-300",
              isDarkMode ? mockContentColors.dark : mockContentColors.light,
              deviceType === 'tablet' ? 'h-28' : 'h-32'
            )}></div>
          )}
          {deviceType === 'desktop' && (
            <div className={cn(
              "h-32 rounded-md shadow-sm transition-colors duration-300",
              isDarkMode ? mockContentColors.dark : mockContentColors.light
            )}></div>
          )}
        </div>

        {/* Main Content */}
        <div className={cn(
          "w-full rounded-md shadow-sm mb-3 transition-colors duration-300",
          isDarkMode ? mockContentColors.dark : mockContentColors.light,
          deviceType === 'mobile' ? 'h-40' : deviceType === 'tablet' ? 'h-48' : 'h-64'
        )}></div>

        {/* Additional Content */}
        <div className={cn(
          "rounded-md shadow-sm mb-3 transition-colors duration-300",
          isDarkMode ? mockContentColors.dark : mockContentColors.light,
          deviceType === 'mobile' ? 'w-full h-6' : deviceType === 'tablet' ? 'w-3/4 h-7' : 'w-3/4 h-8'
        )}></div>

        <div className={cn(
          "w-full rounded-md shadow-sm transition-colors duration-300",
          isDarkMode ? mockContentColors.dark : mockContentColors.light,
          deviceType === 'mobile' ? 'h-24' : deviceType === 'tablet' ? 'h-28' : 'h-32'
        )}></div>

        {/* Extra content for scrolling */}
        {deviceType !== 'desktop' && (
          <>
            <div className={cn(
              "w-full rounded-md shadow-sm mt-3 transition-colors duration-300",
              isDarkMode ? mockContentColors.dark : mockContentColors.light,
              deviceType === 'mobile' ? 'h-20' : 'h-24'
            )}></div>
            <div className={cn(
              "w-2/3 rounded-md shadow-sm mt-3 transition-colors duration-300",
              isDarkMode ? mockContentColors.dark : mockContentColors.light,
              deviceType === 'mobile' ? 'h-6' : 'h-7'
            )}></div>
            {deviceType === 'tablet' && (
              <>
                <div className={cn(
                  "w-full rounded-md shadow-sm mt-3 transition-colors duration-300",
                  isDarkMode ? mockContentColors.dark : mockContentColors.light,
                  'h-32'
                )}></div>
                <div className={cn(
                  "w-4/5 rounded-md shadow-sm mt-3 transition-colors duration-300",
                  isDarkMode ? mockContentColors.dark : mockContentColors.light,
                  'h-8'
                )}></div>
                <div className={cn(
                  "w-full rounded-md shadow-sm mt-3 transition-colors duration-300",
                  isDarkMode ? mockContentColors.dark : mockContentColors.light,
                  'h-20'
                )}></div>
              </>
            )}
          </>
        )}

        {/* Desktop extra content */}
        {deviceType === 'desktop' && (
          <>
            <div className={cn(
              "w-full rounded-md shadow-sm mt-3 transition-colors duration-300",
              isDarkMode ? mockContentColors.dark : mockContentColors.light,
              'h-24'
            )}></div>
            <div className={cn(
              "w-3/4 rounded-md shadow-sm mt-3 transition-colors duration-300",
              isDarkMode ? mockContentColors.dark : mockContentColors.light,
              'h-8'
            )}></div>
          </>
        )}
      </div>

      {/* Widget button */}
      <div
        className={cn(
          "absolute shadow-lg cursor-pointer",
          currentSizing.position,
          animationClasses,
        )}
        onClick={toggleWidget}
        style={{
          fontFamily,
          zIndex: 999,
        }}
      >
        {!isOpen ? (
          <div
            className="rounded-full flex items-center justify-center p-3 text-white overflow-hidden"
            style={{
              backgroundColor: primaryColor,
              width: currentSizing.iconSize,
              height: currentSizing.iconSize,
              borderRadius:
                config.appearance.iconStyle === "square" ? "8px" : 
                config.appearance.iconStyle === "rounded" ? "12px" : "50%",
            }}
          >
            {config.appearance.avatarUrl ? (
              <img
                src={config.appearance.avatarUrl}
                alt="Chat Avatar"
                className="w-full h-full object-cover"
                style={{
                  borderRadius:
                    config.appearance.iconStyle === "square" ? "6px" : 
                    config.appearance.iconStyle === "rounded" ? "10px" : "50%",
                }}
              />
            ) : (
              <MessageSquare size={parseInt(currentSizing.iconSize) * 0.5} />
            )}
          </div>
        ) : (
          <div
            className={cn(
              "rounded-lg shadow-lg overflow-hidden flex flex-col transition-colors duration-300",
              getShadowClass(),
              isExpanded ? "fixed inset-4 h-auto" : "",
              deviceType === 'mobile' && !isExpanded ? "fixed bottom-3 right-3 left-3" : "",
              deviceType === 'tablet' && !isExpanded ? "fixed bottom-4 right-4 left-4" : "",
              isDarkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"
            )}
            style={{
              borderRadius: deviceType === 'mobile' ? '12px' : borderRadius,
              border: `1px solid ${primaryColor}20`,
              width: isExpanded ? 'auto' : (deviceType === 'mobile' || deviceType === 'tablet' ? 'auto' : widgetConstraints.width),
              height: isExpanded ? 'auto' : widgetConstraints.height,
              maxWidth: deviceType === 'mobile' || deviceType === 'tablet' ? 'none' : widgetConstraints.maxWidth,
              maxHeight: widgetConstraints.maxHeight,
              opacity: backgroundOpacity / 100,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={cn(
                "flex items-center justify-between",
                deviceType === 'mobile' ? 'p-2' : deviceType === 'tablet' ? 'p-3' : 'p-4'
              )}
              style={getHeaderStyleProps()}
            >
              <div className="flex items-center gap-2">
                {config.appearance.avatarUrl ? (
                  <img
                    src={config.appearance.avatarUrl}
                    alt="Bot Avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white border-opacity-20"
                  />
                ) : config.appearance.theme === "modern" && (
                  <div className="bg-white bg-opacity-20 p-1.5 rounded">
                    <MessageSquare size={16} className="text-white" />
                  </div>
                )}
                <div>
                  <h3 className={cn(
                    "font-medium text-white",
                    getTypographyClasses('header')
                  )}>
                    {config.content.headerTitle}
                  </h3>
                  <p className={cn(
                    "text-white text-opacity-80",
                    fontSize === "small" ? "text-[10px]" : "text-xs"
                  )}>Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleExpand}
                  className="p-1 rounded-full hover:bg-white hover:bg-opacity-10 text-white"
                >
                  {isExpanded ? (
                    <Minimize2 size={14} />
                  ) : (
                    <Maximize2 size={14} />
                  )}
                </button>
                <button
                  onClick={toggleWidget}
                  className="p-1 rounded-full hover:bg-white hover:bg-opacity-10 text-white"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {renderChatContent()}

            {/* Branding */}
            {config.appearance.theme === "modern" && (
              <div className={cn(
                "py-1 px-3 border-t text-center transition-colors duration-300",
                isDarkMode
                  ? "bg-slate-900 border-slate-600"
                  : "bg-slate-50 border-slate-200"
              )}>
                <p className={cn(
                  "text-[10px] transition-colors duration-300",
                  isDarkMode ? "text-slate-500" : "text-slate-400"
                )}
                  style={{ fontFamily }}
                >
                  Powered by ChatAdmin
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
