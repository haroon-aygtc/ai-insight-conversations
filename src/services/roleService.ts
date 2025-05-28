import apiService from './api';

export interface Role {
  id: number;
  name: string;
  description?: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
  permissions_list?: string[];
}

export interface RoleListResponse {
  roles: Role[];
  total: number;
  page: number;
  perPage: number;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface GroupedPermissions {
  [category: string]: Permission[];
}

export interface PermissionResponse {
  permissions: Permission[];
  groupedPermissions: GroupedPermissions;
}

export interface RoleCreateData {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface RoleUpdateData {
  name?: string;
  description?: string;
  permissions?: string[];
}

export const getRoles = async (page: number = 1, perPage: number = 10, search: string = ''): Promise<RoleListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('per_page', perPage.toString());

    if (search) {
      queryParams.append('search', search);
    }

    const response = await apiService.get(`/roles?${queryParams.toString()}`);
    const data = response.data as any;

    // Backend returns: { roles: Role[], total: number, page: number, perPage: number }
    return {
      roles: data.roles || [],
      total: data.total || 0,
      page: data.page || page,
      perPage: data.perPage || perPage
    };
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const getRole = async (id: string | number): Promise<Role> => {
  try {
    const response = await apiService.get<{ role: Role }>(`/roles/${id}`);
    return response.data.role;
  } catch (error) {
    console.error(`Error fetching role ${id}:`, error);
    throw error;
  }
};

export const createRole = async (roleData: RoleCreateData): Promise<Role> => {
  try {
    const response = await apiService.post<{ role: Role, message: string }>('/roles', roleData);
    return response.data.role;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRole = async (id: string | number, roleData: RoleUpdateData): Promise<Role> => {
  try {
    const response = await apiService.put<{ role: Role, message: string }>(`/roles/${id}`, roleData);
    return response.data.role;
  } catch (error) {
    console.error(`Error updating role ${id}:`, error);
    throw error;
  }
};

export const deleteRole = async (id: string | number): Promise<void> => {
  try {
    await apiService.delete(`/roles/${id}`);
  } catch (error) {
    console.error(`Error deleting role ${id}:`, error);
    throw error;
  }
};

export const getPermissions = async (): Promise<PermissionResponse> => {
  try {
    const response = await apiService.get<PermissionResponse>('/permissions');
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

export default {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getPermissions
};
