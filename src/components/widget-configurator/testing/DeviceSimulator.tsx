import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RotateCw, Smartphone, Tablet, Monitor } from "lucide-react";

interface DeviceSimulatorProps {
  previewUrl?: string;
}

export const DeviceSimulator = ({ previewUrl }: DeviceSimulatorProps) => {
  const [device, setDevice] = useState("desktop");
  const [orientation, setOrientation] = useState("portrait");

  const getDeviceFrame = () => {
    switch (device) {
      case "mobile":
        return {
          width: orientation === "portrait" ? "320px" : "568px",
          height: orientation === "portrait" ? "568px" : "320px",
          className: "border-8 rounded-[36px] border-slate-800",
        };
      case "tablet":
        return {
          width: orientation === "portrait" ? "768px" : "1024px",
          height: orientation === "portrait" ? "1024px" : "768px",
          className: "border-[12px] rounded-[24px] border-slate-800",
        };
      default: // desktop
        return {
          width: "100%",
          height: "600px",
          className: "border-t-8 rounded-t-lg border-slate-800",
        };
    }
  };

  const deviceFrame = getDeviceFrame();

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Device Simulator</CardTitle>
            <CardDescription>Test on different devices</CardDescription>
          </div>
          {(device === "mobile" || device === "tablet") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setOrientation(
                  orientation === "portrait" ? "landscape" : "portrait",
                )
              }
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Rotate
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Tabs value={device} onValueChange={setDevice}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="desktop" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Desktop
              </TabsTrigger>
              <TabsTrigger value="tablet" className="flex items-center gap-2">
                <Tablet className="h-4 w-4" />
                Tablet
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Mobile
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex justify-center">
          <div
            className={`bg-white overflow-hidden ${deviceFrame.className}`}
            style={{
              width: deviceFrame.width,
              height: deviceFrame.height,
              maxWidth: "100%",
              maxHeight: device === "desktop" ? "600px" : "500px",
            }}
          >
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full border-none"
                title="Widget Preview"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                Preview URL not provided
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
