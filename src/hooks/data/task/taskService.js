// /src/hooks/data/task/taskService.js
/**
 * Hook principal para la gestión de tareas.
 * Permite obtener la lista de tareas, y gestionar las mutaciones (agregar, actualizar y eliminar).
 *
 * Puedes pasar el parámetro opcional { all: true } para que se utilice la ruta /tasks/all,
 * la cual retorna un conjunto mayor de datos que /tasks.
 */

// src/services/taskService.js
import { api } from "../../../lib/axios"
import { formatTaskDate } from "../../../util/date"

export const getAllTasks = async () => {
    const { data } = await api.get("/tasks")
    return data.tasks
}

export const getAllTasksAll = async () => {
    const { data } = await api.get("/tasks/all")
    return data.tasks
}

export const createTask = async (task) => {
    console.log("createTask: ", task)
    const { data } = await api.post("/tasks", task)
    return data
}

export const updateTaskApi = async ({ taskId, task }) => {
    const payload = {
        company_id: task.company?.trim(),
        project_id: task.project?.trim(),
        task_type: task.task_type?.trim(),
        task_description: task.task_description?.trim(),
        task_date: formatTaskDate(task.task_date),
        entry_time: task.entry_time,
        exit_time: task.exit_time,
        lunch_hours: Number(task.lunch_hours),
        hour_type: task.hour_type,
        status: Number(task.status),
    }
    await api.put(`/tasks?task_id=${taskId}`, payload)
    return payload
}

export const deleteTaskApi = async (taskId) => {
    await api.delete("/tasks", { params: { task_id: taskId } })

    return taskId
}
export const filterTasksApi = async (filters) => {
    const queryParams = new URLSearchParams()
    if (filters.company) queryParams.append("company", filters.company)
    if (filters.project) queryParams.append("project", filters.project)
    if (filters.fullname) queryParams.append("fullname", filters.fullname)
    if (filters.hourtype) queryParams.append("hourtype", filters.hourtype)
    if (filters.date) queryParams.append("date", filters.date)
    if (filters.status !== undefined)
        queryParams.append("status", filters.status)
    const { data } = await api.get(
        `/tasks/filtertasks?${queryParams.toString()}`
    )
    return data.tasks
}

export const getTaskByIdApi = async (taskId) => {
    const { data } = await api.get(`/tasks/task?task_id=${taskId}`)
    console.log("getTaskByIdApi: ", data)
    return data
}
