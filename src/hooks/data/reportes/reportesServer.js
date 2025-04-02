// /src/hooks/data/reportes/reportesserver.js
import { api } from "../../../lib/axios"

/**
 * Obtiene el reporte KPI agrupado por el grupo indicado.
 * Se envía únicamente los filtros que se provean en el objeto filters.
 * @param {string} group - Grupo por el cual agrupar el KPI.
 * @param {object} filters - Filtros opcionales: company, project, fullname, date, status.
 */
export const getKpiReport = async (group = "task_type", filters = {}) => {
    // Se arma la query string con el grupo, y se añaden los filtros solo si existen
    const params = new URLSearchParams({ group })

    if (
        filters.status !== undefined &&
        filters.status !== null &&
        filters.status !== ""
    ) {
        params.append("status", filters.status)
    }
    if (filters.company) params.append("company", filters.company)
    if (filters.project) params.append("project", filters.project)
    if (filters.fullname) params.append("fullname", filters.fullname)
    if (filters.hourtype) params.append("hourtype", filters.hourtype)
    if (filters.date) params.append("date", filters.date)

    const { data } = await api.get(`/kpi?${params.toString()}`)
    return data
}
