// src/services/taskService.js
import { api } from "../../../lib/axios"

export const getAllTasks = async () => {
    const { data } = await api.get("/tasks")
    return data.tasks
}

export const createTask = async (task) => {
    const { data } = await api.post("/tasks", task)
    return data
}

export const updateTaskApi = async ({ taskId, task }) => {
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
    await api.put(`/tasks?task_id=${taskId}`, payload)
    return payload
}

export const deleteTaskApi = async (taskId) => {
    await api.delete("/tasks", { params: { task_id: taskId } })
    return taskId
}

export const filterTasksApi = async (filters) => {
    const queryParams = new URLSearchParams()
    // Se agregan todos los filtros disponibles si tienen valor
    if (filters.company) queryParams.append("company", filters.company)
    if (filters.project) queryParams.append("project", filters.project)
    if (filters.fullname) queryParams.append("fullname", filters.fullname)
    if (filters.date) queryParams.append("date", filters.date)
    if (filters.status !== undefined) queryParams.append("status", filters.status)
    const { data } = await api.get(
        `/tasks/filtertasks?${queryParams.toString()}`
    )
    return data.tasks
}

export const getTaskByIdApi = async (taskId) => {
    const { data } = await api.get(`/tasks/task/${taskId}`)
    return data
}
