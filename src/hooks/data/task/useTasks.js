// src/hooks/data/task/useTasks.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../lib/axios"
import useTaskStore from "../../../store/taskStore"
import { taskQueryKeys } from "../../../keys/queries"
import { taskMutationKeys } from "../../../keys/mutations"

export const useTasks = () => {
    const queryClient = useQueryClient()
    const { tasks, addTask, deleteTask, updateTask, setTasks, filterTasks } =
        useTaskStore()

    // Consulta para obtener todas las tareas
    const getTasks = useQuery({
        queryKey: taskQueryKeys.getAll(),
        queryFn: async () => {
            const { data } = await api.get("/tasks")
            console.log("Tareas recibidas:", data)
            setTasks(data.tasks)
            return data.tasks
        },
        enabled: true,
    })

    // Mutación para agregar una tarea
    const addTaskMutation = useMutation({
        mutationKey: taskMutationKeys.add(),
        mutationFn: async (task) => {
            console.log("Agregando tarea:", task)
            const { data } = await api.post("/tasks", task)
            console.log("Tarea creada:", data)
            return data
        },
        onSuccess: (createdTask) => {
            addTask(createdTask)
            queryClient.setQueryData(
                taskQueryKeys.getAll(),
                (oldTasks = []) => [...oldTasks, createdTask]
            )
        },
    })

    // Mutación para actualizar una tarea (mejorada)
    const updateTaskMutation = useMutation({
        mutationKey: taskMutationKeys.update(), // Puedes incluir el taskId si tu key lo requiere
        mutationFn: async ({ taskId, task }) => {
            // Construir payload con los nombres de campo correctos y limpieza de espacios
            const payload = {
                company: task.company?.trim(),
                project: task.project?.trim(),
                task_type: task.task_type?.trim(),
                task_description: task.task_description?.trim(),
                task_date: task.task_date,
                entry_time: task.entry_time,
                exit_time: task.exit_time,
                lunch_hours: task.lunch_hours,
                hour_type: task.hour_type,
                status: task.status,
            }
            // Realizamos la petición PUT usando un endpoint RESTful
            console.log("Payload para actualizar:", payload)
            console.log("ID de tarea a actualizar:", taskId)
            const { data } = await api.put(`/tasks?task_id=${taskId}`, payload)
            console.log("Respuesta del servidor:", data)
            // Retornamos el payload para actualizar el store y la caché
            return payload
        },
        retry: 2,
        onSuccess: (updatedTask, { taskId }) => {
            // Actualizamos el store local de Zustand
            updateTask(taskId, updatedTask)
            // Actualizamos la caché de React Query para "getAll"
            queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks = []) =>
                oldTasks.map((t) =>
                    t.id === taskId ? { ...t, ...updatedTask } : t
                )
            )
            // Actualizamos la caché para "getOne"
            queryClient.setQueryData(taskQueryKeys.getOne(taskId), {
                ...updatedTask,
                id: taskId,
            })
        },
        onError: (error) => {
            console.error("🔴 Error al actualizar la tarea:", error)
        },
    })

    // Mutación para eliminar una tarea
    const deleteTaskMutation = useMutation({
        mutationKey: taskMutationKeys.delete(),
        mutationFn: async (taskId) => {
            await api.delete("/tasks", { params: { task_id: taskId } })
            return taskId
        },
        onSuccess: (taskId) => {
            deleteTask(taskId)
            queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks) =>
                oldTasks ? oldTasks.filter((task) => task.id !== taskId) : []
            )
        },
    })

    // Nuevo: Hook para obtener una tarea específica (filtrar por id)
    // Nota: Este hook debe llamarse desde el componente de forma directa,
    // ya que es un custom hook (debe iniciarse con "use").
    const useGetTaskById = ({ taskId, onSuccess }) => {
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
                    const { data: task } = await api.get(
                        `/tasks/task/${taskId}`
                    )
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

    return {
        tasks,
        getTasks,
        addTaskMutation,
        updateTaskMutation,
        deleteTaskMutation,
        filterTasks,
        useGetTaskById,
    }
}
