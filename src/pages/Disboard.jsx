// src/pages/Disboard.jsx

import DashboardCards from "../components/DashboardCards"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import TaskItem from "../components/Tasks/TaskItem"
import { useTasks } from "../hooks/data/task/useTasks"

const DisboardPage = () => {
    const { tasks } = useTasks()

    const validTasks = tasks.filter((task) => task?.id)
    const firstTask = validTasks[0]

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full space-y-6 px-8 py-16">
                <Header subtitle="Panel" title="Panel" />
                <DashboardCards />
                <div className="grid grid-cols-[1.5fr,1fr] gap-10">
                    <div className="space-y-6 rounded-[10px] bg-white p-6">
                        <h3 className="text-xl font-semibold">Tareas</h3>
                        <span className="text-sm text-brand-dark-gray">
                            Resumen de las tareas disponibles
                        </span>
                        <div className="relative max-h-[400px] overflow-y-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-left text-sm text-gray-500">
                                <thead className="sticky top-0 z-10 bg-gray-600 text-xs uppercase text-gray-400">
                                    <tr className="">
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Empresa</th>
                                        <th className="px-6 py-3">Proyecto</th>
                                        <th className="px-6 py-3">Fecha</th>
                                        <th className="px-6 py-3">Hora</th>
                                        <th className="px-6 py-3">
                                            tipo de hora
                                        </th>
                                        <th className="px-4 py-3">
                                            hs trabajadas
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
                    <div className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        {/* Verificar si hay tareas y renderizar el worked_hours de la primera */}
                        <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                            Horas totales
                        </h4>
                        {firstTask ? (
                            <span className="font-normal text-gray-700">
                                {firstTask.total}
                            </span>
                        ) : (
                            <p className="font-normal text-gray-700">
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
