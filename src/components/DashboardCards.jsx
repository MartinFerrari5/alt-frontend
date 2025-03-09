// /src/components/DashboardCards.jsx
import { FaTasks, FaChartBar } from "react-icons/fa"
import DashboardCard from "./DashboardCard"
import { useGetKpiReport } from "../hooks/data/reportes/use-kpi-hooks"

const DashboardCards = () => {
    // Consultas a la API para cada grupo
    const {
        data: statusKpiData,
        isLoading: isLoadingStatus,
        error: statusError,
    } = useGetKpiReport("status")
    const {
        data: taskKpiData,
        isLoading: isLoadingTask,
        error: taskError,
    } = useGetKpiReport("task_type")
    const {
        data: hourKpiData,
        isLoading: isLoadingHour,
        error: hourError,
    } = useGetKpiReport("hour_type")

    // Función para transformar datos numéricos (status, task_type)
    const transformNumericStats = (data, key, labelFormatter) => {
        if (!data) return { stats: [], total: null }
        const totalValue = data.reduce(
            (sum, item) => sum + Number(item.cantidad),
            0
        )
        const stats = data.map((item) => ({
            label: labelFormatter ? labelFormatter(item[key]) : item[key],
            value: item.cantidad,
        }))
        return { stats, total: String(totalValue) }
    }

    // Función para transformar datos de horas (hour_type)
    const transformHourStats = (data, key, labelFormatter) => {
        if (!data) return { stats: [], total: null }
        const totalSeconds = data.reduce((acc, item) => {
            const [hours, minutes, seconds] = item.cantidad
                .split(":")
                .map(Number)
            return acc + hours * 3600 + minutes * 60 + seconds
        }, 0)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        const formattedTotal = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        const stats = data.map((item) => ({
            label: labelFormatter ? labelFormatter(item[key]) : item[key],
            value: item.cantidad,
        }))
        return { stats, total: formattedTotal }
    }

    // Formateador para las etiquetas de status
    const formatStatusLabel = (statusValue) => {
        switch (statusValue) {
            case 0:
                return "En progreso"
            case 1:
                return "Finalizado"
            case 2:
                return "Facturado"
            default:
                return statusValue
        }
    }

    // Generación de datos para cada grupo
    const statusData = isLoadingStatus
        ? { stats: [{ label: "Cargando...", value: "" }], total: null }
        : statusError
          ? { stats: [{ label: "Error", value: "" }], total: null }
          : transformNumericStats(statusKpiData, "status", formatStatusLabel)

    const taskData = isLoadingTask
        ? { stats: [{ label: "Cargando...", value: "" }], total: null }
        : taskError
          ? { stats: [{ label: "Error", value: "" }], total: null }
          : transformNumericStats(taskKpiData, "task_type")

    const hourData = isLoadingHour
        ? { stats: [{ label: "Cargando...", value: "" }], total: null }
        : hourError
          ? { stats: [{ label: "Error", value: "" }], total: null }
          : transformHourStats(hourKpiData, "hour_type")

    return (
        <main>
            <section className="grid grid-cols-4 gap-9">
                {/* Sección opcional, se pueden agregar elementos adicionales aquí */}
            </section>
            <section className="grid grid-cols-4 gap-9">
                <DashboardCard
                    icon={<FaTasks className="text-2xl text-brand-dark-blue" />}
                    title="Estado de Tareas"
                    stats={statusData.stats}
                    total={statusData.total}
                />
                <DashboardCard
                    icon={
                        <FaChartBar className="text-2xl text-brand-dark-blue" />
                    }
                    title="Tipo de Tarea"
                    stats={taskData.stats}
                    total={taskData.total}
                />
                <DashboardCard
                    icon={
                        <FaChartBar className="text-2xl text-brand-dark-blue" />
                    }
                    title="Tipo de Hora"
                    stats={hourData.stats}
                    total={hourData.total}
                />
            </section>
        </main>
    )
}

export default DashboardCards
