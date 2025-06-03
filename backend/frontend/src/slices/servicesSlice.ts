import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchServices as apiFetch } from '../api';
import type { Service, Filters } from '../types';

/* ---------- async thunk -------------------------------------------- */
export const fetchServices = createAsyncThunk<
  { services: Service[]; draftId: number | null },
  Filters | undefined,
  { rejectValue: string }
>('services/fetch', async (filters, th) => {
  try {
    const data = await apiFetch(filters ?? {});
    // backend:  { draft_id, services }
    return { services: data.services, draftId: data.draft_id };
  } catch {
    return th.rejectWithValue('Не удалось загрузить услуги');
  }
});

/* ---------- slice --------------------------------------------------- */
interface ServicesState {
  items: Service[];
  draftId: number | null;
  loading: boolean;
  error: string | null;
}
const initial: ServicesState = { items: [], draftId: null, loading: false, error: null };

const slice = createSlice({
  name: 'services',
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchServices.pending,   (s)           => { s.loading = true;  s.error = null; })
     .addCase(fetchServices.fulfilled, (s, { payload }) => {
       s.loading  = false;
       s.items    = payload.services;
       s.draftId  = payload.draftId;
     })
     .addCase(fetchServices.rejected,  (s, { payload }) => {
       s.loading = false;
       s.error   = payload ?? 'Ошибка';
     });
  },
});

export default slice.reducer;
