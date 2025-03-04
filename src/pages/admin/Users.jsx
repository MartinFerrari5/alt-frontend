// /src/pages/Users.jsx
import Users from "../../components/admin/users/Users";
import Sidebar from "../../components/Sidebar";

function UsersPage() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            {/* Se aplica lg:ml-72 para compensar el ancho de la sidebar fija */}
            <div className="w-full lg:ml-72">
                <Users />
            </div>
        </div>
    );
}

export default UsersPage;
