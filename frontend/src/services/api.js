const BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('token');
}

export function setAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function getAuth() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return { token, user };
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

async function request(method, path, body, isForm = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body, isForm = false) => request('PUT', path, body, isForm),
  patch: (path, body) => request('PATCH', path, body),
  del: (path) => request('DELETE', path),

  register: (data) => request('POST', '/auth/register', data),
  login: (data) => request('POST', '/auth/login', data),
  adminLogin: (data) => request('POST', '/auth/admin-login', data),
  me: () => request('GET', '/auth/me'),

  products: (category) => request('GET', category ? `/products?category=${category}` : '/products'),
  featuredProducts: () => request('GET', '/products/featured'),
  categories: () => request('GET', '/products/categories'),
  product: (slug) => request('GET', `/products/${slug}`),

  placeOrder: (data) => request('POST', '/orders', data),
  myOrders: () => request('GET', '/orders/mine'),
  trackOrder: (id) => request('GET', `/orders/track/${id}`),
  payStatus: (ref) => request('GET', `/payments/paypack/status/${ref}`),

  internshipApply: (formData) => request('POST', '/internship/apply', formData, true),
  courses: () => request('GET', '/courses'),
  course: (slug) => request('GET', `/courses/${slug}`),
  registerCourse: (data) => request('POST', '/courses/register', data),

  sendMessage: (data) => request('POST', '/contact/message', data),
  blog: () => request('GET', '/blog'),
  blogPost: (slug) => request('GET', `/blog/${slug}`),

  adminDashboard: () => request('GET', '/admin/dashboard'),
  adminOrders: () => request('GET', '/admin/orders'),
  adminUpdateOrder: (id, status) => request('PATCH', `/admin/orders/${id}/status`, { status }),
  adminReports: () => request('GET', '/admin/reports'),
  adminInternships: () => request('GET', '/internship/applications'),
  adminUpdateInternship: (id, status) => request('PATCH', `/internship/applications/${id}/status`, { status }),
  adminRegistrations: () => request('GET', '/courses/registrations/all'),
  adminUpdateRegistration: (id, status) => request('PATCH', `/courses/registrations/${id}/status`, { status }),
  adminMessages: () => request('GET', '/contact/messages'),
  adminCreateProduct: (formData) => request('POST', '/products', formData, true),
  adminUpdateProduct: (id, formData) => request('PUT', `/products/${id}`, formData, true),
  adminDeleteProduct: (id) => request('DELETE', `/products/${id}`),
  adminCreateCourse: (formData) => request('POST', '/courses', formData, true),
  adminCreateBlog: (formData) => request('POST', '/blog', formData, true),
};
