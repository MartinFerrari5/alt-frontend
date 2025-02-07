// // src/hooks/data/use-delete-task.js
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { taskMutationKeys } from "../../../keys/mutations"
import { taskQueryKeys } from "../../../keys/queries"
import { api } from "../../../lib/axios"

export const useDeleteTask = (taskId) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: taskMutationKeys.delete(),
        mutationFn: async () => {
            const { data: deletedTask } = await api.delete(`/tasks/${taskId}`)
            return deletedTask
        },
        onSuccess: () => {
            queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks) => {
                return oldTasks
                    ? oldTasks.filter((task) => task.id !== taskId)
                    : []
            })
        },
        onError: (error) => {
            console.error("🔴 Error al eliminar la tarea:", error)
        },
    })
}
