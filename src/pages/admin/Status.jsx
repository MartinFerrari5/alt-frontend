import StatusManager from "../../components/admin/StatusManager/StatusManager"
import Sidebar from "../../components/Sidebar"

export const Status = () => {
    return (
        <div className="flex">
            <Sidebar />
            <StatusManager />
        </div>
    )
}
