// src/components/admin/StatusManager/StatusTable.jsx
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import StatusItem from "./StatusItem"
import TaskFilter from "../../Tasks/TaskFilter"
import Header from "../../Header"
import useStatusStore from "../../../store/statusStore"
import {
    getFilteredExportedTasks,
    getStatuses,
} from "../../../hooks/data/status/statusServer"

const StatusTable = () => {
    // Manejo de query params para filtros
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterParams, setFilterParams] = useState({
        fullname: "",
        company: "",
        project: "",
        status: "",
        date: "",
    })

    // Extraemos métodos y data del store
    const { statuses, setStatuses } = useStatusStore()

    // Actualizamos los filtros según los query params
    useEffect(() => {
        const fullname = searchParams.get("fullname") || ""
        const company = searchParams.get("company") || ""
        const project = searchParams.get("project") || ""
        const status = searchParams.get("status") || ""
        const date = searchParams.get("date") || ""
        setFilterParams({ fullname, company, project, status, date })
    }, [searchParams])

    // Efecto para actualizar el store cada vez que se cargue el componente o cambien los filtros
    useEffect(() => {
        const actualizarStatuses = async () => {
            try {
                // Si se aplican filtros en alguno de los parámetros, se consulta la API filtrada
                if (
                    filterParams.fullname ||
                    filterParams.company ||
                    filterParams.project ||
                    filterParams.status ||
                    filterParams.date
                ) {
                    const filteredTasks =
                        await getFilteredExportedTasks(filterParams)
                    setStatuses(filteredTasks)
                } else {
                    // En caso contrario, se obtienen todos los statuses
                    const allStatuses = await getStatuses()
                    setStatuses(allStatuses)
                }
            } catch (error) {
                console.error("Error al obtener los statuses:", error)
            }
        }

        actualizarStatuses()
    }, [filterParams, setStatuses])

    // Función que se dispara al aplicar filtros desde el componente TaskFilter
    const handleFilter = (params) => {
        setSearchParams(params)
    }

    // Renderizado condicional mientras se carga la data
    if (!statuses) return <div>Cargando estados...</div>

    return (
        <div>
            <Header subtitle="Exportados" title="Exportados" tasks={statuses} />
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
                                                Nombre
                                            </th>
                                            <th className="px-4 py-3">
                                                Fecha de la Tarea
                                            </th>
                                            <th className="px-4 py-3">
                                                Empresa
                                            </th>
                                            <th className="px-4 py-3">
                                                Proyecto
                                            </th>
                                            <th className="px-4 py-3">
                                                Tipo de Tarea
                                            </th>
                                            <th className="px-4 py-3">
                                                Descripción de la Tarea
                                            </th>
                                            <th className="px-4 py-3">
                                                Hora de Entrada
                                            </th>
                                            <th className="px-4 py-3">
                                                Hora de Salida
                                            </th>
                                            <th className="px-4 py-3">
                                                Tipo de Hora
                                            </th>
                                            <th className="px-4 py-3">
                                                Hs de Almuerzo
                                            </th>
                                            <th className="px-4 py-3">
                                                Estado
                                            </th>
                                            <th className="px-4 py-3">
                                                Horas Trabajadas
                                            </th>
                                            <th className="px-4 py-3">Total</th>
                                        </tr>
                                    </thead>
                                    {statuses.length > 0 ? (
                                        <tbody>
                                            {statuses.map((task) => {
                                                // Convertir lunch_hours a string para cumplir con las PropTypes de StatusItem
                                                const updatedTask = {
                                                    ...task,
                                                    lunch_hours: String(
                                                        task.lunch_hours
                                                    ),
                                                }
                                                return (
                                                    <StatusItem
                                                        key={task.id}
                                                        task={updatedTask}
                                                    />
                                                )
                                            })}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td
                                                    colSpan="13"
                                                    className="text-center"
                                                >
                                                    No se encontraron tareas
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
