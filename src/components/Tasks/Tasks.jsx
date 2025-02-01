// src/components/Tasks/Tasks.jsx

import { CloudSunIcon, MoonIcon, SunIcon } from "../../assets/icons"
import { useGetTasks } from "../../hooks/data/use-get-tasks"
import Header from "../Header"
import TaskItem from "./TaskItem"
import TasksSeparator from "./TasksSeparator"

const Tasks = () => {
  const { data: tasks = [] } = useGetTasks()

  const morningTasks = tasks.filter(
    (task) => parseInt(task.entry_time.split(":")[0], 10) < 12
  )
  const afternoonTasks = tasks.filter((task) => {
    const hour = parseInt(task.entry_time.split(":")[0], 10)
    return hour >= 12 && hour < 18
  })
  const eveningTasks = tasks.filter(
    (task) => parseInt(task.entry_time.split(":")[0], 10) >= 18
  )

  return (
    <div className="w-full space-y-6 px-8 py-16">
      <Header subtitle="Mis Tareas" title="Mis Tareas" />
      <div className="rounded-xl bg-white p-6">
        <div className="space-y-3">
          <TasksSeparator title="Mañana" icon={<SunIcon />} />
          {morningTasks.length === 0 ? (
            <p className="text-sm text-brand-text-gray">
              No hay tareas para la mañana.
            </p>
          ) : (
            morningTasks.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </div>

        <div className="my-6 space-y-3">
          <TasksSeparator title="Tarde" icon={<CloudSunIcon />} />
          {afternoonTasks.length === 0 ? (
            <p className="text-sm text-brand-text-gray">
              No hay tareas para la tarde.
            </p>
          ) : (
            afternoonTasks.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </div>

        <div className="space-y-3">
          <TasksSeparator title="Noche" icon={<MoonIcon />} />
          {eveningTasks.length === 0 ? (
            <p className="text-sm text-brand-text-gray">
              No hay tareas para la noche.
            </p>
          ) : (
            eveningTasks.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </div>
      </div>
    </div>
  )
}

export default Tasks
