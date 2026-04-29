import { create } from "zustand";

interface MenuState {
    isOpen: boolean,
    toggleOpen: (state: boolean) => Promise<void>;
}

export const useMenuStore = create<MenuState>((set) => ({
    isOpen: false,
    toggleOpen: async (state: boolean) => {
        set({ isOpen: state })
    }
}
))