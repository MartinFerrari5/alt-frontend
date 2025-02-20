// src/components/Tasks/StatusIndicator.jsx
import PropTypes from "prop-types"
import { FaCheck, FaSpinner } from "react-icons/fa"

const StatusIndicator = ({ status, isLoading, onChange, role }) => {
  const isCompleted = status === 1
  const statusClasses = isCompleted
    ? "bg-brand-custom-green text-brand-custom-green"
    : "bg-brand-process text-brand-process"

  return (
    <label
      className={`relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg ${statusClasses}`}
    >
      {role === "admin" && (
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={onChange}
          disabled={isLoading}
          className="absolute h-full w-full cursor-pointer opacity-0"
        />
      )}
      {isLoading ? (
        <FaSpinner className="animate-spin text-white" />
      ) : isCompleted ? (
        <FaCheck className="text-white" />
      ) : (
        <FaSpinner className="animate-spin text-white" />
      )}
    </label>
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
  role: "", // Valor por defecto: cadena vacía
}

export default StatusIndicator
