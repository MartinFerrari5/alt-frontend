// /src/pages/Users.jsx

import Sidebar from "../../components/Sidebar"
import ManagementTables from "../../components/admin/management/ManagementTables"

function ManagementPage() {
    return (
        <div className="flex">
            <Sidebar />
            <ManagementTables />
        </div>
    )
}

export default ManagementPage
