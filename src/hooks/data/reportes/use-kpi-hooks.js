import { useQuery } from "@tanstack/react-query"
import useKpiStore from "../../../store/kpiStore"
import { getKpiReport } from "./reportesserver"

const kpiQueryKeys = {
  all: (group) => ["kpiReport", group],
}

/**
 * Hook para obtener el reporte KPI.
 * Ahora cualquier usuario puede obtener la información.
 * @param {string} group - Grupo por el cual agrupar el KPI. Puede ser "hour_type", "task_type", "project" o "company".
 */
export const useGetKpiReport = (group = "task_type") => {
  const setKpiReport = useKpiStore((state) => state.setKpiReport)

  return useQuery({
    queryKey: kpiQueryKeys.all(group),
    queryFn: async () => {
      return await getKpiReport(group)
    },
    enabled: true, // Habilitado para cualquier usuario
    onSuccess: (data) => {
      // Se guarda el reporte en el store, asociándolo al grupo consultado
      setKpiReport({ group, data })
    },
  })
}
