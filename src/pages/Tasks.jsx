import Sidebar from "../components/Sidebar"
import Tasks from "../components/Tasks/Tasks"

function TasksPage() {
  return (
    <div className="flex">
      <Sidebar />
      <Tasks />
    </div>
  )
}

export default TasksPage
