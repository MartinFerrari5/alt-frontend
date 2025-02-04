// /src/pages/Users.jsx

import Sidebar from "../components/Sidebar"
import Users from "../components/Users/Users"

function UsersPage() {
    return (
        <div className="flex">
            <Sidebar />
            <Users />
        </div>
    )
}

export default UsersPage
