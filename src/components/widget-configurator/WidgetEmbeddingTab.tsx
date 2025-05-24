
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { EmbedTypeSelector } from './embed/EmbedTypeSelector';
import { EmbedCodeDisplay } from './embed/EmbedCodeDisplay';
import { ConfigurationDetails } from './embed/ConfigurationDetails';
import { PrivacySettings } from './embed/PrivacySettings';
import { ImplementationGuide } from './embed/ImplementationGuide';
import { 
  generateWidgetConfig, 
  generateScriptEmbed, 
  generateIframeEmbed, 
  generateWebComponentEmbed, 
  generateReactEmbed 
} from '@/utils/embedCodeGenerator';

interface WidgetEmbeddingTabProps {
  config: {
    allowedDomains: string;
  };
  widgetId: string;
  onChange: (key: string, value: any) => void;
  fullConfig: any;
}

export const WidgetEmbeddingTab: React.FC<WidgetEmbeddingTabProps> = ({ 
  config, 
  widgetId, 
  onChange, 
  fullConfig 
}) => {
  const { toast } = useToast();
  const [embedType, setEmbedType] = useState("script");
  const [enableAnalytics, setEnableAnalytics] = useState(true);
  const [enableGDPR, setEnableGDPR] = useState(true);
  const [enableCookieConsent, setEnableCookieConsent] = useState(true);

  const privacySettings = {
    enableAnalytics,
    enableGDPR,
    enableCookieConsent
  };

  const widgetConfig = generateWidgetConfig(
    widgetId,
    fullConfig,
    privacySettings,
    config.allowedDomains
  );

  const generateEmbedCode = () => {
    switch (embedType) {
      case 'script':
        return generateScriptEmbed(widgetConfig);
      case 'iframe':
        return generateIframeEmbed(widgetConfig);
      case 'webcomponent':
        return generateWebComponentEmbed(widgetConfig);
      case 'react':
        return generateReactEmbed(widgetConfig);
      default:
        return generateScriptEmbed(widgetConfig);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard.",
      });
    });
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const embedCode = generateEmbedCode();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Production Embed Code</h3>
        <p className="text-sm text-slate-500 mb-4">Get production-ready code to embed your widget</p>
      </div>
      
      <div className="space-y-6">
        <EmbedTypeSelector 
          embedType={embedType}
          onEmbedTypeChange={setEmbedType}
        />

        <EmbedCodeDisplay
          embedCode={embedCode}
          embedType={embedType}
          widgetId={widgetId}
          onCopy={copyToClipboard}
          onDownload={downloadAsFile}
        />

        <ConfigurationDetails
          widgetId={widgetId}
          allowedDomains={config.allowedDomains}
          onAllowedDomainsChange={(value) => onChange('allowedDomains', value)}
          onCopy={copyToClipboard}
        />

        <PrivacySettings
          enableAnalytics={enableAnalytics}
          enableGDPR={enableGDPR}
          enableCookieConsent={enableCookieConsent}
          onAnalyticsChange={setEnableAnalytics}
          onGDPRChange={setEnableGDPR}
          onCookieConsentChange={setEnableCookieConsent}
        />

        <ImplementationGuide />
      </div>
    </div>
  );
};
