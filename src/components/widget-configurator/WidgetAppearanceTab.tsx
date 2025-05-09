
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface WidgetAppearanceTabProps {
  config: {
    primaryColor: string;
    secondaryColor: string;
    borderRadius: number;
    chatIconSize: number;
    fontFamily: string;
  };
  onChange: (key: string, value: any) => void;
}

export const WidgetAppearanceTab: React.FC<WidgetAppearanceTabProps> = ({ config, onChange }) => {
  // Color options
  const colorOptions = [
    { color: "#6366f1", class: "bg-indigo-500" },
    { color: "#10b981", class: "bg-green-500" },
    { color: "#ef4444", class: "bg-red-500" },
    { color: "#f97316", class: "bg-orange-500" },
    { color: "#8b5cf6", class: "bg-purple-500" },
    { color: "#000000", class: "bg-black" },
    { color: "#7e22ce", class: "bg-violet-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Visual Style</h3>
        <p className="text-sm text-slate-500 mb-4">Customize how your chat widget looks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Primary Color</Label>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.color}
                    className={`w-8 h-8 rounded-full ${opt.class} transition-transform hover:scale-110 ${
                      config.primaryColor === opt.color ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                    }`}
                    onClick={() => onChange('primaryColor', opt.color)}
                    aria-label={`Select ${opt.color} as primary color`}
                  />
                ))}
                <div className="relative w-8 h-8">
                  <Input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => onChange('primaryColor', e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0"
                  />
                  <div 
                    className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <span className="sr-only">Custom color</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">This color will be used for the chat header and buttons</p>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Secondary Color</Label>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.color}
                    className={`w-8 h-8 rounded-full ${opt.class} transition-transform hover:scale-110 ${
                      config.secondaryColor === opt.color ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                    }`}
                    onClick={() => onChange('secondaryColor', opt.color)}
                    aria-label={`Select ${opt.color} as secondary color`}
                  />
                ))}
                <button
                  className={`w-8 h-8 rounded-full bg-white border border-slate-300 transition-transform hover:scale-110 ${
                    config.secondaryColor === '#ffffff' ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                  }`}
                  onClick={() => onChange('secondaryColor', '#ffffff')}
                  aria-label="Select white as secondary color"
                />
                <div className="relative w-8 h-8">
                  <Input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => onChange('secondaryColor', e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0"
                  />
                  <div 
                    className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center"
                    style={{ backgroundColor: config.secondaryColor }}
                  >
                    <span className="sr-only">Custom color</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">Used for backgrounds and secondary elements</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Font Family</Label>
            <Select 
              value={config.fontFamily}
              onValueChange={(value) => onChange('fontFamily', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="opensans">Open Sans</SelectItem>
                <SelectItem value="lato">Lato</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">Choose a font for your chat widget</p>
          </div>
          
          <div>
            <Label className="mb-2 block">Border Radius: {config.borderRadius}px</Label>
            <div className="pt-2 px-1">
              <Slider
                value={[config.borderRadius]}
                max={20}
                min={0}
                step={1}
                onValueChange={(value) => onChange('borderRadius', value[0])}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Adjust the roundness of corners</p>
          </div>
          
          <div>
            <Label className="mb-2 block">Chat Icon Size: {config.chatIconSize}px</Label>
            <div className="pt-2 px-1">
              <Slider
                value={[config.chatIconSize]}
                max={60}
                min={20}
                step={1}
                onValueChange={(value) => onChange('chatIconSize', value[0])}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Size of the chat button when minimized</p>
          </div>
        </div>
      </div>
    </div>
  );
};
