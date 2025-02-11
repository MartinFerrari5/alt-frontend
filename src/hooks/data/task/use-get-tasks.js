// src/hooks/data/use-get-tasks.js
import { useQuery } from "@tanstack/react-query"
import { taskQueryKeys } from "../../../keys/queries"
import { api } from "../../../lib/axios"
import useTaskStore from "../../../store/taskStore"

export const useGetTasks = () => {
    const setTasks = useTaskStore((state) => state.setTasks) // Obtener la función setTasks del store

    return useQuery({
        queryKey: taskQueryKeys.getAll(),
        queryFn: async () => {
            try {
                const { data } = await api.get("/tasks")
                setTasks(data.tasks)
                return data.tasks
            } catch (error) {
                console.error("❌ Error obteniendo las tareas:", error)
                throw new Error("Error al obtener las tareas.")
            }
        },
    })
}
