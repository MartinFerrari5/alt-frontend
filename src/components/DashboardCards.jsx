// // src\components\DashboardCards.jsx
import { FaTasks, FaSpinner, FaCheckCircle } from "react-icons/fa" // Import icons from react-icons
import useTaskStore from "../store/taskStore" // Import the task store
import DashboardCard from "./DashboardCard"

const DashboardCards = () => {
    // Get tasks directly from the global state
    const tasks = useTaskStore((state) => state.tasks)

    // Count tasks based on their status
    const notStartedTasks = tasks.filter((task) => task.status === 0).length // Status 0: Not Started
    const inProgressTasks = tasks.filter((task) => task.status === 1).length // Status 1: In Progress
    const completedTasks = tasks.filter((task) => task.status === 2).length // Status 2: Completed

    return (
        <div className="grid grid-cols-4 gap-9">
            {/* Total Tasks */}
            <DashboardCard
                icon={<FaTasks className="text-2xl text-brand-dark-blue" />} // Use FaTasks icon
                mainText={tasks.length}
                secondaryText="Tareas totales"
            />

            {/* Not Started Tasks */}
            <DashboardCard
                icon={<FaTasks className="text-2xl text-brand-dark-blue" />} // Use FaTasks icon
                mainText={notStartedTasks}
                secondaryText="Tareas no iniciadas"
            />

            {/* In Progress Tasks */}
            <DashboardCard
                icon={
                    <FaSpinner className="animate-spin text-2xl text-brand-process" />
                } // Use FaSpinner icon with animation
                mainText={inProgressTasks}
                secondaryText="Tareas en progreso"
            />

            {/* Completed Tasks */}
            <DashboardCard
                icon={
                    <FaCheckCircle className="text-2xl text-brand-custom-green" />
                } // Use FaCheckCircle icon
                mainText={completedTasks}
                secondaryText="Tareas completadas"
            />
        </div>
    )
}

export default DashboardCards
