import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { Application } from '../types';

/* ---------- state ---------- */
interface RequestsState {
  items: Application[];
  current: Application | null;
  loading: boolean;
  loadingOne: boolean;
}

const initialState: RequestsState = {
  items: [],
  current: null,
  loading: false,
  loadingOne: false,
};

/* ---------- thunks ---------- */
export const fetchRequests = createAsyncThunk<Application[]>(
  'requests/fetchAll',
  async () => {
    const { data } = await api.get('/applications/');
    return data;
  },
);

export const fetchOne = createAsyncThunk<Application, number>(
  'requests/fetchOne',
  async (id) => {
    const { data } = await api.get(`/applications/${id}/`);
    return data;
  },
);

/* ---------- slice ---------- */
const slice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchRequests.pending,  (s) => { s.loading = true; })
      .addCase(fetchRequests.fulfilled,(s, { payload }) => {
        s.loading = false;
        s.items   = payload;
      })
      .addCase(fetchRequests.rejected, (s) => { s.loading = false; })

      .addCase(fetchOne.pending,      (s) => { s.loadingOne = true; })
      .addCase(fetchOne.fulfilled,    (s, { payload }) => {
        s.loadingOne = false;
        s.current    = payload;
      })
      .addCase(fetchOne.rejected,     (s) => { s.loadingOne = false; });
  },
});

export default slice.reducer;
