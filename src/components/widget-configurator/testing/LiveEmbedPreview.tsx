import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, ExternalLink, Play } from "lucide-react";
import {
  generateScriptEmbed,
  generateIframeEmbed,
  generateWebComponentEmbed,
  generateWidgetConfig,
} from "@/utils/embedCodeGenerator";
import { useToast } from "@/hooks/use-toast";

export const LiveEmbedPreview = ({ config, widgetId, environment }) => {
  const [embedType, setEmbedType] = useState("script");
  const [embedCode, setEmbedCode] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    updateEmbedCode();
    // Generate a preview URL with the current timestamp to avoid caching
    setPreviewUrl(
      `https://${environment}-preview.chatadmin.com/preview/${widgetId}?t=${Date.now()}`,
    );
  }, [config, widgetId, environment, embedType]);

  const updateEmbedCode = () => {
    switch (embedType) {
      case "script":
        setEmbedCode(generateScriptEmbed(widgetId, config, environment));
        break;
      case "iframe":
        setEmbedCode(generateIframeEmbed(widgetId, config, environment));
        break;
      case "webcomponent":
        setEmbedCode(generateWebComponentEmbed(widgetId, config, environment));
        break;
      case "config":
        setEmbedCode(generateWidgetConfig(config));
        break;
      default:
        setEmbedCode(generateScriptEmbed(widgetId, config, environment));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The embed code has been copied to your clipboard.",
      });
    });
  };

  const refreshPreview = () => {
    setIsRefreshing(true);
    setPreviewUrl(
      `https://${environment}-preview.chatadmin.com/preview/${widgetId}?t=${Date.now()}`,
    );
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const openInNewTab = () => {
    window.open(previewUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>
            See how your widget will appear on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-slate-100 dark:bg-slate-800 rounded-md h-[400px] overflow-hidden">
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshPreview}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={openInNewTab}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </Button>
            </div>

            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Widget Preview"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Embed Code</CardTitle>
          <CardDescription>
            Copy and paste this code into your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="script"
            value={embedType}
            onValueChange={setEmbedType}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="script">Script</TabsTrigger>
              <TabsTrigger value="iframe">iFrame</TabsTrigger>
              <TabsTrigger value="webcomponent">Web Component</TabsTrigger>
              <TabsTrigger value="config">Config JSON</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto text-sm">
              {embedCode}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Test on Your Website
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
