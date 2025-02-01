// src/pages/Disboard.jsx

import DashboardCards from "../components/DashboardCards"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import TaskItem from "../components/Tasks/TaskItem"
import { useGetTasks } from "../hooks/data/use-get-tasks"

const DisboardPage = () => {
  const { data: tasks = [] } = useGetTasks()
  const validTasks = tasks.filter((task) => task?.id)

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full space-y-6 px-8 py-16">
        <Header subtitle="Panel" title="Panel" />
        <DashboardCards />
        <div className="grid grid-cols-[1.5fr,1fr] gap-6">
          <div className="space-y-6 rounded-[10px] bg-white p-6">
            <h3 className="text-xl font-semibold">Tareas</h3>
            <span className="text-sm text-brand-dark-gray">
              Resumen de las tareas disponibles
            </span>
            <div className="space-y-3">
              {validTasks.length === 0 ? (
                <p className="text-sm text-brand-text-gray">
                  No hay tareas disponibles.
                </p>
              ) : (
                validTasks.map((task) => <TaskItem key={task.id} task={task} />)
              )}
            </div>
          </div>
          <div className="flex items-center justify-center space-y-6 rounded-[10px] bg-white p-6">
            <p className="text-brand-dark-gray">
              Cada acción de hoy te acerca a grandes logros mañana. ¡Hazlo!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisboardPage
