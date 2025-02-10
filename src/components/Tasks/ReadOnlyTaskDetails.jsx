export const ReadOnlyTaskDetails = ({ task }) => {
    if (!task) {
        return <p>No hay datos disponibles para esta tarea.</p>
    }

    const statusMap = {
        0: "En Progreso",
        1: "Completada",
    }

    const formatTime = (time) => (time ? time.slice(0, 5) : "-")
    const formatDate = (date) =>
        date ? new Intl.DateTimeFormat("es-ES").format(new Date(date)) : "-"

    return (
        <div className="space-y-6 rounded-xl bg-brand-white p-6">
            <h2 className="text-lg font-semibold">Detalles de la Tarea</h2>
            <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                    <tr>
                        <td className="border px-4 py-2 font-medium">
                            Empresa
                        </td>
                        <td className="border px-4 py-2">
                            {task.company ?? "-"}
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-medium">
                            Proyecto
                        </td>
                        <td className="border px-4 py-2">
                            {task.project ?? "-"}
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-medium">
                            Tipo de Tarea
                        </td>
                        <td className="border px-4 py-2">
                            {task.task_type ?? "-"}
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-medium">
                            Descripción
                        </td>
                        <td className="border px-4 py-2">
                            {task.task_description ?? "-"}
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-medium">
                            Hora de Entrada
                        </td>
                        <td className="border px-4 py-2">
                            {formatTime(task.entry_time)}
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-medium">
                            Hora de Salida
                        </td>
                        <td className="border px-4 py-2">
                            {formatTime(task.exit_time)}
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-medium">
                            Horas de Almuerzo
                        </td>
                        <td className="border px-4 py-2">
                            {task.lunch_hours ?? "0"}
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-medium">Fecha</td>
                        <td className="border px-4 py-2">
                            {formatDate(task.task_date)}
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-medium">Estado</td>
                        <td className="border px-4 py-2">
                            {statusMap[task.status] ?? "No definido"}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
