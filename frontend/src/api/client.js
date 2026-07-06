const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(formatError(data) || `Request failed (${res.status})`);
  }

  return data;
}

// Backend returns either a plain string error, or a Zod array of issues.
function formatError(data) {
  if (!data) return null;
  if (typeof data.error === 'string') return data.error;
  if (Array.isArray(data.error)) {
    return data.error.map((issue) => issue.message).join(', ');
  }
  return null;
}

export const api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getTasks: (token) => request('/tasks', { token }),
  createTask: (payload, token) => request('/tasks', { method: 'POST', body: payload, token }),
  updateTask: (id, payload, token) => request(`/tasks/${id}`, { method: 'PUT', body: payload, token }),
  deleteTask: (id, token) => request(`/tasks/${id}`, { method: 'DELETE', token }),
};
