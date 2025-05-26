import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check, Copy, RefreshCw, ExternalLink } from 'lucide-react';

interface EmbedCodeTesterProps {
  widgetId: string;
  environment: string;
  config: any;
}

export function EmbedCodeTester({ widgetId, environment, config }: EmbedCodeTesterProps) {
  // Generate embed code based on the widget ID, environment, and config
  const generateEmbedCode = () => {
    return `<!-- AI Insight Conversations Widget -->
<script>
  (function(w, d, s) {
    // Create script element and set properties
    var j = document.createElement(s);
    j.async = true;
    j.src = 'https://${environment}.chatadmin.com/widget.js';
    
    // Initialize widget when script loads
    j.onload = function() {
      w.AIInsightWidget.init({
        widgetId: '${widgetId}',
        // Optional: Override config settings from dashboard
        config: ${JSON.stringify(config, null, 2)}
      });
    };
    
    // Insert script into DOM
    var f = d.getElementsByTagName(s)[0];
    f ? f.parentNode.insertBefore(j, f) : d.body.appendChild(j);
  })(window, document, 'script');
</script>
<!-- End AI Insight Conversations Widget -->`;
  };
  
  // Auto-generate the embed code
  const [embedCode, setEmbedCode] = useState<string>(generateEmbedCode());
  
  // Regenerate embed code when widget ID, environment, or config changes
  useEffect(() => {
    setEmbedCode(generateEmbedCode());
  }, [widgetId, environment, JSON.stringify(config)]);
  const [testMode, setTestMode] = useState<'iframe' | 'web' | 'new-tab'>('iframe');
  const [copied, setCopied] = useState(false);
  const [testActive, setTestActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sandboxRef = useRef<HTMLDivElement>(null);

  // Reset error state when embed code changes
  useEffect(() => {
    setError(null);
  }, [embedCode]);

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Test embed code in iframe
  const testEmbedCodeInline = () => {
    setTestActive(true);
    setError(null);
    
    try {
      // Create a sandbox iframe for testing
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (iframeDoc) {
          // Create a basic HTML document with the embed code
          iframeDoc.open();
          iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Widget Test</title>
              <style>
                body { font-family: system-ui, sans-serif; margin: 0; padding: 0; height: 100vh; overflow: hidden; }
                .widget-container { position: relative; width: 100%; height: 100%; overflow: hidden; }
              </style>
            </head>
            <body>
              <div class="widget-container">
                ${embedCode}
              </div>
            </body>
            </html>
          `);
          iframeDoc.close();
        }
      }
    } catch (err) {
      setError('Error loading widget preview. Please check your code and try again.');
      console.error('Error loading widget preview:', err);
    }
  };

  // Test embed code in web preview with simulated website
  const testEmbedCodeSandbox = () => {
    setTestActive(true);
    setError(null);
    
    try {
      if (sandboxRef.current) {
        // Clear previous content
        sandboxRef.current.innerHTML = '';
        
        // Create a simulated website with the embed code
        const websiteTemplate = document.createElement('div');
        websiteTemplate.className = 'simulated-website';
        websiteTemplate.innerHTML = `
          <div class="website-header" style="background-color: #f8f9fa; padding: 16px; border-bottom: 1px solid #e9ecef;">
            <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
              <div style="font-weight: bold; font-size: 20px; color: #333;">Example Company</div>
              <div style="display: flex; gap: 16px;">
                <span style="color: #555;">Home</span>
                <span style="color: #555;">Products</span>
                <span style="color: #555;">About</span>
                <span style="color: #555;">Contact</span>
              </div>
            </div>
          </div>
          <div class="website-content" style="max-width: 1200px; margin: 0 auto; padding: 24px 16px;">
            <h1 style="font-size: 28px; margin-bottom: 16px; color: #333;">Welcome to Our Website</h1>
            <p style="margin-bottom: 16px; line-height: 1.5; color: #555;">
              This is a simulated website to test how your widget appears in a real-world environment. 
              The widget should appear in the bottom-right corner of the page.
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 32px;">
              <div style="background-color: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 24px;">
                <h3 style="font-size: 18px; margin-bottom: 12px; color: #333;">Feature One</h3>
                <p style="color: #555; line-height: 1.5;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p>
              </div>
              <div style="background-color: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 24px;">
                <h3 style="font-size: 18px; margin-bottom: 12px; color: #333;">Feature Two</h3>
                <p style="color: #555; line-height: 1.5;">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
              </div>
              <div style="background-color: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 24px;">
                <h3 style="font-size: 18px; margin-bottom: 12px; color: #333;">Feature Three</h3>
                <p style="color: #555; line-height: 1.5;">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>
              </div>
            </div>
          </div>
        `;
        
        // Create a div to hold the embed code
        const embedContainer = document.createElement('div');
        embedContainer.innerHTML = embedCode;
        
        // Append the website template to the sandbox
        sandboxRef.current.appendChild(websiteTemplate);
        
        // Append the embed code to the sandbox
        sandboxRef.current.appendChild(embedContainer);
      }
    } catch (err) {
      setError('Error loading web preview. Please check your code and try again.');
      console.error('Error loading web preview:', err);
    }
  };

  // Test embed code in new tab
  const testEmbedCodeNewTab = () => {
    try {
      // Create a new window with the embed code
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Widget Test</title>
            <style>
              body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
              h1 { font-size: 24px; margin-bottom: 20px; }
              p { margin-bottom: 16px; }
            </style>
          </head>
          <body>
            <h1>Widget Test Page</h1>
            <p>This is a test page for your widget. The widget should appear in the bottom right corner.</p>
            <p>Try interacting with it to ensure it works as expected.</p>
            ${embedCode}
          </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        setError('Unable to open new tab. Please check your browser settings and try again.');
      }
    } catch (err) {
      setError('Error opening new tab. Please check your code and try again.');
      console.error('Error opening new tab:', err);
    }
  };

  // Handle test button click based on selected mode
  const handleTest = () => {
    if (!embedCode.trim()) {
      setError('Please enter embed code before testing.');
      return;
    }

    switch (testMode) {
      case 'iframe':
        testEmbedCodeInline();
        break;
      case 'web':
        testEmbedCodeSandbox();
        break;
      case 'new-tab':
        testEmbedCodeNewTab();
        break;
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Widget Embed Code Tester</CardTitle>
        <CardDescription>
          Paste your widget embed code and test it in different environments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="embed-code">Paste your embed code here</Label>
          <Textarea
            id="embed-code"
            value={embedCode}
            onChange={(e) => setEmbedCode(e.target.value)}
            placeholder="<!-- Paste your widget embed code here -->"
            className="font-mono text-sm h-[150px]"
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <Tabs defaultValue="inline" onValueChange={(value) => setTestMode(value as any)}>
              <TabsList>
                <TabsTrigger value="iframe">iFrame Preview</TabsTrigger>
                <TabsTrigger value="web">Web Preview</TabsTrigger>
                <TabsTrigger value="new-tab">New Tab</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={handleTest} className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Test Widget
            </Button>
          </div>

          <div className="bg-slate-50 rounded-md p-4 min-h-[300px] border">
            {testMode === 'iframe' && (
              <div className="relative w-full h-[400px] border rounded overflow-hidden">
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0"
                  title="Widget Test"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
                {!testActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 bg-opacity-90">
                    <div className="text-center p-4 max-w-md">
                      <h3 className="text-lg font-medium mb-2">iFrame Preview</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Test your widget in a sandboxed iframe environment. This is the safest way to test your widget.
                      </p>
                      <Button onClick={handleTest} className="flex items-center gap-1">
                        <RefreshCw className="h-4 w-4" />
                        Load Widget Preview
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {testMode === 'web' && (
              <div className="relative w-full h-[400px] border rounded overflow-hidden bg-white">
                <div
                  ref={sandboxRef}
                  className="w-full h-full overflow-auto p-4"
                ></div>
                {!testActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 bg-opacity-90">
                    <div className="text-center p-4 max-w-md">
                      <h3 className="text-lg font-medium mb-2">Web Preview</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Test your widget in a simulated web page environment. This shows how your widget will appear on a real website.
                      </p>
                      <Button onClick={handleTest} className="flex items-center gap-1">
                        <RefreshCw className="h-4 w-4" />
                        Load Web Preview
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {testMode === 'new-tab' && (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <ExternalLink className="h-16 w-16 text-slate-300 mb-4" />
                <p className="text-slate-600 mb-2">
                  Widget will open in a new tab when you click "Test Widget"
                </p>
                <p className="text-sm text-slate-400">
                  Make sure your browser allows popups for this site
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
