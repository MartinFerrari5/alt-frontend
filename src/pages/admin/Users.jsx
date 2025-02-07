// /src/pages/Users.jsx

import Users from "../../components/admin/users/Users"
import Sidebar from "../../components/Sidebar"

function UsersPage() {
    return (
        <div className="flex">
            <Sidebar />
            <Users />
        </div>
    )
}

export default UsersPage
