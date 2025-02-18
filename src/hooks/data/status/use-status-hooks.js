// /src/hooks/data/status/use-status-hooks.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../lib/axios"
import useAuthStore from "../../../store/authStore"

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
            console.log("status", data)
            return data
        },
        enabled: role === "admin",
    })
}

/**
 * Hook para crear un nuevo status.
 * Se espera recibir un objeto con la siguiente estructura:
 * {
 *    tasks: [ ... ], // Array de tareas
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
            // Realiza la petición para crear el status
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
            const { data } = await api.put(`/status?task_id=${id}`, updatedData)
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

/**
 * Hook para filtrar tareas exportadas.
 * Endpoint: GET http://localhost:3000/reportes/status/filtertasks?fullname=&date=
 *
 * Observaciones:
 * 1. Filtro para usuario y admin de tareas exportadas.
 * 2. El usuario **NO PUEDE NI DEBE** filtrar por "fullname", solo por "date".
 * 3. "date" puede ser un mes (en inglés: December, November, etc.) o un rango de fecha.
 *
 * Ejemplos:
 *   - http://localhost:3000/reportes/status/filtertasks?fullname=Tincho&date=December
 *   - http://localhost:3000/reportes/status/filtertasks?fullname=Tincho&date=2022-01-01 2026-12-12
 *
 * @param {Object} filters - Objeto con las propiedades "fullname" y "date".
 * @returns Data de tareas filtradas.
 */
export const useFilterExportedTasks = (filters) => {
    const role = useAuthStore((state) => state.role)
    const { fullname, date } = filters

    return useQuery({
        queryKey: [
            "filterTasks",
            { fullname: role === "admin" ? fullname : "", date },
        ],
        queryFn: async () => {
            const params = new URLSearchParams()
            // Si el usuario es admin y se proporciona fullname, se agrega
            if (role === "admin" && fullname) {
                params.append("fullname", fullname)
            }
            // Siempre se envía el parámetro "date" si está presente
            if (date) {
                params.append("date", date)
            }
            // Realiza la petición GET al endpoint de filtrado
            const { data } = await api.get(
                `/reportes/status/filtertasks?${params.toString()}`
            )
            return data
        },
        enabled: !!date, // El query se activa si "date" tiene algún valor
    })
}
