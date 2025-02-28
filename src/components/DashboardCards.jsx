// /src/components/DashboardCards.jsx
import { FaTasks, FaSpinner, FaCheckCircle, FaChartBar } from "react-icons/fa"
import useTaskStore from "../store/taskStore"
import DashboardCard from "./DashboardCard"
import { useGetKpiReport } from "../hooks/data/reportes/use-kpi-hooks"

const DashboardCards = () => {
  // Ahora se obtiene el estado de tareas desde la API
  const {
    data: statusKpiData,
    isLoading: loadingStatusKpi,
    error: errorStatusKpi,
  } = useGetKpiReport("status")

  // Función para transformar los datos de "status" a un formato amigable
  const transformStatusStats = (data) => {
    if (!data) return []
    return data.map((item) => {
      let label
      switch (item.status) {
        case 0:
          label = "No iniciadas"
          break
        case 1:
          label = "En progreso"
          break
        case 2:
          label = "Completadas"
          break
        default:
          label = item.status
      }
      return { label, value: item.cantidad }
    })
  }

  const statusStats = loadingStatusKpi
    ? [{ label: "Cargando...", value: "" }]
    : errorStatusKpi
    ? [{ label: "Error", value: "" }]
    : transformStatusStats(statusKpiData)

  // Los otros KPI siguen consultándose de la misma forma
  const {
    data: taskKpiData,
    isLoading: loadingTaskKpi,
    error: errorTaskKpi,
  } = useGetKpiReport("task_type")
  const {
    data: hourKpiData,
    isLoading: loadingHourKpi,
    error: errorHourKpi,
  } = useGetKpiReport("hour_type")
  const {
    data: projectKpiData,
    isLoading: loadingProjectKpi,
    error: errorProjectKpi,
  } = useGetKpiReport("project")
  const {
    data: companyKpiData,
    isLoading: loadingCompanyKpi,
    error: errorCompanyKpi,
  } = useGetKpiReport("company")

  // Función auxiliar para transformar la data de los otros KPI
  const transformStats = (data, groupKey) => {
    if (!data) return []
    return data.map((item) => ({
      label: item[groupKey] || item[Object.keys(item)[0]],
      value: item.cantidad,
    }))
  }

  const taskKpiStats = transformStats(taskKpiData, "task_type")
  const hourKpiStats = transformStats(hourKpiData, "hour_type")
  const projectKpiStats = transformStats(projectKpiData, "project")
  const companyKpiStats = transformStats(companyKpiData, "company")

  return (
    <div>
      {/* Sección de Estado de Tareas (obtenido desde API) */}
      <div className="grid grid-cols-4 gap-9">
        {/* <DashboardCard
          icon={<FaTasks className="text-2xl text-brand-dark-blue" />}
          title="Estado de Tareas"
          stats={statusStats}
        /> */}
      </div>

      {/* Sección de reportes KPI para otros grupos */}
      <div className="mt-8 grid grid-cols-4 gap-9">
        <DashboardCard
          icon={<FaTasks className="text-2xl text-brand-dark-blue" />}
          title="Estado de Tareas"
          stats={statusStats}
        />
        {/* KPI Report para Task Type */}
        <DashboardCard
          icon={<FaChartBar className="text-2xl text-brand-dark-blue" />}
          title="Tipo de Tarea"
          stats={
            loadingTaskKpi
              ? [{ label: "Cargando...", value: "" }]
              : errorTaskKpi
              ? [{ label: "Error", value: "" }]
              : taskKpiStats
          }
        />

        {/* KPI Report para Hour Type */}
        <DashboardCard
          icon={<FaChartBar className="text-2xl text-brand-dark-blue" />}
          title="Tipo de Hora"
          stats={
            loadingHourKpi
              ? [{ label: "Cargando...", value: "" }]
              : errorHourKpi
              ? [{ label: "Error", value: "" }]
              : hourKpiStats
          }
        />

        {/* KPI Report para Project */}
        {/* <DashboardCard
          icon={<FaChartBar className="text-2xl text-brand-dark-blue" />}
          title="KPI - Project"
          stats={
            loadingProjectKpi
              ? [{ label: "Cargando...", value: "" }]
              : errorProjectKpi
              ? [{ label: "Error", value: "" }]
              : projectKpiStats
          }
        /> */}

        {/* KPI Report para Company */}
        {/* <DashboardCard
          icon={<FaChartBar className="text-2xl text-brand-dark-blue" />}
          title="KPI - Company"
          stats={
            loadingCompanyKpi
              ? [{ label: "Cargando...", value: "" }]
              : errorCompanyKpi
              ? [{ label: "Error", value: "" }]
              : companyKpiStats
          }
        /> */}
      </div>
    </div>
  )
}

export default DashboardCards
