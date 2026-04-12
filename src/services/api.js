// ─── API Client ── Base HTTP wrapper ─────────────────────────────────────────
import { useAuthStore } from '../store/authStore';

const BASE_URL = import.meta.env.PROD ? 'http://localhost:5000/api' : '/api';

async function request(endpoint, options = {}) {
  const { method = 'GET', body } = options;
  const isFormData = body instanceof FormData;

  // ✅ SECURITY FIX: Lấy JWT token từ store thay vì gửi user info
  const token = useAuthStore.getState().token;

  const config = {
    method,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  };

  // ✅ NEW: Gửi JWT token trong Authorization header (Bearer scheme)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
