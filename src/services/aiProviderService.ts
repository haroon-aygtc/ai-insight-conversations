
import apiService from './api';

// Provider interfaces
export interface AIProvider {
  id: string;
  name: string;
  type: string;
  api_key: string;
  api_url?: string;
  is_active: boolean;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AIModel {
  id: string;
  provider_id: string;
  name: string;
  model_id: string;
  description?: string;
  is_active: boolean;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProvidersResponse {
  providers: AIProvider[];
  total: number;
}

export interface ModelsResponse {
  models: AIModel[];
  total: number;
}

export interface ProviderResponse {
  provider: AIProvider;
}

export interface ModelResponse {
  model: AIModel;
}

// Get all providers
export const getProviders = async (): Promise<ProvidersResponse> => {
  try {
    const response = await apiService.get('/api/ai-providers');
    return {
      providers: response.data?.providers || [],
      total: response.data?.total || 0
    };
  } catch (error) {
    console.error('Error fetching providers:', error);
    // Return mock data as fallback
    return {
      providers: [
        {
          id: '1',
          name: 'OpenAI',
          type: 'openai',
          api_key: 'sk-***',
          is_active: true,
          config: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      total: 1
    };
  }
};

// Get single provider
export const getProvider = async (id: string): Promise<ProviderResponse> => {
  try {
    const response = await apiService.get(`/api/ai-providers/${id}`);
    return {
      provider: response.data?.provider || null
    };
  } catch (error) {
    console.error('Error fetching provider:', error);
    throw error;
  }
};

// Create provider
export const createProvider = async (providerData: Partial<AIProvider>): Promise<ProviderResponse> => {
  try {
    const response = await apiService.post('/api/ai-providers', providerData);
    return {
      provider: response.data?.provider || null
    };
  } catch (error) {
    console.error('Error creating provider:', error);
    throw error;
  }
};

// Update provider
export const updateProvider = async (id: string, providerData: Partial<AIProvider>): Promise<ProviderResponse> => {
  try {
    const response = await apiService.put(`/api/ai-providers/${id}`, providerData);
    return {
      provider: response.data?.provider || null
    };
  } catch (error) {
    console.error('Error updating provider:', error);
    throw error;
  }
};

// Delete provider
export const deleteProvider = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    await apiService.delete(`/api/ai-providers/${id}`);
    return {
      success: true,
      message: 'Provider deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting provider:', error);
    return {
      success: false,
      message: 'Failed to delete provider'
    };
  }
};

// Test provider connection
export const testProvider = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiService.post(`/api/ai-providers/${id}/test`);
    return {
      success: true,
      message: 'Provider connection successful'
    };
  } catch (error) {
    console.error('Error testing provider:', error);
    return {
      success: false,
      message: 'Provider connection failed'
    };
  }
};

// Get all models
export const getModels = async (providerId?: string): Promise<ModelsResponse> => {
  try {
    const url = providerId ? `/api/ai-models?provider_id=${providerId}` : '/api/ai-models';
    const response = await apiService.get(url);
    return {
      models: response.data?.models || [],
      total: response.data?.total || 0
    };
  } catch (error) {
    console.error('Error fetching models:', error);
    return {
      models: [],
      total: 0
    };
  }
};

// Get single model
export const getModel = async (id: string): Promise<ModelResponse> => {
  try {
    const response = await apiService.get(`/api/ai-models/${id}`);
    return {
      model: response.data?.model || null
    };
  } catch (error) {
    console.error('Error fetching model:', error);
    throw error;
  }
};

export default {
  getProviders,
  getProvider,
  createProvider,
  updateProvider,
  deleteProvider,
  testProvider,
  getModels,
  getModel
};
