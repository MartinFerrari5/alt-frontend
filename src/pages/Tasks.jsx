// /src/pages/Tasks.jsx
import Sidebar from "../components/Sidebar";
import Tasks from "../components/Tasks/Tasks";

function TasksPage() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <Tasks />
        </div>
    );
}

export default TasksPage;
