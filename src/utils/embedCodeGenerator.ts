/**
 * Utility functions for generating embed code for widgets
 */

// Types for widget configuration
export interface WidgetConfig {
  appearance?: {
    theme?: string;
    position?: string;
    iconStyle?: string;
    primaryColor?: string;
    secondaryColor?: string;
    borderRadius?: number;
    chatIconSize?: number;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    textColor?: string;
    headerTextColor?: string;
    gradientEnabled?: boolean;
    shadowIntensity?: number;
    backgroundOpacity?: number;
    headerStyle?: string;
    buttonStyle?: string;
    animationStyle?: string;
    customColors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
    };
  };
  behavior?: {
    autoOpen?: string | boolean;
    delay?: number;
    openDelay?: number;
    position?: string;
    animation?: string;
    mobileBehavior?: string;
    showAfterPageViews?: number;
    persistState?: boolean;
    showNotifications?: boolean;
  };
  content?: {
    welcomeMessage?: string;
    botName?: string;
    inputPlaceholder?: string;
    chatButtonText?: string;
    headerTitle?: string;
    headerText?: string;
    placeholderText?: string;
    enablePreChatForm?: boolean;
    preChatFormFields?: Array<any>;
    preChatFormTitle?: string;
    preChatFormSubtitle?: string;
    enableFeedback?: boolean;
    feedbackPosition?: string;
    feedbackOptions?: Array<any>;
    showTypingIndicator?: boolean;
    showAvatar?: boolean;
    showTimestamps?: boolean;
    enableAttachments?: boolean;
  };
  embedding?: {
    allowedDomains?: string;
    enableAnalytics?: boolean;
    gdprCompliance?: boolean;
    widgetId?: string;
  };
  // Additional metadata fields
  widgetId?: string;
  allowedDomains?: string;
  isActive?: boolean;
  isPublished?: boolean;
  widgetName?: string;
  lastUpdated?: string;
}

/**
 * Generate script embed code for the widget
 * @param widgetId - The unique ID of the widget
 * @param config - Widget configuration options
 * @param environment - The environment (production, staging, development)
 * @returns The script tag HTML as a string
 */
export const generateScriptEmbed = (
  widgetId: string,
  config: WidgetConfig = {},
  environment = "production",
): string => {
  const baseUrl = getEnvironmentUrl(environment);

  // Create a deep copy of the config to avoid reference issues
  const configCopy = JSON.parse(JSON.stringify(config));

  // Ensure all required configuration sections exist
  configCopy.appearance = configCopy.appearance || {};
  configCopy.behavior = configCopy.behavior || {};
  configCopy.content = configCopy.content || {};

  // Add widget ID to the config for tracking
  configCopy.widgetId = widgetId;

  // Stringify with minimal whitespace for production
  const configString = JSON.stringify(configCopy, null, 0);

  return `<!-- AI Insight Conversations Widget -->
<script>
  (function(w, d) {
    // Create script element with error handling
    var s = d.createElement('script');
    s.src = '${baseUrl}/widget/${widgetId}.js';
    s.async = true;
    s.defer = true; // Improve page load performance
    
    // Handle loading errors
    s.onerror = function() {
      console.warn('Failed to load AI Insight widget. Please check your connection or widget ID.');
    };
    
    // Initialize widget when script loads
    s.onload = function() {
      try {
        w.ChatAdmin.init(${configString});
      } catch(e) {
        console.error('Error initializing AI Insight widget:', e);
      }
    };
    
    // Insert script into DOM
    d.head.appendChild(s);
  })(window, document);
</script>
<!-- End AI Insight Conversations Widget -->`;
};

/**
 * Generate iframe embed code for the widget
 * @param widgetId - The unique ID of the widget
 * @param config - Widget configuration options
 * @param environment - The environment (production, staging, development)
 * @returns The iframe HTML as a string
 */
export const generateIframeEmbed = (
  widgetId: string,
  config: WidgetConfig = {},
  environment = "production",
): string => {
  const baseUrl = getEnvironmentUrl(environment);

  // Create a deep copy of the config to avoid reference issues
  const configCopy = JSON.parse(JSON.stringify(config));

  // Ensure all required configuration sections exist
  configCopy.appearance = configCopy.appearance || {};
  configCopy.behavior = configCopy.behavior || {};
  configCopy.content = configCopy.content || {};

  // Add widget ID to the config for tracking
  configCopy.widgetId = widgetId;

  const configParam = encodeURIComponent(JSON.stringify(configCopy));

  // Determine responsive height based on config
  const isMobileOptimized =
    configCopy.behavior?.mobileBehavior === "fullscreen" ||
    configCopy.behavior?.mobileBehavior === "responsive";
  const heightStyle = isMobileOptimized
    ? "height: 600px; min-height: 400px; max-height: 90vh;"
    : "height: 600px; min-height: 400px;";

  return `<!-- AI Insight Conversations Widget (iframe) -->
<iframe
  src="${baseUrl}/embed/${widgetId}?config=${configParam}"
  title="AI Insight Chat Widget"
  width="100%"
  height="600px"
  style="border: none; max-width: 100%; ${heightStyle}"
  loading="lazy"
  allow="microphone; camera"
  referrerpolicy="no-referrer-when-downgrade"
></iframe>
<!-- End AI Insight Conversations Widget -->`;
};

/**
 * Generate web component embed code for the widget
 * @param widgetId - The unique ID of the widget
 * @param config - Widget configuration options
 * @param environment - The environment (production, staging, development)
 * @returns The web component HTML as a string
 */
export const generateWebComponentEmbed = (
  widgetId: string,
  config: WidgetConfig = {},
  environment = "production",
): string => {
  // Create a deep copy of the config to avoid reference issues
  const configCopy = JSON.parse(JSON.stringify(config));

  // Ensure all required configuration sections exist
  configCopy.appearance = configCopy.appearance || {};
  configCopy.behavior = configCopy.behavior || {};
  configCopy.content = configCopy.content || {};

  // Add widget ID to the config for tracking
  configCopy.widgetId = widgetId;

  // Escape quotes for HTML attribute
  const configString = JSON.stringify(configCopy).replace(/"/g, "&quot;");
  const baseUrl = getEnvironmentUrl(environment);

  // Extract theme for potential fallback styling
  const theme = configCopy.appearance?.theme || "light";
  const primaryColor =
    configCopy.appearance?.customColors?.primary || "#3b82f6";

  return `<!-- AI Insight Conversations Widget (web component) -->
<script src="${baseUrl}/components/chat-widget.js" async defer></script>
<chat-widget 
  widget-id="${widgetId}" 
  config='${configString}'
  theme="${theme}"
  primary-color="${primaryColor}"
  fallback-text="Loading AI chat widget..."
></chat-widget>
<!-- End AI Insight Conversations Widget -->`;
};

/**
 * Generate a one-line snippet for non-technical users
 * @param widgetId - The unique ID of the widget
 * @param environment - The environment (production, staging, development)
 * @param config - Widget configuration options (optional for one-line embed)
 * @returns A simple one-line script tag
 */
export const generateOneLineEmbed = (
  widgetId: string,
  environment = "production",
  config: WidgetConfig = {},
): string => {
  const baseUrl = getEnvironmentUrl(environment);

  // For one-line embed, we can optionally pass minimal config as URL params
  let configParams = "";

  // Only add essential config parameters that might be needed before full script loads
  if (config.appearance?.position) {
    configParams += `&position=${config.appearance.position}`;
  }

  if (config.appearance?.theme) {
    configParams += `&theme=${config.appearance.theme}`;
  }

  return `<script src="${baseUrl}/widget/embed.js?id=${widgetId}${configParams}" async></script>`;
};

/**
 * Generate NPM/Yarn installation command for the widget
 * @param widgetId - The unique ID of the widget
 * @param config - Widget configuration options
 * @returns The installation and usage instructions
 */
export const generateNpmInstallCommand = (
  widgetId: string,
  config: WidgetConfig = {},
): string => {
  // Create a deep copy of the config to avoid reference issues
  const configCopy = JSON.parse(JSON.stringify(config));

  // Ensure all required configuration sections exist
  configCopy.appearance = configCopy.appearance || {};
  configCopy.behavior = configCopy.behavior || {};
  configCopy.content = configCopy.content || {};

  // Format the config for display in code example
  const configString = JSON.stringify(configCopy, null, 2)
    .split("\n")
    .map((line) => "  " + line) // Add extra indentation for code example
    .join("\n");

  return `# Install the package
npm install ai-insight-widget

# In your JavaScript/TypeScript file
import { initWidget } from 'ai-insight-widget';

// Initialize with widget ID and configuration
initWidget('${widgetId}', ${configString});

// For React applications
import { ChatWidget } from 'ai-insight-widget/react';

function MyComponent() {
  return <ChatWidget widgetId="${widgetId}" config={${configString}} />;
}`;
};

/**
 * Generate a configuration object for the widget
 * @param config - Widget configuration options
 * @returns The stringified configuration object
 */
export const generateWidgetConfig = (config: WidgetConfig = {}): string => {
  return JSON.stringify(config, null, 2);
};

/**
 * Get the base URL for the specified environment
 * @param environment - The environment (production, staging, development)
 * @returns The base URL for the environment
 */
const getEnvironmentUrl = (environment: string): string => {
  switch (environment) {
    case "production":
      return "https://api.chatadmin.com";
    case "staging":
      return "https://staging-api.chatadmin.com";
    case "development":
    default:
      return "https://dev-api.chatadmin.com";
  }
};

/**
 * Validate widget configuration
 * @param config - Widget configuration to validate
 * @returns An object with validation result and any error messages
 */
export const validateWidgetConfig = (
  config: WidgetConfig,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check for required fields or invalid values
  if (
    config.appearance?.position &&
    !["bottom-right", "bottom-left", "top-right", "top-left"].includes(
      config.appearance.position,
    )
  ) {
    errors.push(
      "Invalid position value. Must be one of: bottom-right, bottom-left, top-right, top-left",
    );
  }

  if (
    config.behavior?.openDelay !== undefined &&
    (typeof config.behavior.openDelay !== "number" ||
      config.behavior.openDelay < 0)
  ) {
    errors.push("Open delay must be a non-negative number");
  }

  // Add more validation rules as needed

  return {
    isValid: errors.length === 0,
    errors,
  };
};
