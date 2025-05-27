
import apiService from './api';

export interface Widget {
  id: number;
  widget_id: string;
  name: string;
  description: string;
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

export interface WidgetListResponse {
  widgets: Widget[];
  total: number;
  page: number;
  perPage: number;
}

export const getWidgets = async (page: number = 1, perPage: number = 10): Promise<Widget[]> => {
  try {
    const response = await apiService.get(`/api/widgets?page=${page}&per_page=${perPage}`);
    const data = response.data as any;
    return data.widgets || data || [];
  } catch (error) {
    console.error('Error fetching widgets:', error);
    throw error;
  }
};

export const getWidget = async (id: string): Promise<Widget> => {
  try {
    const response = await apiService.get(`/api/widgets/${id}`);
    const data = response.data as any;
    return data.widget || data;
  } catch (error) {
    console.error('Error fetching widget:', error);
    throw error;
  }
};

export const createWidget = async (widgetData: Omit<Widget, 'id' | 'created_at' | 'updated_at'>): Promise<Widget> => {
  try {
    const response = await apiService.post('/api/widgets', widgetData);
    const data = response.data as any;
    return data.widget || data;
  } catch (error) {
    console.error('Error creating widget:', error);
    throw error;
  }
};

export const updateWidget = async (id: string, widgetData: Partial<Widget>): Promise<Widget> => {
  try {
    const response = await apiService.put(`/api/widgets/${id}`, widgetData);
    const data = response.data as any;
    return data.widget || data;
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
    const response = await apiService.post(`/api/widgets/${id}/publish`);
    const data = response.data as any;
    return data.widget || data;
  } catch (error) {
    console.error('Error publishing widget:', error);
    throw error;
  }
};

export const unpublishWidget = async (id: string): Promise<Widget> => {
  try {
    const response = await apiService.post(`/api/widgets/${id}/unpublish`);
    const data = response.data as any;
    return data.widget || data;
  } catch (error) {
    console.error('Error unpublishing widget:', error);
    throw error;
  }
};

export const getWidgetConfig = async (id: string): Promise<any> => {
  try {
    const response = await apiService.get(`/api/widgets/${id}/config`);
    const data = response.data as any;
    return data.config || data;
  } catch (error) {
    console.error('Error fetching widget config:', error);
    throw error;
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
};

export default widgetService;
