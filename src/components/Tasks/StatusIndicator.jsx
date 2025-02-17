// /src/components/Tasks/StatusIndicator.jsx

import PropTypes from "prop-types"
import { useMemo } from "react"
import { FaCheck, FaSpinner } from "react-icons/fa"

const StatusIndicator = ({ status, isLoading, onChange }) => {
    const statusClasses = useMemo(() => {
        switch (status) {
            case 2: // Completed
                return "bg-brand-custom-green text-brand-custom-green"
            case 1: // In Progress
                return "bg-brand-process text-brand-process"
            default:
                return "bg-brand-dark-blue bg-opacity-5 text-brand-dark-blue"
        }
    }, [status])

    return (
        <label
            className={`relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg ${statusClasses}`}
        >
            <input
                type="checkbox"
                checked={status === 2}
                className="absolute h-full w-full cursor-pointer opacity-0"
                onChange={onChange}
                disabled={isLoading}
            />
            {status === 2 && <FaCheck className="text-white" />}{" "}
            {/* Completed */}
            {status === 1 && (
                <FaSpinner className="animate-spin text-white" />
            )}{" "}
            {/* In Progress */}
        </label>
    )
}

StatusIndicator.propTypes = {
    status: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default StatusIndicator
