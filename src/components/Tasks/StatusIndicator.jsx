// /src/components/Tasks/StatusIndicator.jsx

import PropTypes from "prop-types"
import { FaCheck, FaSpinner, FaDollarSign } from "react-icons/fa"

const StatusIndicator = ({ status, isLoading, onChange }) => {
    let icon
    let statusClasses

    if (isLoading) {
        icon = <FaSpinner className="animate-spin text-white" />
        statusClasses = "bg-gray-500"
    } else {
        switch (status) {
            case 0: // progreso
                icon = <FaSpinner className="animate-spin text-white" />
                statusClasses = "bg-brand-process text-brand-process"
                break
            case 1: // finalizado
                icon = <FaCheck className="text-white" />
                statusClasses = "bg-brand-custom-green text-brand-custom-green"
                break
            case 2: // facturado
                icon = <FaDollarSign className="text-white" />
                statusClasses = "bg-purple-600"
                break
            default:
                icon = <FaSpinner className="animate-spin text-white" />
                statusClasses = "bg-gray-500"
        }
    }

    return (
        <label
            className={`relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg ${statusClasses}`}
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
