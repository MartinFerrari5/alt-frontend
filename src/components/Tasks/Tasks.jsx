// src/components/tasks/Tasks.jsx
import { useMemo, useState, useCallback } from "react"
import { useSearchParams, useLocation } from "react-router-dom"
import { useTasks } from "../../hooks/data/task/useTasks"
import TaskFilter from "./TaskFilter"
import useAuthStore from "../../store/authStore"
import Header from "../layout/Header"
import DashboardCards from "../DashboardCards"
import TaskTable from "./TaskTable"

const Tasks = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { pathname: currentPath } = useLocation()
    const role = useAuthStore((state) => state.role)

    // Se muestra la selección de tareas solo en la ruta "/"
    const isInicio = currentPath === "/"

    // Filtros obtenidos de la URL
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
                    ? `${startDate} ${endDate}`
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

    // Función que adapta el objeto recibido desde TaskFilter
    const handleFilter = useCallback(
        (filterData) => {
            let startDate = ""
            let endDate = ""
            if (filterData.date) {
                const dates = filterData.date.split(" ")
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
                project: filterData.project || "",
                hourtype: filterData.hourtype,
                status,
                startDate,
                endDate,
            })
        },
        [updateFilter]
    )

    // Estados para la selección de tareas
    const [selectedTasks, setSelectedTasks] = useState([])
    const [allSelected, setAllSelected] = useState(false)

    // Manejo de selección global
    const handleSelectAll = useCallback(() => {
        if (allSelected) {
            setSelectedTasks([])
            setAllSelected(false)
        } else {
            const allTaskIds = validTasks.map((task) => task.id)
            setSelectedTasks(allTaskIds)
            setAllSelected(true)
        }
    }, [allSelected, validTasks])

    // Selección individual
    const handleSelectTask = useCallback((taskId) => {
        setSelectedTasks((prevSelected) =>
            prevSelected.includes(taskId)
                ? prevSelected.filter((id) => id !== taskId)
                : [...prevSelected, taskId]
        )
    }, [])

    // Items de tareas seleccionadas
    const selectedTaskItems = validTasks.filter((task) =>
        selectedTasks.includes(task.id)
    )

    // Renderizado de contenidos según estado de carga, error o datos vacíos
    const renderContent = () => {
        if (isLoading)
            return (
                <p className="text-brand-text-gray text-sm">
                    Cargando tareas...
                </p>
            )
        if (isError)
            return (
                <p className="text-sm text-red-500">
                    Error al cargar las tareas.
                </p>
            )
        if (!validTasks || validTasks.length === 0)
            return (
                <p className="text-brand-text-gray text-sm">
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
                filters={filters}
                currentPath={currentPath}
                role={role}
            />
            <div className="space-y-3 rounded-xl bg-white p-1">
                <div className="min-w-full py-2">
                    <TaskFilter
                        onFilter={handleFilter}
                        currentPath={currentPath}
                    />
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

export default Tasks
