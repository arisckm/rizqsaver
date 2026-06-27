import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('rizq_user')) || null,
  token: localStorage.getItem('rizq_token') || null,
  loading: false,
  error: null,

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', data);
      const { token, user } = res.data;
      localStorage.setItem('rizq_token', token);
      localStorage.setItem('rizq_user', JSON.stringify(user));
      set({ user, token, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', credentials);
      const { token, user } = res.data;
      localStorage.setItem('rizq_token', token);
      localStorage.setItem('rizq_user', JSON.stringify(user));
      set({ user, token, loading: false });
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed.';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('rizq_token');
    localStorage.removeItem('rizq_user');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
