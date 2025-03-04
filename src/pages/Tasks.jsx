// /src/pages/Tasks.jsx
import Sidebar from "../components/Sidebar"
import Tasks from "../components/Tasks/Tasks"

function TasksPage() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="w-full lg:ml-72">
                <Tasks />
            </div>
        </div>
    )
}

export default TasksPage
