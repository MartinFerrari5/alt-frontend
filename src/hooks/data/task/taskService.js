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
    return data.data
}

export const getAllTasksAll = async () => {
    const { data } = await api.get("/tasks/all")
    console.log("Tareas obtenidas:", data.data)
    return data.data
}

export const createTask = async (task) => {
    const { data } = await api.post("/tasks", task)
    // console.log("Tarea creada:", data.data)
    return data.data
}

export const updateTaskApi = async ({ taskId, task }) => {
    // Filtramos los campos que no sean undefined o null
    const payload = Object.fromEntries(
        Object.entries({
            company_id: task.company_id?.trim() || task.company?.trim(),
            project_id: task.project?.trim(),
            task_type: task.task_type?.trim(),
            task_description: task.task_description?.trim(),
            task_date: task.task_date
                ? formatTaskDate(task.task_date)
                : undefined,
            entry_time: task.entry_time,
            exit_time: task.exit_time,
            lunch_hours: task.lunch_hours
                ? Number(parseFloat(task.lunch_hours).toFixed(1))
                : undefined,
            hour_type: task.hour_type,
            status: task.status !== undefined ? Number(task.status) : undefined,
        }).filter(([, value]) => value !== undefined)
    )

    // Si el payload está vacío, evitamos hacer la petición innecesaria
    if (Object.keys(payload).length === 0) {
        throw new Error("No hay campos para actualizar")
    }

    // Hacemos la solicitud PUT solo con los campos modificados
    await api.put(`/tasks?task_id=${taskId}`, payload)
    return payload
}

export const deleteTaskApi = async (taskId) => {
    await api.delete("/tasks", { params: { task_id: taskId } })

    return taskId
}
export const filterTasksApi = async (filters) => {
    // Validar que al menos un filtro tenga un valor
    const hasValidFilters = Object.values(filters).some((value) => value)
    if (!hasValidFilters) {
        console.warn("Filtros vacíos, no se ejecutará la consulta.")
        return [] // Devuelve un array vacío si no hay filtros válidos
    }

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
    return data.data || [] // Asegúrate de devolver un array
}

export const getTaskByIdApi = async (taskId) => {
    const { data } = await api.get(`/tasks/task?task_id=${taskId}`)
    return data.data
}
