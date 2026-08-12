const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
}

export function getDepartments() {
  return request('/api/departments');
}

export function getDoctorsByDepartment(departmentId) {
  return request(`/api/doctors?departmentId=${encodeURIComponent(departmentId)}`);
}

export function getAvailableSlots(doctorId, date) {
  return request(
    `/api/doctors/${encodeURIComponent(doctorId)}/available-slots?date=${encodeURIComponent(date)}`
  );
}

export function createAppointment(payload) {
  return request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logoutUser() {
  return request('/api/auth/logout', {
    method: 'POST',
  });
}

export function getCurrentUser() {
  return request('/api/auth/me');
}
