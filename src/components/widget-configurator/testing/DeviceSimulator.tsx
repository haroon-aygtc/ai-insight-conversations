
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Tablet, Monitor } from 'lucide-react';

interface DeviceSimulatorProps {
  config: any;
  widgetId: string;
  selectedDevice: string;
  onDeviceChange: (device: string) => void;
}

const devices = [
  {
    id: 'mobile',
    name: 'Mobile',
    icon: Smartphone,
    width: 375,
    height: 667,
    description: 'iPhone SE'
  },
  {
    id: 'tablet',
    name: 'Tablet',
    icon: Tablet,
    width: 768,
    height: 1024,
    description: 'iPad'
  },
  {
    id: 'desktop',
    name: 'Desktop',
    icon: Monitor,
    width: 1200,
    height: 800,
    description: '1200px wide'
  }
];

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  config,
  widgetId,
  selectedDevice,
  onDeviceChange
}) => {
  const currentDevice = devices.find(d => d.id === selectedDevice) || devices[2];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Device Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            {devices.map((device) => (
              <Button
                key={device.id}
                variant={selectedDevice === device.id ? "default" : "outline"}
                onClick={() => onDeviceChange(device.id)}
                className="flex items-center gap-2"
              >
                <device.icon size={16} />
                {device.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Badge variant="outline">
              {currentDevice.width} × {currentDevice.height}
            </Badge>
            <span className="text-sm text-gray-600">{currentDevice.description}</span>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 overflow-auto">
            <div 
              className="bg-white border rounded-lg shadow-lg mx-auto relative overflow-hidden"
              style={{ 
                width: `${currentDevice.width}px`, 
                height: `${currentDevice.height}px`,
                maxWidth: '100%'
              }}
            >
              {/* Device Frame */}
              <div className="absolute inset-0 p-4">
                <div className="h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded overflow-hidden relative">
                  {/* Simulated website content */}
                  <div className="p-4 space-y-4">
                    <div className="h-6 bg-white rounded shadow-sm"></div>
                    <div className="h-3 bg-white rounded w-3/4 shadow-sm"></div>
                    <div className="h-3 bg-white rounded w-1/2 shadow-sm"></div>
                    <div className="h-20 bg-white rounded shadow-sm"></div>
                  </div>

                  {/* Widget Preview */}
                  <div className={`absolute ${
                    config.behavior?.position === 'bottom-left' ? 'bottom-4 left-4' :
                    config.behavior?.position === 'top-right' ? 'top-4 right-4' :
                    config.behavior?.position === 'top-left' ? 'top-4 left-4' :
                    'bottom-4 right-4'
                  }`}>
                    <div 
                      className="rounded-full shadow-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: config.appearance?.primaryColor || '#6366f1',
                        width: `${Math.min(config.appearance?.chatIconSize || 50, currentDevice.width * 0.15)}px`,
                        height: `${Math.min(config.appearance?.chatIconSize || 50, currentDevice.width * 0.15)}px`,
                      }}
                    >
                      <svg 
                        width={Math.min((config.appearance?.chatIconSize || 50) * 0.5, currentDevice.width * 0.075)} 
                        height={Math.min((config.appearance?.chatIconSize || 50) * 0.5, currentDevice.width * 0.075)} 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="2"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Device-Specific Considerations</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {selectedDevice === 'mobile' && (
                <>
                  <li>• Widget should be easily tappable (minimum 44px)</li>
                  <li>• Consider mobile keyboard overlap</li>
                  <li>• Test portrait and landscape orientations</li>
                </>
              )}
              {selectedDevice === 'tablet' && (
                <>
                  <li>• Widget positioning should work in both orientations</li>
                  <li>• Consider larger screen real estate</li>
                  <li>• Test with touch interactions</li>
                </>
              )}
              {selectedDevice === 'desktop' && (
                <>
                  <li>• Widget should not interfere with scrollbars</li>
                  <li>• Consider hover states and mouse interactions</li>
                  <li>• Test with different browser zoom levels</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
