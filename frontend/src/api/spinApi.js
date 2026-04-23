import { apiClient } from './apiClient';

export const spinSlot = async (username) => {
  return apiClient('/spin', {
    method: 'POST',
    body: JSON.stringify({ username })
  });
};
