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
              "rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 backdrop-blur-sm",
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
              className="flex items-center justify-between p-4 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}E6 100%)`,
                color: headerTextColor,
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-5"></div>
              <div className="flex items-center gap-3 relative z-10">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Bot Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white border-opacity-30 shadow-sm"
                  />
                ) : (
                  <div className="bg-white bg-opacity-20 p-2 rounded-full shadow-sm">
                    <MessageSquare size={18} className="text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {config.content?.headerTitle || "Support Assistant"}
                  </h3>
                  <p className="text-white text-opacity-80 text-xs">
                    Online now
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 relative z-10">
                <button
                  onClick={toggleExpand}
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 text-white transition-colors duration-200"
                >
                  {isExpanded ? (
                    <Minimize2 size={16} />
                  ) : (
                    <Maximize2 size={16} />
                  )}
                </button>
                <button
                  onClick={toggleWidget}
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 text-white transition-colors duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat content */}
            <div className="flex-1 overflow-hidden">{renderChatContent()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernWidgetPreview;
