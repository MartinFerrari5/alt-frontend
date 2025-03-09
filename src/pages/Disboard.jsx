// src/pages/Disboard.jsx
import { useMemo, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import DashboardCards from "../components/DashboardCards"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import TaskItem from "../components/Tasks/TaskItem"
import TaskFilter from "../components/Tasks/TaskFilter"
import { useTasks } from "../hooks/data/task/useTasks"
import useAuthStore from "../store/authStore"

const TABLE_HEADERS = [
    "Nombre",
    "Fecha",
    "HE",
    "HS",
    "Empresa",
    "Proyecto",
    "TH",
    "HD",
    "HT",
    "Estado",
]

const DisboardPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const role = useAuthStore((state) => state.role)

    // Obtención de filtros desde la URL
    const filters = useMemo(
        () => ({
            fullname: searchParams.get("fullname") || "",
            company: searchParams.get("company") || "",
            project: searchParams.get("project") || "",
            date: searchParams.get("date") || "",
            status: searchParams.get("status") || "",
        }),
        [searchParams]
    )

    // Verifica si algún filtro está activo
    const isFilterActive = useMemo(
        () => Object.values(filters).some((value) => value !== ""),
        [filters]
    )

    const { getTasks, useFilterTasks } = useTasks({ all: true })
    const filterQuery = useFilterTasks(filters)

    // Selecciona las tareas a mostrar según si hay filtros o no
    const displayedTasks = isFilterActive ? filterQuery.data : getTasks.data
    const isLoading = isFilterActive
        ? filterQuery.isLoading
        : getTasks.isLoading
    const isError = isFilterActive ? filterQuery.isError : getTasks.isError

    // Filtra las tareas válidas (que tengan id)
    const validTasks = useMemo(
        () => (displayedTasks || []).filter((task) => task?.id),
        [displayedTasks]
    )

    // Actualiza los parámetros de búsqueda en la URL
    const updateFilter = useCallback(
        (filterData) => {
            const { fullname, company, project, status, startDate, endDate } =
                filterData
            const dateRange =
                startDate && endDate
                    ? `${startDate} ${endDate}`
                    : startDate || ""
            setSearchParams({
                fullname: fullname || "",
                company: company || "",
                project: project || "",
                date: dateRange,
                status: status || "",
            })
        },
        [setSearchParams]
    )

    // Ajusta los encabezados según el rol (se omite "Nombre" para roles distintos de admin)
    const tableHeaders = useMemo(() => {
        return role === "admin"
            ? TABLE_HEADERS
            : TABLE_HEADERS.filter((header) => header !== "Nombre")
    }, [role])

    // Renderiza el cuerpo de la tabla
    const renderTableBody = () => {
        if (isLoading) {
            return (
                <tr>
                    <td
                        colSpan={tableHeaders.length}
                        className="px-6 py-5 text-center text-sm text-brand-text-gray"
                    >
                        Cargando tareas...
                    </td>
                </tr>
            )
        }
        if (isError) {
            return (
                <tr>
                    <td
                        colSpan={tableHeaders.length}
                        className="px-6 py-5 text-center text-sm text-red-500"
                    >
                        Error al cargar las tareas.
                    </td>
                </tr>
            )
        }
        if (validTasks.length === 0) {
            return (
                <tr>
                    <td
                        colSpan={tableHeaders.length}
                        className="px-6 py-5 text-center text-sm text-brand-text-gray"
                    >
                        No hay tareas disponibles.
                    </td>
                </tr>
            )
        }
        return validTasks.map((task) => <TaskItem key={task.id} task={task} />)
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="w-full space-y-6 px-8 py-10 lg:ml-72">
                {/* Se pasa la lista de tareas válidas al Header */}
                <Header subtitle="Panel" title="Panel" tasks={validTasks} />
                <DashboardCards />
                <div className="space-y-3 rounded-xl bg-white p-1">
                    <div className="overflow-x-auto">
                        <div className="min-w-full py-2">
                            <TaskFilter onFilter={updateFilter} />
                            <div className="max-h-[500px] overflow-y-auto rounded-lg border">
                                <table className="w-full text-left text-sm text-gray-500">
                                    <thead className="sticky top-0 z-10 bg-gray-600 text-xs uppercase text-gray-400">
                                        <tr>
                                            {tableHeaders.map((header) => (
                                                <th
                                                    key={header}
                                                    className="px-4 py-3"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>{renderTableBody()}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisboardPage
