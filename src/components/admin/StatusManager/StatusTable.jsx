// src/components/admin/StatusManager/StatusTable.jsx
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import StatusItem from "./StatusItem"
import TaskFilter from "../../Tasks/TaskFilter"
import Header from "../../Header"
import useStatusStore from "../../../store/statusStore"
import {
    useFilterExportedTasks,
    useGetStatus,
} from "../../../hooks/data/status/use-status-hooks"

const StatusTable = () => {
    // Hook de react-router-dom para trabajar con los query params
    const [searchParams, setSearchParams] = useSearchParams()
    // Estado local para los filtros
    const [filterParams, setFilterParams] = useState(null)

    // Al montar el componente, se leen los parámetros de la URL
    useEffect(() => {
        const fullname = searchParams.get("fullname") || ""
        const date = searchParams.get("date") || ""
        if (fullname || date) {
            setFilterParams({ fullname, date })
        }
    }, [searchParams])

    // Obtenemos todos los status (solo si el usuario es admin)
    const { data: statusData, isLoading, error } = useGetStatus()
    const { statuses, setStatuses } = useStatusStore()

    // Si se obtienen todos los status y no se aplicó filtro, actualizamos el store
    useEffect(() => {
        if (statusData && !filterParams) {
            setStatuses(statusData)
        }
    }, [statusData, setStatuses, filterParams])

    // Disparamos la query de filtrado si hay parámetros
    const {
        data: filteredData,
        isLoading: filterLoading,
        error: filterError,
    } = useFilterExportedTasks(filterParams || {})

    // Cuando se obtienen datos filtrados, actualizamos el store
    useEffect(() => {
        if (filteredData) {
            setStatuses(filteredData)
        }
    }, [filteredData, setStatuses])

    // Función que se dispara cuando se aplica el filtro
    const handleFilter = (params) => {
        // Actualizamos los query params en la URL
        setSearchParams(params)
        // Actualizamos el estado local
        setFilterParams(params)
    }

    const loadingState = isLoading || filterLoading
    const errorState = error || filterError

    if (loadingState) return <div>Cargando estados...</div>
    if (errorState)
        return <div>Error: {errorState.message || "Ocurrió un error"}</div>

    const tasks = statuses || []

    return (
        <div>
            <Header subtitle="Exportados" title="Exportados" tasks={tasks} />
            <div className="space-y-3 rounded-xl bg-white p-6">
                <TaskFilter onFilter={handleFilter} />
                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="max-h-[500px] overflow-y-auto rounded-lg border">
                                <table className="w-full text-left text-sm text-gray-500">
                                    <thead className="sticky top-0 z-10 bg-gray-600 text-xs uppercase text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3">
                                                Company
                                            </th>
                                            <th className="px-4 py-3">
                                                Project
                                            </th>
                                            <th className="px-4 py-3">
                                                Task Type
                                            </th>
                                            <th className="px-4 py-3">
                                                Task Description
                                            </th>
                                            <th className="px-4 py-3">
                                                Entry Time
                                            </th>
                                            <th className="px-4 py-3">
                                                Exit Time
                                            </th>
                                            <th className="px-4 py-3">
                                                Hour Type
                                            </th>
                                            <th className="px-4 py-3">
                                                Lunch Hours
                                            </th>
                                            <th className="px-4 py-3">
                                                Status
                                            </th>
                                            <th className="px-4 py-3">
                                                Task Date
                                            </th>
                                            <th className="px-4 py-3">
                                                Worked Hours
                                            </th>
                                            <th className="px-4 py-3">
                                                Full Name
                                            </th>
                                            <th className="px-4 py-3">Total</th>
                                        </tr>
                                    </thead>
                                    {tasks.length > 0 ? (
                                        <tbody>
                                            {tasks.map((task) => (
                                                <StatusItem
                                                    key={task.id}
                                                    task={task}
                                                />
                                            ))}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td
                                                    colSpan="13"
                                                    className="text-center"
                                                >
                                                    No tasks found
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusTable
