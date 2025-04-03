// /src/hooks/data/status/use-status-hooks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
    getStatuses,
    postStatus,
    putStatus,
    getStatusByTask,
    getFilteredExportedTasks,
    postStatusRRHH,
} from "./statusServer.js"
import useAuthStore from "../../../store/modules/authStore.js"
import useStatusStore from "../../../store/modules/statusStore.js"

// Claves de consulta para React Query relacionadas con "status"
const statusQueryKeys = {
    all: () => ["status"],
    detail: (id) => ["status", id],
    byTask: (task_id) => ["status", "task", task_id],
}

export const useGetStatus = () => {
    const role = useAuthStore((state) => state.role)
    const setStatuses = useStatusStore((state) => state.setStatuses)

    return useQuery({
        queryKey: statusQueryKeys.all(),
        queryFn: async () => {
            if (role !== "admin") {
                throw new Error(
                    "No tienes permisos para obtener la información de status."
                )
            }
            return await getStatuses()
        },
        enabled: role === "admin",
        onSuccess: (data) => {
            setStatuses(data)
        },
    })
}

export const useCreateStatus = () => {
    const role = useAuthStore((state) => state.role)
    const queryClient = useQueryClient()
    const addStatus = useStatusStore((state) => state.addStatus)

    return useMutation({
        mutationFn: async (payload) => {
            if (role !== "admin") {
                throw new Error("No tienes permisos para crear un status.")
            }
            return await postStatus(payload)
        },
        onSuccess: (newStatus) => {
            queryClient.invalidateQueries(statusQueryKeys.all())
            addStatus(newStatus)
        },
    })
}

export const useUpdateStatus = () => {
    const role = useAuthStore((state) => state.role)
    const queryClient = useQueryClient()
    const updateLocalStatus = useStatusStore((state) => state.updateStatus)

    return useMutation({
        mutationFn: async ({ id, updatedData }) => {
            if (role !== "admin") {
                throw new Error("No tienes permisos para actualizar el status.")
            }
            return await putStatus(id, updatedData)
        },
        onSuccess: (updatedStatus, variables) => {
            queryClient.invalidateQueries(statusQueryKeys.all())
            queryClient.invalidateQueries(statusQueryKeys.detail(variables.id))
            updateLocalStatus(updatedStatus)
        },
    })
}

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
            return await getStatusByTask(task_id)
        },
        enabled: role === "admin" && !!task_id,
    })
}

export const useFilterExportedTasks = (filters) => {
    const { fullname, date } = filters

    return useQuery({
        queryKey: ["filterTasks", { fullname, date }],
        queryFn: async () => {
            return await getFilteredExportedTasks(filters)
        },
        enabled: Boolean(fullname || date),
    })
}

/**
 * Hook para enviar tareas a RRHH. Solo disponible para usuarios con roles "admin" o "user".
 * @returns Un objeto con la función de envío y un objeto con la respuesta.
 */
export const useSendStatusToRRHH = () => {
    const role = useAuthStore((state) => state.role)
    const queryClient = useQueryClient()

    return useMutation({
        /**
         * Función de envío de tareas a RRHH.
         * @param {{ queryParams: Object, payload: Object }} data - Datos a enviar.
         * @returns Promesa con el resultado del envío.
         */
        mutationFn: async ({ queryParams, payload }) => {
            if (role !== "admin" && role !== "user") {
                throw new Error("No tienes permisos para enviar tareas a RRHH.")
            }
            return await postStatusRRHH(queryParams, payload)
        },
        /**
         * Función que se ejecuta si el envío es exitoso.
         * Invalida la caché de la lista de status.
         */
        onSuccess: () => {
            queryClient.invalidateQueries(statusQueryKeys.all())
        },
    })
}
