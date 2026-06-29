import { create } from "zustand";
import { api } from "../lib/api";
import socket from "../lib/socket";

const currentUser = JSON.parse(localStorage.getItem("tf_user") || "null");
if (currentUser) {
  socket.emit("join", currentUser.id);
}

const useAuthStore = create((set) => ({
  isLoggedIn:  !!localStorage.getItem("tf_token"),
  currentUser,
  loginError:  null,
  isLoading:   false,

  login: async (email, password) => {
    set({ isLoading: true, loginError: null });
    try {
      const { token, user } = await api.login(email, password);
      localStorage.setItem("tf_token", token);
      localStorage.setItem("tf_user", JSON.stringify(user));
      set({ isLoggedIn: true, currentUser: user, isLoading: false });
      socket.emit('join', user.id);
    } catch (err) {
      set({ isLoading: false, loginError: err.message });
    }
  },

  demoLogin: async () => {
    set({ isLoading: true, loginError: null });
    try {
      const { token, user } = await api.login("sarah@trackflow.io", "demo123");
      localStorage.setItem("tf_token", token);
      localStorage.setItem("tf_user", JSON.stringify(user));
      set({ isLoggedIn: true, currentUser: user, isLoading: false });
      socket.emit('join', user.id);
    } catch (err) {
      set({ isLoading: false, loginError: err.message });
    }
  },

  logout: () => {
    localStorage.removeItem("tf_token");
    localStorage.removeItem("tf_user");
    set({ isLoggedIn: false, currentUser: null });
  },

  updateProfile: (updates) =>
    set((s) => {
      const updated = { ...s.currentUser, ...updates };
      localStorage.setItem("tf_user", JSON.stringify(updated));
      return { currentUser: updated };
    }),
}));

export default useAuthStore;
