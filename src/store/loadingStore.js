import { create } from "zustand"

export const useLoadingStore = create((set) => ({
    isLoading: false,
    error: null,

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
}))
