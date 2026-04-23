import { apiClient } from './apiClient';

export const loginUser = async (username, password) => {
  return apiClient('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
};
