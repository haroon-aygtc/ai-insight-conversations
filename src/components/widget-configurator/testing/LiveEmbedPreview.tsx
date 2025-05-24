
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, RefreshCw, ExternalLink, Play } from 'lucide-react';
import { generateScriptEmbed, generateIframeEmbed, generateWebComponentEmbed, generateWidgetConfig } from '@/utils/embedCodeGenerator';
import { useToast } from "@/hooks/use-toast";

interface LiveEmbedPreviewProps {
  config: any;
  widgetId: string;
  environment: string;
}

export const LiveEmbedPreview: React.FC<LiveEmbedPreviewProps> = ({
  config,
  widgetId,
  environment
}) => {
  const { toast } = useToast();
  const [embedType, setEmbedType] = useState("script");
  const [testUrl, setTestUrl] = useState("https://example.com");
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const privacySettings = {
    enableAnalytics: true,
    enableGDPR: true,
    enableCookieConsent: true
  };

  const widgetConfig = generateWidgetConfig(
    widgetId,
    config,
    privacySettings,
    "*"
  );

  const generateEmbedCode = () => {
    switch (embedType) {
      case 'script':
        return generateScriptEmbed(widgetConfig);
      case 'iframe':
        return generateIframeEmbed(widgetConfig);
      case 'webcomponent':
        return generateWebComponentEmbed(widgetConfig);
      default:
        return generateScriptEmbed(widgetConfig);
    }
  };

  const testEmbedCode = () => {
    setIsLoading(true);
    
    const embedCode = generateEmbedCode();
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Widget Test - ${testUrl}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5;
        }
        .test-page {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .test-header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .test-content {
            line-height: 1.6;
            color: #333;
        }
        .test-info {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #2196f3;
        }
    </style>
</head>
<body>
    <div class="test-page">
        <div class="test-header">
            <h1>Widget Test Page</h1>
            <p>Testing widget on: <strong>${testUrl}</strong></p>
            <p>Embed Type: <strong>${embedType}</strong></p>
            <p>Environment: <strong>${environment}</strong></p>
        </div>
        
        <div class="test-content">
            <h2>Sample Website Content</h2>
            <p>This is a sample website to test how the chat widget appears and functions in a real website environment.</p>
            
            <div class="test-info">
                <strong>Widget Information:</strong><br>
                Widget ID: ${widgetId}<br>
                Position: ${config.behavior?.position || 'bottom-right'}<br>
                Auto Open: ${config.behavior?.autoOpen || 'no'}
            </div>
            
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
            
            <h3>Features to Test:</h3>
            <ul>
                <li>Widget positioning and visibility</li>
                <li>Chat functionality</li>
                <li>Responsive behavior</li>
                <li>Auto-open settings</li>
                <li>Color scheme and branding</li>
            </ul>
        </div>
    </div>
    
    ${embedCode}
    
    <script>
        // Test environment logging
        console.log('Widget Test Environment: ${environment}');
        console.log('Widget Config:', ${JSON.stringify(widgetConfig, null, 2)});
        
        // Performance monitoring
        window.addEventListener('load', function() {
            console.log('Page loaded at:', new Date().toISOString());
        });
    </script>
</body>
</html>`;

    if (iframeRef.current) {
      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      
      iframeRef.current.onload = () => {
        setIsLoading(false);
        URL.revokeObjectURL(url);
      };
    }
  };

  const copyEmbedCode = () => {
    const embedCode = generateEmbedCode();
    navigator.clipboard.writeText(embedCode).then(() => {
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard.",
      });
    });
  };

  const openInNewTab = () => {
    const embedCode = generateEmbedCode();
    const fullHtml = `<!DOCTYPE html><html><head><title>Widget Test</title></head><body><h1>Widget Test</h1>${embedCode}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  useEffect(() => {
    testEmbedCode();
  }, [embedType, config, widgetId, environment]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play size={20} />
            Live Embed Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="mb-2 block">Embed Type</Label>
              <Tabs value={embedType} onValueChange={setEmbedType}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="script">Script</TabsTrigger>
                  <TabsTrigger value="iframe">iFrame</TabsTrigger>
                  <TabsTrigger value="webcomponent">Component</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div>
              <Label className="mb-2 block">Test URL</Label>
              <Input 
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <Button onClick={testEmbedCode} className="flex items-center gap-2" disabled={isLoading}>
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                Refresh Test
              </Button>
              <Button variant="outline" onClick={copyEmbedCode}>
                <Copy size={16} />
              </Button>
              <Button variant="outline" onClick={openInNewTab}>
                <ExternalLink size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden bg-white">
            <iframe
              ref={iframeRef}
              className="w-full h-96"
              title="Widget Test Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="animate-spin mr-2" size={20} />
              Loading test environment...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
