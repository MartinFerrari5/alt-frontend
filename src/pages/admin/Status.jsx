import StatusTable from "../../components/admin/StatusManager/StatusTable"
import Sidebar from "../../components/layout/Sidebar"

import { useGetStatus } from "../../hooks/data/status/use-status-hooks"

export const Status = () => {
    useGetStatus()
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="w-full lg:ml-72">
                <StatusTable />
            </div>
        </div>
    )
}
