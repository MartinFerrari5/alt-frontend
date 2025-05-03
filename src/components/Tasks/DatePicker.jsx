// /src/components/Tasks/DatePicker.jsx
import PropTypes from "prop-types"

const DatePicker = ({ value, onChange }) => {
    // Preparamos la cadena "YYYY-MM-DD" sin tocar la hora ni la zona
    let dateString = ""
    if (value instanceof Date && !isNaN(value.getTime())) {
        const year = value.getFullYear()
        const month = String(value.getMonth() + 1).padStart(2, "0")
        const day = String(value.getDate()).padStart(2, "0")
        dateString = `${year}-${month}-${day}`
    }

    const handleChange = (e) => {
        const iso = e.target.value // "YYYY-MM-DD" o ""
        if (!iso) {
            // Si el usuario borró la fecha
            onChange(null)
            return
        }
        // Parseamos manualmente para evitar que Date lo convierta en UTC
        const [year, month, day] = iso.split("-").map(Number)
        const selectedDate = new Date(year, month - 1, day)
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
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
        </div>
    )
}

DatePicker.propTypes = {
    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
}

DatePicker.defaultProps = {
    value: null,
}

export default DatePicker
