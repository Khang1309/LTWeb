import { create } from 'zustand'
import { type UserDataType } from '@/schema/user';

interface UserStore {
    user: UserDataType | null; // Chỉ lưu thông tin như name, email, avatar...
    isAuthenticated: boolean;
    login: (userData: any) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    isAuthenticated: false,

    login: (userData) => set({
        user: userData,
        isAuthenticated: true
    }),

    logout: () => set({
        user: null,
        isAuthenticated: false
    }),
}));