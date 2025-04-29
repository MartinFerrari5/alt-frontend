// /src/components/Tasks/DatePicker.jsx
import PropTypes from "prop-types"

const DatePicker = ({ value, onChange }) => {
    // 1. Validar el 'value' antes de usarlo
    const isValidDate = value instanceof Date && !isNaN(value.getTime())
    let dateString = ""

    if (isValidDate) {
        // 2. Ajustar por zona horaria SOLO para mostrar en el input 'YYYY-MM-DD'
        // Creamos una copia para no mutar el 'value' original
        const displayDate = new Date(value)
        displayDate.setMinutes(
            displayDate.getMinutes() + displayDate.getTimezoneOffset()
        )
        dateString = displayDate.toISOString().split("T")[0]
    }

    const handleChange = (e) => {
        // 3. Usar valueAsDate para obtener el objeto Date directamente (o null)
        // valueAsDate interpreta la fecha seleccionada como UTC 00:00:00
        const selectedDate = e.target.valueAsDate

        // 4. Llamar a onChange con el objeto Date (o null si se borra)
        // No se necesita ajuste de zona aquí, el estado mantendrá la fecha UTC 00:00:00
        onChange(selectedDate)
    }

    return (
        <div className="col-span-2">
            <label
                htmlFor="task-date"
                className="mb-1 block text-sm font-medium text-gray-700"
            >
                Fecha
            </label>
            <input
                id="task-date"
                type="date"
                value={dateString}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" // Usar w-full para ocupar el espacio disponible
            />
        </div>
    )
}

// Añadir PropTypes para validación y documentación
DatePicker.propTypes = {
    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
}

// Valor por defecto si no se proporciona 'value'
DatePicker.defaultProps = {
    value: null,
}

export default DatePicker
