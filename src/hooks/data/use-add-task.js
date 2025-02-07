// // src/hooks/data/use-add-task.js

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { taskMutationKeys } from "../../keys/mutations"
import { taskQueryKeys } from "../../keys/queries"
import { api } from "../../lib/axios"

export const useAddTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: taskMutationKeys.add(),
        mutationFn: async (task) => {
            try {
                const { data } = await api.post("/tasks", task)
                console.log("📌 Tarea creada:", data)
                return data
            } catch (error) {
                console.error(
                    "Error al crear la tarea:",
                    error.response?.data || error.message
                )
                throw error
            }
        },
        onSuccess: (createdTask) => {
            queryClient.setQueryData(
                taskQueryKeys.getAll(),
                (oldTasks = []) => [...oldTasks, createdTask]
            )
        },
    })
}
