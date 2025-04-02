// /src/pages/Tasks.jsx
import MainLayout from "../components/layout/MainLayout"
import Tasks from "../components/Tasks/Tasks"

const TasksPage = () => (
    <div className="flex h-screen">
        {/* <Sidebar /> */}
        <MainLayout>
            <Tasks />
        </MainLayout>
    </div>
)

export default TasksPage
