import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { DraftState, Service, DraftItem } from '../types';

/* ---------- initial ---------- */
const initialState: DraftState = {
  draftId : null,
  items   : [],
  loading : false,
};

/* ---------- thunks ---------- */
export const fetchDraft = createAsyncThunk<
  DraftState, void, { rejectValue: string }
>('draft/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/draft/');
    return { draftId: data.draftId ?? null, items: data.items ?? [], loading: false };
  } catch { return rejectWithValue('Не удалось загрузить черновик'); }
});

export const confirmDraft = createAsyncThunk<
  void, number | null, { state: { draft: DraftState }, rejectValue: string }
>('draft/confirm', async (draftId, { getState, rejectWithValue }) => {
  try {
    const { items } = getState().draft;
    /* 1. создаём заявку, если ещё нет */
    let id = draftId;
    if (!id) {
      const { data } = await api.post('/applications/');
      id = data.id;
    }
    /* 2. отдаём позиции */
    await api.post(`/applications/${id}/items/`, items.map(i => ({
      service:  i.service.id,
      quantity: i.quantity,
    })));
    /* 3. статус formed */
    await api.put(`/applications/${id}/form/`);
  } catch { return rejectWithValue('Не удалось подтвердить черновик'); }
});

/* ---------- slice ---------- */
const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    addToDraft: (s, { payload }: PayloadAction<Service>) => {
      const idx = s.items.findIndex(i => i.service.id === payload.id);
      if (idx === -1) {
        s.items.push({ id: Date.now(), service: payload, quantity: 1 });
      } else s.items[idx].quantity += 1;
    },
    incQty: (s, { payload }: PayloadAction<number>) => {
      const it = s.items.find(i => i.id === payload); if (it) it.quantity += 1;
    },
    decQty: (s, { payload }: PayloadAction<number>) => {
      const it = s.items.find(i => i.id === payload);
      if (it && it.quantity > 1) it.quantity -= 1;
    },
    removeItem: (s, { payload }: PayloadAction<number>) => {
      s.items = s.items.filter(i => i.id !== payload);
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchDraft.pending, s => { s.loading = true; })
     .addCase(fetchDraft.fulfilled, (s, { payload }) => {
        s.loading = false;
        if (payload.draftId !== null) s.draftId = payload.draftId;
        if (payload.items.length)     s.items   = payload.items;
     })
     .addCase(fetchDraft.rejected,  s => { s.loading = false; })
     .addCase(confirmDraft.fulfilled, s => { s.items = []; s.draftId = null; });
  },
});

export const { addToDraft, incQty, decQty, removeItem } = draftSlice.actions;
export default draftSlice.reducer;
