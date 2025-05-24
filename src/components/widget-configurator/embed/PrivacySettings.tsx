
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PrivacySettingsProps {
  enableAnalytics: boolean;
  enableGDPR: boolean;
  enableCookieConsent: boolean;
  onAnalyticsChange: (checked: boolean) => void;
  onGDPRChange: (checked: boolean) => void;
  onCookieConsentChange: (checked: boolean) => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  enableAnalytics,
  enableGDPR,
  enableCookieConsent,
  onAnalyticsChange,
  onGDPRChange,
  onCookieConsentChange
}) => {
  return (
    <div className="border rounded-lg p-4 bg-slate-50">
      <Label className="font-medium mb-3 block">Privacy & Compliance</Label>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="enable-analytics" 
            checked={enableAnalytics}
            onCheckedChange={(checked) => onAnalyticsChange(checked === true)}
          />
          <Label htmlFor="enable-analytics" className="text-sm">Enable user analytics</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="gdpr-compliance" 
            checked={enableGDPR}
            onCheckedChange={(checked) => onGDPRChange(checked === true)}
          />
          <Label htmlFor="gdpr-compliance" className="text-sm">Enable GDPR compliance features</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="cookie-consent" 
            checked={enableCookieConsent}
            onCheckedChange={(checked) => onCookieConsentChange(checked === true)}
          />
          <Label htmlFor="cookie-consent" className="text-sm">Show cookie consent message</Label>
        </div>
      </div>
    </div>
  );
};
