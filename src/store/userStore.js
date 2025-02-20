// /src/store/statusStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

const useStatusStore = create(
    persist(
        (set) => ({
            statuses: [],
            isLoading: false,
            error: null,

            setStatuses: (statuses) => set({ statuses }),
            addStatus: (status) =>
                set((state) => ({ statuses: [...state.statuses, status] })),
            updateStatus: (updatedStatus) =>
                set((state) => ({
                    statuses: state.statuses.map((status) =>
                        status.id === updatedStatus.id ? updatedStatus : status
                    ),
                })),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),
        }),
        {
            name: "status-storage", // Nombre de la clave en el storage (localStorage)
            getStorage: () => localStorage,
        }
    )
)

export default useStatusStore
