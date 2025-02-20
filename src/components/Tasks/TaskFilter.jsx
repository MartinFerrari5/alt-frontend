// src/components/Tasks/TaskFilter.jsx
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import useAuthStore from "../../store/authStore"

const TaskFilter = ({ onFilter }) => {
    const role = useAuthStore((state) => state.role)
    const [searchParams, setSearchParams] = useSearchParams()
    const [fullname, setFullname] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    // Inicializar los campos con los valores de la URL, si existen
    useEffect(() => {
        const urlFullname = searchParams.get("fullname") || ""
        const urlDate = searchParams.get("date") || ""
        setFullname(urlFullname)
        if (urlDate) {
            const dates = urlDate.split(" ")
            if (dates.length === 2) {
                setStartDate(dates[0])
                setEndDate(dates[1])
            } else {
                setStartDate(urlDate)
            }
        }
    }, [searchParams])

    const handleFilter = () => {
        // Construir el rango de fecha según los valores disponibles
        const dateRange =
            startDate && endDate ? `${startDate} ${endDate}` : startDate || ""

        // Actualizar los parámetros en la URL
        const params = {}
        if (fullname) params.fullname = fullname
        if (dateRange) params.date = dateRange
        setSearchParams(params)

        // Llamar a la función de filtrado pasada desde Tasks
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
