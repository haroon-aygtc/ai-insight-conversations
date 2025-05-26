
import apiService from './api';

// Widget interfaces
export interface WidgetData {
  name: string;
  description: string;
  appearance_config: Record<string, any>;
  behavior_config: Record<string, any>;
  content_config: Record<string, any>;
  embedding_config: Record<string, any>;
}

export interface Widget extends WidgetData {
  id: string | number;
  widget_id: string;
  is_active: boolean;
  is_published: boolean;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface WidgetListResponse {
  widgets: Widget[];
  total: number;
  page: number;
  perPage: number;
}

// Get all widgets
export const getWidgets = async (page: number = 1, perPage: number = 10): Promise<WidgetListResponse> => {
  try {
    const response = await apiService.get(`/api/widgets?page=${page}&per_page=${perPage}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching widgets:', error);
    // Return mock data if API fails
    return {
      widgets: [
        {
          id: '1',
          widget_id: 'widget_123',
          name: 'Customer Support Widget',
          description: 'Main customer support chat widget',
          is_active: true,
          is_published: true,
          status: 'published',
          appearance_config: {
            primaryColor: '#6366f1',
            secondaryColor: '#ffffff',
            borderRadius: 8,
            theme: 'light'
          },
          behavior_config: {
            autoOpen: 'no',
            position: 'bottom-right',
            delay: 5
          },
          content_config: {
            welcomeMessage: 'Hello! How can I help you today?',
            botName: 'AI Assistant'
          },
          embedding_config: {
            allowedDomains: '*',
            enableAnalytics: true
          }
        }
      ],
      total: 1,
      page: 1,
      perPage: 10
    };
  }
};

// Get single widget
export const getWidget = async (id: string): Promise<Widget> => {
  try {
    const response = await apiService.get(`/api/widgets/${id}`);
    return response.data.widget;
  } catch (error) {
    console.error('Error fetching widget:', error);
    throw error;
  }
};

// Create new widget
export const createWidget = async (widgetData: WidgetData): Promise<Widget> => {
  try {
    const response = await apiService.post('/api/widgets', widgetData);
    return response.data.widget;
  } catch (error) {
    console.error('Error creating widget:', error);
    throw error;
  }
};

// Update existing widget
export const updateWidget = async (id: string | number, widgetData: WidgetData): Promise<Widget> => {
  try {
    const response = await apiService.put(`/api/widgets/${id}`, widgetData);
    return response.data.widget;
  } catch (error) {
    console.error('Error updating widget:', error);
    throw error;
  }
};

// Delete widget
export const deleteWidget = async (id: string | number): Promise<void> => {
  try {
    await apiService.delete(`/api/widgets/${id}`);
  } catch (error) {
    console.error('Error deleting widget:', error);
    throw error;
  }
};

// Publish widget
export const publishWidget = async (id: string | number): Promise<Widget> => {
  try {
    const response = await apiService.post(`/api/widgets/${id}/publish`);
    return response.data.widget;
  } catch (error) {
    console.error('Error publishing widget:', error);
    throw error;
  }
};

// Unpublish widget
export const unpublishWidget = async (id: string | number): Promise<Widget> => {
  try {
    const response = await apiService.post(`/api/widgets/${id}/unpublish`);
    return response.data.widget;
  } catch (error) {
    console.error('Error unpublishing widget:', error);
    throw error;
  }
};

// Load default form template
export const loadDefaultFormTemplate = async (
  widgetConfig: WidgetData,
  formType: 'preChatForm' | 'postChatForm' | 'feedback'
): Promise<WidgetData> => {
  try {
    const response = await apiService.post('/api/widgets/load-template', {
      config: widgetConfig,
      form_type: formType
    });
    return response.data.config;
  } catch (error) {
    console.error('Error loading form template:', error);
    // Return default templates as fallback
    const defaultTemplates = {
      preChatForm: {
        ...widgetConfig,
        content_config: {
          ...widgetConfig.content_config,
          preChatFormFields: [
            {
              id: "field-name",
              label: "Name",
              type: "text",
              placeholder: "Enter your name",
              required: true
            },
            {
              id: "field-email",
              label: "Email",
              type: "email",
              placeholder: "Enter your email",
              required: true
            }
          ]
        }
      },
      feedback: {
        ...widgetConfig,
        content_config: {
          ...widgetConfig.content_config,
          feedbackOptions: [
            {
              id: "feedback-helpful",
              type: "thumbs",
              question: "Was this helpful?",
              required: true
            }
          ]
        }
      },
      postChatForm: widgetConfig // No specific template for post-chat form yet
    };

    return defaultTemplates[formType] || widgetConfig;
  }
};

export default {
  getWidgets,
  getWidget,
  createWidget,
  updateWidget,
  deleteWidget,
  publishWidget,
  unpublishWidget,
  loadDefaultFormTemplate
};
