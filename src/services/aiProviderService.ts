import apiService from './api';

export interface AIModel {
    id: string;
    name: string;
    enabled: boolean;
    maxTokens: number;
    temperature: number;
}

export interface AIProvider {
    id: string;
    name: string;
    key: string;
    type: 'openai' | 'anthropic' | 'google' | 'huggingface' | 'mistral' | 'openrouter' | 'deepseek' | 'grok';
    enabled: boolean;
    isDefault: boolean;
    models: AIModel[];
    iconColor: string;
    configuration: Record<string, any>;
}

// Get all providers
export const getProviders = async (): Promise<AIProvider[]> => {
    try {
        const response = await apiService.get('/ai/providers');
        return response.data?.providers || [];
    } catch (error) {
        console.error('Error fetching providers:', error);
        throw error;
    }
};

// Get a single provider by ID
export const getProviderById = async (id: string): Promise<AIProvider> => {
    try {
        const response = await apiService.get(`/ai/providers/${id}`);
        return response.data?.provider;
    } catch (error) {
        console.error(`Error fetching provider ${id}:`, error);
        throw error;
    }
};

// Create a new provider
export const createProvider = async (provider: Omit<AIProvider, 'id'>): Promise<AIProvider> => {
    try {
        const response = await apiService.post('/ai/providers', provider);
        return response.data?.provider;
    } catch (error) {
        console.error('Error creating provider:', error);
        throw error;
    }
};

// Update a provider
export const updateProvider = async (id: string, provider: Partial<AIProvider>): Promise<AIProvider> => {
    try {
        const response = await apiService.put(`/ai/providers/${id}`, provider);
        return response.data?.provider;
    } catch (error) {
        console.error(`Error updating provider ${id}:`, error);
        throw error;
    }
};

// Delete a provider
export const deleteProvider = async (id: string): Promise<void> => {
    try {
        await apiService.delete(`/ai/providers/${id}`);
    } catch (error) {
        console.error(`Error deleting provider ${id}:`, error);
        throw error;
    }
};

// Set a provider as default
export const setDefaultProvider = async (id: string): Promise<AIProvider> => {
    try {
        const response = await apiService.post(`/ai/providers/${id}/default`);
        return response.data?.provider;
    } catch (error) {
        console.error(`Error setting provider ${id} as default:`, error);
        throw error;
    }
};

// Test a provider's connection
export const testProviderConnection = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await apiService.post(`/ai/providers/${id}/test-connection`);
        return response.data || { success: false, message: 'No response data' };
    } catch (error) {
        console.error(`Error testing provider ${id} connection:`, error);
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message || 'Connection test failed',
            };
        }
        throw error;
    }
};

// Get all models for a provider
export const getProviderModels = async (id: string): Promise<AIModel[]> => {
    try {
        const response = await apiService.get(`/ai/providers/${id}/models`);
        return response.data?.models || [];
    } catch (error) {
        console.error(`Error fetching models for provider ${id}:`, error);
        throw error;
    }
};

// Update a model
export const updateModel = async (
    providerId: string,
    modelId: string,
    model: Partial<AIModel>
): Promise<AIModel> => {
    try {
        const response = await apiService.put(`/ai/providers/${providerId}/models/${modelId}`, model);
        return response.data?.model;
    } catch (error) {
        console.error(`Error updating model ${modelId}:`, error);
        throw error;
    }
};

export default {
    getProviders,
    getProviderById,
    createProvider,
    updateProvider,
    deleteProvider,
    setDefaultProvider,
    testProviderConnection,
    getProviderModels,
    updateModel,
};