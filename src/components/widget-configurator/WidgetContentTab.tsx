
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WidgetContentTabProps {
  config: {
    welcomeMessage: string;
    botName: string;
    inputPlaceholder: string;
    chatButtonText: string;
    headerTitle: string;
    enablePreChatForm: boolean;
    preChatFormFields: string[];
    preChatFormRequired: boolean;
    enableFeedback: boolean;
    feedbackPosition: string;
  };
  onChange: (key: string, value: any) => void;
}

export const WidgetContentTab: React.FC<WidgetContentTabProps> = ({ config, onChange }) => {
  const handlePreChatFieldToggle = (field: string, checked: boolean) => {
    const currentFields = config.preChatFormFields || [];
    let newFields;
    
    if (checked) {
      newFields = [...currentFields, field];
    } else {
      newFields = currentFields.filter(f => f !== field);
    }
    
    onChange('preChatFormFields', newFields);
  };

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
          
          {/* Pre-Chat Form Section */}
          <div className="border rounded-lg p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-medium">Pre-Chat Form</Label>
              <Switch 
                checked={config.enablePreChatForm}
                onCheckedChange={(checked) => onChange('enablePreChatForm', checked)}
              />
            </div>
            
            {config.enablePreChatForm && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Form Fields</Label>
                  <div className="space-y-2">
                    {['name', 'email', 'phone', 'company', 'message'].map((field) => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`field-${field}`}
                          checked={config.preChatFormFields?.includes(field)}
                          onCheckedChange={(checked) => handlePreChatFieldToggle(field, checked as boolean)}
                        />
                        <Label htmlFor={`field-${field}`} className="capitalize text-sm">
                          {field}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="form-required"
                    checked={config.preChatFormRequired}
                    onCheckedChange={(checked) => onChange('preChatFormRequired', checked)}
                  />
                  <Label htmlFor="form-required" className="text-sm">Make form required</Label>
                </div>
              </div>
            )}
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
          
          {/* Feedback Section */}
          <div className="border rounded-lg p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-medium">Feedback System</Label>
              <Switch 
                checked={config.enableFeedback}
                onCheckedChange={(checked) => onChange('enableFeedback', checked)}
              />
            </div>
            
            {config.enableFeedback && (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm mb-2 block">Feedback Position</Label>
                  <RadioGroup 
                    value={config.feedbackPosition}
                    onValueChange={(value) => onChange('feedbackPosition', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="after-bot" id="after-bot" />
                      <Label htmlFor="after-bot" className="text-sm">After bot messages</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="end-chat" id="end-chat" />
                      <Label htmlFor="end-chat" className="text-sm">At end of chat</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
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
