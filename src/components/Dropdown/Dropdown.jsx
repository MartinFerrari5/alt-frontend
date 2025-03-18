// /src/components/Dropdown/Dropdown.jsx
import PropTypes from "prop-types"
import { useEffect } from "react"
import { toast } from "react-toastify"

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
    useIdAsValue = false, // Nueva prop opcional
}) => {
    useEffect(() => {
        if (isError) {
            toast.error(errorText, { autoClose: 5000 })
        }
    }, [isError, errorText])

    return (
        <div className="group relative z-0 mb-5 w-full">
            <label htmlFor={id} className="mb-2 block text-sm font-medium">
                {label}
            </label>
            <select
                id={id}
                {...register(id)}
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0"
                disabled={isLoading}
            >
                <option value="">Seleccione un {label}</option>
                {isLoading ? (
                    <option>{loadingText}</option>
                ) : isError ? (
                    <option className="text-red-500">{errorText}</option>
                ) : (
                    items.map((item) => (
                        <option
                            key={item.id}
                            value={useIdAsValue ? item.id : item.option}
                        >
                            {item.option}
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
            option: PropTypes.string.isRequired,
        })
    ).isRequired,
    loadingText: PropTypes.string.isRequired,
    errorText: PropTypes.string.isRequired,
    useIdAsValue: PropTypes.bool, // Declaración de la nueva prop
}

export default Dropdown
