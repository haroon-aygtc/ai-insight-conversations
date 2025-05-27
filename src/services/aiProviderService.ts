import apiService from './api';

export interface AIProvider {
  id: string;
  name: string;
  type: string;
  api_key: string;
  base_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AIModel {
  id: string;
  provider_id: string;
  name: string;
  model_id: string;
  max_tokens: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AIProviderListResponse {
  providers: AIProvider[];
  total: number;
  page: number;
  perPage: number;
}

export interface AIModelListResponse {
  models: AIModel[];
  total: number;
}

export const getProviders = async (page: number = 1, perPage: number = 10): Promise<AIProviderListResponse> => {
  try {
    const response = await apiService.get(`/api/ai/providers?page=${page}&per_page=${perPage}`);
    const data = response.data as any;
    return {
      providers: data.providers || [],
      total: data.total || 0,
      page,
      perPage
    };
  } catch (error) {
    console.error('Error fetching AI providers:', error);
    throw error;
  }
};

export const getProvider = async (id: string): Promise<AIProvider> => {
  try {
    const response = await apiService.get(`/api/ai/providers/${id}`);
    const data = response.data as any;
    return data.provider as AIProvider;
  } catch (error) {
    console.error('Error fetching AI provider:', error);
    throw error;
  }
};

export const createProvider = async (providerData: Omit<AIProvider, 'id' | 'created_at' | 'updated_at'>): Promise<AIProvider> => {
  try {
    const response = await apiService.post('/api/ai/providers', providerData);
    const data = response.data as any;
    return data.provider as AIProvider;
  } catch (error) {
    console.error('Error creating AI provider:', error);
    throw error;
  }
};

export const updateProvider = async (id: string, providerData: Partial<AIProvider>): Promise<AIProvider> => {
  try {
    const response = await apiService.put(`/api/ai/providers/${id}`, providerData);
    const data = response.data as any;
    return data.provider as AIProvider;
  } catch (error) {
    console.error('Error updating AI provider:', error);
    throw error;
  }
};

export const deleteProvider = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/api/ai/providers/${id}`);
  } catch (error) {
    console.error('Error deleting AI provider:', error);
    throw error;
  }
};

export const toggleProviderStatus = async (id: string, status: boolean): Promise<AIProvider> => {
  try {
    const response = await apiService.post(`/api/ai/providers/${id}/status`, { is_active: status });
    const data = response.data as any;
    return data.provider as AIProvider;
  } catch (error) {
    console.error('Error toggling AI provider status:', error);
    throw error;
  }
};

export const getModels = async (providerId?: string): Promise<AIModelListResponse> => {
  try {
    const url = providerId ? `/api/ai/models?provider_id=${providerId}` : '/api/ai/models';
    const response = await apiService.get(url);
    const data = response.data as any;
    return {
      models: data.models || [],
      total: data.total || 0
    };
  } catch (error) {
    console.error('Error fetching AI models:', error);
    throw error;
  }
};

export const createModel = async (modelData: Omit<AIModel, 'id' | 'created_at' | 'updated_at'>): Promise<AIModel> => {
  try {
    const response = await apiService.post('/api/ai/models', modelData);
    const data = response.data as any;
    return data.model as AIModel;
  } catch (error) {
    console.error('Error creating AI model:', error);
    throw error;
  }
};

export const updateModel = async (id: string, modelData: Partial<AIModel>): Promise<AIModel> => {
  try {
    const response = await apiService.put(`/api/ai/models/${id}`, modelData);
    const data = response.data as any;
    return data.model as AIModel;
  } catch (error) {
    console.error('Error updating AI model:', error);
    throw error;
  }
};

export const deleteModel = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/api/ai/models/${id}`);
  } catch (error) {
    console.error('Error deleting AI model:', error);
    throw error;
  }
};

export const toggleModelStatus = async (id: string, status: boolean): Promise<AIModel> => {
  try {
    const response = await apiService.post(`/api/ai/models/${id}/status`, { is_active: status });
    const data = response.data as any;
    return data.model as AIModel;
  } catch (error) {
    console.error('Error toggling AI model status:', error);
    throw error;
  }
};
