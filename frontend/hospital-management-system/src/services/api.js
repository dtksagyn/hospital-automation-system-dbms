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

export function getDashboardSummary() {
  return request('/api/dashboard');
}

export function getUserAppointments() {
  return request('/api/dashboard/appointments');
}

export function cancelAppointment(appointmentId) {
  return request(`/api/dashboard/appointments/${encodeURIComponent(appointmentId)}/cancel`, {
    method: 'PATCH',
  });
}

export function loginDoctor(payload) {
  return request('/api/doctor/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logoutDoctor() {
  return request('/api/doctor/auth/logout', {
    method: 'POST',
  });
}

export function getCurrentDoctor() {
  return request('/api/doctor/auth/me');
}

export function getDoctorDashboardSummary(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/api/doctor/dashboard${query}`);
}

export function getDoctorAppointments(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.date) searchParams.set('date', params.date);
  if (params.search) searchParams.set('search', params.search);
  const query = searchParams.toString();
  return request(`/api/doctor/appointments${query ? `?${query}` : ''}`);
}

export function getDoctorSchedule(date) {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return request(`/api/doctor/schedule${query}`);
}

export function getDoctorPatients(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/api/doctor/patients${query}`);
}

export function updateDoctorAppointmentStatus(appointmentId, visitStatus) {
  return request(
    `/api/doctor/appointments/${encodeURIComponent(appointmentId)}/visit-status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ visitStatus }),
    },
  );
}
