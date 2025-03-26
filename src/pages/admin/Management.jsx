// /src/pages/Users.jsx

import ManagementTables from "../../components/admin/management/ManagementTables"
import Sidebar from "../../components/layout/Sidebar"

function ManagementPage() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="w-full space-y-6 px-8 py-9 lg:ml-72">
                <ManagementTables />
            </div>
        </div>
    )
}

export default ManagementPage
