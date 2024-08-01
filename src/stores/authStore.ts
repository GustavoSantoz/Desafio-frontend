import { create } from "zustand";

interface AuthState {
  email: string;
  password: string;
  isRegister: boolean;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  toggleIsRegister: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: "",
  password: "",
  isRegister: false,
  isLoading: false,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  toggleIsRegister: () => set((state) => ({ isRegister: !state.isRegister })),
  setLoading: (loading) => set({ isLoading: loading }),
}));
