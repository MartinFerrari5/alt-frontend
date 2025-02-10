// /src/components/Tasks/DatePicker.jsx
const DatePicker = ({ value, onChange }) => {
    const localDate = new Date(value)
    localDate.setMinutes(value.getMinutes() - value.getTimezoneOffset())

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Fecha</label>
            <input
                type="date"
                value={localDate.toISOString().split("T")[0]}
                onChange={(e) => {
                    const newDate = new Date(e.target.value)
                    newDate.setMinutes(
                        newDate.getMinutes() + newDate.getTimezoneOffset()
                    )
                    onChange(newDate)
                }}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
        </div>
    )
}

export default DatePicker
