import { LoaderIcon, Tasks2Icon, TasksIcon } from "../assets/icons"
import { useGetTasks } from "../hooks/data/use-get-tasks"
import DashboardCard from "./DashboardCard"

const DashboardCards = () => {
  const { data: tasks = [] } = useGetTasks() // Evita undefined, usa [] como valor por defecto

  const notStartedTasks = tasks.filter((task) => task.status === 0).length
  const inProgressTasks = tasks.filter((task) => task.status === 1).length
  const completedTasks = tasks.filter((task) => task.status === 2).length

  return (
    <div className="grid grid-cols-4 gap-9">
      <DashboardCard
        icon={<Tasks2Icon />}
        mainText={tasks.length}
        secondaryText="Tareas totales"
      />
      <DashboardCard
        icon={<LoaderIcon />}
        mainText={notStartedTasks}
        secondaryText="Tareas no iniciadas"
      />
      <DashboardCard
        icon={<LoaderIcon />}
        mainText={inProgressTasks}
        secondaryText="Tareas en progreso"
      />
      <DashboardCard
        icon={<TasksIcon />}
        mainText={completedTasks}
        secondaryText="Tareas completadas"
      />
    </div>
  )
}

export default DashboardCards
