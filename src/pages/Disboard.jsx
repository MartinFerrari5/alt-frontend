// src/pages/Disboard.jsx

import DashboardCards from "../components/DashboardCards"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import TaskItem from "../components/Tasks/TaskItem"
import useTaskStore from "../store/taskStore"

const DisboardPage = () => {
    const tasks = useTaskStore((state) => state.tasks)

    const validTasks = tasks.filter((task) => task?.id)
    const firstTask = validTasks[0]

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
                        <div className="relative max-h-[400px] overflow-y-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-600 dark:text-gray-400">
                                    <tr className="">
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Empresa</th>
                                        <th className="px-6 py-3">Proyecto</th>
                                        <th className="px-6 py-3">Fecha</th>
                                        <th className="px-6 py-3">Hora</th>
                                        <th className="px-6 py-3">
                                            tipo de hora
                                        </th>
                                        <th className="px-6 py-3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {validTasks.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-5 text-center text-sm text-brand-text-gray"
                                            >
                                                No hay tareas disponibles.
                                            </td>
                                        </tr>
                                    ) : (
                                        validTasks.map((task) => (
                                            <TaskItem
                                                key={task.id}
                                                task={task}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-y-6 rounded-[10px] bg-white p-6">
                        {/* Verificar si hay tareas y renderizar el worked_hours de la primera */}
                        <h4 className="text-xl font-semibold">Horas totales</h4>
                        {firstTask ? (
                            <span className="ml-2 text-sm text-brand-dark-gray">
                                {firstTask.total}
                            </span>
                        ) : (
                            <p className="text-brand-dark-gray">
                                No hay tareas disponibles.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisboardPage
