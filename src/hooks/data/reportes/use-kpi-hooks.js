// /src/hooks/data/reportes/use-kpi-hooks.js
import { useQuery } from "@tanstack/react-query";
import useKpiStore from "../../../store/kpiStore";
import { getKpiReport } from "./reportesserver";

const kpiQueryKeys = {
  all: (group, filters) => ["kpiReport", group, filters],
};

/**
 * Hook para obtener el reporte KPI.
 * Cualquier usuario puede obtener la información, pero se requiere el parámetro status.
 * @param {string} group - Grupo por el cual agrupar el KPI. Ejemplo: "hour_type".
 * @param {object} filters - Objeto con filtros adicionales: company, project, fullname, date y status.
 */
export const useGetKpiReport = (group = "task_type", filters = {}) => {
  const setKpiReport = useKpiStore((state) => state.setKpiReport);

  return useQuery({
    queryKey: kpiQueryKeys.all(group, filters),
    queryFn: async () => await getKpiReport(group, filters),
    enabled: true, // Habilitado para cualquier usuario
    onSuccess: (data) => {
      // Se guarda el reporte en el store, asociándolo al grupo consultado
      setKpiReport({ group, data });
    },
  });
};
