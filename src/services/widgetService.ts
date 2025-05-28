import apiService from './api';

export interface AppearanceConfig {
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
}

export interface BehaviorConfig {
  autoOpen: string;
  delay: number;
  position: string;
  animation: string;
  mobileBehavior: string;
  showAfterPageViews: number;
  persistState: boolean;
  showNotifications: boolean;
}

export interface ContentConfig {
  welcomeMessage: string;
  botName: string;
  inputPlaceholder: string;
  chatButtonText: string;
  headerTitle: string;
  enablePreChatForm: boolean;
  preChatFormFields: Array<{
    id: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
  }>;
  preChatFormTitle: string;
  preChatFormSubtitle: string;
  enableFeedback: boolean;
  feedbackPosition: string;
  feedbackOptions: Array<{
    id: string;
    type: string;
    question: string;
    required: boolean;
  }>;
  enablePostChatForm?: boolean;
  postChatFormFields?: Array<any>;
  showTypingIndicator: boolean;
  showAvatar: boolean;
  [key: string]: any; // For any additional properties
}

export interface EmbeddingConfig {
  allowedDomains: string;
  enableAnalytics: boolean;
  widgetId: string;
  gdprCompliance: boolean;
  [key: string]: any; // For any additional properties
}

export interface WidgetData {
  name: string;
  description?: string;
  appearance_config: AppearanceConfig;
  behavior_config: BehaviorConfig;
  content_config: ContentConfig;
  embedding_config: EmbeddingConfig;
}

export interface Widget extends WidgetData {
  id: string | number;
  widget_id: string;
  is_active: boolean;
  is_published: boolean;
  status: string;
  appearance_config: any;
  behavior_config: any;
  content_config: any;
  embedding_config: any;
  created_at?: string;
  updated_at?: string;
}

export interface WidgetData {
  name: string;
  description: string;
  appearance_config: any;
  behavior_config: any;
  content_config: any;
  embedding_config: any;
}

export interface WidgetListResponse {
  data: any[];
  widgets: Widget[];
  total: number;
  page: number;
  perPage: number;
}

export const getWidgets = async (page: number = 1, perPage: number = 10): Promise<Widget[]> => {
  try {
    const response = await apiService.get<WidgetListResponse>(`/widgets?page=${page}&per_page=${perPage}`);
    return response.data as WidgetListResponse;
  } catch (error) {
    console.error('Error fetching widgets:', error);
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
            chatIconSize: 40,
            fontFamily: 'inter',
            fontSize: 'medium',
            fontWeight: 'normal',
            textColor: '#333333',
            headerTextColor: '#ffffff',
            theme: 'light',
            iconStyle: 'circle',
            customCSS: ''
          },
          behavior_config: {
            autoOpen: 'no',
            delay: 5,
            position: 'bottom-right',
            animation: 'fade',
            mobileBehavior: 'responsive',
            showAfterPageViews: 1,
            persistState: true,
            showNotifications: true
          },
          content_config: {
            welcomeMessage: 'Hello! How can I help you today?',
            botName: 'AI Assistant',
            inputPlaceholder: 'Type a message...',
            chatButtonText: 'Chat with us',
            headerTitle: 'Chat Support',
            enablePreChatForm: false,
            preChatFormFields: [],
            preChatFormTitle: 'Before we start chatting...',
            preChatFormSubtitle: 'Please provide the following information:',
            enableFeedback: false,
            feedbackPosition: 'after-bot',
            feedbackOptions: [],
            enablePostChatForm: false,
            postChatFormFields: [],
            showTypingIndicator: true,
            showAvatar: true
          },
          embedding_config: {
            allowedDomains: '*',
            enableAnalytics: true,
            widgetId: 'widget_123',
            gdprCompliance: true
          }
        }
      ],
      total: 1,
      page: 1,
      perPage: 10
    };
  }
};

export const getWidget = async (id: string): Promise<Widget> => {
  try {
    const response = await apiService.get<{ widget: Widget }>(`/api/widgets/${id}`);
    return (response.data as any)?.widget || response.data;
  } catch (error) {
    console.error('Error fetching widget:', error);
    throw error;
  }
};

export const createWidget = async (widgetData: Omit<Widget, 'id' | 'created_at' | 'updated_at'>): Promise<Widget> => {
  try {
    const response = await apiService.post<{ widget: Widget }>('/api/widgets', widgetData);
    return (response.data as any)?.widget || response.data;
  } catch (error) {
    console.error('Error creating widget:', error);
    throw error;
  }
};

export const updateWidget = async (id: string, widgetData: Partial<Widget>): Promise<Widget> => {
  try {
    const response = await apiService.put<{ widget: Widget }>(`/api/widgets/${id}`, widgetData);
    return (response.data as any)?.widget || response.data;
  } catch (error) {
    console.error('Error updating widget:', error);
    throw error;
  }
};

export const deleteWidget = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/api/widgets/${id}`);
  } catch (error) {
    console.error('Error deleting widget:', error);
    throw error;
  }
};

export const publishWidget = async (id: string): Promise<Widget> => {
  try {
    const response = await apiService.post<{ widget: Widget }>(`/api/widgets/${id}/publish`);
    return (response.data as any)?.widget || response.data;
  } catch (error) {
    console.error('Error publishing widget:', error);
    throw error;
  }
};

export const unpublishWidget = async (id: string): Promise<Widget> => {
  try {
    const response = await apiService.post<{ widget: Widget }>(`/api/widgets/${id}/unpublish`);
    return (response.data as any)?.widget || response.data;
  } catch (error) {
    console.error('Error unpublishing widget:', error);
    throw error;
  }
};

export const getWidgetConfig = async (id: string): Promise<any> => {
  try {
    const response = await apiService.post<{ config: WidgetData }>('/api/widgets/load-template', {
      config: widgetConfig,
      form_type: formType
    });
    return (response.data as any)?.config || response.data;
  } catch (error) {
    console.error('Error loading form template:', error);
    const defaultTemplates = {
      preChatForm: {
        ...widgetConfig,
        content_config: {
          ...widgetConfig.content_config,
          enablePreChatForm: true,
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
          ],
          preChatFormTitle: "Before we start chatting...",
          preChatFormSubtitle: "Please provide the following information:",
          feedbackPosition: "after-bot",
          showTypingIndicator: true,
          showAvatar: true
        }
      },
      feedback: {
        ...widgetConfig,
        content_config: {
          ...widgetConfig.content_config,
          enableFeedback: true,
          feedbackPosition: "after-bot",
          feedbackOptions: [
            {
              id: "feedback-helpful",
              type: "thumbs",
              question: "Was this helpful?",
              required: true
            }
          ],
          showTypingIndicator: true,
          showAvatar: true
        }
      },
      postChatForm: {
        ...widgetConfig,
        content_config: {
          ...widgetConfig.content_config,
          enablePostChatForm: true,
          postChatFormFields: [],
          feedbackPosition: "after-bot",
          showTypingIndicator: true,
          showAvatar: true
        }
      }
    };

    return defaultTemplates[formType] || widgetConfig;
  }
};

export const loadDefaultFormTemplate = async (widgetData: WidgetData, formType: string): Promise<WidgetData> => {
  try {
    const response = await apiService.get<{ embed_code: string }>(`/api/widgets/${widgetId}/embed`);
    return response.data as { embed_code: string };
  } catch (error) {
    console.error('Error loading form template:', error);
    return widgetData;
  }
};

export const widgetService = {
  getWidgets,
  getWidget,
  createWidget,
  updateWidget,
  deleteWidget,
  publishWidget,
  unpublishWidget,
  getWidgetConfig,
  getWidgetEmbedCode,
  loadDefaultFormTemplate,
};

export default widgetService;
