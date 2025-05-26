import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  Eye,
  Maximize2,
  Minimize2,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import ModernWidgetPreview from "./ModernWidgetPreview";

interface WidgetPreviewProps {
  config: any;
}

export const WidgetPreview: React.FC<WidgetPreviewProps> = ({ config }) => {
  const [activeDevice, setActiveDevice] = useState("desktop");
  const [orientation, setOrientation] = useState("portrait");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [forceWidgetOpen, setForceWidgetOpen] = useState(true);

  // Re-render preview when config changes
  useEffect(() => {
    setRefreshKey(Date.now());
    // Do not change forceWidgetOpen on config changes to keep widget open
  }, [config]);

  // Force refresh the preview
  const handleRefresh = () => {
    setRefreshKey(Date.now());
  };

  // Toggle widget visibility (for debugging)
  const toggleWidgetVisibility = () => {
    setForceWidgetOpen(prev => !prev);
  };

  // Device configurations
  const devices = {
    desktop: {
      name: "Desktop",
      icon: Monitor,
      width: "100%",
      height: "500px",
      frame: "border-t-4 rounded-t-lg border-slate-300",
      scale: 1,
      canRotate: false
    },
    tablet: {
      name: "Tablet",
      icon: Tablet,
      width: orientation === "portrait" ? "768px" : "1024px",
      height: orientation === "portrait" ? "1024px" : "768px",
      frame: "border-[8px] rounded-[20px] border-slate-800",
      scale: 0.4,
      canRotate: true
    },
    mobile: {
      name: "Mobile",
      icon: Smartphone,
      width: orientation === "portrait" ? "375px" : "667px",
      height: orientation === "portrait" ? "667px" : "375px",
      frame: "border-[6px] rounded-[24px] border-slate-900",
      scale: 0.6,
      canRotate: true
    }
  };

  const currentDevice = devices[activeDevice as keyof typeof devices];

  const toggleOrientation = () => {
    setOrientation(prev => prev === "portrait" ? "landscape" : "portrait");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  return (
    <Card className={cn(
      "transition-all duration-300",
      isFullscreen && "fixed inset-4 z-50 h-auto"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Device Preview
            </CardTitle>
            <Badge variant="outline" className="font-normal">
              {config.behavior?.position || "bottom-right"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleWidgetVisibility}
              className="flex items-center gap-1"
              title={forceWidgetOpen ? "Close widget" : "Open widget"}
            >
              {forceWidgetOpen ? "Hide Widget" : "Show Widget"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-1"
              title="Refresh preview"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            {currentDevice.canRotate && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleOrientation}
                className="flex items-center gap-1"
              >
                <RotateCw className="h-3 w-3" />
                {orientation === "portrait" ? "Landscape" : "Portrait"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="flex items-center gap-1"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3 w-3" />
                  Exit
                </>
              ) : (
                <>
                  <Maximize2 className="h-3 w-3" />
                  Fullscreen
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Selector */}
        <Tabs value={activeDevice} onValueChange={setActiveDevice}>
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(devices).map(([key, device]) => {
              const Icon = device.icon;
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {device.name}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Device Preview */}
        <div className="flex justify-center items-center min-h-[400px] p-4">
          {activeDevice === "desktop" ? (
            /* Desktop Preview - Full Width */
            <div className="w-full h-[500px] bg-white border-t-4 rounded-t-lg border-slate-300 overflow-hidden">
              <ModernWidgetPreview
                config={config}
                deviceType="desktop"
                forceOpen={forceWidgetOpen}
                key={`desktop-preview-${refreshKey}`}
              />
            </div>
          ) : (
            /* Mobile/Tablet Preview - Scaled Device Frame */
            <div className="relative">
              <div
                className={cn(
                  "bg-slate-900 overflow-hidden transition-all duration-300 relative",
                  currentDevice.frame
                )}
                style={{
                  width: currentDevice.width,
                  height: currentDevice.height,
                  transform: `scale(${currentDevice.scale})`,
                  transformOrigin: "center"
                }}
              >
                {/* Device Status Bar */}
                {activeDevice === "mobile" && (
                  <div className="h-6 bg-black flex items-center justify-between px-4 text-white text-xs">
                    <span className="font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 border border-white rounded-sm">
                        <div className="w-3 h-1 bg-white rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                )}

                {activeDevice === "tablet" && (
                  <div className="h-8 bg-slate-100 flex items-center justify-between px-6 text-sm">
                    <span className="font-medium">9:41 AM</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-2 border border-slate-600 rounded-sm">
                        <div className="w-3 h-1 bg-slate-600 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Widget Preview Content */}
                <div
                  className="bg-slate-50 relative overflow-hidden"
                  style={{
                    width: currentDevice.width,
                    height: `calc(${currentDevice.height} - ${activeDevice === "mobile" ? "24px" : activeDevice === "tablet" ? "32px" : "0px"})`
                  }}
                >
                  <div className="w-full h-full">
                    <ModernWidgetPreview
                      config={config}
                      deviceType={activeDevice as 'tablet' | 'mobile'}
                      forceOpen={forceWidgetOpen}
                      key={`${activeDevice}-preview-${refreshKey}`}
                    />
                  </div>
                </div>

                {/* Mobile Home Indicator */}
                {activeDevice === "mobile" && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-32 h-1 bg-white rounded-full opacity-60"></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Device Info */}
        <div className="flex justify-center">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="font-medium">Resolution:</span>
              <span>{currentDevice.width} × {currentDevice.height}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Scale:</span>
              <span>{Math.round(currentDevice.scale * 100)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Orientation:</span>
              <span className="capitalize">{orientation}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
