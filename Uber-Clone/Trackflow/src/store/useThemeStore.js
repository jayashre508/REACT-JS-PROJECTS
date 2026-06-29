import { create } from "zustand";

const useThemeStore = create((set) => ({
  dark: false,
  toggleDark: () =>
    set((s) => {
      const next = !s.dark;
      document.documentElement.classList.toggle("dark", next);
      return { dark: next };
    }),
}));

export default useThemeStore;
