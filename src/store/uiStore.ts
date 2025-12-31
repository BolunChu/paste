import { create } from 'zustand';

interface UIState {
    isTestMode: boolean; // Endfield Mode
    toggleTestMode: () => void;
    setTestMode: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isTestMode: false,
    toggleTestMode: () => set((state) => ({ isTestMode: !state.isTestMode })),
    setTestMode: (v) => set({ isTestMode: v }),
}));
