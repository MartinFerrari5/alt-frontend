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
    const { useFilterTasks } = useTasks()
    const [searchParams, setSearchParams] = useSearchParams()
    const { pathname: currentPath } = useLocation()
    const role = useAuthStore((state) => state.role)

    // Se muestra la selección de tareas solo en la ruta "/"
    const isInicio = currentPath === "/rraa"

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

    const {
        data: filteredTasks = [],
        isLoading,
        isError,
    } = useFilterTasks(filters)

    // Actualiza los parámetros de búsqueda con los filtros
    const handleFilter = useCallback(
        (filterData) => {
            const { fullname, company, project, status, date, hourtype } =
                filterData
            setSearchParams({
                fullname,
                company,
                project,
                status,
                date,
                hourtype,
            })
        },
        [setSearchParams]
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
            const allTaskIds = filteredTasks.map((task) => task.id)
            setSelectedTasks(allTaskIds)
            setAllSelected(true)
        }
    }, [allSelected, filteredTasks])

    // Selección individual
    const handleSelectTask = useCallback((taskId) => {
        setSelectedTasks((prevSelected) =>
            prevSelected.includes(taskId)
                ? prevSelected.filter((id) => id !== taskId)
                : [...prevSelected, taskId]
        )
    }, [])

    // Items de tareas seleccionadas
    const selectedTaskItems = filteredTasks.filter((task) =>
        selectedTasks.includes(task.id)
    )

    // Renderizado de contenidos según estado de carga, error o datos vacíos
    const renderContent = () => {
        if (isLoading)
            return (
                <p className="text-sm text-brand-text-gray">
                    Cargando tareas...
                </p>
            )
        if (isError)
            return (
                <p className="text-sm text-red-500">
                    Error al cargar las tareas.
                </p>
            )
        if (!filteredTasks || filteredTasks.length === 0)
            return (
                <p className="text-sm text-brand-text-gray">
                    No hay tareas disponibles.
                </p>
            )
        return (
            <TaskTable
                tasks={filteredTasks}
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
        <div className="space-y-6 overflow-hidden px-8 py-9">
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
