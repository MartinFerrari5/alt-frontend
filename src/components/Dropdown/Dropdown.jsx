// / src\components\Dropdown\Dropdown.jsx
import PropTypes from "prop-types"
import { useEffect } from "react"
import { toast } from "react-toastify" // Importa toast de react‑toastify

const Dropdown = ({
    id,
    label,
    register,
    error,
    isLoading,
    isError,
    items,
    loadingText,
    errorText,
}) => {
    // Muestra una alerta cuando ocurre un error
    useEffect(() => {
        if (isError) {
            toast.error(errorText, { autoClose: 5000 })
        }
    }, [isError, errorText])

    return (
        <div className="group relative z-0 mb-5 w-full">
            <label htmlFor={id} className="block mb-2 text-sm font-medium">
                {label}
            </label>
            <select
                id={id}
                {...register(id)}
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none  focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                disabled={isLoading}
            >
                {isLoading ? (
                    <option>{loadingText}</option>
                ) : isError ? (
                    <option className="text-red-500">{errorText}</option>
                ) : (
                    items.map((item) => (
                        <option key={item.id} value={item.options}>
                            {item.options}
                        </option>
                    ))
                )}
            </select>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
    )
}

Dropdown.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    register: PropTypes.func.isRequired,
    error: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            options: PropTypes.string.isRequired,
        })
    ).isRequired,
    loadingText: PropTypes.string.isRequired,
    errorText: PropTypes.string.isRequired,
}

export default Dropdown
