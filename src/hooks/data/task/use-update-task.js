// /src/hooks/data/use-update-task.js
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { taskMutationKeys } from "../../../keys/mutations"
import { taskQueryKeys } from "../../../keys/queries"
import { api } from "../../../lib/axios"

export const useUpdateTask = (taskId) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: taskMutationKeys.update(taskId),
        mutationFn: async (data) => {
            console.log("📌 Datos a actualizar:", data)
            const { data: updatedTask } = await api.put(`/tasks/${taskId}`, {
                // 🛠️ Cambiado de PATCH a PUT
                title: data?.title?.trim(),
                description: data?.description?.trim(),
                time: data?.time,
                status: data?.status,
            })
            return updatedTask
        },
        retry: 2, // ⬅️ Reintentar 2 veces antes de fallar
        onSuccess: (updatedTask) => {
            queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks) => {
                return oldTasks
                    ? oldTasks.map((task) =>
                          task.id === taskId ? updatedTask : task
                      )
                    : []
            })

            queryClient.setQueryData(taskQueryKeys.getOne(taskId), updatedTask)
        },
        onError: (error) => {
            console.error("🔴 Error al actualizar tarea:", error)
        },
    })
}
