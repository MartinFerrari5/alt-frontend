// src/hooks/data/task/useTasks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { taskMutationKeys } from "../../../keys/mutations"
import { taskQueryKeys } from "../../../keys/queries"
import useTaskStore from "../../../store/modules/taskStore"
import { handleApiError } from "../../../lib/errorHandler"
import {
    getAllTasks,
    getAllTasksAll,
    updateTaskApi,
    deleteTaskApi,
    filterTasksApi,
    getTaskByIdApi,
    createTask,
} from "./taskService"

// Factory modificada para recibir queryClient
const mutationFactory = (queryClient) => (config) => ({
    ...config,
    onError: (error) => handleApiError(error, config.errorMessage),
    onSettled: () => queryClient.invalidateQueries(config.invalidateQueries),
})

export const useGetTask = (taskId) => {
    // const { tasks } = useTaskStore()
    return useQuery({
        queryKey: taskQueryKeys.getOne(taskId),
        queryFn: async () => {
            // const existingTask = tasks.find((t) => t.id.toString() === taskId.toString())
            // return existingTask || getTaskByIdApi(taskId)
            return getTaskByIdApi(taskId)
        },
        onError: (error) => handleApiError(error, "Error al obtener la tarea"),
        enabled: !!taskId,
        retry: false,
        staleTime: 300000,
    })
}

export const useTasks = ({ all = false, page = 1 } = {}) => {
    const queryClient = useQueryClient()
    const { tasks, setTasks, setPages, addTask, deleteTask, updateTask } =
        useTaskStore()

    // Factory con queryClient inyectado
    const createMutation = mutationFactory(queryClient)

    const commonMutationConfig = {
        invalidateQueries: taskQueryKeys.getAll(),
    }

    // Query principal
    const queryKey = all
        ? taskQueryKeys.getAllAll(page)
        : taskQueryKeys.getAll(page)

    const queryFn = () => (all ? getAllTasksAll(page) : getAllTasks(page))

    const getTasks = useQuery({
        queryKey,
        queryFn,
        onSuccess: ({ tasks: dataTasks, pages: dataPages }) => {
            setTasks(dataTasks)
            setPages(dataPages)
        },
        onError: (error) =>
            handleApiError(error, "Error al obtener las tareas"),
        keepPreviousData: true,
    })

    // Mutaciones optimizadas
    const addTaskMutation = useMutation(
        createMutation({
            mutationKey: taskMutationKeys.add(),
            mutationFn: createTask,
            errorMessage: "Error al crear la tarea",
            ...commonMutationConfig,
            onMutate: async (newTask) => {
                await queryClient.cancelQueries(taskQueryKeys.getAll())
                const optimisticTask = {
                    ...newTask,
                    id: Date.now(),
                    optimistic: true,
                }
                addTask(optimisticTask)
                queryClient.setQueryData(taskQueryKeys.getAll(), (old) => {
                    if (!old) {
                        return {
                            tasks: [optimisticTask],
                            pages: { current: 1, total: 1 },
                        }
                    }
                    if (Array.isArray(old.tasks)) {
                        return {
                            ...old,
                            tasks: [...old.tasks, optimisticTask],
                        }
                    }
                    return {
                        tasks: [optimisticTask],
                        pages: { current: 1, total: 1 },
                    }
                })
                return {
                    previousTasks: queryClient.getQueryData(
                        taskQueryKeys.getAll()
                    ),
                    optimisticTask,
                }
            },

            onError: (error, _, context) => {
                queryClient.setQueryData(
                    taskQueryKeys.getAll(),
                    context.previousTasks
                )
                deleteTask(context.optimisticTask.id)
                handleApiError(error, "Error al crear la tarea")
            },
        })
    )

    const updateTaskMutation = useMutation(
        createMutation({
            mutationKey: taskMutationKeys.update(),
            mutationFn: ({ taskId, task }) => updateTaskApi({ taskId, task }),
            errorMessage: "Error al actualizar la tarea",
            ...commonMutationConfig,
            onMutate: async ({ taskId, task }) => {
                await queryClient.cancelQueries(taskQueryKeys.getAll())
                const previousTasks = queryClient.getQueryData(
                    taskQueryKeys.getAll()
                )
                const updatedTasks = previousTasks.map((t) =>
                    t.id === taskId ? { ...t, ...task } : t
                )
                queryClient.setQueryData(taskQueryKeys.getAll(), updatedTasks)
                updateTask(taskId, task) // Usando updateTask del store
                return { previousTasks }
            },
            onError: (error, _, context) => {
                queryClient.setQueryData(
                    taskQueryKeys.getAll(),
                    context.previousTasks
                )
                handleApiError(error, "Error al actualizar la tarea")
            },
        })
    )

    const deleteTaskMutation = useMutation(
        createMutation({
            mutationKey: taskMutationKeys.delete(),
            mutationFn: deleteTaskApi,
            errorMessage: "Error al eliminar la tarea",
            ...commonMutationConfig,
            onSuccess: (_, taskId) => deleteTask(taskId),
        })
    )

    // Filtrado de tareas
    const useFilterTasks = (filters, page = 1) =>
        useQuery({
            queryKey: ["filterTasks", filters, page],
            queryFn: () => filterTasksApi(filters, page),
            enabled: Object.values(filters || {}).some(Boolean),
            onSuccess: ({ tasks: filtered, pages: filteredPages }) => {
                setTasks(filtered)
                setPages(filteredPages)
            },
            onError: (error) =>
                handleApiError(error, "Error al filtrar tareas"),
            keepPreviousData: true,
        })

    return {
        tasks,
        getTasks,
        addTaskMutation,
        updateTaskMutation,
        deleteTaskMutation,
        useFilterTasks,
    }
}
