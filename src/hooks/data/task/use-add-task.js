// src/hooks/data/task/use-add-task.js
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { taskMutationKeys } from "../../../keys/mutations"
import { taskQueryKeys } from "../../../keys/queries"
import { api } from "../../../lib/axios"
import useTaskStore from "../../../store/taskStore"

export const useAddTask = () => {
    const queryClient = useQueryClient()
    const addTaskFromStore = useTaskStore((state) => state.addTask)

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
            try {
                if (typeof addTaskFromStore === "function") {
                    addTaskFromStore(createdTask) // Agregar la tarea al store de Zustand
                }
            } catch (error) {
                console.error("Error actualizando el store de tareas:", error)
                // Si prefieres no propagar el error, lo capturamos y evitamos que se lance
            }
            queryClient.setQueryData(
                taskQueryKeys.getAll(),
                (oldTasks = []) => [...oldTasks, createdTask]
            )
        },
    })
}
