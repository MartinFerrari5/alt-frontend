// src/hooks/data/use-add-task.js
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { taskMutationKeys } from "../../../keys/mutations"
import { taskQueryKeys } from "../../../keys/queries"
import { api } from "../../../lib/axios"
import useTaskStore from "../../../store/taskStore"

export const useAddTask = () => {
    const queryClient = useQueryClient()
    const addTask = useTaskStore((state) => state.addTask)

    return useMutation({
        mutationKey: taskMutationKeys.add(),
        mutationFn: async (task) => {
            try {
                const { data } = await api.post("/tasks", task)
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
            addTask(createdTask) // Agregar la tarea al store de Zustand
            queryClient.setQueryData(
                taskQueryKeys.getAll(),
                (oldTasks = []) => [...oldTasks, createdTask]
            )
        },
    })
}
