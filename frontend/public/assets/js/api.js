import { getLang, t } from './i18n/index.js';

const TOKEN_KEY = 'forreira_admin_token';

export const session = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (auth) headers.Authorization = `Bearer ${session.get()}`;

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let message;
    if (getLang() === 'en') {
      if (response.status === 400) message = t('apiError.400');
      else if (response.status === 401) message = t('apiError.401');
      else if (response.status === 404) message = t('apiError.404');
      else if (response.status === 429) message = t('apiError.429');
      else message = t('apiError.other');
    } else {
      const serverMsg = Array.isArray(data?.message) ? data.message.join('، ') : data?.message;
      message = serverMsg || t('apiError.other');
    }
    throw new ApiError(message, response.status);
  }
  return data;
}

export const publicApi = {
  track: (code) => request(`/shipments/track/${encodeURIComponent(code)}`),
  createShipment: (payload) => request('/shipments', { method: 'POST', body: payload }),
};

export const adminApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  listShipments: ({ status, page }) => {
    const params = new URLSearchParams({ page });
    if (status) params.set('status', status);
    return request(`/admin/shipments?${params}`, { auth: true });
  },
  updateStatus: (id, payload) =>
    request(`/admin/shipments/${id}/status`, { method: 'PATCH', body: payload, auth: true }),
};
