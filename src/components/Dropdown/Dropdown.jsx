// /src/components/Dropdown/Dropdown.jsx
import PropTypes from "prop-types"
import { useEffect } from "react"
import { toast } from "react-toastify"

/**
 * Dropdown reutilizable que muestra una lista de opciones con estados de carga y error.
 *
 * @param {object} props
 * @param {string} props.id - El id del select.
 * @param {string} props.label - El label del select.
 * @param {function} props.register - La función de register de React Hook Form.
 * @param {object} props.error - El objeto de error de React Hook Form.
 * @param {boolean} props.isLoading - Indica si se esta cargando la lista de opciones.
 * @param {boolean} props.isError - Indica si hubo un error al cargar la lista de opciones.
 * @param {array} props.items - La lista de opciones.
 * @param {string} [props.valueKey] - La clave de los objetos en la lista de opciones que se utiliza como valor del select.
 * @param {string} [props.loadingText] - El texto que se muestra mientras se esta cargando la lista de opciones.
 * @param {string} [props.errorText] - El texto que se muestra cuando hubo un error al cargar la lista de opciones.
 */
const Dropdown = ({
    id,
    label,
    register,
    error,
    isLoading,
    isError,
    items = [],
    valueKey = "id",
    loadingText = "Cargando...",
    errorText = "Error al cargar opciones",
}) => {
    useEffect(() => {
        if (isError) {
            toast.error(errorText, { autoClose: 5000 })
        }
    }, [isError, errorText])

    /**
     * Obtiene las opciones del select.
     * Si isLoading es true, devuelve un option disabled con el texto de carga.
     * Si isError es true, devuelve un option disabled con el texto de error.
     * Si isLoading y isError son false, devuelve una lista de options con las opciones de la lista de items.
     *
     * @returns {JSX.Element} Un JSX.Element con las opciones del select.
     */
    const getOptions = () => {
        if (isLoading) {
            return <option disabled>{loadingText}</option>
        }
        if (isError) {
            return (
                <option disabled className="text-red-500">
                    {errorText}
                </option>
            )
        }
        return items.map((item) => (
            <option key={item.id} value={item[valueKey]}>
                {item.option}
            </option>
        ))
    }

    return (
        <div className="group relative z-0 mb-5 w-full">
            <label htmlFor={id} className="mb-2 block text-sm font-medium">
                {label}
            </label>
            <select
                id={id}
                {...register(id)}
                disabled={isLoading}
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-500 focus:border-green-300 focus:outline-none focus:ring-0"
            >
                <option value="">Seleccione {label}</option>
                {getOptions()}
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
    ),
    valueKey: PropTypes.string,
    loadingText: PropTypes.string,
    errorText: PropTypes.string,
}

export default Dropdown
