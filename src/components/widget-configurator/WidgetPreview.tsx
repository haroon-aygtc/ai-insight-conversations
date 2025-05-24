
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send, X, Minimize2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WidgetConfig {
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    borderRadius: number;
    chatIconSize: number;
    fontFamily: string;
  };
  behavior: {
    autoOpen: string;
    delay: number;
    position: string;
    animation: string;
    mobileBehavior: string;
    showAfterPageViews: number;
  };
  content: {
    welcomeMessage: string;
    botName: string;
    inputPlaceholder: string;
    chatButtonText: string;
    headerTitle: string;
  };
}

interface WidgetPreviewProps {
  config: WidgetConfig;
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const WidgetPreview: React.FC<WidgetPreviewProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: config.content.welcomeMessage,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now(),
        text: inputValue,
        isBot: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);

      // Simulate bot response
      setTimeout(() => {
        const botResponses = [
          "Thank you for your message! How can I help you today?",
          "I'd be happy to assist you with that. Could you provide more details?",
          "That's a great question! Let me help you with that.",
          "I understand. Let me connect you with the right information.",
          "Thanks for reaching out! Here's what I can do for you..."
        ];
        
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        
        const botMessage: Message = {
          id: Date.now() + 1,
          text: randomResponse,
          isBot: true,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleWidget = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const minimizeWidget = () => {
    setIsMinimized(true);
  };

  const getFontFamily = (font: string) => {
    const fontMap: Record<string, string> = {
      'inter': 'Inter, system-ui, sans-serif',
      'roboto': 'Roboto, sans-serif',
      'opensans': 'Open Sans, sans-serif',
      'lato': 'Lato, sans-serif',
      'montserrat': 'Montserrat, sans-serif',
      'poppins': 'Poppins, sans-serif'
    };
    return fontMap[font] || 'Inter, system-ui, sans-serif';
  };

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const getAnimationClass = (animation: string) => {
    switch (animation) {
      case 'slide':
        return 'transition-all duration-300 ease-out';
      case 'bounce':
        return 'transition-all duration-500 ease-bounce';
      case 'fade':
        return 'transition-all duration-300 ease-in-out';
      default:
        return 'transition-all duration-200';
    }
  };

  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h3 className="font-medium text-slate-800 flex items-center">
          Live Preview 
          <span className="ml-2 px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded-full">
            Interactive
          </span>
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Device: <strong>Desktop</strong>
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMessages([{ id: 1, text: config.content.welcomeMessage, isBot: true, timestamp: new Date() }])}
            className="text-xs"
          >
            Reset Chat
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="relative h-[600px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
          {/* Simulated website background */}
          <div className="absolute inset-0 p-8">
            <div className="h-8 bg-white rounded mb-4 shadow-sm"></div>
            <div className="h-4 bg-white rounded mb-2 w-3/4 shadow-sm"></div>
            <div className="h-4 bg-white rounded mb-2 w-1/2 shadow-sm"></div>
            <div className="h-4 bg-white rounded mb-4 w-2/3 shadow-sm"></div>
            <div className="h-32 bg-white rounded shadow-sm"></div>
          </div>

          {/* Widget Container */}
          <div className={`absolute ${getPositionClasses(config.behavior.position)} z-10`}>
            {/* Chat Widget */}
            {isOpen && !isMinimized && (
              <div 
                className={`w-80 h-96 bg-white shadow-2xl overflow-hidden mb-4 ${getAnimationClass(config.behavior.animation)}`}
                style={{ 
                  borderRadius: `${config.appearance.borderRadius}px`,
                  fontFamily: getFontFamily(config.appearance.fontFamily),
                }}
              >
                {/* Header */}
                <div 
                  className="h-14 flex items-center px-4 justify-between" 
                  style={{ 
                    backgroundColor: config.appearance.primaryColor, 
                    color: config.appearance.secondaryColor 
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{config.content.headerTitle}</div>
                      <div className="text-xs opacity-75">{config.content.botName}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="p-1 rounded-full hover:bg-white/10 transition-colors"
                      onClick={minimizeWidget}
                    >
                      <Minimize2 size={16} />
                    </button>
                    <button 
                      className="p-1 rounded-full hover:bg-white/10 transition-colors"
                      onClick={toggleWidget}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-64 p-4 bg-slate-50 overflow-y-auto flex flex-col gap-3">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                          message.isBot 
                            ? 'bg-white text-slate-800' 
                            : 'text-white'
                        }`}
                        style={!message.isBot ? { 
                          backgroundColor: config.appearance.primaryColor 
                        } : {}}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="h-16 px-3 py-2 flex items-center gap-2 border-t bg-white">
                  <Input 
                    placeholder={config.content.inputPlaceholder}
                    className="h-10 text-sm border-slate-200"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button 
                    className="h-10 w-10 p-0 rounded-full" 
                    style={{ backgroundColor: config.appearance.primaryColor }}
                    onClick={handleSendMessage}
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            )}

            {/* Minimized state */}
            {isOpen && isMinimized && (
              <div 
                className={`w-64 h-12 bg-white shadow-lg rounded-full mb-4 flex items-center px-4 cursor-pointer ${getAnimationClass(config.behavior.animation)}`}
                onClick={() => setIsMinimized(false)}
                style={{ fontFamily: getFontFamily(config.appearance.fontFamily) }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: config.appearance.primaryColor, color: config.appearance.secondaryColor }}
                >
                  <MessageSquare size={16} />
                </div>
                <span className="text-sm font-medium text-slate-700 flex-1">{config.content.headerTitle}</span>
                <button 
                  className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWidget();
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {/* Chat Icon Button */}
            {!isOpen && (
              <div 
                className={`rounded-full shadow-lg cursor-pointer flex items-center justify-center hover:scale-110 transition-transform ${getAnimationClass(config.behavior.animation)}`}
                style={{ 
                  backgroundColor: config.appearance.primaryColor,
                  color: config.appearance.secondaryColor,
                  width: `${config.appearance.chatIconSize}px`,
                  height: `${config.appearance.chatIconSize}px`,
                }}
                onClick={toggleWidget}
              >
                <MessageSquare size={config.appearance.chatIconSize * 0.5} />
              </div>
            )}
          </div>
          
          {/* Widget Info */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs text-slate-600 shadow-lg">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div><strong>Position:</strong> {config.behavior.position}</div>
              <div><strong>Animation:</strong> {config.behavior.animation}</div>
              <div><strong>Auto Open:</strong> {config.behavior.autoOpen}</div>
              <div><strong>Font:</strong> {config.appearance.fontFamily}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
