import api from './api/axios';
import {
  Service, Filters, ServiceListResponse,
  ServiceFormData, UserAuthData, AuthResponse, Application
} from './types';

// Services
export const fetchServices = async (filters: Filters = {}): Promise<ServiceListResponse> => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Моковые данные услуг
  const mockServices: Service[] = [
    {
      id: 1,
      name: 'Онлайн-платформа для художников',
      slug: 'onlajn-platforma-dlya-hudozhnikov',
      description: 'Уведомления о новых заказах, отзывах на работы, а также о предстоящих конкурсах и акциях.',
      status: 'active',
      image: ''
    },
    {
      id: 2,
      name: 'Магазин художественных материалов',
      slug: 'magazin-hudozhestvennyh-materialov',
      description: 'Уведомления о поступлении новых товаров, скидках и акциях на краски, холсты и другие материалы.',
      status: 'active',
      image: ''
    },
    {
      id: 3,
      name: 'Фонд поддержки молодых художников',
      slug: 'fond-podderzhki-molodyh-hudozhnikov',
      description: 'Уведомления о грантах, стипендиях и возможностях участия в программах поддержки.',
      status: 'active',
      image: ''
    }
  ];

  return {
    services: mockServices,
    draft_id: 42 // Пример draft_id
  };
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