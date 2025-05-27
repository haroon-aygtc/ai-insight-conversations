import React, { useState } from 'react';

interface ChatInterfaceProps {
  messages: Array<{role: string, content: string}>;
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
  showTypingIndicator = true,
}) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessageClick = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessageClick();
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <style>
        {`
          .chat-container {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          
          .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            max-height: 300px;
          }
          
          .message {
            margin-bottom: 12px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
          }
          
          .message.user {
            flex-direction: row-reverse;
          }
          
          .message-content {
            max-width: 80%;
            padding: 8px 12px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
          }
          
          .message.user .message-content {
            background-color: ${primaryColor};
            color: white;
            border-bottom-right-radius: 4px;
          }
          
          .message.assistant .message-content {
            background-color: #f3f4f6;
            color: #1f2937;
            border-bottom-left-radius: 4px;
          }
          
          .input-container {
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 8px;
            align-items: center;
          }
          
          .message-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
          }
          
          .send-button {
            background-color: ${primaryColor};
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: opacity 0.2s;
          }
          
          .send-button:hover {
            opacity: 0.8;
          }
          
          .send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 12px;
            background-color: #f3f4f6;
            border-radius: 12px;
            border-bottom-left-radius: 4px;
            max-width: 80%;
            margin-bottom: 12px;
          }
          
          .typing-dot {
            width: 6px;
            height: 6px;
            background-color: #9ca3af;
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
          }
          
          .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          @keyframes typing {
            0%, 80%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
      
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          {showTypingIndicator && (
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          )}
        </div>
        
        <div className="input-container">
          <input
            type="text"
            className="message-input"
            placeholder={inputPlaceholder}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
          <button
            className="send-button"
            onClick={handleSendMessageClick}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 13V18H6L16 8L14 6L4 16V13Z" fill="white"/>
              <path d="M18 6L16 8L18 6ZM14 6L20 6L14 6Z" fill="white"/>
            </svg>
          </button>
          <button onClick={onEndChat}>End Chat</button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
