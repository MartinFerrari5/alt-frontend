import { useQuery } from "@tanstack/react-query"
import useAuthStore from "../../../store/authStore"
import useKpiStore from "../../../store/kpiStore"
import { getKpiReport } from "./reportesserver"

const kpiQueryKeys = {
    all: (group) => ["kpiReport", group],
}

/**
 * Hook para obtener el reporte KPI.
 * Sólo los usuarios con rol "admin" tienen permiso para obtener la información.
 * @param {string} group - Grupo por el cual agrupar el KPI. Puede ser "hour_type", "task_type", "project" o "company".
 */
export const useGetKpiReport = (group = "task_type") => {
    const role = useAuthStore((state) => state.role)
    const setKpiReport = useKpiStore((state) => state.setKpiReport)

    return useQuery({
        queryKey: kpiQueryKeys.all(group),
        queryFn: async () => {
            if (role !== "admin") {
                throw new Error("No tienes permisos para obtener el reporte KPI.")
            }
            return await getKpiReport(group)
        },
        enabled: role === "admin",
        onSuccess: (data) => {
            // Se guarda el reporte en el store, asociándolo al grupo consultado
            setKpiReport({ group, data })
        },
    })
}
