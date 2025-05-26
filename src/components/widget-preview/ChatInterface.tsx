import React, { useState, useRef, useEffect } from 'react';

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
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onEndChat,
  primaryColor,
  botName,
  inputPlaceholder,
  showTypingIndicator = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (showTypingIndicator && messages.length > 0 && messages[messages.length - 1].role === 'user') {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages, showTypingIndicator]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="chat-interface" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div 
        className="messages-container" 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role}`}
            style={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: message.role === 'user' ? primaryColor : '#f3f4f6',
              color: message.role === 'user' ? 'white' : '#1f2937',
              marginBottom: '4px',
              wordBreak: 'break-word',
            }}
          >
            {message.role === 'assistant' && (
              <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {botName}
              </div>
            )}
            {message.content}
          </div>
        ))}

        {isTyping && (
          <div
            className="typing-indicator"
            style={{
              alignSelf: 'flex-start',
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: '#f3f4f6',
              color: '#1f2937',
              marginBottom: '4px',
            }}
          >
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              <div className="dot" style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#6b7280',
                borderRadius: '50%',
                animation: 'typingAnimation 1.4s infinite ease-in-out',
                animationDelay: '0s',
              }}></div>
              <div className="dot" style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#6b7280',
                borderRadius: '50%',
                animation: 'typingAnimation 1.4s infinite ease-in-out',
                animationDelay: '0.2s',
              }}></div>
              <div className="dot" style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#6b7280',
                borderRadius: '50%',
                animation: 'typingAnimation 1.4s infinite ease-in-out',
                animationDelay: '0.4s',
              }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-controls" style={{ padding: '12px', borderTop: '1px solid #e5e7eb' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: primaryColor,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 12px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
        
        <button
          onClick={onEndChat}
          style={{
            backgroundColor: 'transparent',
            color: '#6b7280',
            border: 'none',
            fontSize: '12px',
            padding: '8px 0 0',
            cursor: 'pointer',
            textAlign: 'center',
            width: '100%',
          }}
        >
          End Chat
        </button>
      </div>

      <style jsx>{`
        @keyframes typingAnimation {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
