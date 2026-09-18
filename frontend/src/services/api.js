const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('yuvasetu_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  checkAdminExists: async () => {
    const res = await fetch(`${API_BASE}/auth/admin-exists`);
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getHeaders(),
      });
    } catch (e) {
      // ignore
    }
  },

  // Student Profile
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/student/profile`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE}/student/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },

  uploadPhoto: async (formData) => {
    const res = await fetch(`${API_BASE}/student/profile/photo`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(res);
  },

  // Education
  getEducation: async () => {
    const res = await fetch(`${API_BASE}/student/education`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateEducation: async (educationData) => {
    const res = await fetch(`${API_BASE}/student/education`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(educationData),
    });
    return handleResponse(res);
  },

  // Current Academics
  updateAcademics: async (academicData) => {
    const res = await fetch(`${API_BASE}/student/academics`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(academicData),
    });
    return handleResponse(res);
  },

  // Skills
  updateSkills: async (skills) => {
    const res = await fetch(`${API_BASE}/student/skills`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ skills }),
    });
    return handleResponse(res);
  },

  // Resume
  uploadResume: async (formData) => {
    const res = await fetch(`${API_BASE}/student/resume`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(res);
  },

  deleteResume: async () => {
    const res = await fetch(`${API_BASE}/student/resume`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Drives
  getDrives: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/drives${query ? '?' + query : ''}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getDriveById: async (id) => {
    const res = await fetch(`${API_BASE}/drives/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createDrive: async (driveData) => {
    const res = await fetch(`${API_BASE}/drives`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(driveData),
    });
    return handleResponse(res);
  },

  updateDrive: async (id, driveData) => {
    const res = await fetch(`${API_BASE}/drives/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(driveData),
    });
    return handleResponse(res);
  },

  deleteDrive: async (id) => {
    const res = await fetch(`${API_BASE}/drives/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Applications
  applyForDrive: async (driveId) => {
    const res = await fetch(`${API_BASE}/applications/apply/${driveId}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getMyApplications: async () => {
    const res = await fetch(`${API_BASE}/applications/my`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAllApplications: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/applications${query ? '?' + query : ''}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateApplicationStatus: async (id, statusData) => {
    const res = await fetch(`${API_BASE}/applications/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(statusData),
    });
    return handleResponse(res);
  },

  // Admin
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAdminStudents: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/students${query ? '?' + query : ''}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAdminStudentById: async (id) => {
    const res = await fetch(`${API_BASE}/admin/students/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Logs
  getAdminLogs: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/logs${query ? '?' + query : ''}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  clearAdminLogs: async () => {
    const res = await fetch(`${API_BASE}/logs/clear`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
