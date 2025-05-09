
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface WidgetBehaviorTabProps {
  config: {
    autoOpen: string;
    delay: number;
    position: string;
    animation: string;
    mobileBehavior: string;
    showAfterPageViews: number;
  };
  onChange: (key: string, value: any) => void;
}

export const WidgetBehaviorTab: React.FC<WidgetBehaviorTabProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Widget Behavior</h3>
        <p className="text-sm text-slate-500 mb-4">Configure how your widget behaves</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Auto Open</Label>
            <Select 
              value={config.autoOpen}
              onValueChange={(value) => onChange('autoOpen', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="delay">After delay</SelectItem>
                <SelectItem value="scroll">After scrolling</SelectItem>
                <SelectItem value="exit">On exit intent</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">When should the chat automatically open</p>
          </div>
          
          <div>
            <Label className="mb-2 block">Delay (seconds): {config.delay}</Label>
            <div className="pt-2 px-1">
              <Slider
                value={[config.delay]}
                max={30}
                min={1}
                step={1}
                onValueChange={(value) => onChange('delay', value[0])}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Delay before the widget appears</p>
          </div>
          
          <div>
            <Label className="mb-2 block">Position</Label>
            <Select 
              value={config.position}
              onValueChange={(value) => onChange('position', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="top-left">Top Left</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">Position of the widget on the page</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Animation</Label>
            <Select 
              value={config.animation}
              onValueChange={(value) => onChange('animation', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select animation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="slide">Slide</SelectItem>
                <SelectItem value="bounce">Bounce</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">Animation when opening/closing the widget</p>
          </div>
          
          <div>
            <Label className="mb-2 block">Mobile Behavior</Label>
            <Select 
              value={config.mobileBehavior}
              onValueChange={(value) => onChange('mobileBehavior', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select behavior" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="responsive">Responsive</SelectItem>
                <SelectItem value="fullscreen">Fullscreen</SelectItem>
                <SelectItem value="minimized">Minimized</SelectItem>
                <SelectItem value="hidden">Hidden on mobile</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">How the widget behaves on mobile devices</p>
          </div>
          
          <div>
            <Label className="mb-2 block">Show after page views: {config.showAfterPageViews}</Label>
            <div className="pt-2 px-1">
              <Slider
                value={[config.showAfterPageViews]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => onChange('showAfterPageViews', value[0])}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Number of page views before showing the widget</p>
          </div>
          
          <div className="flex items-center justify-between space-x-2 pt-2">
            <Label htmlFor="enable-sound">Enable Notification Sound</Label>
            <Switch id="enable-sound" />
          </div>
        </div>
      </div>
    </div>
  );
};
