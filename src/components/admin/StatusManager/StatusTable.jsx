// src/components/admin/StatusManager/StatusTable.jsx
import StatusItem from "./StatusItem"
import useStatusStore from "../../../store/statusStore"

const StatusTable = () => {
    const { statuses } = useStatusStore()
    const tasks = statuses.tasks
    return (
        <div className="w-full space-y-6 px-8 py-16">
            <div className="space-y-3 rounded-xl bg-white p-6">
                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="max-h-[500px] overflow-y-auto rounded-lg border">
                                <table className="w-full text-left text-sm text-gray-500">
                                    <thead className="sticky top-0 bg-white text-xs uppercase text-gray-600 shadow-md">
                                        <tr>
                                            <th className="px-4 py-3">
                                                Company
                                            </th>
                                            <th className="px-4 py-3">
                                                Project
                                            </th>
                                            <th className="px-4 py-3">
                                                Task Type
                                            </th>
                                            <th className="px-4 py-3">
                                                Task Description
                                            </th>
                                            <th className="px-4 py-3">
                                                Entry Time
                                            </th>
                                            <th className="px-4 py-3">
                                                Exit Time
                                            </th>
                                            <th className="px-4 py-3">
                                                Hour Type
                                            </th>
                                            <th className="px-4 py-3">
                                                Lunch Hours
                                            </th>
                                            <th className="px-4 py-3">
                                                Status
                                            </th>
                                            <th className="px-4 py-3">
                                                User ID
                                            </th>
                                            <th className="px-4 py-3">
                                                Task Date
                                            </th>
                                            <th className="px-4 py-3">
                                                Worked Hours
                                            </th>
                                            <th className="px-4 py-3">
                                                Full Name
                                            </th>
                                            <th className="px-4 py-3">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task) => (
                                            <StatusItem
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
            </div>
        </div>
    )
}

export default StatusTable
