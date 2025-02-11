import PropTypes from "prop-types"

const Alert = ({ type, message, onClose }) => {
    let classes = ""
    let title = ""
    if (type === "success") {
        classes =
            "flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
        title = "¡Tarea creada con éxito!"
    } else if (type === "danger") {
        classes =
            "flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
        title = "Error"
    } else {
        classes =
            "flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
        title = "Info"
    }
    return (
        <div className={classes} role="alert">
            <svg
                className="mr-3 inline h-4 w-4 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <div className="flex-1">
                <span className="font-medium">{title}</span> {message}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="ml-3 text-sm font-bold text-gray-500 hover:text-gray-900"
                    aria-label="Close"
                >
                    &times;
                </button>
            )}
        </div>
    )
}

Alert.propTypes = {
    type: PropTypes.oneOf(["success", "danger", "info"]).isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func,
}

export default Alert