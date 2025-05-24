
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from 'lucide-react';

interface ConfigurationDetailsProps {
  widgetId: string;
  allowedDomains: string;
  onAllowedDomainsChange: (value: string) => void;
  onCopy: (text: string) => void;
}

export const ConfigurationDetails: React.FC<ConfigurationDetailsProps> = ({
  widgetId,
  allowedDomains,
  onAllowedDomainsChange,
  onCopy
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label className="mb-2 block">Widget ID</Label>
        <div className="flex gap-2">
          <Input value={widgetId} readOnly className="font-mono text-sm" />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onCopy(widgetId)}
          >
            <Copy size={14} />
          </Button>
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">Allowed Domains</Label>
        <Input 
          placeholder="*.example.com, app.domain.com" 
          value={allowedDomains}
          onChange={(e) => onAllowedDomainsChange(e.target.value)}
        />
        <p className="text-xs text-slate-500 mt-1">Use * for all domains, or specify comma-separated domains</p>
      </div>
    </div>
  );
};
