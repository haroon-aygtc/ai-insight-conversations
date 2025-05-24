
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface EmbedTypeSelectorProps {
  embedType: string;
  onEmbedTypeChange: (type: string) => void;
}

export const EmbedTypeSelector: React.FC<EmbedTypeSelectorProps> = ({
  embedType,
  onEmbedTypeChange
}) => {
  return (
    <div>
      <Label className="mb-3 block font-medium">Integration Method</Label>
      <Tabs value={embedType} onValueChange={onEmbedTypeChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="script">Script Tag</TabsTrigger>
          <TabsTrigger value="iframe">iframe</TabsTrigger>
          <TabsTrigger value="webcomponent">Web Component</TabsTrigger>
          <TabsTrigger value="react">React</TabsTrigger>
        </TabsList>
        
        <div className="mt-4 space-y-4">
          <TabsContent value="script" className="mt-0">
            <div className="text-sm text-slate-600 mb-3">
              <strong>Recommended:</strong> Self-contained JavaScript that creates the widget directly on your page.
              <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                <li>No external dependencies</li>
                <li>Fastest loading time</li>
                <li>Full customization support</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="iframe" className="mt-0">
            <div className="text-sm text-slate-600 mb-3">
              <strong>Secure:</strong> Widget loads in an isolated iframe for maximum security.
              <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                <li>Complete isolation from parent page</li>
                <li>GDPR compliant by default</li>
                <li>Easy to implement</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="webcomponent" className="mt-0">
            <div className="text-sm text-slate-600 mb-3">
              <strong>Modern:</strong> Uses Web Components standard for clean integration.
              <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                <li>Clean HTML syntax</li>
                <li>Framework agnostic</li>
                <li>Encapsulated styling</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="react" className="mt-0">
            <div className="text-sm text-slate-600 mb-3">
              <strong>React:</strong> Native React component for React applications.
              <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                <li>TypeScript support</li>
                <li>React hooks integration</li>
                <li>SSR compatible</li>
              </ul>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
