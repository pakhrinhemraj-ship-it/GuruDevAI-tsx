import { create } from "zustand";

// Define User type
type User = {
  name: string;
  email: string;
  role?: string;
};

// Define the store state and actions
type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  user: JSON.parse(localStorage.getItem("loggedInUser") || "null"),

  login: (user: User) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    set({ isLoggedIn: true, user });
  },

  logout: () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    set({ isLoggedIn: false, user: null });
  },
}));

export default useAuthStore;