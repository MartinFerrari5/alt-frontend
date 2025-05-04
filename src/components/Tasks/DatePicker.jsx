// /src/components/Tasks/DatePicker.jsx
import { useState, useEffect } from "react"
import PropTypes from "prop-types"

const isoFromDate = (date) =>
    date instanceof Date && !isNaN(date) ? date.toISOString().slice(0, 10) : ""

/**
 * DatePicker controlado + semi‐controlado:
 * - `displayValue` es sólo el string que ve el usuario.
 * - `value` es el Date (o null) real que tu app maneja.
 */
const DatePicker = ({ value = null, onChange }) => {
    const [displayValue, setDisplayValue] = useState(isoFromDate(value))

    // Si `value` cambia desde fuera, sincronizamos el display
    useEffect(() => {
        setDisplayValue(isoFromDate(value))
    }, [value])

    // Mientras el user teclea, actualizamos sólo el string
    const handleInput = (e) => {
        setDisplayValue(e.target.value)
    }

    // Cuando pierde el foco, parseamos y avisamos al padre
    const handleBlur = () => {
        if (!displayValue) {
            onChange(null)
            return
        }
        const [y, m, d] = displayValue.split("-").map(Number)
        const dObj = new Date(y, m - 1, d)
        // sólo enviamos si es válido
        onChange(!isNaN(dObj.getTime()) ? dObj : null)
        // y nos aseguramos de formatearlo bien
        setDisplayValue(isoFromDate(!isNaN(dObj.getTime()) ? dObj : null))
    }

    return (
        <div className="group relative z-0 mb-5 w-full">
            <label
                htmlFor="task-date"
                className="mb-1 block text-sm font-medium text-gray-700"
            >
                Fecha
            </label>
            <input
                id="task-date"
                type="date"
                lang="es-ES"
                value={displayValue}
                onChange={handleInput}
                onBlur={handleBlur}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
        </div>
    )
}

DatePicker.propTypes = {
    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
}

export default DatePicker
