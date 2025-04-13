// /src/components/Tasks/DatePicker.jsx
const DatePicker = ({ value, onChange }) => {
    // Ajusta la fecha para mostrarla correctamente en el input type="date"
    // independientemente de la zona horaria del navegador.
    const localDate = new Date(value)
    // Sumamos el offset para que la fecha en UTC coincida con la fecha local deseada
    localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset())
    const dateString = localDate.toISOString().split("T")[0]

    return (
        <div className="col-span-2">
            <label
                htmlFor="task-date"
                className="mb-1 block text-sm font-medium text-gray-700"
            >
                Fecha
            </label>
            <input
                id="task-date" // Añadir id para asociar con label
                type="date"
                value={dateString}
                onChange={(e) => {
                    // Al cambiar, creamos la fecha a partir del valor YYYY-MM-DD.
                    // new Date('YYYY-MM-DD') interpreta la fecha como UTC 00:00:00.
                    const newDate = new Date(e.target.value)
                    // No es necesario ajustar el offset aquí si siempre trabajamos
                    // con la fecha a medianoche UTC.
                    onChange(newDate)
                }}
                // Clases de Tailwind mejoradas
                className="mt-1 block max-w-screen-2xl rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
        </div>
    )
}

export default DatePicker
