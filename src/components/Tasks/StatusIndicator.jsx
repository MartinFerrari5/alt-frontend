// /src/components/Tasks/StatusIndicator.jsx

import PropTypes from "prop-types"
import { CheckIcon, LoaderIcon } from "../../assets/icons"

const StatusIndicator = ({ status, isLoading, onChange }) => {
    const getStatusClasses = () => {
        switch (status) {
            case 2:
                return "bg-brand-custom-green text-brand-custom-green"
            case 1:
                return "bg-brand-process text-brand-process"
            default:
                return "bg-brand-dark-blue bg-opacity-5 text-brand-dark-blue"
        }
    }

    return (
        <label
            className={`relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg ${getStatusClasses()}`}
        >
            <input
                type="checkbox"
                checked={status === 2}
                className="absolute h-full w-full cursor-pointer opacity-0"
                onChange={onChange}
                disabled={isLoading}
            />
            {status === 2 && <CheckIcon />}
            {status === 1 && (
                <LoaderIcon className="animate-spin text-brand-white" />
            )}
        </label>
    )
}

StatusIndicator.propTypes = {
    status: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default StatusIndicator
