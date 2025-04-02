// /src/store/statusStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
    getStatuses,
    postStatus,
    putStatus,
    getStatusByTask,
} from "../../hooks/data/status/statusServer"
import useAuthStore from "./authStore"


const initialState = {
    statuses: [],
    currentTaskStatus: null,
    loading: false,
    error: null,
}

const useStatusStore = create(
    persist(
        (set) => ({
            ...initialState,

            // Setter para actualizar el listado de statuses
            setStatuses: (statuses) => set({ statuses }),

            // Agregar un nuevo status al estado actual
            addStatus: (newStatus) =>
                set((state) => ({ statuses: [...state.statuses, newStatus] })),

            // Acción para obtener statuses usando la función de API
            fetchStatuses: async () => {
                const { role } = useAuthStore.getState()
                if (role !== "admin") {
                    set({
                        error: "No tienes permisos para obtener los estados.",
                    })
                    return
                }
                set({ loading: true, error: null })
                try {
                    const statuses = await getStatuses()
                    set({ statuses, loading: false })
                } catch (error) {
                    console.error("Error al obtener los estados:", error)
                    set({
                        error: "Error al obtener los estados.",
                        loading: false,
                    })
                }
            },

            // Crea un nuevo status
            createStatus: async (payload) => {
                const { role } = useAuthStore.getState()
                if (role !== "admin") {
                    set({ error: "No tienes permisos para crear un estado." })
                    return
                }
                set({ loading: true, error: null })
                try {
                    const newStatus = await postStatus(payload)
                    set((state) => ({
                        statuses: [...state.statuses, newStatus],
                        loading: false,
                    }))
                } catch (error) {
                    console.error("Error al crear el estado:", error)
                    set({ error: "Error al crear el estado.", loading: false })
                }
            },

            // Actualiza un status existente
            updateStatus: async (id, updatedData) => {
                const { role } = useAuthStore.getState()
                if (role !== "admin") {
                    set({
                        error: "No tienes permisos para actualizar el estado.",
                    })
                    return
                }
                set({ loading: true, error: null })
                try {
                    const updatedStatus = await putStatus(id, updatedData)
                    set((state) => ({
                        statuses: state.statuses.map((status) =>
                            status.id === id ? updatedStatus : status
                        ),
                        loading: false,
                    }))
                } catch (error) {
                    console.error("Error al actualizar el estado:", error)
                    set({
                        error: "Error al actualizar el estado.",
                        loading: false,
                    })
                }
            },

            // Obtiene el status asociado a una tarea específica
            fetchStatusByTask: async (task_id) => {
                const { role } = useAuthStore.getState()
                if (role !== "admin") {
                    set({
                        error: "No tienes permisos para obtener el estado de la tarea.",
                    })
                    return
                }
                if (!task_id) {
                    set({ error: "Task ID no proporcionado." })
                    return
                }
                set({ loading: true, error: null })
                try {
                    const statusData = await getStatusByTask(task_id)
                    set({ currentTaskStatus: statusData, loading: false })
                } catch (error) {
                    console.error(
                        "Error al obtener el estado de la tarea:",
                        error
                    )
                    set({
                        error: "Error al obtener el estado de la tarea.",
                        loading: false,
                    })
                }
            },

            clearError: () => set({ error: null }),

            resetStatusStore: () => set({ ...initialState }),
        }),
        {
            name: "status-store",
            getStorage: () => localStorage,
        }
    )
)

export default useStatusStore
