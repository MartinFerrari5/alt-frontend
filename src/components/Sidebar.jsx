import { HomeIcon, TasksIcon } from "../assets/icons"
import SidebarButton from "./SidebarButton"

const Sidebar = () => {
  return (
    <div className="h-screen w-72 min-w-72 bg-white">
      <div className="space-y-4 px-8 py-6">
        <h1 className="text-xl font-semibold text-brand-custom-green">
          Administrador de Tareas
        </h1>
        <p>
          Un simple{" "}
          <span className="text-brand-custom-green">organizador de tareas</span>
          .
        </p>
      </div>

      <div className="flex flex-col gap-2 p-2">
        <SidebarButton to="/">
          <HomeIcon />
          Inicio
        </SidebarButton>
        <SidebarButton to="/tasks">
          <TasksIcon />
          Mis Tareas
        </SidebarButton>
      </div>
    </div>
  )
}

export default Sidebar
