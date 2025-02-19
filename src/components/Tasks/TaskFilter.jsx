// /src\components\Tasks\TaskFilter.jsx

import { useState } from "react"
import useAuthStore from "../../store/authStore"

const TaskFilter = ({ onFilter }) => {
    const role = useAuthStore((state) => state.role)
    const [fullname, setFullname] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const handleFilter = () => {
        const dateRange = startDate && endDate ? `${startDate} ${endDate}` : ""
        onFilter({ fullname, date: dateRange })
    }

    return (
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            {role === "admin" && (
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full rounded-lg border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleFilter}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Filtrar
            </button>
        </div>
    )
}

export default TaskFilter
