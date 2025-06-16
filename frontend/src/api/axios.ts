import axios, {
  AxiosHeaders,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from 'axios';

/* базовый инстанс --------------------------------------------------- */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || '/api',
  withCredentials: false,             // cookie‑сессия не нужна для Token‑auth
});

/* вспомогательные функции ------------------------------------------ */
const isAxiosHeaders = (h: unknown): h is AxiosHeaders =>
  !!h && typeof (h as AxiosHeaders).set === 'function';

function putHeader(
  cfg: InternalAxiosRequestConfig,
  key: string,
  val: string,
): void {
  if (isAxiosHeaders(cfg.headers)) {
    cfg.headers.set(key, val);
  } else {
    const h = (cfg.headers ?? {}) as AxiosRequestHeaders;
    h[key] = val;
    cfg.headers = h;
  }
}

/* интерцептор: Token + CSRF ---------------------------------------- */
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) putHeader(cfg, 'Authorization', `Token ${token}`);

  if (/^(post|put|patch|delete)$/i.test(cfg.method ?? '')) {
    const m = document.cookie.match(/csrftoken=([^;]+)/);
    if (m) putHeader(cfg, 'X-CSRFToken', m[1]);
  }
  return cfg;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;        //  ← важно: default‑экспорт
