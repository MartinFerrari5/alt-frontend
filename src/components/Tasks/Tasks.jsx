// src/components/Tasks/Tasks.jsx
import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useTasks } from "../../hooks/data/task/useTasks"
import Header from "../Header"
import TaskItem from "./TaskItem"
import TaskFilter from "./TaskFilter"
import useAuthStore from "../../store/authStore"

const Tasks = () => {
  const { useFilterTasks } = useTasks()
  const [searchParams, setSearchParams] = useSearchParams()
  const role = useAuthStore((state) => state.role)

  // Obtención de filtros desde la URL
  const filters = useMemo(() => ({
    fullname: searchParams.get("fullname") || "",
    company: searchParams.get("company") || "",
    project: searchParams.get("project") || "",
    date: searchParams.get("date") || "",
    status: searchParams.get("status") || "0",
  }), [searchParams])

  const { data: filteredTasks, isLoading, isError } = useFilterTasks(filters)

  // Actualiza la URL con los datos del filtro
  const handleFilter = (filterData) => {
    const { fullname, company, project, status, date } = filterData
    setSearchParams({ fullname, company, project, status, date })
  }

  // Función para renderizar la tabla de tareas
  const renderTable = () => (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        <div className="max-h-[400px] overflow-y-auto rounded-lg border">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="sticky top-0 z-10 bg-gray-600 text-xs uppercase text-gray-400">
              <tr>
                {role === "admin" && <th className="px-4 py-3">Nombre</th>}
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">HE</th>
                <th className="px-4 py-3">HS</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Proyecto</th>
                <th className="px-4 py-3">TH</th>
                <th className="px-4 py-3">HD</th>
                <th className="px-4 py-3">HT</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Función para gestionar los distintos estados de carga/error/vacío
  const renderContent = () => {
    if (isLoading) return <p className="text-sm text-brand-text-gray">Cargando tareas...</p>
    if (isError) return <p className="text-sm text-red-500">Error al cargar las tareas.</p>
    if (!filteredTasks || filteredTasks.length === 0)
      return <p className="text-sm text-brand-text-gray">No hay tareas disponibles.</p>
    return renderTable()
  }

  return (
    <div className="space-y-6 overflow-hidden px-8 py-9">
      <Header subtitle="Mis Tareas" title="Mis Tareas" tasks={filteredTasks} />
      <div className="space-y-3 rounded-xl bg-white p-6">
        <TaskFilter onFilter={handleFilter} />
        {renderContent()}
      </div>
    </div>
  )
}

export default Tasks
