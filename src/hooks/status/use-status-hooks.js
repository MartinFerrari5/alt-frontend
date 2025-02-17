// /src/hooks/data/use-status-hooks.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../lib/axios"
import useAuthStore from "../../store/authStore"

// Claves de consulta para React Query relacionadas con "status"
const statusQueryKeys = {
    all: () => ["status"],
    detail: (id) => ["status", id],
    byTask: (task_id) => ["status", "task", task_id],
}

/**
 * Hook para obtener todos los status.
 * Se requiere que el usuario tenga rol "admin".
 */
export const useGetStatus = () => {
    const role = useAuthStore((state) => state.role)

    return useQuery({
        queryKey: statusQueryKeys.all(),
        queryFn: async () => {
            if (role !== "admin") {
                throw new Error(
                    "No tienes permisos para obtener la información de status."
                )
            }
            const { data } = await api.get("/status")
            return data
        },
        enabled: role === "admin",
    })
}

/**
 * Hook para crear un nuevo status.
 * Se espera recibir un objeto con la siguiente estructura:
 * {
 *    tasks: [ ... ], // Array de tareas (ver ejemplo arriba)
 *    id: "..."       // Un identificador (puede ser el user_id u otro)
 * }
 *
 * Ejemplo de uso:
 *   const { mutate: createStatus } = useCreateStatus();
 *   createStatus({ tasks: [...], id: "267413f1-e79e-11ef-acb7-04bf1b130b11" });
 */
export const useCreateStatus = () => {
    const role = useAuthStore((state) => state.role)
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload) => {
            // Verifica que el usuario tenga permisos
            if (role !== "admin") {
                throw new Error("No tienes permisos para crear un status.")
            }
            // El payload debe tener la estructura requerida (tasks y id)
            const { data } = await api.post("/status/download", payload)
            return data
        },
        onSuccess: () => {
            // Invalida la query para refrescar la lista de status
            queryClient.invalidateQueries(statusQueryKeys.all())
        },
    })
}

/**
 * Hook para actualizar un status existente.
 * Ejemplo de uso:
 *   const { mutate: updateStatus } = useUpdateStatus();
 *   updateStatus({ id: 123, updatedData: { name: "Actualizado" } });
 */
export const useUpdateStatus = () => {
    const role = useAuthStore((state) => state.role)
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, updatedData }) => {
            if (role !== "admin") {
                throw new Error("No tienes permisos para actualizar el status.")
            }
            const { data } = await api.put(`/status/${id}`, updatedData)
            return data
        },
        onSuccess: (_data, variables) => {
            // Invalida la lista general y el detalle del status actualizado
            queryClient.invalidateQueries(statusQueryKeys.all())
            queryClient.invalidateQueries(statusQueryKeys.detail(variables.id))
        },
    })
}

/**
 * Hook para obtener el status asociado a una tarea específica.
 *
 * @param {string|number} task_id - El ID de la tarea.
 */
export const useGetStatusByTask = (task_id) => {
    const role = useAuthStore((state) => state.role)

    return useQuery({
        queryKey: statusQueryKeys.byTask(task_id),
        queryFn: async () => {
            if (role !== "admin") {
                throw new Error(
                    "No tienes permisos para obtener el status de la tarea."
                )
            }
            const { data } = await api.get(`/status/task/${task_id}`)
            return data
        },
        enabled: role === "admin" && !!task_id,
    })
}
