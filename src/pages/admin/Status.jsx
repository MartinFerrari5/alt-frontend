import StatusTable from "../../components/admin/StatusManager/StatusTable";
import Sidebar from "../../components/Sidebar";
import { useGetStatus } from "../../hooks/data/status/use-status-hooks";

export const Status = () => {
       useGetStatus();
    return (
        // Se fija la altura de la pantalla y se desactiva el scroll global
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            {/* Se aplica margen izquierdo en pantallas grandes para evitar que el contenido quede detrás de la sidebar */}
        <div className="w-full lg:ml-72">
            <StatusTable />
        </div>
        </div>
    );
};
