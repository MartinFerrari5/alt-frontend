// /src/pages/Users.jsx

import Sidebar from "../../components/Sidebar";
import ManagementTables from "../../components/admin/management/ManagementTables";

function ManagementPage() {
    return (
        // Contenedor principal fijo con h-screen y sin scroll global
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            {/* Se aplica margen izquierdo en pantallas grandes para que el contenido no quede debajo de la sidebar */}
            <div className="w-full lg:ml-72 space-y-6 px-8 py-16 overflow-hidden">
                <ManagementTables />
            </div>
        </div>
    );
}

export default ManagementPage;
