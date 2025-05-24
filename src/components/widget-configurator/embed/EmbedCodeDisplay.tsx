
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Download } from 'lucide-react';

interface EmbedCodeDisplayProps {
  embedCode: string;
  embedType: string;
  widgetId: string;
  onCopy: (text: string) => void;
  onDownload: (content: string, filename: string) => void;
}

export const EmbedCodeDisplay: React.FC<EmbedCodeDisplayProps> = ({
  embedCode,
  embedType,
  widgetId,
  onCopy,
  onDownload
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="font-medium">Generated Embed Code</Label>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onCopy(embedCode)}
            className="flex items-center gap-2"
          >
            <Copy size={14} />
            Copy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDownload(embedCode, `widget-${widgetId}.${embedType === 'react' ? 'jsx' : 'html'}`)}
            className="flex items-center gap-2"
          >
            <Download size={14} />
            Download
          </Button>
        </div>
      </div>
      
      <div className="bg-slate-900 text-slate-100 p-4 rounded-md font-mono text-sm overflow-auto max-h-96">
        <pre className="whitespace-pre-wrap break-all">{embedCode}</pre>
      </div>
    </div>
  );
};
