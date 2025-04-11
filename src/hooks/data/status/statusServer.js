// /src/hooks/data/status/statusServer.js
import { api } from "../../../lib/axios"

/**
 * Obtiene todos los statuses.
 */
export const getStatuses = async () => {
    const { data } = await api.get("/status")
    // Se asume que la respuesta contiene un arreglo en data.tasks
    return data.data
}

/**
 * Crea un nuevo status.
 * @param {Object} payload - Datos del nuevo status.
 */
export const postStatus = async (payload) => {
    const { data } = await api.post("/status", payload)
    return data
}

/**
 * Actualiza un status existente.
 * @param {number|string} id - ID del status.
 * @param {Object} updatedData - Datos actualizados.
 */
export const putStatus = async (id, updatedData) => {
    const { data } = await api.put(`/status/${id}`, updatedData)
    return data
}

/**
 * Obtiene el status asociado a una tarea específica.
 * @param {number|string} task_id - ID de la tarea.
 */
export const getStatusByTask = async (task_id) => {
    const { data } = await api.get(`/status/task/${task_id}`)
    return data
}

/**
 * Filtra tareas exportadas según parámetros.
 * @param {Object} filters - Objeto con filtros: { fullname, company, project, status, date }
 */
export const getFilteredExportedTasks = async (filters) => {
    const params = new URLSearchParams()
    params.append("company", filters.company || "")
    params.append("project", filters.project || "")
    params.append("fullname", filters.fullname || "")
    params.append("status", filters.status || "")
    params.append("date", filters.date || "")
    const { data } = await api.get(`/status/filtertasks?${params.toString()}`)
    // Se asume que la respuesta contiene un arreglo en data.tasks
    return data.data
}

/**
 * Envía tareas a RRHH con parámetros de consulta.
 * @param {Object} queryParams - Parámetros de consulta para la solicitud.
 * @param {Object} payload - Datos del payload a enviar.
 * @returns {Promise<Object>} - Promesa que resuelve con los datos de la respuesta.
 * @throws {Error} - Si ocurre un error al enviar las tareas.
 */
export const postStatusRRHH = async (queryParams, payload) => {
    try {
        const { data } = await api.post("/status/rrhh", payload, {
            params: queryParams,
        })
        return data.data
    } catch (error) {
        console.error("Error en postStatusRRHH:", error)

        // Si no hay una respuesta del servidor, lanza un error genérico
        if (!error.response) {
            throw new Error("Error de red o servidor no disponible.")
        }

        // Si el servidor devolvió un error, lanza el mensaje del backend
        throw new Error(
            error.response.data?.message || "Error al enviar tareas a RRHH"
        )
    }
}
