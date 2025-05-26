import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DeviceSimulator } from "./DeviceSimulator";
import { LiveEmbedPreview } from "./LiveEmbedPreview";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { TestScenarios } from "./TestScenarios";
import { TestEnvironmentSelector } from "./TestEnvironmentSelector";
import { EmbedCodeTester } from "./EmbedCodeTester";
import { Button } from "@/components/ui/button";
import { Download, Share2, Code, Monitor, Smartphone, Wrench, HelpCircle } from "lucide-react";
import { WidgetTestingTourGuide } from "./WidgetTestingTourGuide";

interface WidgetTestingContainerProps {
    widgetId: string;
    config: any;
    initialTab?: string;
}

export function WidgetTestingContainer({
    widgetId,
    config,
    initialTab = "preview"
}: WidgetTestingContainerProps) {
    const [showTourGuide, setShowTourGuide] = useState(false);
    const [hasSeenTour, setHasSeenTour] = useState(false);
    
    // Check if user has seen the tour before
    useEffect(() => {
        const tourSeen = localStorage.getItem('widget-testing-tour-seen');
        if (tourSeen) {
            setHasSeenTour(true);
        }
    }, []);
    
    const handleCloseTour = () => {
        setShowTourGuide(false);
        localStorage.setItem('widget-testing-tour-seen', 'true');
        setHasSeenTour(true);
    };
    const [activeTab, setActiveTab] = useState(initialTab);
    const [environment, setEnvironment] = useState("development");
    const [previewUrl, setPreviewUrl] = useState(
        `https://${environment}-preview.chatadmin.com/preview/${widgetId}?t=${Date.now()}`
    );

    const handleEnvironmentChange = (env: string) => {
        setEnvironment(env);
        setPreviewUrl(
            `https://${env}-preview.chatadmin.com/preview/${widgetId}?t=${Date.now()}`
        );
    };

    // Navigation options
    const navigationTabs = [
        { id: "preview", label: "Live Preview", icon: <Monitor className="h-4 w-4 mr-2" /> },
        { id: "devices", label: "Device Testing", icon: <Smartphone className="h-4 w-4 mr-2" /> },
        { id: "embed", label: "Embed Code", icon: <Code className="h-4 w-4 mr-2" /> },
        { id: "testing", label: "Test Tools", icon: <Wrench className="h-4 w-4 mr-2" /> }
    ];

    // Generate embed code based on settings
    const generateEmbedCode = () => {
        return `<!-- AI Insight Conversations Widget -->
<script>
  (function(w, d, s) {
    // Create script element and set properties
    var j = document.createElement(s);
    j.async = true;
    j.src = 'https://${environment}.chatadmin.com/widget.js';
    
    // Initialize widget when script loads
    j.onload = function() {
      w.AIInsightWidget.init({
        widgetId: '${widgetId}',
        // Optional: Override config settings from dashboard
        config: ${JSON.stringify(config, null, 2)}
      });
    };
    
    // Insert script into DOM
    var f = d.getElementsByTagName(s)[0];
    f ? f.parentNode.insertBefore(j, f) : d.body.appendChild(j);
  })(window, document, 'script');
</script>
<!-- End AI Insight Conversations Widget -->`;
    };

    // Get URL to the custom test page
    const getTestPageUrl = () => {
        const baseUrl = window.location.origin;
        return `${baseUrl}/widget-test-page.html`;
    };

    return (
        <div className="space-y-6 widget-testing-platform">
            {showTourGuide && <WidgetTestingTourGuide onClose={handleCloseTour} />}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Widget Testing & Embed</h2>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowTourGuide(true)}
                        className="flex items-center gap-1"
                    >
                        <HelpCircle className="h-4 w-4" />
                        {hasSeenTour ? 'Show Guide' : 'Take Tour'}
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                    <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Results
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="border-b pb-2">
                            <h3 className="text-lg font-medium">Widget Testing Platform</h3>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <div className="px-6 pt-6">
                                    <TabsList className="grid grid-cols-4">
                                        {navigationTabs.map(tab => (
                                            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center">
                                                {tab.icon}
                                                {tab.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>

                                <TabsContent value="preview" className="m-0">
                                    <div className="p-6">
                                        <LiveEmbedPreview
                                            config={config}
                                            widgetId={widgetId}
                                            environment={environment}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="devices" className="m-0">
                                    <div className="p-6">
                                        <DeviceSimulator previewUrl={getTestPageUrl()} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="embed" className="m-0">
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Generated Embed Code</CardTitle>
                                                    <CardDescription>Copy this code to add the widget to your website</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="relative">
                                                        <pre className="bg-slate-900 text-white p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                                                            <code>
                                                                {generateEmbedCode()}
                                                            </code>
                                                        </pre>

                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="absolute top-2 right-2 bg-primary hover:bg-primary/90"
                                                            onClick={() => navigator.clipboard.writeText(generateEmbedCode())}
                                                        >
                                                            Copy
                                                        </Button>
                                                    </div>

                                                    <div className="mt-4">
                                                        <Button variant="outline" className="w-full" onClick={() => {
                                                            const testPageUrl = `${getTestPageUrl()}?widgetId=${widgetId}&env=${environment}`;
                                                            window.open(testPageUrl, '_blank');
                                                        }}>
                                                            Open Test Page
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            
                                            <EmbedCodeTester 
                                                widgetId={widgetId}
                                                environment={environment}
                                                config={config}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="testing" className="m-0">
                                    <div className="p-6">
                                        <TestScenarios
                                            onRunTest={(scenarioId) => console.log(`Running test: ${scenarioId}`)}
                                            previewUrl={previewUrl}
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <div className="environment-selector">
                        <TestEnvironmentSelector
                            environment={environment}
                            onEnvironmentChange={handleEnvironmentChange}
                        />
                    </div>
                    <div className="performance-metrics">
                        <PerformanceMetrics previewUrl={previewUrl} />
                    </div>
                </div>
            </div>
        </div>
    );
} 