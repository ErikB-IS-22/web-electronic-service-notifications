// types.ts

export interface Service {
  id: number;
  name: string;
  description: string;
  slug: string;
  image: string;
  status: 'active' | 'draft' | 'archived';
}

export interface DraftItem {
  id: number;           // запись в черновике
  quantity: number;
  service: Service;
}

export interface DraftState {
  draftId : number | null;
  items   : DraftItem[];
  loading : boolean;
}

export interface ServiceFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  status: 'active' | 'draft';
}

export interface Filters {
  q?: string;
}

export interface ServiceListResponse {
  draft_id: number | null;
  services: Service[];
}

export interface DraftItem {
  id: number;
  service: Service;
  quantity: number;
}

export interface DraftState {
  draftId: number | null;
  items: DraftItem[];
  loading: boolean;
}

export interface Application {
  id: number;
  status: string;
  created_at: string;
  services: {
    id: number;
    name: string;
    quantity: number;
  }[];
}

export interface ApplicationFormData {
  services: { id: number; quantity: number }[];
}

export interface User {
  id: number;
  username: string;
  is_staff: boolean;
}

export interface UserAuthData {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  token: string;
}
