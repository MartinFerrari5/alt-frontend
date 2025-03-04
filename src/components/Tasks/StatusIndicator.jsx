// src/components/Tasks/StatusIndicator.jsx
import PropTypes from "prop-types"
import {
    FaCheck,
    FaSpinner,
    FaMoneyBillWave,
    FaHourglassHalf,
} from "react-icons/fa"

const StatusIndicator = ({ status, isLoading, onChange, role }) => {
    // Mapeo de clases según el estado
    const statusClassesMap = {
        0: "bg-brand-process", // En progreso
        1: "bg-brand-custom-green", // Enviado a admin (finalizado)
        2: "bg-brand-custom-blue", // Facturado (asumida clase azul)
    }
    const statusClasses = statusClassesMap[status] || "bg-gray-500"

    // Texto descriptivo del estado
    let statusText = ""
    if (status === 0) statusText = "progreso"
    else if (status === 1) statusText = "finalizado"
    else if (status === 2) statusText = "facturado"

    // Función para renderizar el ícono adecuado
    const renderIcon = () => {
        if (isLoading) {
            return <FaSpinner className="animate-spin text-white" />
        }
        switch (status) {
            case 0:
                return <FaHourglassHalf className="text-white" />
            case 1:
                return <FaCheck className="text-white" />
            case 2:
                return <FaMoneyBillWave className="text-white" />
            default:
                return null
        }
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{statusText}</span>
            <label
                className={`relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg ${statusClasses}`}
            >
                {role === "admin" && (
                    <input
                        type="checkbox"
                        checked={status === 1}
                        onChange={onChange}
                        disabled={isLoading}
                        className="absolute h-full w-full cursor-pointer opacity-0"
                    />
                )}
                {renderIcon()}
            </label>
        </div>
    )
}

StatusIndicator.propTypes = {
    status: PropTypes.number.isRequired,
    isLoading: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    role: PropTypes.string,
}

StatusIndicator.defaultProps = {
    isLoading: false,
    role: "",
}

export default StatusIndicator
