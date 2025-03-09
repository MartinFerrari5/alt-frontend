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
 * Primero intenta obtenerla del store; si no existe, consulta la API.
 * Acepta un callback onSuccess opcional.
 */
export const useGetTask = (taskId, onSuccess) => {
    const { tasks } = useTaskStore()
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

/**
 * Hook principal para la gestión de tareas.
 * Permite obtener la lista de tareas y gestionar las mutaciones (agregar, actualizar y eliminar).
 * Puedes pasar el parámetro opcional { all: true } para usar la ruta /tasks/all, que trae un conjunto mayor de datos.
 */
export const useTasks = ({ all = false } = {}) => {
    const queryClient = useQueryClient()
    const { tasks, addTask, deleteTask, updateTask, setTasks } = useTaskStore()

    // Consulta para obtener todas las tareas, utilizando el endpoint adecuado según el flag "all"
    const getTasks = useQuery({
        queryKey: all ? taskQueryKeys.getAllAll() : taskQueryKeys.getAll(),
        queryFn: async () => {
            const tasksData = all ? await getAllTasksAll() : await getAllTasks()
            setTasks(tasksData)
            return tasksData
        },
    })

    // Mutación para agregar una tarea con actualización optimista
    const addTaskMutation = useMutation({
        mutationKey: taskMutationKeys.add(),
        mutationFn: async (newTask) => await createTask(newTask),
        onMutate: async (newTask) => {
            await queryClient.cancelQueries(taskQueryKeys.getAll())
            const previousTasks =
                queryClient.getQueryData(taskQueryKeys.getAll()) || []
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

    // Mutación para actualizar una tarea con actualización optimista
    const updateTaskMutation = useMutation({
        mutationKey: taskMutationKeys.update(),
        mutationFn: async ({ taskId, task }) =>
            await updateTaskApi({ taskId, task }),
        onMutate: async ({ taskId, task }) => {
            await queryClient.cancelQueries(taskQueryKeys.getAll())
            const previousTasks = queryClient.getQueryData(
                taskQueryKeys.getAll()
            )
            // Actualización optimista en la caché de react-query
            queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks = []) =>
                oldTasks.map((t) => (t.id === taskId ? { ...t, ...task } : t))
            )
            // Actualización optimista en el store de Zustand
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
            // Reemplazamos el cambio optimista por la respuesta definitiva
            queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks = []) =>
                oldTasks.map((t) => (t.id === taskId ? updatedTask : t))
            )
            queryClient.setQueryData(taskQueryKeys.getOne(taskId), updatedTask)
            // Actualizamos el store con la respuesta de la API
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

    return {
        tasks,
        getTasks,
        addTaskMutation,
        updateTaskMutation,
        deleteTaskMutation,
        useFilterTasks,
    }
}
