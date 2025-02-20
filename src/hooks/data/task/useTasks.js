// src/hooks/data/task/useTasks.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    getAllTasks,
    createTask,
    updateTaskApi,
    deleteTaskApi,
    filterTasksApi,
    getTaskByIdApi,
} from "./taskService"
import useTaskStore from "../../../store/taskStore"
import { taskQueryKeys } from "../../../keys/queries"
import { taskMutationKeys } from "../../../keys/mutations"

export const useTasks = () => {
    const queryClient = useQueryClient()
    const { tasks, addTask, deleteTask, updateTask, setTasks } = useTaskStore()

    // Consulta para obtener todas las tareas
    const getTasks = useQuery({
        queryKey: taskQueryKeys.getAll(),
        queryFn: async () => {
            const tasks = await getAllTasks()
            setTasks(tasks)
            return tasks
        },
    })

    // Mutación para agregar una tarea con actualización optimista
    const addTaskMutation = useMutation({
        mutationKey: taskMutationKeys.add(),
        mutationFn: async (newTask) => await createTask(newTask),
        onMutate: async (newTask) => {
            await queryClient.cancelQueries(taskQueryKeys.getAll())
            const previousTasks = queryClient.getQueryData(taskQueryKeys.getAll()) || []
            // Asignamos un ID temporal para la tarea optimista
            const optimisticTask = {
                ...newTask,
                id: Date.now(),
                optimistic: true,
            }
            addTask(optimisticTask)
            queryClient.setQueryData(
                taskQueryKeys.getAll(),
                (oldTasks = []) => [...oldTasks, optimisticTask]
            )
            return { previousTasks, optimisticTask }
        },
        onError: (error, newTask, context) => {
            queryClient.setQueryData(taskQueryKeys.getAll(), context.previousTasks)
            deleteTask(context.optimisticTask.id)
            console.error("Error al agregar la tarea:", error)
        },
        onSuccess: (createdTask, newTask, context) => {
            queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks = []) =>
                oldTasks.map((task) =>
                    task.id === context.optimisticTask.id ? createdTask : task
                )
            )
            deleteTask(context.optimisticTask.id)
            addTask(createdTask)
        },
        onSettled: () => {
            queryClient.invalidateQueries(taskQueryKeys.getAll())
        },
    })

    // Mutación para actualizar una tarea
    const updateTaskMutation = useMutation({
        mutationKey: taskMutationKeys.update(),
        mutationFn: async ({ taskId, task }) => await updateTaskApi({ taskId, task }),
        onSuccess: (updatedTask, { taskId }) => {
            updateTask(taskId, updatedTask)
            queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks = []) =>
                oldTasks.map((t) =>
                    t.id === taskId ? { ...t, ...updatedTask } : t
                )
            )
            queryClient.setQueryData(taskQueryKeys.getOne(taskId), {
                ...updatedTask,
                id: taskId,
            })
        },
        onError: (error) => {
            console.error("Error al actualizar la tarea:", error)
        },
    })

    // Mutación para eliminar una tarea
    const deleteTaskMutation = useMutation({
        mutationKey: taskMutationKeys.delete(),
        mutationFn: async (taskId) => await deleteTaskApi(taskId),
        onSuccess: (taskId) => {
            deleteTask(taskId)
            queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks) =>
                oldTasks ? oldTasks.filter((task) => task.id !== taskId) : []
            )
        },
    })

    // Hook para filtrar tareas con múltiples opciones y combinaciones
    const useFilterTasks = (filters) => {
        return useQuery({
            queryKey: ["filterTasks", filters],
            queryFn: async () => await filterTasksApi(filters),
            enabled:
                filters &&
                Object.values(filters).some(
                    (value) => value !== undefined && value !== ""
                ),
        })
    }

    // Hook para obtener una tarea específica por ID
    const useGetTaskById = ({ taskId, onSuccess }) => {
        return useQuery({
            queryKey: taskQueryKeys.getOne(taskId),
            queryFn: async () => {
                const existingTask = tasks.find((task) => task.id === taskId)
                if (existingTask) {
                    if (onSuccess) onSuccess(existingTask)
                    return existingTask
                }
                try {
                    const task = await getTaskByIdApi(taskId)
                    if (onSuccess) onSuccess(task)
                    return task
                } catch (error) {
                    if (error.response?.status === 404) {
                        console.warn("🚨 La tarea no existe o fue eliminada.")
                        return null
                    }
                    throw new Error(
                        "Error al obtener la tarea. Intenta nuevamente."
                    )
                }
            },
            onError: (error) => {
                console.error("Error al obtener la tarea:", error.message)
            },
            enabled: !!taskId,
            retry: false,
        })
    }

    return {
        tasks,
        getTasks,
        addTaskMutation,
        updateTaskMutation,
        deleteTaskMutation,
        useFilterTasks,
        useGetTaskById,
    }
}
