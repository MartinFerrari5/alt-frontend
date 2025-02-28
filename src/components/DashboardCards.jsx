// /src/components/DashboardCards.jsx
import { FaTasks, FaSpinner, FaCheckCircle, FaChartBar } from "react-icons/fa"
import useTaskStore from "../store/taskStore"
import DashboardCard from "./DashboardCard"
import { useGetKpiReport } from "../hooks/data/reportes/use-kpi-hooks"

const DashboardCards = () => {
  // Obtener las tareas desde el store global
  const tasks = useTaskStore((state) => state.tasks)

  // Conteo de tareas según su estado
  const inProgressTasks = tasks.filter((task) => task.status === 0).length // Tareas en progreso
  const completedTasks = tasks.filter((task) => task.status === 1).length // Tareas completadas

  // Llamadas al hook para cada KPI report (se ejecutan si el usuario es admin)
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

  // Función auxiliar para transformar los datos del API al formato que DashboardCard espera
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
      {/* Sección de tarjetas de tareas */}
      <div className="grid grid-cols-4 gap-9">
        {/* Tareas totales */}
        <DashboardCard
          icon={<FaTasks className="text-2xl text-brand-dark-blue" />}
          mainText={tasks.length}
          secondaryText="Tareas totales"
        />

        {/* Tareas en progreso */}
        <DashboardCard
          icon={<FaSpinner className="animate-spin text-2xl text-brand-process" />}
          mainText={inProgressTasks}
          secondaryText="Tareas en progreso"
        />

        {/* Tareas completadas */}
        <DashboardCard
          icon={<FaCheckCircle className="text-2xl text-brand-custom-green" />}
          mainText={completedTasks}
          secondaryText="Tareas completadas"
        />

        {/* Se puede agregar una tarjeta resumen adicional si se requiere */}
      </div>

      {/* Sección de reportes KPI */}
      <div className="mt-8 grid grid-cols-4 gap-9">
        {/* KPI Report para Task Type */}
        <DashboardCard
          icon={<FaChartBar className="text-2xl text-brand-dark-blue" />}
          title="KPI - Task Type"
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
          title="KPI - Hour Type"
          stats={
            loadingHourKpi
              ? [{ label: "Cargando...", value: "" }]
              : errorHourKpi
              ? [{ label: "Error", value: "" }]
              : hourKpiStats
          }
        />

        {/* KPI Report para Project */}
        <DashboardCard
          icon={<FaChartBar className="text-2xl text-brand-dark-blue" />}
          title="KPI - Project"
          stats={
            loadingProjectKpi
              ? [{ label: "Cargando...", value: "" }]
              : errorProjectKpi
              ? [{ label: "Error", value: "" }]
              : projectKpiStats
          }
        />

        {/* KPI Report para Company */}
        <DashboardCard
          icon={<FaChartBar className="text-2xl text-brand-dark-blue" />}
          title="KPI - Company"
          stats={
            loadingCompanyKpi
              ? [{ label: "Cargando...", value: "" }]
              : errorCompanyKpi
              ? [{ label: "Error", value: "" }]
              : companyKpiStats
          }
        />
      </div>
    </div>
  )
}

export default DashboardCards
