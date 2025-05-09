
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WidgetConfig {
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    borderRadius: number;
    chatIconSize: number;
    fontFamily: string;
  };
  behavior: {
    autoOpen: string;
    delay: number;
    position: string;
    animation: string;
    mobileBehavior: string;
    showAfterPageViews: number;
  };
  content: {
    welcomeMessage: string;
    botName: string;
    inputPlaceholder: string;
    chatButtonText: string;
    headerTitle: string;
  };
}

interface WidgetPreviewProps {
  config: WidgetConfig;
}

export const WidgetPreview: React.FC<WidgetPreviewProps> = ({ config }) => {
  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h3 className="font-medium text-slate-800 flex items-center">
          Live Preview 
          <span className="ml-2 px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded-full">
            Active
          </span>
        </h3>
        <span className="text-xs text-slate-500">
          Device Preview: <strong>Desktop</strong>
        </span>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-col items-center justify-center h-[600px] bg-slate-50 rounded-md">
          <div 
            className="w-full max-w-xs h-[450px] bg-white border shadow-lg overflow-hidden relative"
            style={{ 
              borderRadius: `${config.appearance.borderRadius}px`,
              fontFamily: config.appearance.fontFamily,
            }}
          >
            <div 
              className="h-12 flex items-center px-4 justify-between" 
              style={{ backgroundColor: config.appearance.primaryColor, color: config.appearance.secondaryColor }}
            >
              <span className="font-medium">{config.content.headerTitle}</span>
              <div className="flex gap-2">
                <button className="p-1 rounded-full hover:bg-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <div className="p-4 h-[340px] bg-slate-50 overflow-y-auto flex flex-col gap-4">
              <div className="flex">
                <div className="bg-white rounded-lg p-3 shadow max-w-[80%] text-slate-800">
                  <p className="text-sm">{config.content.welcomeMessage}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div 
                  className="rounded-lg p-3 shadow max-w-[80%]"
                  style={{ backgroundColor: config.appearance.primaryColor, color: config.appearance.secondaryColor }}
                >
                  <p className="text-sm">I need help with my order</p>
                </div>
              </div>
              <div className="flex">
                <div className="bg-white rounded-lg p-3 shadow max-w-[80%] text-slate-800">
                  <p className="text-sm">I'd be happy to help with your order. Could you please provide your order number?</p>
                </div>
              </div>
            </div>
            <div className="h-14 px-3 py-2 flex items-center gap-2 border-t">
              <Input 
                placeholder={config.content.inputPlaceholder}
                className="h-9 text-sm"
              />
              <Button 
                className="h-9 w-9 p-0 rounded-full" 
                style={{ backgroundColor: config.appearance.primaryColor }}
              >
                <Send size={16} />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
          
          <div 
            className="mt-4 rounded-full shadow-lg cursor-pointer flex items-center justify-center"
            style={{ 
              backgroundColor: config.appearance.primaryColor,
              color: config.appearance.secondaryColor,
              width: `${config.appearance.chatIconSize}px`,
              height: `${config.appearance.chatIconSize}px`,
            }}
          >
            <MessageSquare size={config.appearance.chatIconSize * 0.5} />
          </div>
          
          <div className="mt-4 text-center text-xs text-slate-500">
            <p>Position: {config.behavior.position}</p>
            <p>Animation: {config.behavior.animation}</p>
            <p>Auto open: {config.behavior.autoOpen}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
