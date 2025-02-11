// src/hooks/data/use-get-task.js
import { useQuery } from "@tanstack/react-query"
import { taskQueryKeys } from "../../../keys/queries"
import { api } from "../../../lib/axios"
import useTaskStore from "../../../store/taskStore"

export const useGetTask = ({ taskId, onSuccess }) => {
    const tasks = useTaskStore((state) => state.tasks)

    return useQuery({
        queryKey: taskQueryKeys.getOne(taskId),
        queryFn: async () => {
            if (!taskId) throw new Error("ID de tarea inválido.")

            // Verificar si la tarea ya está en el store
            const existingTask = tasks.find((task) => task.id === taskId)
            
            if (existingTask) {
                if (onSuccess) onSuccess(existingTask)
                return existingTask
            }

            // Si la tarea no está en el store, obtenerla desde la API
            try {
                const { data: task } = await api.get(`/tasks/task/${taskId}`)
                if (onSuccess) onSuccess(task)
                return task
            } catch (error) {
                if (error.response?.status === 404) {
                    console.warn("🚨 La tarea no existe o fue eliminada.")
                    return null // Evita que React Query muestre un error global
                }
                throw new Error(
                    "Error al obtener la tarea. Intenta nuevamente."
                )
            }
        },
        onError: (error) => {
            console.error("Error al obtener la tarea:", error.message)
        },
        enabled: !!taskId, // No ejecutar si taskId es null/undefined
        retry: false, // Evita reintentos automáticos
    })
}
