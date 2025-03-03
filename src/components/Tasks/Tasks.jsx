// src/components/Tasks/Tasks.jsx
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useTasks } from "../../hooks/data/task/useTasks"

import Header from "../Header"
import TaskItem from "./TaskItem"
import TaskFilter from "./TaskFilter"

const Tasks = () => {
    const { useFilterTasks } = useTasks()
    const [searchParams, setSearchParams] = useSearchParams()

    // Si no se ha definido el filtro de estado en la URL, lo establecemos a "0" (pendiente) por defecto
    useEffect(() => {
        if (!searchParams.has("status")) {
            searchParams.set("status", "0")
            setSearchParams(searchParams)
        }
    }, [searchParams, setSearchParams])

    // Extraemos los parámetros de búsqueda de la URL (con default para status)
    const urlFullname = searchParams.get("fullname") || ""
    const urlCompany = searchParams.get("company") || ""
    const urlProject = searchParams.get("project") || ""
    const urlDate = searchParams.get("date") || ""
    const urlStatus = searchParams.get("status") || "0" // por defecto pendiente

    // Construimos el objeto de filtros (incluyendo el estado pendiente por defecto)
    const filters = {
        fullname: urlFullname,
        company: urlCompany,
        project: urlProject,
        date: urlDate,
        status: urlStatus,
    }

    // Ejecutamos el hook de filtrado con los filtros definidos
    const { data: filteredTasks, isLoading, isError } = useFilterTasks(filters)

    // Función para actualizar los parámetros de búsqueda (manteniendo el filtro pendiente si se borra)
    const handleFilter = ({ fullname, company, project, date, status }) => {
        setSearchParams({
            fullname: fullname || "",
            company: company || "",
            project: project || "",
            date: date || "",
            status: status || "0",
        })
    }

    const displayTasks = filteredTasks

    return (
        <div className="w-full space-y-6 px-8 py-16">
            <Header subtitle="Mis Tareas" title="Mis Tareas" />
            <div className="space-y-3 rounded-xl bg-white p-6">
                <TaskFilter onFilter={handleFilter} />
                {isLoading ? (
                    <p className="text-sm text-brand-text-gray">
                        Cargando tareas...
                    </p>
                ) : isError ? (
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
                                                    Nombre
                                                </th>
                                                <th className="px-4 py-3">
                                                    Fecha
                                                </th>
                                                <th className="px-4 py-3">
                                                    HE
                                                </th>
                                                <th className="px-4 py-3">
                                                    HS
                                                </th>
                                                <th className="px-4 py-3">
                                                    Empresa
                                                </th>
                                                <th className="px-4 py-3">
                                                    Proyecto
                                                </th>
                                                <th className="px-4 py-3">
                                                    TH
                                                </th>
                                                <th className="px-4 py-3">
                                                    HD
                                                </th>
                                                <th className="px-4 py-3">
                                                    HT
                                                </th>
                                                <th className="px-4 py-3">
                                                    Estado
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
