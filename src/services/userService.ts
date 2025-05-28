import apiService from './api';
import { User } from './auth';

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  perPage: number;
}

export interface UserCreateData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  roles?: string[];
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  roles?: string[];
}

export const getUsers = async (page: number = 1, perPage: number = 10, search: string = '', role: string = ''): Promise<UserListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('per_page', perPage.toString());
    
    if (search) {
      queryParams.append('search', search);
    }
    
    if (role) {
      queryParams.append('role', role);
    }
    
    const response = await apiService.get<UserListResponse>(`/users?${queryParams.toString()}`);
    console.log(response.data);
    return response.data as UserListResponse;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUser = async (id: string | number): Promise<User> => {
  try {
    const response = await apiService.get<{ user: User }>(`/users/${id}`);
    return response.data.user;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

export const createUser = async (userData: UserCreateData): Promise<User> => {
  try {
    const response = await apiService.post<{ user: User, message: string }>('/users', userData);
    return response.data.user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: string | number, userData: UserUpdateData): Promise<User> => {
  try {
    const response = await apiService.put<{ user: User, message: string }>(`/users/${id}`, userData);
    return response.data.user;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string | number): Promise<void> => {
  try {
    await apiService.delete(`/users/${id}`);
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

export const getRoles = async (): Promise<string[]> => {
  try {
    const response = await apiService.get<{ roles: any[] }>('/users/roles/all');
    return response.data.roles.map(role => role.name);
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getRoles
};
