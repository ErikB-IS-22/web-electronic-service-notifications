import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Filters } from '../types';

const slice = createSlice({
  name: 'filters',
  initialState: {} as Filters,
  reducers: {
    setFilters:  (_, { payload }: PayloadAction<Filters>) => payload,
    clearFilters: () => ({}),
  },
});
export const { setFilters, clearFilters } = slice.actions;
export default slice.reducer;
