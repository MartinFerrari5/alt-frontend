// /src/components/Tasks/StatusIndicator.jsx

import PropTypes from "prop-types";
import { FaCheck, FaSpinner } from "react-icons/fa";

const StatusIndicator = ({ status, isLoading, onChange }) => {
  const isCompleted = status === 1;
  const statusClasses = isCompleted
    ? "bg-brand-custom-green text-brand-custom-green"
    : "bg-brand-process text-brand-process";

  return (
    <label
      className={`relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg ${statusClasses}`}
    >
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={onChange}
        disabled={isLoading}
        className="absolute h-full w-full cursor-pointer opacity-0"
      />
      {isCompleted ? (
        <FaCheck className="text-white" />
      ) : (
        <FaSpinner className="animate-spin text-white" />
      )}
    </label>
  );
};

StatusIndicator.propTypes = {
  status: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StatusIndicator;
