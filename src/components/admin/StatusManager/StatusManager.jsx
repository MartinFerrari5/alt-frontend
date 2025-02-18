// src/components/admin/StatusManager/StatusManager.jsx

import StatusTable from "./StatusTable"
import Header from "../../Header"
import { useGetStatus } from "../../../hooks/status/use-status-hooks"

const StatusManager = () => {
    useGetStatus()

    return (
        <div>
            <Header subtitle="Mis Tareas" title="Mis Tareas" />
            <StatusTable />
        </div>
    )
}

export default StatusManager
