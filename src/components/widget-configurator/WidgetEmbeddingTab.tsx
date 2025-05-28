import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getWidgetEmbedCode } from "@/services/widgetService";

interface WidgetEmbeddingTabProps {
  config: {
    allowedDomains: string;
    enableAnalytics?: boolean;
    gdprCompliance?: boolean;
  };
  widgetId: string;
  onChange: (key: string, value: any) => void;
}

export const WidgetEmbeddingTab: React.FC<WidgetEmbeddingTabProps> = ({
  config,
  widgetId,
  onChange,
}) => {
  const { toast } = useToast();
  const [embedCode, setEmbedCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch embed code when widgetId changes
  useEffect(() => {
    if (widgetId) {
      fetchEmbedCode();
    } else {
      setEmbedCode(
        '<script src="https://example.com/widget.js" id="chat-widget" data-id="widget-id"></script>',
      );
    }
  }, [widgetId]);

  const fetchEmbedCode = async () => {
    if (!widgetId) return;

    setLoading(true);
    try {
      const data = await getWidgetEmbedCode(widgetId);
      setEmbedCode(data.embed_code);
    } catch (error) {
      console.error("Error fetching embed code:", error);
      setEmbedCode(
        '<script src="https://example.com/widget.js" id="chat-widget" data-id="widget-id"></script>',
      );
    } finally {
      setLoading(false);
    }
  };

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
      <div className="bg-gradient-to-r from-slate-50 to-white p-4 rounded-lg border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Code className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Embed Settings</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Get code to embed on your website
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <Label className="mb-2 block font-medium flex items-center gap-2">
            <Code className="h-4 w-4 text-primary" />
            Embed Code
          </Label>
          <div className="bg-slate-50 p-4 rounded-md mt-2 relative border border-slate-200">
            <code className="text-sm text-foreground font-mono break-all">
              {loading ? "Loading embed code..." : embedCode}
            </code>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 bg-white hover:bg-slate-50 transition-colors duration-200"
            onClick={copyToClipboard}
          >
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
            Copy to clipboard
          </Button>
        </div>

        <div className="pt-4">
          <Label className="mb-2 block">Installation Instructions</Label>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Copy the embed code above</li>
            <li>
              Paste it before the closing &lt;/body&gt; tag on your website
            </li>
            <li>The widget will automatically initialize</li>
            <li>Visit our documentation for advanced customization options</li>
          </ol>
        </div>

        <div className="pt-4">
          <Label className="mb-2 block">Domains Allowed</Label>
          <Input
            placeholder="Enter domains (e.g., example.com)"
            value={config.allowedDomains}
            onChange={(e) => onChange("allowedDomains", e.target.value)}
            className="bg-background text-foreground border-border placeholder:text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Domains where the widget can be loaded (* for all domains)
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable-analytics"
              checked={config.enableAnalytics !== false}
              onCheckedChange={(checked) =>
                onChange("enableAnalytics", checked)
              }
            />
            <Label htmlFor="enable-analytics">Enable user analytics</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gdpr-compliance"
              checked={config.gdprCompliance !== false}
              onCheckedChange={(checked) => onChange("gdprCompliance", checked)}
            />
            <Label htmlFor="gdpr-compliance">
              Enable GDPR compliance features
            </Label>
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
