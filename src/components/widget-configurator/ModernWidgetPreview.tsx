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
  MoreHorizontal,
  Download,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  Clock,
  ChevronDown,
} from "lucide-react";
import PreChatForm from "../widget-preview/PreChatForm";
import ChatInterface from "../widget-preview/ChatInterface";
import PostChatForm from "../widget-preview/PostChatForm";
import FeedbackForm from "../widget-preview/FeedbackForm";

interface ModernWidgetPreviewProps {
  config: {
    appearance: any;
    behavior: any;
    content: any;
    embedding: any;
  };
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  forceOpen?: boolean;
}

export const ModernWidgetPreview: React.FC<ModernWidgetPreviewProps> = ({
  config,
  deviceType = 'desktop',
  forceOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(forceOpen || deviceType === 'mobile' || deviceType === 'tablet');
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentView, setCurrentView] = useState<'pre-chat' | 'chat' | 'post-chat' | 'feedback'>(
    config.content.enablePreChatForm ? 'pre-chat' : 'chat'
  );
  const [messages, setMessages] = useState<Array<{ role: string, content: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [preChatData, setPreChatData] = useState<Record<string, any>>({});
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [animateEntrance, setAnimateEntrance] = useState(false);

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

  // Trigger entrance animation when widget opens
  useEffect(() => {
    if (isOpen) {
      setAnimateEntrance(true);
      const timer = setTimeout(() => {
        setAnimateEntrance(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

    // Show typing indicator if enabled
    if (config.content.showTypingIndicator) {
      setTimeout(() => {
        setMessages([
          ...newMessages,
          { role: "typing", content: "" }
        ]);

        // Remove typing indicator and add response after 1.5s
        setTimeout(() => {
          setMessages([
            ...newMessages,
            {
              role: "assistant",
              content: "Thank you for your message! This is a preview response. In the actual widget, this would be a response from your AI model."
            }
          ]);
        }, 1500);
      }, 500);
    } else {
      // If typing indicator is disabled, show response immediately
      setTimeout(() => {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "Thank you for your message! This is a preview response. In the actual widget, this would be a response from your AI model."
          }
        ]);
      }, 500);
    }
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
  };

  // Apply theme colors
  const primaryColor = config.appearance.primaryColor;
  const secondaryColor = config.appearance.secondaryColor || "#ffffff";
  const borderRadius = config.appearance.borderRadius || 8;
  const iconSize = config.appearance.chatIconSize || 40;
  const fontFamily = config.appearance.fontFamily || "system-ui";
  const textColor = config.appearance.textColor || "#333333";
  const headerTextColor = config.appearance.headerTextColor || "#ffffff";
  const gradientEnabled = config.appearance.gradientEnabled || false;
  const shadowIntensity = config.appearance.shadowIntensity || 2;

  // Position and animation settings
  const position = config.behavior.position || "bottom-right";
  const animation = config.behavior.animation || "fade";

  // Get position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-right':
        return { bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { bottom: '20px', left: '20px' };
      case 'top-right':
        return { top: '20px', right: '20px' };
      case 'top-left':
        return { top: '20px', left: '20px' };
      default:
        return { bottom: '20px', right: '20px' };
    }
  };

  // Get entrance animation
  const getEntranceAnimation = () => {
    if (!animateEntrance) return '';

    switch (animation) {
      case 'slide':
        switch (position) {
          case 'bottom-right':
            return 'animate-slide-in-from-right';
          case 'bottom-left':
            return 'animate-slide-in-from-left';
          case 'top-right':
            return 'animate-slide-in-from-top-right';
          case 'top-left':
            return 'animate-slide-in-from-top-left';
          default:
            return 'animate-slide-in-from-right';
        }
      case 'bounce':
        return 'animate-bounce-in';
      case 'zoom':
        return 'animate-zoom-in';
      case 'fade':
      default:
        return 'animate-fade-in';
    }
  };

  // Get shadow class based on intensity
  const getShadowClass = () => {
    switch (shadowIntensity) {
      case 0: return 'shadow-none';
      case 1: return 'shadow-sm';
      case 2: return 'shadow-md';
      case 3: return 'shadow-lg';
      case 4: return 'shadow-xl';
      case 5: return 'shadow-2xl';
      default: return 'shadow-md';
    }
  };

  // Get background styles for gradient if enabled
  const getBackgroundStyles = () => {
    if (gradientEnabled) {
      return {
        background: `linear-gradient(135deg, ${primaryColor}, ${adjustColor(primaryColor, -20)})`,
      };
    }
    return { backgroundColor: primaryColor };
  };

  // Helper to adjust color brightness
  const adjustColor = (color: string, amount: number): string => {
    return color; // Simplified for preview
  };

  // Button style
  const buttonStyle = config.appearance.buttonStyle || "rounded";
  const getButtonShape = () => {
    switch (buttonStyle) {
      case 'square': return '0px';
      case 'rounded': return '8px';
      case 'pill': return '9999px';
      default: return '8px';
    }
  };

  // Chat button icon style
  const iconStyle = config.appearance.iconStyle || "default";
  const renderChatButtonIcon = () => {
    switch (iconStyle) {
      case 'bubble':
        return (
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <MessageSquare className="h-5 w-5" />
          </div>
        );
      case 'wave':
        return <span className="text-xl">👋</span>;
      case 'bot':
        return <Bot className="h-5 w-5" />;
      case 'sparkle':
        return <Sparkles className="h-5 w-5" />;
      case 'default':
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  return (
    <div className="widget-preview" style={{ fontFamily }}>
      {/* Chat toggle button */}
      {!isOpen && (
        <button
          onClick={toggleWidget}
          className={cn(
            "chat-toggle-button flex items-center justify-center transition-all duration-300",
            getShadowClass()
          )}
          style={{
            ...getPositionStyles(),
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            borderRadius: getButtonShape(),
            position: 'absolute',
            zIndex: 999,
            border: 'none',
            cursor: 'pointer',
            ...getBackgroundStyles(),
          }}
          aria-label={config.content.chatButtonText || 'Chat with us'}
        >
          <div className="text-white">
            {renderChatButtonIcon()}
          </div>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={cn(
            "widget-window flex flex-col",
            getShadowClass(),
            getEntranceAnimation(),
            {
              "widget-expanded": isExpanded,
            }
          )}
          style={{
            position: 'absolute',
            ...getPositionStyles(),
            width: isExpanded ? '100%' : deviceType === 'mobile' ? '320px' : '380px',
            height: isExpanded ? '100%' : deviceType === 'mobile' ? '500px' : '560px',
            maxHeight: isExpanded ? '100%' : '80vh',
            backgroundColor: secondaryColor,
            borderRadius: `${borderRadius}px`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            zIndex: 9999,
            maxWidth: isExpanded ? '100%' : '95vw',
            color: textColor,
          }}
        >
          {/* Header */}
          <div
            className="widget-header flex items-center justify-between px-4 py-3"
            style={{
              ...getBackgroundStyles(),
              color: headerTextColor,
            }}
          >
            <div className="flex items-center gap-2">
              {config.content.showAvatar && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: adjustColor(primaryColor, 15),
                  }}
                >
                  <Bot className="h-4 w-4" style={{ color: headerTextColor }} />
                </div>
              )}
              <div>
                <h3 className="font-medium text-sm">
                  {config.content.headerTitle || 'Chat Support'}
                </h3>
                <div className="flex items-center text-xs opacity-80">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-1.5"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {deviceType === 'desktop' && (
                <button
                  onClick={toggleExpand}
                  className="p-1.5 hover:bg-black/10 rounded-full mr-1 transition-colors"
                  aria-label={isExpanded ? 'Minimize' : 'Maximize'}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4" style={{ color: headerTextColor }} />
                  ) : (
                    <Maximize2 className="h-4 w-4" style={{ color: headerTextColor }} />
                  )}
                </button>
              )}

              <button
                onClick={toggleWidget}
                className="p-1.5 hover:bg-black/10 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" style={{ color: headerTextColor }} />
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-hidden">
            {renderChatContent()}
          </div>

          {/* Powered by footer */}
          {config.embedding.showBranding !== false && (
            <div
              className="py-1.5 px-3 text-[10px] opacity-60 flex items-center justify-center border-t"
              style={{
                borderColor: 'rgba(0,0,0,0.1)',
              }}
            >
              Powered by <span className="font-semibold ml-1">AI Insight</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModernWidgetPreview;
