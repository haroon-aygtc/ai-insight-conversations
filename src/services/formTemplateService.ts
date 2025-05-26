import apiService from './api';

/**
 * Form template interface
 */
export interface FormTemplate {
  id: number;
  name: string;
  type: 'pre_chat' | 'post_chat' | 'feedback';
  description: string | null;
  fields: Array<any>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Form template service for interacting with the form template API
 */
class FormTemplateService {
  /**
   * Get all form templates
   * @param type Optional type filter ('pre_chat', 'post_chat', 'feedback')
   * @param defaultOnly Optional flag to get only default templates
   * @returns Array of FormTemplate objects
   */
  async getTemplates(type?: string, defaultOnly?: boolean): Promise<FormTemplate[]> {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (type) {
        params.append('type', type);
      }
      if (defaultOnly) {
        params.append('default', 'true');
      }

      const queryString = params.toString();
      const endpoint = `/form-templates${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiService.get<{ templates: FormTemplate[] }>(endpoint);
      return response.data.templates;
    } catch (error) {
      console.error('Error fetching form templates:', error);
      throw error;
    }
  }

  /**
   * Get a specific form template by ID
   * @param id Template ID
   * @returns FormTemplate object
   */
  async getTemplate(id: number): Promise<FormTemplate> {
    try {
      const response = await apiService.get<{ template: FormTemplate }>(`/form-templates/${id}`);
      return response.data.template;
    } catch (error) {
      console.error(`Error fetching form template with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get the default template for a specific type
   * @param type Template type ('pre_chat', 'post_chat', 'feedback')
   * @returns FormTemplate object or null if no default template exists
   */
  async getDefaultTemplate(type: string): Promise<FormTemplate | null> {
    try {
      const response = await apiService.get<{ template: FormTemplate }>(`/form-templates/type/${type}/default`);
      return response.data.template;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // No default template found, return null
        return null;
      }
      console.error(`Error fetching default template for type ${type}:`, error);
      throw error;
    }
  }
}

export const formTemplateService = new FormTemplateService();
export default formTemplateService;
