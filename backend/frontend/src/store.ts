import { configureStore } from '@reduxjs/toolkit';
import auth       from './slices/authSlice';
import services   from './slices/servicesSlice';
import draft      from './slices/draftSlice';
import requests   from './slices/requestsSlice';
import filters    from './slices/filterSlice';
import ui         from './slices/uiSlice';

export const store = configureStore({
  reducer: { auth, services, draft, requests, filters, ui },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
