import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink } from "lucide-react";

interface LiveEmbedPreviewProps {
  config: any;
  widgetId: string;
  environment: string;
}

export const LiveEmbedPreview = ({
  config,
  widgetId,
  environment,
}: LiveEmbedPreviewProps) => {
  const previewUrl = `https://${environment}-preview.chatadmin.com/preview/${widgetId}`;
  const [refreshKey, setRefreshKey] = React.useState(Date.now());

  const handleRefresh = () => {
    setRefreshKey(Date.now());
  };

  const getEnvironmentBadge = () => {
    switch (environment) {
      case "production":
        return <Badge className="bg-red-500">Production</Badge>;
      case "staging":
        return <Badge className="bg-amber-500">Staging</Badge>;
      default:
        return <Badge className="bg-blue-500">Development</Badge>;
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>Live Preview</CardTitle>
            {getEnvironmentBadge()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </a>
            </Button>
          </div>
        </div>
        <CardDescription>
          See how your widget appears on a live website
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden rounded-b-lg">
        <div className="w-full h-[500px] bg-white">
          <iframe
            key={refreshKey}
            src={`${previewUrl}?t=${refreshKey}`}
            className="w-full h-full border-none"
            title="Widget Live Preview"
          />
        </div>
      </CardContent>
    </Card>
  );
};
