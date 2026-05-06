import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type UserDataType } from "@/schema/user";

interface UserStore {
  user: UserDataType | null;
  isAuthenticated: boolean;
  login: (userData: UserDataType) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) =>
        set({
          user: userData,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "user-storage",
    }
  )
);