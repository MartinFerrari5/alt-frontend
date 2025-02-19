// src/components/Tasks/TaskStatusFilter.jsx
import { useState } from "react"
import PropTypes from "prop-types"

const TaskStatusFilter = ({ onFilterStatus }) => {
    const [selectedStatus, setSelectedStatus] = useState("")

    const handleChange = (e) => {
        const value = e.target.value
        setSelectedStatus(value)
        // Si value es vacío, se entiende que no hay filtro de estado.
        const status = value === "" ? null : Number(value)
        onFilterStatus(status)
    }

    return (
        <div className="max-w-sm">
            <label htmlFor={selectedStatus}>Estatus</label>
            <select
                value={selectedStatus}
                onChange={handleChange}
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-gray-400"
            >
                <option value="0">Progreso</option>
                <option value="1">Completadas</option>
                <option value="">Todas</option>
            </select>
        </div>
    )
}

TaskStatusFilter.propTypes = {
    onFilterStatus: PropTypes.func.isRequired,
}

export default TaskStatusFilter
