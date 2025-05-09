
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface WidgetContentTabProps {
  config: {
    welcomeMessage: string;
    botName: string;
    inputPlaceholder: string;
    chatButtonText: string;
    headerTitle: string;
  };
  onChange: (key: string, value: any) => void;
}

export const WidgetContentTab: React.FC<WidgetContentTabProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Chat Content</h3>
        <p className="text-sm text-slate-500 mb-4">Configure messages and content settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Welcome Message</Label>
            <Textarea 
              placeholder="Enter welcome message" 
              value={config.welcomeMessage}
              onChange={(e) => onChange('welcomeMessage', e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-slate-500 mt-1">First message shown to your visitors</p>
          </div>
          
          <div>
            <Label className="mb-2 block">Input Placeholder</Label>
            <Input 
              placeholder="Enter placeholder text" 
              value={config.inputPlaceholder}
              onChange={(e) => onChange('inputPlaceholder', e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">Text shown in the chat input field</p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="show-timestamp" />
            <Label htmlFor="show-timestamp">Show message timestamps</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="enable-attachments" />
            <Label htmlFor="enable-attachments">Allow file attachments</Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Bot Name</Label>
            <Input 
              placeholder="Enter bot name" 
              value={config.botName}
              onChange={(e) => onChange('botName', e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">Name displayed for the chat assistant</p>
          </div>
          
          <div>
            <Label className="mb-2 block">Chat Button Text</Label>
            <Input 
              placeholder="Enter button text" 
              value={config.chatButtonText}
              onChange={(e) => onChange('chatButtonText', e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">Text shown on the chat button</p>
          </div>
          
          <div>
            <Label className="mb-2 block">Header Title</Label>
            <Input 
              placeholder="Enter header title" 
              value={config.headerTitle}
              onChange={(e) => onChange('headerTitle', e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">Title shown in the chat header</p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="show-avatar" defaultChecked />
            <Label htmlFor="show-avatar">Show bot avatar</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="typing-indicator" defaultChecked />
            <Label htmlFor="typing-indicator">Show typing indicator</Label>
          </div>
        </div>
      </div>
    </div>
  );
};
