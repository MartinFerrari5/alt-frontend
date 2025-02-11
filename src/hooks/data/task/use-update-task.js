// src/hooks/data/use-update-task.js
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { taskMutationKeys } from "../../../keys/mutations"
import { taskQueryKeys } from "../../../keys/queries"
import { api } from "../../../lib/axios"
import useTaskStore from "../../../store/taskStore"

export const useUpdateTask = (taskId) => {
    const queryClient = useQueryClient()
    const updateTask = useTaskStore((state) => state.updateTask)

    return useMutation({
        mutationKey: taskMutationKeys.update(taskId),
        mutationFn: async (data) => {
            const { data: updatedTask } = await api.put(`/tasks/${taskId}`, {
                title: data?.title?.trim(),
                description: data?.description?.trim(),
                time: data?.time,
                status: data?.status,
            })
            return updatedTask
        },
        retry: 2,
        onSuccess: (updatedTask) => {
            updateTask(taskId, updatedTask) // Actualizar la tarea en el store de Zustand
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
