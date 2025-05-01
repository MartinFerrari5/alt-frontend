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
    return useQuery({
        queryKey: taskQueryKeys.getOne(taskId),
        queryFn: () => getTaskByIdApi(taskId),
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

    const createMutation = mutationFactory(queryClient)
    const commonMutationConfig = { invalidateQueries: taskQueryKeys.getAll() }

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

    const addTaskMutation = useMutation(
        createMutation({
            mutationKey: taskMutationKeys.add(),
            mutationFn: createTask,
            errorMessage: "Error al crear la tarea",
            ...commonMutationConfig,
            onMutate: async (newTask) => {
                await queryClient.cancelQueries(taskQueryKeys.getAll())
                const previousData = queryClient.getQueryData(
                    taskQueryKeys.getAll()
                )
                const optimisticTask = {
                    ...newTask,
                    id: Date.now(),
                    optimistic: true,
                }
                addTask(optimisticTask)

                const prevTasks = Array.isArray(previousData?.tasks)
                    ? previousData.tasks
                    : []
                queryClient.setQueryData(taskQueryKeys.getAll(), {
                    ...(previousData ?? { pages: { current: 1, total: 1 } }),
                    tasks: [...prevTasks, optimisticTask],
                })

                return { previousData, optimisticTask }
            },
            onError: (error, _, context) => {
                if (context?.previousData) {
                    queryClient.setQueryData(
                        taskQueryKeys.getAll(),
                        context.previousData
                    )
                }
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

                const previousData = queryClient.getQueryData(
                    taskQueryKeys.getAll()
                )
                const prevTasks = Array.isArray(previousData?.tasks)
                    ? previousData.tasks
                    : []
                const updatedTasks = prevTasks.map((t) =>
                    String(t.id) === String(taskId) ? { ...t, ...task } : t
                )

                queryClient.setQueryData(taskQueryKeys.getAll(), {
                    ...(previousData ?? { pages: { current: 1, total: 1 } }),
                    tasks: updatedTasks,
                })

                updateTask(taskId, task)
                return { previousData }
            },
            onError: (error, _, context) => {
                if (context?.previousData) {
                    queryClient.setQueryData(
                        taskQueryKeys.getAll(),
                        context.previousData
                    )
                }
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
