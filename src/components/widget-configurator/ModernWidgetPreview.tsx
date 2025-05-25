import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, X, Maximize2, Minimize2, Send, User, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ModernWidgetPreviewProps {
  config: any;
}

const ModernWidgetPreview: React.FC<ModernWidgetPreviewProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', content: config.content.welcomeMessage, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newMessages = [...messages, { type: 'user', content: inputValue, timestamp: new Date() }];
    setMessages(newMessages);
    setInputValue('');

    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          type: 'bot', 
          content: 'Thank you for your message! How else can I assist you today?', 
          timestamp: new Date() 
        }
      ]);
    }, 1000);
  };

  // Apply theme colors
  const primaryColor = config.appearance.primaryColor;
  const secondaryColor = config.appearance.secondaryColor;
  const borderRadius = `${config.appearance.borderRadius}px`;
  const iconSize = `${config.appearance.chatIconSize}px`;
  const fontFamily = config.appearance.fontFamily || 'system-ui';

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  }[config.behavior.position] || 'bottom-right';

  // Animation classes
  const animationClasses = {
    'fade': 'transition-opacity duration-300',
    'slide': 'transition-transform duration-300',
    'bounce': 'animate-bounce',
    'none': '',
  }[config.behavior.animation] || 'fade';

  return (
    <div className="relative w-full h-[500px] bg-slate-50 rounded-lg border overflow-hidden">
      {/* Mock browser frame */}
      <div className="h-8 bg-slate-200 flex items-center px-3 gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <div className="ml-4 h-5 w-64 bg-white rounded-md"></div>
      </div>
      
      {/* Mock website content */}
      <div className="p-4 h-[calc(100%-2rem)] relative">
        <div className="w-full h-12 bg-white rounded-md shadow-sm mb-4"></div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="h-32 bg-white rounded-md shadow-sm"></div>
          <div className="h-32 bg-white rounded-md shadow-sm"></div>
          <div className="h-32 bg-white rounded-md shadow-sm"></div>
        </div>
        <div className="w-full h-64 bg-white rounded-md shadow-sm mb-4"></div>
        <div className="w-3/4 h-8 bg-white rounded-md shadow-sm mb-4"></div>
        <div className="w-full h-32 bg-white rounded-md shadow-sm"></div>
        
        {/* Widget button */}
        <div 
          className={cn(
            "absolute shadow-lg cursor-pointer",
            positionClasses,
            animationClasses
          )}
          onClick={toggleWidget}
          style={{ 
            fontFamily,
            zIndex: 999
          }}
        >
          {!isOpen ? (
            <div 
              className="rounded-full flex items-center justify-center p-3 text-white"
              style={{ 
                backgroundColor: primaryColor,
                width: iconSize,
                height: iconSize,
                borderRadius: config.appearance.theme === 'modern' ? '12px' : '50%'
              }}
            >
              <MessageSquare size={parseInt(iconSize) * 0.5} />
            </div>
          ) : (
            <div 
              className={cn(
                "bg-white rounded-lg shadow-lg overflow-hidden flex flex-col",
                isExpanded ? "fixed inset-4 h-auto" : "w-80 h-96"
              )}
              style={{ 
                borderRadius,
                border: `1px solid ${primaryColor}20`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div 
                className="p-4 flex items-center justify-between"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex items-center gap-2">
                  {config.appearance.theme === 'modern' && (
                    <div className="bg-white bg-opacity-20 p-1.5 rounded">
                      <MessageSquare size={16} className="text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-sm text-white">{config.content.headerTitle}</h3>
                    <p className="text-xs text-white text-opacity-80">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={toggleExpand}
                    className="p-1 rounded-full hover:bg-white hover:bg-opacity-10 text-white"
                  >
                    {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                  <button 
                    onClick={toggleWidget}
                    className="p-1 rounded-full hover:bg-white hover:bg-opacity-10 text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              
              {/* Chat area */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "mb-4 max-w-[80%]",
                      message.type === 'user' ? "ml-auto" : "mr-auto"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === 'bot' && config.content.showAvatar && (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${primaryColor}20` }}
                        >
                          <Bot size={16} style={{ color: primaryColor }} />
                        </div>
                      )}
                      <div>
                        <div 
                          className={cn(
                            "rounded-lg p-3",
                            message.type === 'user' 
                              ? "bg-primary text-white" 
                              : "bg-white border"
                          )}
                          style={message.type === 'user' ? { backgroundColor: primaryColor } : {}}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.type === 'user' && config.content.showAvatar && (
                        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-slate-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {config.content.showTypingIndicator && messages[messages.length - 1]?.type === 'user' && (
                  <div className="flex items-center gap-1 mb-4">
                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
              
              {/* Input area */}
              <form 
                className="p-3 border-t bg-white flex items-center gap-2"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1"
                  placeholder={config.content.inputPlaceholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  style={{ borderColor: `${primaryColor}40`, focusRing: primaryColor }}
                />
                <button 
                  type="submit"
                  className="p-2 rounded-full text-white flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send size={16} />
                </button>
              </form>
              
              {/* Branding */}
              {config.appearance.theme === 'modern' && (
                <div className="py-1 px-3 bg-slate-50 border-t text-center">
                  <p className="text-[10px] text-slate-400">Powered by ChatAdmin</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernWidgetPreview;
