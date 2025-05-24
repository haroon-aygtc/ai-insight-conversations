
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, ExternalLink } from 'lucide-react';

interface WidgetEmbeddingTabProps {
  config: {
    allowedDomains: string;
  };
  widgetId: string;
  onChange: (key: string, value: any) => void;
  fullConfig: any;
}

export const WidgetEmbeddingTab: React.FC<WidgetEmbeddingTabProps> = ({ 
  config, 
  widgetId, 
  onChange, 
  fullConfig 
}) => {
  const { toast } = useToast();
  const [embedType, setEmbedType] = useState("script");
  const [enableAnalytics, setEnableAnalytics] = useState(true);
  const [enableGDPR, setEnableGDPR] = useState(true);
  const [enableCookieConsent, setEnableCookieConsent] = useState(true);
  
  // Generate widget configuration as JSON
  const generateWidgetConfig = () => {
    return {
      id: widgetId,
      appearance: fullConfig.appearance,
      behavior: fullConfig.behavior,
      content: fullConfig.content,
      privacy: {
        enableAnalytics,
        enableGDPR,
        enableCookieConsent
      },
      allowedDomains: config.allowedDomains === '*' ? [] : config.allowedDomains.split(',').map(d => d.trim())
    };
  };

  // Generate the widget runtime script
  const generateWidgetScript = () => {
    const widgetConfig = generateWidgetConfig();
    
    return `(function() {
  // Widget Configuration
  const WIDGET_CONFIG = ${JSON.stringify(widgetConfig, null, 2)};
  
  // Create widget container
  function createWidget() {
    if (document.getElementById('lovable-chat-widget-' + WIDGET_CONFIG.id)) return;
    
    const container = document.createElement('div');
    container.id = 'lovable-chat-widget-' + WIDGET_CONFIG.id;
    container.style.cssText = \`
      position: fixed;
      z-index: 999999;
      \${getPositionStyles()}
      font-family: \${getFontFamily()};
    \`;
    
    // Widget state
    let isOpen = false;
    let isMinimized = false;
    let messages = [];
    
    // Create chat button
    function createChatButton() {
      const button = document.createElement('div');
      button.style.cssText = \`
        width: \${WIDGET_CONFIG.appearance.chatIconSize}px;
        height: \${WIDGET_CONFIG.appearance.chatIconSize}px;
        background-color: \${WIDGET_CONFIG.appearance.primaryColor};
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: transform 0.2s ease;
        color: \${WIDGET_CONFIG.appearance.secondaryColor};
      \`;
      
      button.innerHTML = \`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      \`;
      
      button.addEventListener('click', openWidget);
      button.addEventListener('mouseenter', () => button.style.transform = 'scale(1.1)');
      button.addEventListener('mouseleave', () => button.style.transform = 'scale(1)');
      
      return button;
    }
    
    // Create chat widget
    function createChatWidget() {
      const widget = document.createElement('div');
      widget.style.cssText = \`
        width: 320px;
        height: 400px;
        background: white;
        border-radius: \${WIDGET_CONFIG.appearance.borderRadius}px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
        margin-bottom: 16px;
      \`;
      
      // Header
      const header = document.createElement('div');
      header.style.cssText = \`
        background-color: \${WIDGET_CONFIG.appearance.primaryColor};
        color: \${WIDGET_CONFIG.appearance.secondaryColor};
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      \`;
      
      header.innerHTML = \`
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div style="font-weight: 600; font-size: 14px;">\${WIDGET_CONFIG.content.headerTitle}</div>
            <div style="font-size: 12px; opacity: 0.8;">\${WIDGET_CONFIG.content.botName}</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="minimizeWidget()" style="background: none; border: none; color: inherit; cursor: pointer; padding: 4px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4 14 10 14 10 20"/>
              <polyline points="20 10 14 10 14 4"/>
              <line x1="14" y1="10" x2="21" y2="3"/>
              <line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          </button>
          <button onclick="closeWidget()" style="background: none; border: none; color: inherit; cursor: pointer; padding: 4px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      \`;
      
      // Messages area
      const messagesArea = document.createElement('div');
      messagesArea.style.cssText = \`
        flex: 1;
        padding: 16px;
        background: #f8fafc;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      \`;
      
      // Input area
      const inputArea = document.createElement('div');
      inputArea.style.cssText = \`
        padding: 12px;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 8px;
        align-items: center;
      \`;
      
      const input = document.createElement('input');
      input.style.cssText = \`
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        outline: none;
        font-size: 14px;
      \`;
      input.placeholder = WIDGET_CONFIG.content.inputPlaceholder;
      
      const sendButton = document.createElement('button');
      sendButton.style.cssText = \`
        background-color: \${WIDGET_CONFIG.appearance.primaryColor};
        color: \${WIDGET_CONFIG.appearance.secondaryColor};
        border: none;
        border-radius: 6px;
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      \`;
      sendButton.innerHTML = \`
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22,2 15,22 11,13 2,9"/>
        </svg>
      \`;
      
      inputArea.appendChild(input);
      inputArea.appendChild(sendButton);
      
      widget.appendChild(header);
      widget.appendChild(messagesArea);
      widget.appendChild(inputArea);
      
      // Add welcome message
      if (WIDGET_CONFIG.content.welcomeMessage) {
        addMessage(WIDGET_CONFIG.content.welcomeMessage, true, messagesArea);
      }
      
      // Handle send message
      function handleSend() {
        const message = input.value.trim();
        if (message) {
          addMessage(message, false, messagesArea);
          input.value = '';
          
          // Simulate bot response
          setTimeout(() => {
            const responses = [
              "Thank you for your message! How can I help you today?",
              "I'd be happy to assist you with that.",
              "Let me help you with that question.",
              "Thanks for reaching out! Here's what I can do for you."
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            addMessage(response, true, messagesArea);
          }, 1000);
        }
      }
      
      sendButton.addEventListener('click', handleSend);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
      });
      
      return widget;
    }
    
    function addMessage(text, isBot, container) {
      const message = document.createElement('div');
      message.style.cssText = \`
        display: flex;
        justify-content: \${isBot ? 'flex-start' : 'flex-end'};
      \`;
      
      const bubble = document.createElement('div');
      bubble.style.cssText = \`
        max-width: 80%;
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 14px;
        \${isBot 
          ? \`background: white; color: #334155; border: 1px solid #e2e8f0;\`
          : \`background: \${WIDGET_CONFIG.appearance.primaryColor}; color: \${WIDGET_CONFIG.appearance.secondaryColor};\`
        }
      \`;
      bubble.textContent = text;
      
      message.appendChild(bubble);
      container.appendChild(message);
      container.scrollTop = container.scrollHeight;
    }
    
    function getPositionStyles() {
      const pos = WIDGET_CONFIG.behavior.position;
      switch (pos) {
        case 'bottom-left': return 'bottom: 20px; left: 20px;';
        case 'top-right': return 'top: 20px; right: 20px;';
        case 'top-left': return 'top: 20px; left: 20px;';
        default: return 'bottom: 20px; right: 20px;';
      }
    }
    
    function getFontFamily() {
      const fonts = {
        inter: 'Inter, system-ui, sans-serif',
        roboto: 'Roboto, sans-serif',
        opensans: 'Open Sans, sans-serif',
        lato: 'Lato, sans-serif',
        montserrat: 'Montserrat, sans-serif',
        poppins: 'Poppins, sans-serif'
      };
      return fonts[WIDGET_CONFIG.appearance.fontFamily] || fonts.inter;
    }
    
    function openWidget() {
      isOpen = true;
      container.querySelector('#chat-button').style.display = 'none';
      container.querySelector('#chat-widget').style.display = 'flex';
    }
    
    window.closeWidget = function() {
      isOpen = false;
      container.querySelector('#chat-button').style.display = 'flex';
      container.querySelector('#chat-widget').style.display = 'none';
    };
    
    window.minimizeWidget = function() {
      // Implementation for minimize
      closeWidget();
    };
    
    // Create elements
    const chatButton = createChatButton();
    chatButton.id = 'chat-button';
    
    const chatWidget = createChatWidget();
    chatWidget.id = 'chat-widget';
    
    container.appendChild(chatButton);
    container.appendChild(chatWidget);
    
    document.body.appendChild(container);
    
    // Auto-open logic
    if (WIDGET_CONFIG.behavior.autoOpen === 'yes') {
      setTimeout(openWidget, 1000);
    } else if (WIDGET_CONFIG.behavior.autoOpen === 'delay') {
      setTimeout(openWidget, WIDGET_CONFIG.behavior.delay * 1000);
    }
  }
  
  // Domain validation
  function validateDomain() {
    if (WIDGET_CONFIG.allowedDomains.length === 0) return true;
    const currentDomain = window.location.hostname;
    return WIDGET_CONFIG.allowedDomains.some(domain => 
      domain === '*' || currentDomain === domain || currentDomain.endsWith('.' + domain)
    );
  }
  
  // Initialize widget
  if (validateDomain()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createWidget);
    } else {
      createWidget();
    }
  } else {
    console.warn('Lovable Chat Widget: Domain not allowed');
  }
})();`;
  };

  // Generate different embed code types
  const generateEmbedCode = () => {
    const widgetConfig = generateWidgetConfig();
    
    switch (embedType) {
      case 'script':
        return `<!-- Lovable Chat Widget -->
<script>
${generateWidgetScript()}
</script>`;

      case 'iframe':
        const configEncoded = encodeURIComponent(JSON.stringify(widgetConfig));
        return `<!-- Lovable Chat Widget (iframe) -->
<iframe 
  src="https://widget.lovable.dev/embed?config=${configEncoded}" 
  style="position: fixed; ${getPositionStyle()}; width: 400px; height: 500px; border: none; z-index: 999999;"
  title="Chat Widget">
</iframe>`;

      case 'webcomponent':
        return `<!-- Lovable Chat Widget (Web Component) -->
<script src="https://widget.lovable.dev/webcomponent.js"></script>
<lovable-chat-widget 
  widget-id="${widgetId}"
  primary-color="${fullConfig.appearance.primaryColor}"
  position="${fullConfig.behavior.position}"
  auto-open="${fullConfig.behavior.autoOpen}"
  welcome-message="${fullConfig.content.welcomeMessage}"
  bot-name="${fullConfig.content.botName}">
</lovable-chat-widget>`;

      case 'react':
        return `// React Component Integration
import { LovableChatWidget } from '@lovable/chat-widget';

export default function App() {
  const widgetConfig = ${JSON.stringify(widgetConfig, null, 4)};
  
  return (
    <div>
      {/* Your app content */}
      <LovableChatWidget config={widgetConfig} />
    </div>
  );
}

// Install: npm install @lovable/chat-widget`;

      default:
        return generateWidgetScript();
    }
  };

  const getPositionStyle = () => {
    const pos = fullConfig.behavior.position;
    switch (pos) {
      case 'bottom-left': return 'bottom: 20px; left: 20px;';
      case 'top-right': return 'top: 20px; right: 20px;';
      case 'top-left': return 'top: 20px; left: 20px;';
      default: return 'bottom: 20px; right: 20px;';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard.",
      });
    });
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const embedCode = generateEmbedCode();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Production Embed Code</h3>
        <p className="text-sm text-slate-500 mb-4">Get production-ready code to embed your widget</p>
      </div>
      
      <div className="space-y-6">
        {/* Embed Type Selection */}
        <div>
          <Label className="mb-3 block font-medium">Integration Method</Label>
          <Tabs value={embedType} onValueChange={setEmbedType}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="script">Script Tag</TabsTrigger>
              <TabsTrigger value="iframe">iframe</TabsTrigger>
              <TabsTrigger value="webcomponent">Web Component</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 space-y-4">
              <TabsContent value="script" className="mt-0">
                <div className="text-sm text-slate-600 mb-3">
                  <strong>Recommended:</strong> Self-contained JavaScript that creates the widget directly on your page.
                  <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                    <li>No external dependencies</li>
                    <li>Fastest loading time</li>
                    <li>Full customization support</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="iframe" className="mt-0">
                <div className="text-sm text-slate-600 mb-3">
                  <strong>Secure:</strong> Widget loads in an isolated iframe for maximum security.
                  <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                    <li>Complete isolation from parent page</li>
                    <li>GDPR compliant by default</li>
                    <li>Easy to implement</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="webcomponent" className="mt-0">
                <div className="text-sm text-slate-600 mb-3">
                  <strong>Modern:</strong> Uses Web Components standard for clean integration.
                  <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                    <li>Clean HTML syntax</li>
                    <li>Framework agnostic</li>
                    <li>Encapsulated styling</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="react" className="mt-0">
                <div className="text-sm text-slate-600 mb-3">
                  <strong>React:</strong> Native React component for React applications.
                  <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                    <li>TypeScript support</li>
                    <li>React hooks integration</li>
                    <li>SSR compatible</li>
                  </ul>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Generated Code */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium">Generated Embed Code</Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(embedCode)}
                className="flex items-center gap-2"
              >
                <Copy size={14} />
                Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => downloadAsFile(embedCode, `widget-${widgetId}.${embedType === 'react' ? 'jsx' : 'html'}`)}
                className="flex items-center gap-2"
              >
                <Download size={14} />
                Download
              </Button>
            </div>
          </div>
          
          <div className="bg-slate-900 text-slate-100 p-4 rounded-md font-mono text-sm overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap break-all">{embedCode}</pre>
          </div>
        </div>

        {/* Configuration Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Widget ID</Label>
            <div className="flex gap-2">
              <Input value={widgetId} readOnly className="font-mono text-sm" />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(widgetId)}
              >
                <Copy size={14} />
              </Button>
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Allowed Domains</Label>
            <Input 
              placeholder="*.example.com, app.domain.com" 
              value={config.allowedDomains}
              onChange={(e) => onChange('allowedDomains', e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">Use * for all domains, or specify comma-separated domains</p>
          </div>
        </div>

        {/* Privacy & Compliance */}
        <div className="border rounded-lg p-4 bg-slate-50">
          <Label className="font-medium mb-3 block">Privacy & Compliance</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="enable-analytics" 
                checked={enableAnalytics}
                onCheckedChange={(checked) => setEnableAnalytics(checked === true)}
              />
              <Label htmlFor="enable-analytics" className="text-sm">Enable user analytics</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="gdpr-compliance" 
                checked={enableGDPR}
                onCheckedChange={(checked) => setEnableGDPR(checked === true)}
              />
              <Label htmlFor="gdpr-compliance" className="text-sm">Enable GDPR compliance features</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cookie-consent" 
                checked={enableCookieConsent}
                onCheckedChange={(checked) => setEnableCookieConsent(checked === true)}
              />
              <Label htmlFor="cookie-consent" className="text-sm">Show cookie consent message</Label>
            </div>
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="border rounded-lg p-4">
          <Label className="font-medium mb-3 block flex items-center gap-2">
            <ExternalLink size={16} />
            Implementation Guide
          </Label>
          <div className="space-y-3 text-sm text-slate-600">
            <div>
              <strong>Step 1:</strong> Copy the embed code above
            </div>
            <div>
              <strong>Step 2:</strong> Paste it into your website's HTML before the closing &lt;/body&gt; tag
            </div>
            <div>
              <strong>Step 3:</strong> Test the widget on your website
            </div>
            <div>
              <strong>Step 4:</strong> Configure domain restrictions if needed
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <strong>💡 Pro Tip:</strong> Use the Script Tag method for best performance and full feature support.
          </div>
        </div>
      </div>
    </div>
  );
};
