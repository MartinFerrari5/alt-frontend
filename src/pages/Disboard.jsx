// src/pages/Disboard.jsx
import { useMemo, useEffect, useCallback } from "react"
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

    // Si "status" no está definido, se establece por defecto a "0" (pendiente)
    useEffect(() => {
        if (!searchParams.get("status")) {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev)
                params.set("status", "0")
                return params
            })
        }
    }, [searchParams, setSearchParams])

    // Se obtienen los filtros desde la URL
    const filters = useMemo(
        () => ({
            fullname: searchParams.get("fullname") || "",
            company: searchParams.get("company") || "",
            project: searchParams.get("project") || "",
            date: searchParams.get("date") || "",
            status: searchParams.get("status") || "0",
        }),
        [searchParams]
    )

    // Determina si se aplicó algún filtro (se ignora el valor "0" por defecto en status)
    const isFilterActive = useMemo(() => {
        return (
            filters.fullname !== "" ||
            filters.company !== "" ||
            filters.project !== "" ||
            filters.date !== "" ||
            filters.status !== "0"
        )
    }, [filters])

    const { getTasks, useFilterTasks } = useTasks({ all: true })
    const filterQuery = useFilterTasks(filters)

    const displayedTasks = isFilterActive ? filterQuery.data : getTasks.data
    const isLoading = isFilterActive
        ? filterQuery.isLoading
        : getTasks.isLoading
    const isError = isFilterActive ? filterQuery.isError : getTasks.isError

    const validTasks = useMemo(
        () => (displayedTasks || []).filter((task) => task?.id),
        [displayedTasks]
    )
    const firstTask = validTasks[0]

    const handleFilter = useCallback(
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
                status: status || "0",
            })
        },
        [setSearchParams]
    )

    // Se filtran los encabezados para usuarios que no sean admin (se omite "Nombre")
    const tableHeaders = useMemo(() => {
        return role === "admin" ? TABLE_HEADERS : TABLE_HEADERS.filter(header => header !== "Nombre")
    }, [role])

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="w-full space-y-6 px-8 py-10 lg:ml-72">
                <Header subtitle="Panel" title="Panel" />
                <DashboardCards />
                <div className="space-y-3 rounded-xl bg-white p-1">
                    {/* {firstTask ? (
          <h3 className="text-sm font-semibold text-brand-dark-gray">Horas totales {firstTask.total}</h3>

          ) : (
            <p className="text-sm text-brand-dark-gray">
              No hay tareas disponibles.
            </p>
          )} */}
                    <div className="overflow-x-auto">
                        <div className="min-w-full py-2">
                            <TaskFilter onFilter={handleFilter} />
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
                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td
                                                    colSpan={tableHeaders.length}
                                                    className="px-6 py-5 text-center text-sm text-brand-text-gray"
                                                >
                                                    Cargando tareas...
                                                </td>
                                            </tr>
                                        ) : isError ? (
                                            <tr>
                                                <td
                                                    colSpan={tableHeaders.length}
                                                    className="px-6 py-5 text-center text-sm text-red-500"
                                                >
                                                    Error al cargar las tareas.
                                                </td>
                                            </tr>
                                        ) : validTasks.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={tableHeaders.length}
                                                    className="px-6 py-5 text-center text-sm text-brand-text-gray"
                                                >
                                                    No hay tareas disponibles.
                                                </td>
                                            </tr>
                                        ) : (
                                            validTasks.map((task) => (
                                                <TaskItem
                                                    key={task.id}
                                                    task={task}
                                                />
                                            ))
                                        )}
                                    </tbody>
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
