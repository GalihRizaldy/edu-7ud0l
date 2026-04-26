export const apiClient = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const BASE_URL = import.meta.env.VITE_API_URL || '';

  try {
    const response = await fetch(`${BASE_URL}/api${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Terjadi kesalahan pada server');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};
