// src/pages/DisboardPage.jsx
import { useMemo, useCallback, useState, useEffect } from "react"
import { useLocation, useSearchParams } from "react-router-dom"
import DashboardCards from "../components/DashboardCards"
import TaskItem from "../components/Tasks/TaskItem"
import TaskFilter from "../components/Tasks/TaskFilter"
import { useTasks } from "../hooks/data/task/useTasks"
import Header from "../components/layout/Header"
import MainLayout from "../components/layout/MainLayout"
import useAuthStore from "../store/modules/authStore"
import Pagination from "../components/ui/pagination/Pagination"

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
    const role = useAuthStore((state) => state.user.role)

    const pageParam = Number(searchParams.get("page") || 1)
    const [page, setPage] = useState(pageParam)

    const filters = useMemo(
        () => ({
            fullname: searchParams.get("fullname") || "",
            company: searchParams.get("company") || "",
            hourtype: searchParams.get("hourtype") || "",
            project: searchParams.get("project") || "",
            date: searchParams.get("date") || "",
            status: searchParams.get("status") || "",
            page,
        }),
        [searchParams, page]
    )

    // Mantener la URL sincronizada con `page`
    useEffect(() => {
        const params = Object.fromEntries(searchParams)
        params.page = page
        setSearchParams(params, { replace: true })
    }, [page, searchParams, setSearchParams])

    // --- Hooks de datos
    const { getTasks, useFilterTasks } = useTasks({ all: true, page })
    const filterQuery = useFilterTasks(filters, page)
    const hasFilters = Object.values(filters).some((v) => v)
    const {
        data: res,
        isLoading,
        isError,
    } = hasFilters ? filterQuery : getTasks

    // --- Datos y paginación
    const tasks = res?.tasks || []
    const { current = 1, total = 1 } = res?.pages || {}

    // Filtrar sólo tareas válidas
    const validTasks = useMemo(() => tasks.filter((t) => t?.id), [tasks])

    // Actualiza filtros (resetea página)
    const updateFilter = useCallback(
        (data) => {
            const {
                fullname,
                company,
                project,
                status,
                startDate,
                endDate,
                hourtype,
            } = data
            const date =
                startDate && endDate
                    ? `${startDate} ${endDate}`
                    : startDate || ""
            setSearchParams(
                { fullname, company, project, status, hourtype, date, page: 1 },
                { replace: true }
            )
            setPage(1)
        },
        [setSearchParams]
    )

    const handleFilter = useCallback(
        (f) => {
            let startDate = ""
            let endDate = ""
            if (f.date) {
                const parts = f.date.split(" ")
                if (parts.length === 2) [startDate, endDate] = parts
                else startDate = f.date
            }
            const status = f.status !== "" ? String(Number(f.status)) : ""
            updateFilter({ ...f, startDate, endDate, status })
        },
        [updateFilter]
    )

    // Encabezados según rol
    const headers = useMemo(
        () =>
            role === "admin"
                ? TABLE_HEADERS
                : TABLE_HEADERS.filter((h) => h !== "Nombre"),
        [role]
    )

    // Render del cuerpo de la tabla
    const renderBody = () => {
        if (isLoading)
            return (
                <tr>
                    <td
                        colSpan={headers.length}
                        className="px-6 py-5 text-center"
                    >
                        Cargando...
                    </td>
                </tr>
            )
        if (isError)
            return (
                <tr>
                    <td
                        colSpan={headers.length}
                        className="px-6 py-5 text-center text-red-500"
                    >
                        Error al cargar.
                    </td>
                </tr>
            )
        if (validTasks.length === 0)
            return (
                <tr>
                    <td
                        colSpan={headers.length}
                        className="px-6 py-5 text-center"
                    >
                        No hay tareas.
                    </td>
                </tr>
            )
        return validTasks.map((task) => (
            <TaskItem key={task.id} task={task} currentPath={currentPath} />
        ))
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <Header subtitle="Panel" title="Historial" tasks={validTasks} />
                <DashboardCards filters={filters} currentPath={currentPath} />

                <div className="space-y-4 rounded-xl bg-white p-4">
                    <TaskFilter
                        onFilter={handleFilter}
                        currentPath={currentPath}
                    />

                    <div className="max-h-[500px] overflow-auto rounded-lg border">
                        <table className="w-full text-sm text-gray-500">
                            <thead className="sticky top-0 z-20 bg-gray-600 text-xs uppercase text-gray-400">
                                <tr>
                                    {headers.map((h) => (
                                        <th key={h} className="px-4 py-3">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>{renderBody()}</tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={current}
                        totalPages={total}
                        onPageChange={setPage}
                    />
                </div>
            </div>
        </MainLayout>
    )
}

export default DisboardPage
