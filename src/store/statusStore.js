// /src/store/statusStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api } from "../lib/axios"
import useAuthStore from "./authStore"

const useStatusStore = create(
    persist(
        (set) => ({
            // Estado inicial
            statuses: [],
            currentTaskStatus: null,
            loading: false,
            error: null,

            // Setter para actualizar directamente el listado de statuses
            setStatuses: (statuses) => set({ statuses }),

            /**
             * Obtiene todos los status y actualiza el store.
             * (Este método lo usaremos desde el hook si se desea realizar la consulta desde el store)
             */
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
                    const { data } = await api.get("/status")
                    set({ statuses: data, loading: false })
                } catch (error) {
                    console.error("Error al obtener los estados:", error)
                    set({
                        error: "Error al obtener los estados.",
                        loading: false,
                    })
                }
            },

            /**
             * Crea un nuevo status y lo agrega al store.
             * Se espera recibir un objeto con la siguiente estructura:
             * {
             *   tasks: [ ... ], // Array de tareas
             *   id: "..."       // Identificador (por ejemplo, user_id)
             * }
             */
            createStatus: async (payload) => {
                const { role } = useAuthStore.getState()
                if (role !== "admin") {
                    set({ error: "No tienes permisos para crear un estado." })
                    return
                }
                set({ loading: true, error: null })
                try {
                    const { data } = await api.post("/status/download", payload)
                    set((state) => ({
                        statuses: [...state.statuses, data],
                        loading: false,
                    }))
                } catch (error) {
                    console.error("Error al crear el estado:", error)
                    set({ error: "Error al crear el estado.", loading: false })
                }
            },

            /**
             * Actualiza un status existente en el store.
             *
             * @param {number|string} id - ID del status a actualizar.
             * @param {Object} updatedData - Datos actualizados.
             */
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
                    const { data } = await api.put(`/status/${id}`, updatedData)
                    set((state) => ({
                        statuses: state.statuses.map((status) =>
                            status.id === id ? data : status
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

            /**
             * Obtiene el status asociado a una tarea específica y lo guarda en el store.
             *
             * @param {number|string} task_id - ID de la tarea.
             */
            fetchStatusByTask: async (task_id) => {
                const { role } = useAuthStore.getState()
                if (role !== "admin") {
                    set({
                        error: "No tienes permisos para obtener el estado de la tarea.",
                    })
                    return
                }
                set({ loading: true, error: null })
                try {
                    const { data } = await api.get(`/status/task/${task_id}`)
                    set({ currentTaskStatus: data, loading: false })
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

            /**
             * Limpia el mensaje de error del store.
             */
            clearError: () => set({ error: null }),
        }),
        {
            name: "status-store", // Clave para localStorage
        }
    )
)

export default useStatusStore
