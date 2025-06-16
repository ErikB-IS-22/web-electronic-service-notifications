import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: { loading: false } as { loading: boolean },
  reducers: {
    startLoading: (s) => { s.loading = true; },
    stopLoading:  (s) => { s.loading = false; },
  },
});
export const { startLoading, stopLoading } = slice.actions;
export default slice.reducer;

