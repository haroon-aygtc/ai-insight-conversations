import apiService from './api';
import formTemplateService from './formTemplateService';

/**
 * Widget interface
 */
export interface Widget {
  id: string | number;
  widget_id: string;
  name: string;
  description: string;
  is_active: boolean;
  is_published: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  appearance_config: {
    primaryColor: string;
    secondaryColor: string;
    borderRadius: number;
    chatIconSize: number;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    textColor: string;
    headerTextColor: string;
    theme: string;
    iconStyle: string;
    customCSS: string;
    [key: string]: any;
  };
  behavior_config: {
    autoOpen: string;
    delay: number;
    position: string;
    animation: string;
    mobileBehavior: string;
    showAfterPageViews: number;
    persistState: boolean;
    showNotifications: boolean;
    [key: string]: any;
  };
  content_config: {
    welcomeMessage: string;
    botName: string;
    inputPlaceholder: string;
    chatButtonText: string;
    headerTitle: string;
    enablePreChatForm: boolean;
    preChatFormFields: Array<any>;
    preChatFormTitle: string;
    preChatFormSubtitle: string;
    enablePostChatForm: boolean;
    postChatFormFields: Array<any>;
    postChatFormTitle: string;
    postChatFormSubtitle: string;
    enableFeedback: boolean;
    feedbackPosition: string;
    feedbackOptions: Array<any>;
    showTypingIndicator: boolean;
    showAvatar: boolean;
    [key: string]: any;
  };
  embedding_config: {
    allowedDomains: string;
    enableAnalytics: boolean;
    gdprCompliance: boolean;
    widgetId?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Widget data for creating or updating
 */
export interface WidgetData {
  name: string;
  description?: string;
  appearance_config?: Partial<Widget['appearance_config']>;
  behavior_config?: Partial<Widget['behavior_config']>;
  content_config?: Partial<Widget['content_config']>;
  embedding_config?: Partial<Widget['embedding_config']>;
  is_active?: boolean;
}

/**
 * Widget service for interacting with the widget API
 */
/**
 * Maximum recommended size for form field arrays
 */
const MAX_FORM_FIELDS = 20;

/**
 * Maximum length for individual form field values
 */
const MAX_FIELD_VALUE_LENGTH = 500;

export const widgetService = {
    /**
     * Load a form template and apply it to widget content configuration
     * @param widgetData Widget data to update
     * @param templateId Template ID to load
     * @param formType Type of form ('preChatForm', 'postChatForm', 'feedback')
     * @returns Updated widget data with template fields
     */
    async loadFormTemplate(widgetData: WidgetData, templateId: number, formType: 'preChatForm' | 'postChatForm' | 'feedback'): Promise<WidgetData> {
        try {
            // Clone the widget data to avoid modifying the original
            const updatedWidgetData = JSON.parse(JSON.stringify(widgetData));
            
            // Ensure content_config exists
            if (!updatedWidgetData.content_config) {
                updatedWidgetData.content_config = {};
            }
            
            // Get the template
            const template = await formTemplateService.getTemplate(templateId);
            
            // Apply template fields based on form type
            switch (formType) {
                case 'preChatForm':
                    updatedWidgetData.content_config.enablePreChatForm = true;
                    updatedWidgetData.content_config.preChatFormFields = template.fields;
                    updatedWidgetData.content_config.preChatFormTitle = template.name;
                    updatedWidgetData.content_config.preChatFormSubtitle = template.description || '';
                    break;
                    
                case 'postChatForm':
                    updatedWidgetData.content_config.enablePostChatForm = true;
                    updatedWidgetData.content_config.postChatFormFields = template.fields;
                    updatedWidgetData.content_config.postChatFormTitle = template.name;
                    updatedWidgetData.content_config.postChatFormSubtitle = template.description || '';
                    break;
                    
                case 'feedback':
                    updatedWidgetData.content_config.enableFeedback = true;
                    updatedWidgetData.content_config.feedbackOptions = template.fields;
                    updatedWidgetData.content_config.feedbackPosition = 'after-bot';
                    break;
            }
            
            // Sanitize form fields to prevent issues with large payloads
            return this.sanitizeFormFields(updatedWidgetData);
        } catch (error) {
            console.error(`Error loading form template (ID: ${templateId}):`, error);
            throw error;
        }
    },
    
    /**
     * Load the default form template for a specific form type
     * @param widgetData Widget data to update
     * @param formType Type of form ('preChatForm', 'postChatForm', 'feedback')
     * @returns Updated widget data with default template fields
     */
    async loadDefaultFormTemplate(widgetData: WidgetData, formType: 'preChatForm' | 'postChatForm' | 'feedback'): Promise<WidgetData> {
        try {
            // Map form type to template type
            const templateType = formType === 'preChatForm' ? 'pre_chat' : 
                               formType === 'postChatForm' ? 'post_chat' : 'feedback';
            
            // Get the default template for this type
            const template = await formTemplateService.getDefaultTemplate(templateType);
            
            if (!template) {
                console.warn(`No default template found for type: ${templateType}`);
                return widgetData;
            }
            
            // Load the template
            return this.loadFormTemplate(widgetData, template.id, formType);
        } catch (error) {
            console.error(`Error loading default form template for ${formType}:`, error);
            return widgetData; // Return original data if template loading fails
        }
    },
    /**
     * Get all widgets for the authenticated user
     * @returns Array of Widget objects
     */
    async getWidgets(): Promise<Widget[]> {
        try {
            const response = await apiService.get('/widgets');
            // Handle different response structures
            const responseData = response.data as any;
            
            if (responseData && Array.isArray(responseData)) {
                return responseData as Widget[];
            } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
                // API might return { data: [...widgets] }
                return responseData.data as Widget[];
            } else {
                console.warn('Unexpected response format from widgets API:', response);
                return [];
            }
        } catch (error) {
            console.error('Error fetching widgets:', error);
            // Return empty array instead of throwing to prevent UI errors
            return [];
        }
    },

    /**
     * Get a widget by ID
     * @param id Widget ID
     * @returns Widget object
     * @throws Error if widget not found or other API errors
     */
    async getWidget(id: string): Promise<Widget> {
        try {
            const response = await apiService.get(`/widgets/${id}`);
            // Handle different response structures
            const responseData = response.data as any;
            
            if (responseData && !responseData.data) {
                return responseData as Widget;
            } else if (responseData && responseData.data) {
                // API might return { data: {...widget} }
                return responseData.data as Widget;
            } else {
                console.warn(`Unexpected response format from widget API for ID ${id}:`, response);
                throw new Error(`Invalid widget data format for ID ${id}`);
            }
        } catch (error) {
            // Check if it's a 404 Not Found error
            if (error.response && error.response.status === 404) {
                console.error(`Widget not found with ID ${id}`);
                const notFoundError: any = new Error(`Widget not found with ID ${id}`);
                notFoundError.response = error.response;
                notFoundError.isWidgetNotFound = true;
                throw notFoundError;
            }
            
            console.error(`Error fetching widget ${id}:`, error);
            throw error;
        }
    },

    /**
     * Create a new widget
     * @param widgetData Widget data to create
     * @returns Created Widget object
     */
    async createWidget(widgetData: WidgetData): Promise<Widget> {
        try {
            // Validate required fields before sending to API
            if (!widgetData.name) {
                const error: any = new Error('Widget name is required');
                error.response = {
                    data: {
                        errors: {
                            name: ['Widget name is required']
                        }
                    }
                };
                throw error;
            }

            // Ensure numeric fields are actually numbers
            this.validateNumericFields(widgetData);
            
            // Sanitize form fields to prevent issues with large payloads
            this.sanitizeFormFields(widgetData);
            
            try {
                const response = await apiService.post<Widget>('/widgets', widgetData);
                return response.data;
            } catch (error) {
                // Handle authentication errors
                if (error.isAuthError) {
                    // Redirect to login page with return URL
                    const returnUrl = encodeURIComponent(window.location.pathname);
                    window.location.href = `/login?returnUrl=${returnUrl}`;
                    // Throw a more descriptive error
                    throw new Error('Authentication error: Please log in to continue');
                }
                throw error;
            }
        } catch (error) {
            console.error('Error creating widget:', error);
            throw error;
        }
    },

    /**
     * Update a widget
     * @param id Widget ID
     * @param widgetData Widget data to update
     * @returns Updated Widget object
     */
    async updateWidget(id: string, widgetData: WidgetData): Promise<Widget> {
        try {
            // Validate required fields before sending to API
            if (widgetData.name !== undefined && !widgetData.name) {
                const error: any = new Error('Widget name is required');
                error.response = {
                    data: {
                        errors: {
                            name: ['Widget name is required']
                        }
                    }
                };
                throw error;
            }

            // Ensure numeric fields are actually numbers
            this.validateNumericFields(widgetData);
            
            // Check for large form configurations that might cause issues
            this.sanitizeFormFields(widgetData);
            
            // Log the size of the payload for debugging
            const payloadSize = JSON.stringify(widgetData).length;
            console.log(`Widget update payload size: ${payloadSize} bytes`);
            
            // Add a small delay before large requests to ensure session is ready
            if (payloadSize > 10000) {
                console.log('Large widget payload detected, adding delay for session stability');
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            try {
                const response = await apiService.put<Widget>(`/widgets/${id}`, widgetData);
                return response.data;
            } catch (error) {
                // Handle authentication errors
                if (error.isAuthError) {
                    // Redirect to login page with return URL
                    const returnUrl = encodeURIComponent(window.location.pathname);
                    window.location.href = `/login?returnUrl=${returnUrl}`;
                    // Throw a more descriptive error
                    throw new Error('Authentication error: Please log in to continue');
                }
                throw error;
            }
        } catch (error) {
            console.error(`Error updating widget ${id}:`, error);
            
            // Provide more helpful error messages for specific issues
            if (error.response?.status === 401) {
                console.error('Authentication error while saving widget. Refreshing session...');
                // Try to refresh the session
                await apiService.getCsrfToken(true);
            }
            
            throw error;
        }
    },

    /**
     * Delete a widget
     * @param id Widget ID
     * @returns Response data
     */
    async deleteWidget(id: string): Promise<{message: string}> {
        try {
            const response = await apiService.delete<{message: string}>(`/widgets/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting widget ${id}:`, error);
            throw error;
        }
    },

    /**
     * Publish a widget
     * @param id Widget ID
     * @returns Updated Widget object
     */
    async publishWidget(id: string): Promise<Widget> {
        try {
            const response = await apiService.post<Widget>(`/widgets/${id}/publish`);
            return response.data;
        } catch (error) {
            console.error(`Error publishing widget ${id}:`, error);
            throw error;
        }
    },

    /**
     * Unpublish a widget
     * @param id Widget ID
     * @returns Updated Widget object
     */
    async unpublishWidget(id: string): Promise<Widget> {
        try {
            const response = await apiService.post<Widget>(`/widgets/${id}/unpublish`);
            return response.data;
        } catch (error) {
            console.error(`Error unpublishing widget ${id}:`, error);
            throw error;
        }
    },

    /**
     * Duplicate a widget
     * @param id Widget ID
     * @returns Duplicated Widget object
     */
    async duplicateWidget(id: string | number): Promise<Widget> {
        try {
            const response = await apiService.post<Widget>(`/widgets/${id}/duplicate`);
            return response.data;
        } catch (error) {
            console.error(`Error duplicating widget ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get widget embed code
     * @param id Widget ID
     * @returns Embed code data
     */
    async getWidgetEmbedCode(id: string): Promise<{embed_code: string}> {
        try {
            const response = await apiService.get<{embed_code: string}>(`/widgets/${id}/embed-code`);
            return response.data;
        } catch (error) {
            console.error(`Error getting embed code for widget ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get widget analytics
     * @param id Widget ID
     * @param params Query parameters
     * @returns Analytics data
     */
    async getWidgetAnalytics(id: string, params: Record<string, string | number> = {}): Promise<any> {
        try {
            const response = await apiService.get(`/widgets/${id}/analytics?${new URLSearchParams(params as Record<string, string>)}`);
            return response.data;
        } catch (error) {
            console.error(`Error getting analytics for widget ${id}:`, error);
            throw error;
        }
    },

    /**
     * Validate numeric fields in widget data
     * This ensures that fields that should be numbers are actually numbers before sending to the API
     */
    validateNumericFields(widgetData: any) {
        // Appearance config numeric fields
        if (widgetData.appearance_config) {
            const appearance = widgetData.appearance_config;
            
            if (appearance.borderRadius !== undefined) {
                appearance.borderRadius = Number(appearance.borderRadius);
                if (isNaN(appearance.borderRadius)) {
                    throw this.createValidationError('appearance_config.borderRadius', 'Border radius must be a number');
                }
                if (appearance.borderRadius < 0 || appearance.borderRadius > 50) {
                    throw this.createValidationError('appearance_config.borderRadius', 'Border radius must be between 0 and 50');
                }
            }
            
            if (appearance.chatIconSize !== undefined) {
                appearance.chatIconSize = Number(appearance.chatIconSize);
                if (isNaN(appearance.chatIconSize)) {
                    throw this.createValidationError('appearance_config.chatIconSize', 'Chat icon size must be a number');
                }
                if (appearance.chatIconSize < 20 || appearance.chatIconSize > 80) {
                    throw this.createValidationError('appearance_config.chatIconSize', 'Chat icon size must be between 20 and 80');
                }
            }
        }

        // Behavior config numeric fields
        if (widgetData.behavior_config) {
            const behavior = widgetData.behavior_config;
            
            if (behavior.delay !== undefined) {
                behavior.delay = Number(behavior.delay);
                if (isNaN(behavior.delay)) {
                    throw this.createValidationError('behavior_config.delay', 'Delay must be a number');
                }
                if (behavior.delay < 0) {
                    throw this.createValidationError('behavior_config.delay', 'Delay must be a positive number');
                }
            }
            
            if (behavior.showAfterPageViews !== undefined) {
                behavior.showAfterPageViews = Number(behavior.showAfterPageViews);
                if (isNaN(behavior.showAfterPageViews)) {
                    throw this.createValidationError('behavior_config.showAfterPageViews', 'Page views must be a number');
                }
                if (behavior.showAfterPageViews < 0) {
                    throw this.createValidationError('behavior_config.showAfterPageViews', 'Page views must be a positive number');
                }
            }
        }
    },

    /**
     * Create a validation error with the same structure as the API returns
     */
    createValidationError(field: string, message: string) {
        const error: any = new Error(message);
        error.response = {
            data: {
                errors: {
                    [field]: [message]
                }
            }
        };
        return error;
    },

    /**
     * Sanitize form fields to prevent issues with large payloads
     * This helps prevent authentication issues when saving widgets with large form configurations
     * @param widgetData Widget data to sanitize
     */
    sanitizeFormFields(widgetData: any) {
        // Handle pre-chat form fields
        if (widgetData.content_config?.preChatFormFields && 
            Array.isArray(widgetData.content_config.preChatFormFields)) {
            
            // Limit the number of form fields
            if (widgetData.content_config.preChatFormFields.length > MAX_FORM_FIELDS) {
                console.warn(`Limiting pre-chat form fields from ${widgetData.content_config.preChatFormFields.length} to ${MAX_FORM_FIELDS}`);
                widgetData.content_config.preChatFormFields = 
                    widgetData.content_config.preChatFormFields.slice(0, MAX_FORM_FIELDS);
            }
            
            // Sanitize each field
            widgetData.content_config.preChatFormFields = 
                widgetData.content_config.preChatFormFields.map(field => this.sanitizeFormField(field));
        }
        
        // Handle post-chat form fields
        if (widgetData.content_config?.postChatFormFields && 
            Array.isArray(widgetData.content_config.postChatFormFields)) {
            
            // Limit the number of form fields
            if (widgetData.content_config.postChatFormFields.length > MAX_FORM_FIELDS) {
                console.warn(`Limiting post-chat form fields from ${widgetData.content_config.postChatFormFields.length} to ${MAX_FORM_FIELDS}`);
                widgetData.content_config.postChatFormFields = 
                    widgetData.content_config.postChatFormFields.slice(0, MAX_FORM_FIELDS);
            }
            
            // Sanitize each field
            widgetData.content_config.postChatFormFields = 
                widgetData.content_config.postChatFormFields.map(field => this.sanitizeFormField(field));
        }
        
        // Handle feedback form fields
        if (widgetData.content_config?.feedbackOptions && 
            Array.isArray(widgetData.content_config.feedbackOptions)) {
            
            // Limit the number of feedback options
            if (widgetData.content_config.feedbackOptions.length > MAX_FORM_FIELDS) {
                console.warn(`Limiting feedback options from ${widgetData.content_config.feedbackOptions.length} to ${MAX_FORM_FIELDS}`);
                widgetData.content_config.feedbackOptions = 
                    widgetData.content_config.feedbackOptions.slice(0, MAX_FORM_FIELDS);
            }
            
            // Sanitize each option
            widgetData.content_config.feedbackOptions = 
                widgetData.content_config.feedbackOptions.map(option => {
                    if (typeof option === 'object') {
                        return this.sanitizeFormField(option);
                    }
                    return option;
                });
        }
        
        return widgetData;
    },
    
    /**
     * Sanitize an individual form field to prevent issues with large values
     * @param field Form field to sanitize
     * @returns Sanitized form field
     */
    sanitizeFormField(field: any) {
        if (!field || typeof field !== 'object') {
            return field;
        }
        
        const sanitizedField = { ...field };
        
        // Truncate long string values
        Object.keys(sanitizedField).forEach(key => {
            if (typeof sanitizedField[key] === 'string' && 
                sanitizedField[key].length > MAX_FIELD_VALUE_LENGTH) {
                
                console.warn(`Truncating field value for ${key} from ${sanitizedField[key].length} to ${MAX_FIELD_VALUE_LENGTH} characters`);
                sanitizedField[key] = sanitizedField[key].substring(0, MAX_FIELD_VALUE_LENGTH);
            }
        });
        
        return sanitizedField;
    }
};