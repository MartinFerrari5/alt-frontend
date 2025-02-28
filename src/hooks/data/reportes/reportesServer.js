import { api } from "../../../lib/axios"


/**
 * Obtiene el reporte KPI agrupado por tipo de tarea.
 * @param {string} group - Grupo por el cual agrupar el KPI. Por defecto "task_type".
 */
export const getKpiReport = async (group = "task_type") => {
    const { data } = await api.get(`/kpi?group=${group}`)
    console.log("KPI Report: ", data)
    return data
}
