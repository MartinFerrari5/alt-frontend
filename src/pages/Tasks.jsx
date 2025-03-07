// /src/pages/Tasks.jsx
import Sidebar from "../components/Sidebar"
import Tasks from "../components/Tasks/Tasks"

const TasksPage = () => (
  <div className="flex h-screen">
    <Sidebar />
    <main className="w-full lg:ml-72">
      <Tasks />
    </main>
  </div>
)

export default TasksPage
