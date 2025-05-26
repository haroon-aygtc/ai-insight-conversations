/**
 * Utility functions for generating embed code for widgets
 */

// Types for widget configuration
export interface WidgetConfig {
  appearance?: {
    theme?: string;
    position?: string;
    iconStyle?: string;
    customColors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
    };
  };
  behavior?: {
    autoOpen?: boolean;
    openDelay?: number;
    persistState?: boolean;
    showNotifications?: boolean;
  };
  content?: {
    welcomeMessage?: string;
    headerText?: string;
    placeholderText?: string;
  };
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
  const configString = JSON.stringify(config);

  return `<script>
  (function(w, d) {
    var s = d.createElement('script');
    s.src = '${baseUrl}/widget/${widgetId}.js';
    s.async = true;
    s.onload = function() {
      w.ChatAdmin.init(${configString});
    };
    d.head.appendChild(s);
  })(window, document);
</script>`;
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
  const configParam = encodeURIComponent(JSON.stringify(config));

  return `<iframe
  src="${baseUrl}/embed/${widgetId}?config=${configParam}"
  width="100%"
  height="600px"
  frameborder="0"
  allow="microphone; camera"
></iframe>`;
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
  const configString = JSON.stringify(config).replace(/"/g, "&quot;");

  return `<script src="${getEnvironmentUrl(environment)}/components/chat-widget.js"></script>
<chat-widget widget-id="${widgetId}" config='${configString}'></chat-widget>`;
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
