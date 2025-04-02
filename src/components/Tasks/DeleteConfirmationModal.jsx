// /src/components/Tasks/DeleteConfirmationModal.jsx
import PropTypes from "prop-types"

const DeleteConfirmationModal = ({
    onConfirm,
    onCancel,
    message,
    confirmText,
    cancelText,
}) => {
    return (
        <div
            id="popup-modal"
            tabIndex="-1"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div className="relative max-h-full w-full max-w-md p-4">
                <div className="relative rounded-lg bg-white shadow-sm">
                    <button
                        type="button"
                        className="absolute end-2.5 top-3 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                        onClick={onCancel}
                    >
                        <svg
                            className="h-3 w-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-4 text-center md:p-5">
                        <svg
                            className="mx-auto mb-4 h-12 w-12 text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500">
                            {message}
                        </h3>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                        <button
                            type="button"
                            className="ms-3 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

DeleteConfirmationModal.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    message: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
}

DeleteConfirmationModal.defaultProps = {
    message: "¿Estás seguro de que deseas eliminar esta tarea?",
    confirmText: "Si, estoy seguro",
    cancelText: "No, cancel",
}

export default DeleteConfirmationModal
