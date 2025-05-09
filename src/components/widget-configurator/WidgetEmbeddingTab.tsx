
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface WidgetEmbeddingTabProps {
  config: {
    allowedDomains: string;
  };
  widgetId: string;
  onChange: (key: string, value: any) => void;
}

export const WidgetEmbeddingTab: React.FC<WidgetEmbeddingTabProps> = ({ config, widgetId, onChange }) => {
  const { toast } = useToast();
  
  const embedCode = `<script src="https://chatadmin.example.com/widget.js" id="chat-widget" data-id="${widgetId}"></script>`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard.",
      });
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Embed Settings</h3>
        <p className="text-sm text-slate-500 mb-4">Get code to embed on your website</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="mb-2 block">Embed Code</Label>
          <div className="bg-slate-100 p-4 rounded-md mt-2 relative">
            <code className="text-sm text-slate-700 font-mono break-all">
              {embedCode}
            </code>
          </div>
          <Button variant="outline" size="sm" className="mt-2" onClick={copyToClipboard}>
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            Copy to clipboard
          </Button>
        </div>
        
        <div className="pt-4">
          <Label className="mb-2 block">Installation Instructions</Label>
          <ol className="list-decimal list-inside space-y-2 text-slate-600">
            <li>Copy the embed code above</li>
            <li>Paste it before the closing &lt;/body&gt; tag on your website</li>
            <li>The widget will automatically initialize</li>
            <li>Visit our documentation for advanced customization options</li>
          </ol>
        </div>
        
        <div className="pt-4">
          <Label className="mb-2 block">Domains Allowed</Label>
          <Input 
            placeholder="Enter domains (e.g., example.com)" 
            value={config.allowedDomains}
            onChange={(e) => onChange('allowedDomains', e.target.value)}
          />
          <p className="text-xs text-slate-500 mt-1">Domains where the widget can be loaded (* for all domains)</p>
        </div>
        
        <div className="pt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="enable-analytics" defaultChecked />
            <Label htmlFor="enable-analytics">Enable user analytics</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="gdpr-compliance" defaultChecked />
            <Label htmlFor="gdpr-compliance">Enable GDPR compliance features</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cookie-consent" defaultChecked />
            <Label htmlFor="cookie-consent">Show cookie consent message</Label>
          </div>
        </div>
      </div>
    </div>
  );
};
