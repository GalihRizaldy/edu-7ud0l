import { apiClient } from './apiClient';

export const topUpBalance = async (username, amount) => {
  return apiClient('/topup', {
    method: 'POST',
    body: JSON.stringify({ username, amount })
  });
};

export const fetchAllUsers = async () => {
  return apiClient('/users');
};

export const fetchAdminStats = async () => {
  return apiClient('/admin/stats');
};

export const createUser = async (userData) => {
  return apiClient('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

export const updateUser = async (id, updateData) => {
  return apiClient(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
};

export const triggerJackpotUser = async (id) => {
  return apiClient(`/users/${id}/jackpot`, {
    method: 'POST'
  });
};

export const deleteUser = async (id) => {
  return apiClient(`/users/${id}`, {
    method: 'DELETE'
  });
};
