// src/components/admin/StatusManager/StatusManager.jsx

import StatusTable from "./StatusTable"
import { useGetStatus } from "../../../hooks/data/status/use-status-hooks"

const StatusManager = () => {
    useGetStatus()

    return (
        <div className="w-full space-y-6 px-8 py-16">
            <StatusTable />
        </div>
    )
}

export default StatusManager
