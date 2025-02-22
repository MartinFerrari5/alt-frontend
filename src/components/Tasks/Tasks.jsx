// src/components/Tasks/Tasks.jsx
import { useSearchParams } from "react-router-dom"
import { useTasks } from "../../hooks/data/task/useTasks"

import Header from "../Header"
import TaskItem from "./TaskItem"
import TaskFilter from "./TaskFilter"

const Tasks = () => {
    const { tasks, getTasks, useFilterTasks } = useTasks()
    const [searchParams, setSearchParams] = useSearchParams()

    // Extraer todos los parámetros de la URL
    const urlFullname = searchParams.get("fullname") || ""
    const urlCompany = searchParams.get("company") || ""
    const urlProject = searchParams.get("project") || ""
    const urlDate = searchParams.get("date") || ""
    const urlStatus = searchParams.get("status") || ""
    const filterActive =
        urlFullname || urlCompany || urlProject || urlDate || urlStatus

    // Ejecutamos el hook de filtrado si existen parámetros
    const {
        data: filteredTasks,
        isLoading: filterLoading,
        isError: filterError,
    } = useFilterTasks({
        fullname: urlFullname,
        company: urlCompany,
        project: urlProject,
        date: urlDate,
        status: urlStatus,
    })

    // Determinamos qué listado mostrar
    const displayTasks = filterActive ? filteredTasks : tasks
    const loading = filterActive ? filterLoading : getTasks.isLoading
    const error = filterActive ? filterError : getTasks.isError

    // Actualiza la URL con los parámetros de búsqueda
    const handleFilter = ({ fullname, company, project, date, status }) => {
        setSearchParams({ fullname, company, project, date, status })
    }

    return (
        <div className="w-full space-y-6 px-8 py-16">
            <Header subtitle="Mis Tareas" title="Mis Tareas" />
            <div className="space-y-3 rounded-xl bg-white p-6">
                <TaskFilter onFilter={handleFilter} />
                {loading ? (
                    <p className="text-sm text-brand-text-gray">
                        Cargando tareas...
                    </p>
                ) : error ? (
                    <p className="text-sm text-red-500">
                        Error al cargar las tareas.
                    </p>
                ) : !displayTasks || displayTasks.length === 0 ? (
                    <p className="text-sm text-brand-text-gray">
                        No hay tareas disponibles.
                    </p>
                ) : (
                    <div className="flex flex-col">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                <div className="max-h-[500px] overflow-y-auto rounded-lg border">
                                    <table className="w-full text-left text-sm text-gray-500">
                                        <thead className="sticky top-0 z-10 bg-gray-600 text-xs uppercase text-gray-400">
                                            <tr>
                                                <th className="px-4 py-3">
                                                    Usuario
                                                </th>
                                                <th className="px-4 py-3">
                                                    Empresa
                                                </th>
                                                <th className="px-4 py-3">
                                                    Proyecto
                                                </th>
                                                <th className="px-4 py-3">
                                                    Fecha
                                                </th>
                                                <th className="px-4 py-3">
                                                    Hora
                                                </th>
                                                <th className="px-4 py-3">
                                                    Tipo de hora
                                                </th>
                                                <th className="px-4 py-3">
                                                    hs trabajadas
                                                </th>
                                                <th className="px-4 py-3">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayTasks.map((task) => (
                                                <TaskItem
                                                    key={task.id}
                                                    task={task}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Tasks
