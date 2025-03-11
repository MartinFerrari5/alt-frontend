// src/hooks/data/task/useTasks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getAllTasks,
    getAllTasksAll,
    createTask,
    updateTaskApi,
    deleteTaskApi,
    filterTasksApi,
    getTaskByIdApi,
} from "./taskService"
import useTaskStore from "../../../store/taskStore"

import { taskMutationKeys } from "../../../keys/mutations"
import { taskQueryKeys } from "../../../keys/queries"

/**
 * Hook para obtener una tarea por ID.
 */
export const useGetTask = (taskId, onSuccess) => {
    const { tasks } = useTaskStore()
    return useQuery({
        queryKey: taskQueryKeys.getOne(taskId),
        queryFn: async () => {
            const existingTask = tasks.find(
                (task) => task.id.toString() === taskId.toString()
            )
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

/**
 * Hook principal para la gestión de tareas.
 */
export const useTasks = ({ all = false } = {}) => {
    const queryClient = useQueryClient()
    const { tasks, addTask, deleteTask, updateTask, setTasks } = useTaskStore()

    const getTasks = useQuery({
        queryKey: all ? taskQueryKeys.getAllAll() : taskQueryKeys.getAll(),
        queryFn: async () => {
            const tasksData = all ? await getAllTasksAll() : await getAllTasks()
            setTasks(tasksData)
            return tasksData
        },
    })

    // Mutación para agregar una tarea (actualización optimista)
    const addTaskMutation = useMutation({
        mutationKey: taskMutationKeys.add(),
        mutationFn: async (newTask) => await createTask(newTask),
        onMutate: async (newTask) => {
            await queryClient.cancelQueries(taskQueryKeys.getAll())
            const previousTasks =
                queryClient.getQueryData(taskQueryKeys.getAll()) || []
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
            queryClient.setQueryData(
                taskQueryKeys.getAll(),
                context.previousTasks
            )
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

    // Mutación para actualizar una tarea (actualización optimista)
    const updateTaskMutation = useMutation({
        mutationKey: taskMutationKeys.update(),
        mutationFn: async ({ taskId, task }) =>
            await updateTaskApi({ taskId, task }),
        onMutate: async ({ taskId, task }) => {
            await queryClient.cancelQueries(taskQueryKeys.getAll())
            const previousTasks = queryClient.getQueryData(
                taskQueryKeys.getAll()
            )
            queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks = []) =>
                oldTasks.map((t) =>
                    t.id.toString() === taskId.toString()
                        ? { ...t, ...task }
                        : t
                )
            )
            updateTask(taskId, task)
            return { previousTasks }
        },
        onError: (error, variables, context) => {
            queryClient.setQueryData(
                taskQueryKeys.getAll(),
                context.previousTasks
            )
            console.error("Error al actualizar la tarea:", error)
        },
        onSuccess: (updatedTask, { taskId }) => {
            queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks = []) =>
                oldTasks.map((t) =>
                    t.id.toString() === taskId.toString() ? updatedTask : t
                )
            )
            queryClient.setQueryData(taskQueryKeys.getOne(taskId), updatedTask)
            updateTask(taskId, updatedTask)
        },
        onSettled: () => {
            queryClient.invalidateQueries(taskQueryKeys.getAll())
            queryClient.invalidateQueries(taskQueryKeys.getOne())
        },
    })

    // Mutación para eliminar una tarea
    const deleteTaskMutation = useMutation({
        mutationKey: taskMutationKeys.delete(),
        mutationFn: async (taskId) => await deleteTaskApi(taskId),
        onMutate: async () => {
            await queryClient.cancelQueries(taskQueryKeys.getAll())
            const previousTasks = queryClient.getQueryData(
                taskQueryKeys.getAll()
            )
            return { previousTasks }
        },
        onSuccess: (taskId) => {
            // Actualizamos el store y la caché utilizando conversiones a string
            deleteTask(taskId)
            queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks) =>
                oldTasks
                    ? oldTasks.filter(
                          (task) => task.id.toString() !== taskId.toString()
                      )
                    : []
            )
        },
        onError: (error, taskId, context) => {
            queryClient.setQueryData(
                taskQueryKeys.getAll(),
                context.previousTasks
            )
            console.error("Error al eliminar tarea:", error)
        },
        onSettled: () => {
            queryClient.invalidateQueries(taskQueryKeys.getAll())
        },
    })

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

    return {
        tasks,
        getTasks,
        addTaskMutation,
        updateTaskMutation,
        deleteTaskMutation,
        useFilterTasks,
    }
}
