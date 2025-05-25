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
import { Smartphone, Tablet, Monitor, RotateCcw } from "lucide-react";

export const DeviceSimulator = ({ previewUrl }) => {
  const [deviceType, setDeviceType] = useState("desktop");
  const [orientation, setOrientation] = useState("portrait");

  const getDeviceDimensions = () => {
    switch (deviceType) {
      case "mobile":
        return orientation === "portrait"
          ? { width: 375, height: 667 }
          : { width: 667, height: 375 };
      case "tablet":
        return orientation === "portrait"
          ? { width: 768, height: 1024 }
          : { width: 1024, height: 768 };
      case "desktop":
      default:
        return { width: "100%", height: 600 };
    }
  };

  const dimensions = getDeviceDimensions();

  const toggleOrientation = () => {
    if (deviceType !== "desktop") {
      setOrientation((prev) =>
        prev === "portrait" ? "landscape" : "portrait",
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Simulator</CardTitle>
        <CardDescription>Test your widget on different devices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Tabs
            defaultValue="desktop"
            value={deviceType}
            onValueChange={setDeviceType}
          >
            <TabsList>
              <TabsTrigger value="desktop">
                <Monitor className="h-4 w-4 mr-1" />
                Desktop
              </TabsTrigger>
              <TabsTrigger value="tablet">
                <Tablet className="h-4 w-4 mr-1" />
                Tablet
              </TabsTrigger>
              <TabsTrigger value="mobile">
                <Smartphone className="h-4 w-4 mr-1" />
                Mobile
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {deviceType !== "desktop" && (
            <Button variant="outline" size="sm" onClick={toggleOrientation}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Rotate
            </Button>
          )}
        </div>

        <div className="flex justify-center bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
          <div
            className={`border border-slate-300 dark:border-slate-600 rounded overflow-hidden ${deviceType !== "desktop" ? "shadow-lg" : ""}`}
            style={{
              width: dimensions.width,
              height: dimensions.height,
              maxWidth: "100%",
              transition: "width 0.3s, height 0.3s",
            }}
          >
            <iframe
              src={previewUrl || "about:blank"}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Device Preview"
            />
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {deviceType !== "desktop" ? (
            <p>
              Simulating {deviceType} device in {orientation} mode
            </p>
          ) : (
            <p>Simulating desktop view</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
