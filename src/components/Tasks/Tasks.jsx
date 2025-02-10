// src/components/Tasks/Tasks.jsx

import useTaskStore from "../../store/taskStore"
import Header from "../Header"
import TaskItem from "./TaskItem"

const Tasks = () => {
    // Get tasks from the Zustand store
    const tasks = useTaskStore((state) => state.tasks)

    return (
        <div className="w-full space-y-6 px-8 py-16">
            <Header subtitle="Mis Tareas" title="Mis Tareas" />
            <div className="space-y-3 rounded-xl bg-white p-6">
                {tasks.length === 0 ? (
                    <p className="text-sm text-brand-text-gray">
                        No hay tareas disponibles.
                    </p>
                ) : (
                    <div className="flex flex-col">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                <div className="max-h-[500px] overflow-y-auto rounded-lg border">
                                    <table className="rti:text-right w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                        <thead className="sticky top-0 z-10 bg-white text-xs uppercase text-gray-600 shadow-md dark:bg-gray-600 dark:text-gray-400">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Empresa
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Proyecto
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Fecha
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Hora
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-right"
                                                >
                                                    tipo de hora
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-right"
                                                >
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        {/* Cabecera fija */}
                                        {/* Cuerpo de la tabla con scroll */}
                                        <tbody>
                                            {tasks.map((task) => (
                                                <TaskItem
                                                    key={task.id}
                                                    task={task}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Tasks
