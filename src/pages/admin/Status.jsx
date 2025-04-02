import StatusTable from "../../components/admin/StatusManager/StatusTable"
import MainLayout from "../../components/layout/MainLayout"
import { useGetStatus } from "../../hooks/data/status/use-status-hooks"

export const Status = () => {
    useGetStatus()
    return (
        <MainLayout>
            <div className="w-full lg:ml-72">
                <StatusTable />
            </div>
        </MainLayout>
    )
}
