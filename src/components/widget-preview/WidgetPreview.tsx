import React, { useState, useEffect } from 'react';
import { Widget } from '@/services/widgetService';
import PreChatForm from '@/components/widget-preview/PreChatForm';
import ChatInterface from '@/components/widget-preview/ChatInterface';
import PostChatForm from '@/components/widget-preview/PostChatForm';
import FeedbackForm from '@/components/widget-preview/FeedbackForm';

interface WidgetPreviewProps {
  widgetConfig: Widget;
  updateTrigger?: number; // Used to force re-render when config changes
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  forceOpen?: boolean;
}

/**
 * A comprehensive widget preview component that shows exactly how the widget will look
 * to end users, including all forms and the chat interface.
 */
const WidgetPreview: React.FC<WidgetPreviewProps> = ({ 
  widgetConfig,
  updateTrigger = 0,
  deviceType = 'desktop',
  forceOpen = false
}) => {
  // Widget state
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [currentView, setCurrentView] = useState<'pre-chat' | 'chat' | 'post-chat' | 'feedback'>('pre-chat');
  const [preChatData, setPreChatData] = useState<Record<string, any>>({});
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Update state when forceOpen changes
  useEffect(() => {
    setIsOpen(forceOpen);
  }, [forceOpen]);
  
  // Reset state when widget config changes
  useEffect(() => {
    if (!forceOpen) {
      setIsOpen(false);
    }
    setCurrentView('pre-chat');
    setPreChatData({});
    setMessages([]);
    setFeedbackSubmitted(false);
  }, [updateTrigger, forceOpen]);

  // Initialize chat with welcome message when opened
  useEffect(() => {
    if (isOpen && currentView === 'chat' && messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: widgetConfig.content_config?.welcomeMessage || 'Hello! How can I help you today?' 
        }
      ]);
    }
  }, [isOpen, currentView, messages.length, widgetConfig.content_config?.welcomeMessage]);

  // Toggle widget open/closed
  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  // Handle pre-chat form submission
  const handlePreChatSubmit = (data: Record<string, any>) => {
    setPreChatData(data);
    setCurrentView('chat');
  };

  // Handle chat message submission
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // Simulate assistant response (in a real app, this would call an API)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'This is a simulated response. In a real widget, this would be an AI response.' 
      }]);
    }, 1000);
  };

  // Handle end chat
  const handleEndChat = () => {
    if (widgetConfig.content_config?.enablePostChatForm) {
      setCurrentView('post-chat');
    } else if (widgetConfig.content_config?.enableFeedback) {
      setCurrentView('feedback');
    } else {
      setIsOpen(false);
    }
  };

  // Handle post-chat form submission
  const handlePostChatSubmit = (data: Record<string, any>) => {
    if (widgetConfig.content_config?.enableFeedback) {
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

  // Extract styles from widget config
  const {
    primaryColor = '#6366f1',
    secondaryColor = '#ffffff',
    borderRadius = 8,
    chatIconSize = 40,
    fontFamily = 'Inter, sans-serif',
    textColor = '#1f2937',
    headerTextColor = '#ffffff',
  } = widgetConfig.appearance_config || {};

  // Widget position from config
  const position = widgetConfig.behavior_config?.position || 'bottom-right';

  // Apply position styles
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

  // Get device-specific styles
  const getDeviceStyles = () => {
    // Base styles for all devices
    const baseStyles = {
      position: 'relative' as const,
      width: '100%',
      height: '100%',
      backgroundColor: '#f9fafb',
      overflow: 'hidden',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: '60px', // Add padding to prevent touching the header
    };

    // Device-specific dimensions
    switch (deviceType) {
      case 'tablet':
        return {
          ...baseStyles,
          maxWidth: '768px',
          height: '500px',
        };
      case 'mobile':
        return {
          ...baseStyles,
          maxWidth: '375px',
          height: '600px',
        };
      case 'desktop':
      default:
        return {
          ...baseStyles,
          maxWidth: '100%',
          height: '500px',
        };
    }
  };

  return (
    <div className="widget-preview" style={getDeviceStyles()}>
      {/* Chat button */}
      <button
        onClick={toggleWidget}
        style={{
          backgroundColor: primaryColor,
          width: `${chatIconSize}px`,
          height: `${chatIconSize}px`,
          borderRadius: '50%',
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: isOpen ? 'none' : 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 999,
        }}
        aria-label={widgetConfig.content_config?.chatButtonText || 'Chat with us'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20H4V12Z" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 10H15" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 14H13" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: deviceType === 'mobile' ? '320px' : '350px',
            height: deviceType === 'mobile' ? '450px' : '500px',
            backgroundColor: secondaryColor,
            borderRadius: `${borderRadius}px`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily,
            color: textColor,
            zIndex: 1000,
            maxHeight: '80%', // Prevent overflow in small containers
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: primaryColor,
              padding: '12px 16px',
              color: headerTextColor,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
              {widgetConfig.content_config?.headerTitle || 'Chat Support'}
            </h3>
            <button
              onClick={toggleWidget}
              style={{
                background: 'none',
                border: 'none',
                color: headerTextColor,
                cursor: 'pointer',
                padding: '4px',
              }}
              aria-label="Close chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Content area - conditionally render based on current view */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
            {currentView === 'pre-chat' && widgetConfig.content_config?.enablePreChatForm ? (
              <PreChatForm 
                fields={widgetConfig.content_config.preChatFormFields || []} 
                title={widgetConfig.content_config.preChatFormTitle || 'Before we start'}
                subtitle={widgetConfig.content_config.preChatFormSubtitle || 'Please provide the following information'}
                primaryColor={primaryColor}
                onSubmit={handlePreChatSubmit}
              />
            ) : currentView === 'chat' ? (
              <ChatInterface 
                messages={messages}
                onSendMessage={handleSendMessage}
                onEndChat={handleEndChat}
                primaryColor={primaryColor}
                botName={widgetConfig.content_config?.botName || 'AI Assistant'}
                inputPlaceholder={widgetConfig.content_config?.inputPlaceholder || 'Type a message...'}
                showTypingIndicator={widgetConfig.content_config?.showTypingIndicator}
              />
            ) : currentView === 'post-chat' ? (
              <PostChatForm 
                fields={widgetConfig.content_config?.postChatFormFields || []}
                title={widgetConfig.content_config?.postChatFormTitle || 'Before you go'}
                subtitle={widgetConfig.content_config?.postChatFormSubtitle || 'Please provide some feedback about your experience'}
                primaryColor={primaryColor}
                onSubmit={handlePostChatSubmit}
              />
            ) : currentView === 'feedback' ? (
              <FeedbackForm 
                options={widgetConfig.content_config?.feedbackOptions || []}
                primaryColor={primaryColor}
                onSubmit={handleFeedbackSubmit}
                submitted={feedbackSubmitted}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetPreview;
