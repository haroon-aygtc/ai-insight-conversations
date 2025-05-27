
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User, Bot } from 'lucide-react';

interface Message {
  role: string;
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onEndChat: () => void;
  primaryColor: string;
  botName: string;
  inputPlaceholder: string;
  showTypingIndicator?: boolean;
  avatarUrl?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onEndChat,
  primaryColor,
  botName,
  inputPlaceholder,
  showTypingIndicator = true,
  avatarUrl = '',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={botName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Bot size={16} />
                  </div>
                )}
              </div>
            )}
            
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'text-white ml-auto'
                  : 'bg-gray-100 text-gray-900'
              }`}
              style={{
                backgroundColor: message.role === 'user' ? primaryColor : undefined,
              }}
            >
              <p className="text-sm">{message.content}</p>
            </div>
            
            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {showTypingIndicator && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={botName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Bot size={16} />
                </div>
              )}
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
            className="flex-1"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!inputValue.trim()}
            style={{ backgroundColor: primaryColor }}
            className="text-white hover:opacity-90"
          >
            <Send size={16} />
          </Button>
        </form>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            Powered by {botName}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEndChat}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            End Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
