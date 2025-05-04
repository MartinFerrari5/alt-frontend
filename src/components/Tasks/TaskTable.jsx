// src/components/tasks/TaskTable.jsx
import TaskItem from "./TaskItem"

const TaskTable = ({
    tasks,
    isInicio,
    selectedTasks,
    onSelectTask,
    onSelectAll,
    currentPath,
    role,
}) => {
    return (
        <div className="overflow-x-auto">
            <div className="min-w-full">
                <div className="max-h-[400px] overflow-y-auto rounded-lg border">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="sticky top-0 z-20 bg-gray-600 text-xs uppercase text-gray-400">
                            <tr>
                                {isInicio && (
                                    <th className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedTasks.length ===
                                                tasks.length
                                            }
                                            onChange={onSelectAll}
                                            className="h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-gray-300 bg-white transition duration-200 checked:border-green-500 checked:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                    </th>
                                )}
                                {role === "admin" && (
                                    <th className="px-4 py-3">Nombre</th>
                                )}
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">HE</th>
                                <th className="px-4 py-3">HS</th>
                                <th className="px-4 py-3">Empresa</th>
                                <th className="px-4 py-3">Proyecto</th>
                                <th className="px-4 py-3">TH</th>
                                <th className="px-4 py-3">HD</th>
                                <th className="px-4 py-3">HT</th>
                                <th className="px-4 py-3">TDT</th>
                                <th className="px-4 py-3">Descripción</th>
                                <th className="px-4 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task || []}
                                    showCheckbox={isInicio}
                                    isSelected={selectedTasks.includes(task.id)}
                                    onSelectTask={onSelectTask}
                                    currentPath={currentPath}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TaskTable
