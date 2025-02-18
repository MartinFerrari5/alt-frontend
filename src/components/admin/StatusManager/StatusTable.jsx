// src/components/admin/StatusManager/StatusTable.jsx
import { useEffect } from "react"
import StatusItem from "./StatusItem"
import useStatusStore from "../../../store/statusStore"
import TaskFilter from "../../Tasks/TaskFilter"
import { api } from "../../../lib/axios"
import useUserStore from "../../../store/userStore"

const StatusTable = () => {
    // Extraemos la data y métodos del store de status
    const { statuses, loading, error, fetchStatuses } = useStatusStore()

    // Al montar el componente se obtienen los estados
    useEffect(() => {
        fetchStatuses()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Función para filtrar tareas exportadas
    const handleFilter = async (filterParams) => {
        try {
            // Construimos los parámetros de búsqueda
            const params = new URLSearchParams()
            // Obtenemos el rol del usuario desde el store de usuario
            const { user } = useUserStore.getState()
            // Solo el usuario admin puede filtrar por "fullname"
            if (user.role === "admin" && filterParams.fullname) {
                params.append("fullname", filterParams.fullname)
            }
            // Siempre se envía el parámetro "date" si tiene valor
            if (filterParams.date) {
                params.append("date", filterParams.date)
            }
            // Realizamos la petición al endpoint de filtrado
            const response = await api.get(
                `/reportes/status/filtertasks?${params.toString()}`
            )
            // Actualizamos el store con la data filtrada
            useStatusStore.getState().setStatuses(response.data)
        } catch (err) {
            console.error("Error filtering tasks:", err)
        }
    }

    if (loading) return <div>Cargando estados...</div>
    if (error) return <div>Error: {error}</div>

    // Se asume que la data tiene la propiedad "tasks"
    const tasks = statuses.tasks || []
    console.log("tasks:", tasks)

    return (
        <div>
            <div className="space-y-3 rounded-xl bg-white p-6">
                {/* Se le pasa la función handleFilter al componente TaskFilter */}
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
                                                <td colSpan="10">
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
