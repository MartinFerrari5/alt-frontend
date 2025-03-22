// /src/pages/Disboard.jsx
import { useMemo, useCallback } from "react"
import { useLocation, useSearchParams } from "react-router-dom"
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
    "Descripción",
    "Estado",
]

const DisboardPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { pathname: currentPath } = useLocation()

    const role = useAuthStore((state) => state.role)

    // Extraer filtros desde la URL e incluir el nuevo filtro "hourtype"
    const filters = useMemo(() => {
        return {
            fullname: searchParams.get("fullname") || "",
            company: searchParams.get("company") || "",
            hourtype: searchParams.get("hourtype") || "",
            project: searchParams.get("project") || "",
            date: searchParams.get("date") || "",
            status: searchParams.get("status") || "",
        }
    }, [searchParams])

    // Obtener todas las tareas y las filtradas, dependiendo de si hay filtros activos
    const { getTasks, useFilterTasks } = useTasks({ all: true })
    const filterQuery = useFilterTasks(filters)
    const hasActiveFilters = useMemo(
        () => Object.values(filters).some((value) => value !== ""),
        [filters]
    )

    const displayedTasks = hasActiveFilters ? filterQuery.data : getTasks.data
    const isLoading = hasActiveFilters
        ? filterQuery.isLoading
        : getTasks.isLoading
    const isError = hasActiveFilters ? filterQuery.isError : getTasks.isError

    // Filtramos las tareas válidas (con id)
    const validTasks = useMemo(
        () => (displayedTasks || []).filter((task) => task?.id),
        [displayedTasks]
    )

    // Función para actualizar los filtros en la URL (se agrega hourtype)
    const updateFilter = useCallback(
        (filterData) => {
            const {
                fullname,
                company,
                project,
                status,
                startDate,
                endDate,
                hourtype,
            } = filterData
            const dateRange =
                startDate && endDate
                    ? `${startDate}+${endDate}`
                    : startDate || ""
            setSearchParams({
                fullname: fullname || "",
                company: company || "",
                project: project || "",
                hourtype: hourtype || "",
                status: status || "",
                date: dateRange,
            })
        },
        [setSearchParams]
    )
    console.log("Filtros actuales:", filters)

    // Función que adapta el objeto recibido desde TaskFilter
    const handleFilter = useCallback(
        (filterData) => {
            let startDate = ""
            let endDate = ""
            if (filterData.date) {
                const dates = filterData.date.split("+")
                if (dates.length === 2) {
                    startDate = dates[0]
                    endDate = dates[1]
                } else {
                    startDate = filterData.date
                }
            }
            const status =
                filterData.status !== ""
                    ? Number(filterData.status).toString()
                    : ""
            updateFilter({
                fullname: filterData.fullname,
                company: filterData.company,
                project: filterData.project,
                hourtype: filterData.hourtype,
                status,
                startDate,
                endDate,
            })
        },
        [updateFilter]
    )
    console.log("handleFilter: ", handleFilter)

    // Definir los encabezados de la tabla según el rol
    const tableHeaders = useMemo(
        () =>
            role === "admin"
                ? TABLE_HEADERS
                : TABLE_HEADERS.filter((header) => header !== "Nombre"),
        [role]
    )

    // Renderizar el cuerpo de la tabla
    const renderTableBody = useCallback(() => {
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
        return validTasks.map((task) => (
            <TaskItem key={task.id} task={task} currentPath={currentPath} />
        ))
    }, [isLoading, isError, validTasks, tableHeaders, currentPath])

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="w-full space-y-6 px-8 py-10 lg:ml-72">
                <Header subtitle="Panel" title="Panel" tasks={validTasks} />
                <DashboardCards filters={filters} currentPath={currentPath} />
                <div className="space-y-3 rounded-xl bg-white p-1">
                    <div className="overflow-x-auto">
                        <div className="min-w-full py-2">
                            <TaskFilter
                                onFilter={handleFilter}
                                currentPath={currentPath}
                            />
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
