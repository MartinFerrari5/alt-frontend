// src/components/admin/StatusManager/StatusManager.jsx

import StatusTable from "./StatusTable"
import Header from "../../Header"
import { useGetStatus } from "../../../hooks/status/use-status-hooks"

const StatusManager = () => {
    useGetStatus()

    return (
        <div className="w-full space-y-6 px-8 py-16">
            <Header subtitle="Exportados" title="Exportados" />
            <StatusTable />
        </div>
    )
}

export default StatusManager
