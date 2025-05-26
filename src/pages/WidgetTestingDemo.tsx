import React, { useState } from "react";
import { WidgetTestingContainer } from "@/components/widget-configurator/testing";

export default function WidgetTestingDemo() {
    // Sample widget configuration
    const [widgetConfig, setWidgetConfig] = useState({
        appearance: {
            primaryColor: "#3b82f6",
            secondaryColor: "#eff6ff",
            textColor: "#1e293b",
            borderRadius: 12,
            shadow: "md",
            darkMode: false,
            glassmorphism: false
        },
        behavior: {
            position: "bottom-right",
            showOnLoad: false,
            showAfterSeconds: 5,
            showAfterScroll: 50,
            showOnExit: false,
            showOnPages: ["*"],
            hideOnPages: []
        },
        content: {
            headerTitle: "Chat with us",
            headerSubtitle: "We typically reply within minutes",
            welcomeMessage: "Hi there! How can I help you today?",
            inputPlaceholder: "Type your message...",
            botAvatar: null
        }
    });

    // Sample widget ID
    const widgetId = "demo_widget_123";

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Widget Testing & Embedding</h1>

            <WidgetTestingContainer
                widgetId={widgetId}
                config={widgetConfig}
                initialTab="preview"
            />
        </div>
    );
} 