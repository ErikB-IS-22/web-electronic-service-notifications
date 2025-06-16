import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { User } from '../types';

/* ---------- state --------------------------------------------------- */
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

/* ---------- async‑thunks ------------------------------------------- */
export const register = createAsyncThunk<
  User,
  { username: string; password: string },
  { rejectValue: string }
>('auth/register', async (body, th) => {
  try {
    const { data } = await api.post<User>('/auth/register/', body);
    if ((data as any).token) localStorage.setItem('token', (data as any).token);
    return data;
  } catch {
    return th.rejectWithValue('Ошибка регистрации');
  }
});

export const login = createAsyncThunk<
  User,
  { username: string; password: string },
  { rejectValue: string }
>('auth/login', async (body, th) => {
  try {
    const { data } = await api.post<User>('/auth/login/', body);
    if ((data as any).token) localStorage.setItem('token', (data as any).token);
    return data;
  } catch {
    return th.rejectWithValue('Неверный логин/пароль');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout/');
  localStorage.removeItem('token');
});

export const fetchProfile = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/fetchProfile',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get<User>('/auth/profile/');
      return data;
    } catch {
      return thunkAPI.rejectWithValue('Ошибка при загрузке профиля');
    }
  }
);

/* ---------- slice --------------------------------------------------- */
const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<User | null>) {
      state.user = payload;
    },
  },
  extraReducers: (b) => {
    b
      .addCase(register.pending,  (s) => { s.loading = true;  s.error = null; })
      .addCase(register.fulfilled,(s, { payload }) => { s.loading = false; s.user = payload; })
      .addCase(register.rejected, (s, { payload }) => { s.loading = false; s.error = payload ?? null; })

      .addCase(login.pending,     (s) => { s.loading = true;  s.error = null; })
      .addCase(login.fulfilled,   (s, { payload }) => { s.loading = false; s.user = payload; })
      .addCase(login.rejected,    (s, { payload }) => { s.loading = false; s.error = payload ?? null; })

      .addCase(logout.fulfilled,  (s) => { s.user = null; })

      .addCase(fetchProfile.pending,  (s) => { s.loading = true; })
      .addCase(fetchProfile.fulfilled,(s, { payload }) => { s.loading = false; s.user = payload; })
      .addCase(fetchProfile.rejected, (s) => { s.loading = false; s.user = null; });
  },
});

export const { setUser } = slice.actions;
export default slice.reducer;
