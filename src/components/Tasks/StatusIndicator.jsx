// /src/components/Tasks/StatusIndicator.jsx

import PropTypes from "prop-types"
import {
    FaCheckCircle,
    FaSpinner,
    FaExclamationCircle,
    FaUndoAlt,
} from "react-icons/fa"

const StatusIndicator = ({ status, isLoading, onChange }) => {
    let icon
    let statusClasses

    if (isLoading) {
        icon = <FaSpinner className="animate-spin text-white" />
        statusClasses = "bg-gray-500"
    } else {
        switch (status) {
            case 0: // progreso
                icon = <FaUndoAlt className="text-white" />
                statusClasses = "bg-yellow-500"
                break
            case 1: // revisión
                icon = <FaExclamationCircle className="text-white" />
                statusClasses = "bg-green-600"
                break
            case 2: // finalizado
                icon = <FaCheckCircle className="text-white" />
                // statusClasses = "bg-green-600"
                statusClasses = "bg-purple-600"
                break
            default:
                icon = <FaSpinner className="animate-spin text-white" />
                statusClasses = "bg-gray-500"
        }
    }

    return (
        <label
            className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg ${statusClasses}`}
        >
            <input
                type="checkbox"
                onClick={onChange}
                disabled={isLoading}
                className="absolute h-full w-full cursor-pointer opacity-0"
            />
            {icon}
        </label>
    )
}

StatusIndicator.propTypes = {
    status: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default StatusIndicator
