// src/components/Tasks/Tasks.jsx

import { useGetTasks } from "../../hooks/data/use-get-tasks"
import Header from "../Header"
import TaskItem from "./TaskItem"

const Tasks = () => {
    const { data: tasks = [] } = useGetTasks()

    return (
        <div className="w-full space-y-6 px-8 py-16">
            <Header subtitle="Mis Tareas" title="Mis Tareas" />
            <div className="space-y-3 rounded-xl bg-white p-6">
                {tasks.length === 0 ? (
                    <p className="text-sm text-brand-text-gray">
                        No hay tareas disponibles.
                    </p>
                ) : (
                    <div className="relative max-h-[400px] overflow-y-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-left text-sm text-gray-500 rtl:text-right">
                            <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Empresa
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Proyecto
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Fecha
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Hora
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right"
                                    >
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <TaskItem key={task.id} task={task} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Tasks
