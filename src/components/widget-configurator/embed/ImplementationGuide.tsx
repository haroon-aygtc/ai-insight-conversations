
import React from 'react';
import { Label } from "@/components/ui/label";
import { ExternalLink } from 'lucide-react';

export const ImplementationGuide: React.FC = () => {
  return (
    <div className="border rounded-lg p-4">
      <Label className="font-medium mb-3 block flex items-center gap-2">
        <ExternalLink size={16} />
        Implementation Guide
      </Label>
      <div className="space-y-3 text-sm text-slate-600">
        <div>
          <strong>Step 1:</strong> Copy the embed code above
        </div>
        <div>
          <strong>Step 2:</strong> Paste it into your website's HTML before the closing &lt;/body&gt; tag
        </div>
        <div>
          <strong>Step 3:</strong> Test the widget on your website
        </div>
        <div>
          <strong>Step 4:</strong> Configure domain restrictions if needed
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
        <strong>💡 Pro Tip:</strong> Use the Script Tag method for best performance and full feature support.
      </div>
    </div>
  );
};
