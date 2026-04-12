// ─── API Client ── Base HTTP wrapper ─────────────────────────────────────────
import { useAuthStore } from '../store/authStore';

const BASE_URL = import.meta.env.PROD ? 'http://localhost:5000/api' : '/api';

async function request(endpoint, options = {}) {
  const { method = 'GET', body } = options;
  const isFormData = body instanceof FormData;

  // Lấy user từ store để gửi kèm headers
  const currentUser = useAuthStore.getState().currentUser;

  const config = {
    method,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  };

  // Gửi user info trong headers để server verify
  if (currentUser) {
    config.headers['x-user-id'] = currentUser._id || currentUser.id;
    config.headers['x-user-role'] = currentUser.role;
    config.headers['x-user-status'] = currentUser.status || 'active';
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
