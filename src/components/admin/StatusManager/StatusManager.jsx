// /src/components/StatusManager.jsx

import { useEffect } from "react"
import useStatusStore from "../../../store/statusStore"
import { useGetTasks } from "../../../hooks/data/task/use-get-tasks"
import useAuthStore from "../../../store/authStore"

const StatusManager = () => {
    const {
        statuses,
        currentTaskStatus,
        loading,
        error,
        fetchStatuses,
        createStatus,
        updateStatus,
        fetchStatusByTask,
        clearError,
    } = useStatusStore()

    // Obtiene las tareas usando React Query
    const {
        data: tasks = [],
        isLoading: tasksLoading,
        isError: tasksError,
    } = useGetTasks()

    // Extrae el userId desde el store de autenticación
    const userId = useAuthStore((state) => state.userId)

    // Carga los estados al montar el componente
    useEffect(() => {
        fetchStatuses()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * Crea un nuevo status enviando el payload requerido:
     * {
     *   tasks: [ ... ],  // Array de tareas
     *   id: "user-id"    // Identificador del usuario
     * }
     */
    const handleCreateStatus = async () => {
        if (tasks.length === 0) {
            alert("No hay tareas para enviar en el status.")
            return
        }
        const payload = {
            tasks,
            id: userId,
        }
        await createStatus(payload)
    }

    /**
     * Actualiza un status existente.
     * En este ejemplo se envía un objeto de actualización simple,
     * pero se puede modificar según los requisitos.
     */
    const handleUpdateStatus = async (id) => {
        const updatedData = { updated: true } // Ejemplo de datos actualizados
        await updateStatus(id, updatedData)
    }

    /**
     * Obtiene el estado de la tarea usando el primer task.id disponible.
     */
    const handleFetchByTask = async () => {
        if (tasks.length === 0) {
            alert("No hay tareas disponibles para buscar el estado.")
            return
        }
        const taskId = tasks[0].id
        await fetchStatusByTask(taskId)
    }

    return (
        <div className="mx-auto max-w-4xl p-6">
            <h2 className="mb-6 text-center text-3xl font-bold">
                Gestor de Estados
            </h2>

            {loading && (
                <p className="mb-4 text-center text-blue-500">
                    Cargando estados...
                </p>
            )}
            {error && (
                <div className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                    <p>Error: {error}</p>
                    <button
                        className="mt-2 rounded bg-red-500 px-3 py-1 text-white transition-colors hover:bg-red-600"
                        onClick={clearError}
                    >
                        Limpiar Error
                    </button>
                </div>
            )}

            {tasksLoading && (
                <p className="mb-4 text-center text-blue-500">
                    Cargando tareas...
                </p>
            )}
            {tasksError && (
                <p className="mb-4 text-center text-red-500">
                    Error al cargar las tareas.
                </p>
            )}

            <div className="mb-6 flex flex-col sm:flex-row sm:justify-center sm:space-x-4">
                <button
                    className="mb-2 rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 sm:mb-0"
                    onClick={handleCreateStatus}
                    disabled={tasksLoading}
                >
                    Crear Estado con Tareas
                </button>
                <button
                    className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                    onClick={handleFetchByTask}
                    disabled={tasksLoading}
                >
                    Obtener Estado por Tarea (Primer ID)
                </button>
            </div>

            <h3 className="mb-4 text-2xl font-semibold">Lista de Estados</h3>
            {statuses.length > 0 ? (
                <ul className="space-y-3">
                    {statuses.map((status) => (
                        <li
                            key={status.id}
                            className="flex items-center justify-between rounded bg-gray-100 px-4 py-3 shadow"
                        >
                            <span className="text-gray-800">
                                {status.name || "Sin nombre"}
                            </span>
                            <button
                                className="rounded bg-yellow-500 px-3 py-1 text-white transition-colors hover:bg-yellow-600"
                                onClick={() => handleUpdateStatus(status.id)}
                            >
                                Actualizar
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">
                    No hay estados disponibles.
                </p>
            )}

            {currentTaskStatus && (
                <div className="mt-8 rounded border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-2 text-xl font-semibold">
                        Estado de la Tarea
                    </h3>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {JSON.stringify(currentTaskStatus, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}

export default StatusManager
