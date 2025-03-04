// src/components/admin/StatusManager/StatusManager.jsx

import StatusTable from "./StatusTable"
import { useGetStatus } from "../../../hooks/data/status/use-status-hooks"

const StatusManager = () => {
    useGetStatus()

    return (
        // Contenedor del contenido principal con padding y sin scroll global
        <div className="w-full space-y-6 overflow-hidden px-8 py-16">
            <StatusTable />
        </div>
    )
}

export default StatusManager
