import apiService from './api';
import { Permission, GroupedPermissions } from './roleService';

export interface PermissionListResponse {
  permissions: Permission[];
  groupedPermissions: GroupedPermissions;
  total: number;
  page: number;
  perPage: number;
}

export interface PermissionCheckResponse {
  permission: string;
  hasPermission: boolean;
}

export interface PermissionCheckMultipleResponse {
  permissions: Record<string, boolean>;
  hasAllPermissions: boolean;
  hasAnyPermission: boolean;
  result: boolean;
}

/**
 * Fetch permissions with pagination and search
 */
export const getPermissions = async (page: number = 1, perPage: number = 20, search: string = ''): Promise<PermissionListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('per_page', perPage.toString());

    if (search) {
      queryParams.append('search', search);
    }

    const response = await apiService.get(`/permissions?${queryParams.toString()}`);
    const data = response.data as any;

    // Handle the actual API response format from Laravel
    if (data.permissions && data.groupedPermissions) {
      return {
        permissions: data.permissions,
        groupedPermissions: data.groupedPermissions,
        total: data.total || data.permissions.length,
        page: data.current_page || page,
        perPage: data.per_page || perPage
      };
    }

    throw new Error('Invalid response format from permissions API');
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

/**
 * Fetch a specific permission by ID
 */
export const getPermission = async (id: string | number): Promise<Permission> => {
  try {
    const response = await apiService.get<{ permission: Permission }>(`/permissions/${id}`);

    if (!response.data || !response.data.permission) {
      throw new Error(`Failed to fetch permission with ID ${id}`);
    }

    return response.data.permission;
  } catch (error) {
    console.error(`Error fetching permission ${id}:`, error);
    throw error;
  }
};

/**
 * Check if current user has a specific permission
 */
export const checkPermission = async (permission: string): Promise<boolean> => {
  try {
    const response = await apiService.post<PermissionCheckResponse>('/permissions/check', { permission });

    if (!response.data || typeof response.data.hasPermission !== 'boolean') {
      throw new Error(`Invalid response checking permission ${permission}`);
    }

    return response.data.hasPermission;
  } catch (error) {
    console.error(`Error checking permission ${permission}:`, error);
    return false;
  }
};

/**
 * Check if current user has multiple permissions
 */
export const checkPermissions = async (permissions: string[], requireAll: boolean = false): Promise<PermissionCheckMultipleResponse> => {
  try {
    const response = await apiService.post<PermissionCheckMultipleResponse>('/permissions/check-multiple', {
      permissions,
      requireAll
    });

    if (!response.data) {
      throw new Error('Invalid response from permissions check API');
    }

    return response.data;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return {
      permissions: {},
      hasAllPermissions: false,
      hasAnyPermission: false,
      result: false
    };
  }
};

/**
 * Get permissions grouped by category (dynamic from API)
 */
export const getPermissionsByCategory = async (): Promise<GroupedPermissions> => {
  try {
    const response = await getPermissions(1, 1000); // Get all permissions
    return response.groupedPermissions;
  } catch (error) {
    console.error('Error getting permissions by category:', error);
    return {};
  }
};

/**
 * Get all permissions (dynamic from API)
 */
export const getAllPermissions = async (): Promise<Permission[]> => {
  try {
    const response = await getPermissions(1, 1000); // Get all permissions
    return response.permissions;
  } catch (error) {
    console.error('Error getting all permissions:', error);
    return [];
  }
};

/**
 * Get user-friendly display name for permission (dynamic)
 */
export const getPermissionDisplayName = (permission: Permission | string): string => {
  const permissionName = typeof permission === 'string' ? permission : permission.name;

  // Convert permission name to readable format
  // e.g., "user.create" -> "User Create", "dashboard.view" -> "Dashboard View"
  return permissionName.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Search permissions by name or display name
 */
export const searchPermissions = async (query: string): Promise<Permission[]> => {
  try {
    const response = await getPermissions(1, 1000, query);
    return response.permissions;
  } catch (error) {
    console.error('Error searching permissions:', error);
    return [];
  }
};

/**
 * Create a new permission
 */
export const createPermission = async (permissionData: {
  name: string;
  guard_name: string;
}): Promise<Permission> => {
  try {
    const response = await apiService.post('/permissions', permissionData);
    const data = response.data as any;
    return data.permission || data;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
};

/**
 * Update an existing permission
 */
export const updatePermission = async (id: string | number, permissionData: {
  name?: string;
  guard_name?: string;
}): Promise<Permission> => {
  try {
    const response = await apiService.put(`/permissions/${id}`, permissionData);
    const data = response.data as any;
    return data.permission || data;
  } catch (error) {
    console.error(`Error updating permission ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a permission
 */
export const deletePermission = async (id: string | number): Promise<void> => {
  try {
    await apiService.delete(`/permissions/${id}`);
  } catch (error) {
    console.error(`Error deleting permission ${id}:`, error);
    throw error;
  }
};

export default {
  getPermissions,
  getPermission,
  checkPermission,
  checkPermissions,
  getPermissionsByCategory,
  getAllPermissions,
  getPermissionDisplayName,
  searchPermissions,
  createPermission,
  updatePermission,
  deletePermission
};
