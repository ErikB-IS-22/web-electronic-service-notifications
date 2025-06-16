import api from './api/axios';
import {
  Service, Filters, ServiceListResponse,
  ServiceFormData, UserAuthData, AuthResponse, Application
} from './types';

// Services
export const fetchServices = async (filters: Filters | undefined): Promise<ServiceListResponse> => {
  const { data } = await api.get<ServiceListResponse>('/services/', { params: filters });
  return data;
};

export const fetchService = async (id: number): Promise<Service> =>
  (await api.get<Service>(`/services/${id}/`)).data;

export const createService = async (payload: ServiceFormData): Promise<Service> =>
  (await api.post<Service>('/services/', payload)).data;

export const updateService = async (id: number, payload: ServiceFormData): Promise<Service> =>
  (await api.put<Service>(`/services/${id}/`, payload)).data;

export const deleteService = async (id: number): Promise<void> =>
  api.delete(`/services/${id}/`);

// Auth
export const loginUser = async (payload: UserAuthData): Promise<AuthResponse> =>
  (await api.post<AuthResponse>('/auth/login/', payload)).data;

export const registerUser = async (payload: UserAuthData): Promise<AuthResponse> =>
  (await api.post<AuthResponse>('/auth/register/', payload)).data;

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout/');
};

// Requests
export const fetchRequests = async (): Promise<Application[]> =>
  (await api.get<Application[]>('/requests/my/')).data;
