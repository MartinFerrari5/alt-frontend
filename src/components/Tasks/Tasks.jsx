// src/components/tasks/Tasks.jsx
import { useMemo, useState, useCallback, useEffect } from "react"
import { useSearchParams, useLocation } from "react-router-dom"
import { useTasks } from "../../hooks/data/task/useTasks"
import TaskFilter from "./TaskFilter"
import useAuthStore from "../../store/modules/authStore"
import Header from "../layout/Header"
import DashboardCards from "../DashboardCards"
import TaskTable from "./TaskTable"
import Pagination from "../ui/pagination/Pagination"

const Tasks = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { pathname: currentPath } = useLocation()
    const role = useAuthStore((state) => state.user.role)

    // --- Estado de página
    const initialPage = Number(searchParams.get("page") || 1)
    const [page, setPage] = useState(initialPage)

    // --- Filtros obtenidos de la URL (no incluyen page)
    const filters = useMemo(
        () => ({
            fullname: searchParams.get("fullname") || "",
            company: searchParams.get("company") || "",
            hourtype: searchParams.get("hourtype") || "",
            project: searchParams.get("project") || "",
            date: searchParams.get("date") || "",
            status:
                searchParams.get("status") || (role === "admin" ? "1" : "0"),
        }),
        [searchParams, role]
    )

    // --- Sincroniza el estado `page` con la URL
    useEffect(() => {
        const params = { ...Object.fromEntries(searchParams) }
        params.page = page
        setSearchParams(params, { replace: true })
    }, [page, searchParams, setSearchParams])

    // --- Consultas
    const { getTasks, useFilterTasks } = useTasks({ all: true, page })
    const filterQuery = useFilterTasks(filters, page)
    const hasFilters = Object.values(filters).some((v) => v !== "")

    const {
        data: res,
        isLoading,
        isError,
    } = hasFilters ? filterQuery : getTasks

    // --- Datos de la API
    const tasks = res?.tasks || []
    const { current = 1, total = 1 } = res?.pages || {}

    // --- Filtrar sólo tareas válidas
    const validTasks = useMemo(() => tasks.filter((t) => t?.id), [tasks])

    // --- Funciones de filtrado
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
                {
                    fullname,
                    company,
                    project,
                    status,
                    hourtype,
                    date,
                    page: 1,
                },
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

    // --- Selección de rutas
    const isInicio = currentPath === "/rraa"

    // --- Selección de tareas
    const [selectedTasks, setSelectedTasks] = useState([])
    const [allSelected, setAllSelected] = useState(false)

    const handleSelectAll = useCallback(() => {
        if (allSelected) {
            setSelectedTasks([])
            setAllSelected(false)
        } else {
            setSelectedTasks(validTasks.map((t) => t.id))
            setAllSelected(true)
        }
    }, [allSelected, validTasks])

    const handleSelectTask = useCallback((taskId) => {
        setSelectedTasks((prev) =>
            prev.includes(taskId)
                ? prev.filter((id) => id !== taskId)
                : [...prev, taskId]
        )
    }, [])

    // --- Items seleccionados
    const selectedTaskItems = validTasks.filter((t) =>
        selectedTasks.includes(t.id)
    )

    // --- Renderizado condicional de la tabla
    const renderContent = () => {
        if (isLoading)
            return <p className="text-sm text-gray-500">Cargando tareas…</p>
        if (isError)
            return (
                <p className="text-sm text-red-500">
                    Error al cargar las tareas.
                </p>
            )
        if (validTasks.length === 0)
            return (
                <p className="text-sm text-gray-500">
                    No hay tareas disponibles.
                </p>
            )
        return (
            <TaskTable
                tasks={validTasks}
                isInicio={isInicio}
                selectedTasks={selectedTasks}
                onSelectTask={handleSelectTask}
                onSelectAll={handleSelectAll}
                currentPath={currentPath}
                role={role}
            />
        )
    }

    return (
        <div className="space-y-6">
            <Header
                subtitle="Mis Tareas"
                title="Mis Tareas"
                tasks={selectedTaskItems}
            />

            <DashboardCards
                filters={{ ...filters, page }}
                currentPath={currentPath}
                role={role}
            />

            <div className="space-y-3 rounded-xl bg-white p-4">
                <TaskFilter onFilter={handleFilter} currentPath={currentPath} />

                {renderContent()}

                <Pagination
                    currentPage={current}
                    totalPages={total}
                    onPageChange={setPage}
                />
            </div>
        </div>
    )
}

export default Tasks
