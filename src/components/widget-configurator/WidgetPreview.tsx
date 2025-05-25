import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ModernWidgetPreview from "./ModernWidgetPreview";

interface WidgetPreviewProps {
  config: any;
}

export const WidgetPreview: React.FC<WidgetPreviewProps> = ({ config }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Live Preview</CardTitle>
          <Badge variant="outline" className="font-normal">
            {config.behavior.position || "bottom-right"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ModernWidgetPreview config={config} />
      </CardContent>
    </Card>
  );
};
