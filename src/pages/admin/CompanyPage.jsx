import CompaniesTable from "../../components/CompaniesTable"
import MainLayout from "../../components/layout/MainLayout"
import useAuthStore from "../../store/modules/authStore"

const CompanyPage = () => {
    const user = useAuthStore((state) => state.user)

    return (
        <MainLayout>
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Lista de Compañías</h1>
                <CompaniesTable userId={user.id} />
            </div>
        </MainLayout>
    )
}

export default CompanyPage
