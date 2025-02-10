// /src/components/Tasks/DatePicker.jsx
const DatePicker = ({ value, onChange }) => {
    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Fecha</label>
            <input
                type="date"
                value={value.toISOString().split("T")[0]} // Ensure the input value is in the correct format
                onChange={(e) => onChange(new Date(e.target.value))} // Pass a Date object to onChange
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
        </div>
    )
}

export default DatePicker
