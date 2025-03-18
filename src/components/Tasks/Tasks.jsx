// src/components/Tasks/Tasks.jsx
import { useMemo, useState } from "react"
import { useSearchParams, useLocation } from "react-router-dom"
import { useTasks } from "../../hooks/data/task/useTasks"
import Header from "../Header"
import TaskItem from "./TaskItem"
import TaskFilter from "./TaskFilter"
import useAuthStore from "../../store/authStore"
import DashboardCards from "../DashboardCards"

const Tasks = () => {
    const { useFilterTasks } = useTasks()
    const [searchParams, setSearchParams] = useSearchParams()
    const { pathname: currentPath } = useLocation()
    const role = useAuthStore((state) => state.role)

    // Solo mostramos el sistema de selección en la ruta "/"
    const isInicio = currentPath === "/"

    // Obtención de filtros desde la URL
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

    const {
        data: filteredTasks = [],
        isLoading,
        isError,
    } = useFilterTasks(filters)

    // Actualiza la URL con los datos del filtro
    const handleFilter = (filterData) => {
        const { fullname, company, project, status, date } = filterData
        setSearchParams({ fullname, company, project, status, date })
    }

    // Estado para almacenar los IDs de las tareas seleccionadas
    const [selectedTasks, setSelectedTasks] = useState([])
    const [allSelected, setAllSelected] = useState(false)

    // Selección/deselección global
    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedTasks([])
            setAllSelected(false)
        } else {
            const allTaskIds = filteredTasks.map((task) => task.id)
            setSelectedTasks(allTaskIds)
            setAllSelected(true)
        }
    }

    // Selección individual
    const handleSelectTask = (taskId) => {
        if (selectedTasks.includes(taskId)) {
            setSelectedTasks(selectedTasks.filter((id) => id !== taskId))
        } else {
            setSelectedTasks([...selectedTasks, taskId])
        }
    }

    // Filtra los items seleccionados de la lista de tareas
    const selectedTaskItems = filteredTasks.filter((task) =>
        selectedTasks.includes(task.id)
    )

    // Renderiza la tabla con encabezados y filas
    const renderTable = () => (
        <div className="overflow-x-auto">
            <div className="min-w-full">
                <div className="max-h-[400px] overflow-y-auto rounded-lg border">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="sticky top-0 z-10 bg-gray-600 text-xs uppercase text-gray-400">
                            <tr>
                                {isInicio && (
                                    <th className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                )}
                                {role === "admin" && (
                                    <th className="px-4 py-3">Nombre</th>
                                )}
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">HE</th>
                                <th className="px-4 py-3">HS</th>
                                <th className="px-4 py-3">Empresa</th>
                                <th className="px-4 py-3">Proyecto</th>
                                <th className="px-4 py-3">TH</th>
                                <th className="px-4 py-3">HD</th>
                                <th className="px-4 py-3">HT</th>
                                <th className="px-4 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    showCheckbox={isInicio}
                                    isSelected={selectedTasks.includes(task.id)}
                                    onSelectTask={handleSelectTask}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

    // Manejo de estados de carga, error o sin datos
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
        return renderTable()
    }

    return (
        <div className="space-y-6 overflow-hidden px-8 py-9">
            {/* Se pasa al Header solo los items seleccionados */}
            <Header
                subtitle="Mis Tareas"
                title="Mis Tareas"
                tasks={selectedTaskItems}
            />
                <DashboardCards filters={handleFilter} currentPath={currentPath} role={role} />
            <div className="space-y-3 rounded-xl bg-white p-1">
                <div className="min-w-full py-2">
                    <TaskFilter onFilter={handleFilter} currentPath={currentPath} />
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

export default Tasks
