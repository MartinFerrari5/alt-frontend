// src/components/admin/StatusManager/StatusItem.jsx

import PropTypes from "prop-types"
import { useCallback } from "react"

const StatusItem = ({ task }) => {
    console.log("Task:", task)
    // Función para formatear la fecha
    const formatDate = useCallback((dateString) => {
        if (!dateString) return "Fecha no disponible"

        const parsedDate = new Date(dateString)
        if (isNaN(parsedDate.getTime())) {
            console.warn(`⚠️ Fecha inválida recibida: ${dateString}`)
            return "Fecha inválida"
        }

        return new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(parsedDate)
    }, [])

    // Si task.status es "1" o 1, se muestra "completado"; de lo contrario, "progreso"
    const displayStatus = task.status === "1" || task.status === 1 ? "completado" : "progreso"

    return (
        <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
            <td className="px-4 py-5">{task.company}</td>
            <td className="px-4 py-5">{task.project}</td>
            <td className="px-4 py-5">{task.task_type}</td>
            <td className="px-4 py-5">{task.task_description}</td>
            <td className="px-4 py-5">{task.entry_time}</td>
            <td className="px-4 py-5">{task.exit_time}</td>
            <td className="px-4 py-5">{task.hour_type}</td>
            <td className="px-4 py-5">{task.lunch_hours}</td>
            <td className="px-4 py-5">{displayStatus}</td>
            <td className="px-4 py-5">{formatDate(task.task_date)}</td>
            <td className="px-4 py-5">{task.worked_hours}</td>
            <td className="px-4 py-5">{task.full_name}</td>
            <td className="px-4 py-5">{task.total}</td>
        </tr>
    )
}

StatusItem.propTypes = {
    task: PropTypes.shape({
        company: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        task_type: PropTypes.string.isRequired,
        task_description: PropTypes.string,
        entry_time: PropTypes.string,
        exit_time: PropTypes.string,
        hour_type: PropTypes.string,
        lunch_hours: PropTypes.string,
        status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        user_id: PropTypes.string,
        task_date: PropTypes.string,
        worked_hours: PropTypes.string,
        full_name: PropTypes.string,
        total: PropTypes.string,
    }).isRequired,
}

export default StatusItem
