import CompaniesTable from "../../components/CompaniesTable"
import MainLayout from "../../components/layout/MainLayout"
import useAuthStore from "../../store/modules/authStore"

const CompanyPage = () => {
    const user = useAuthStore((state) => state.user)

    return (
        <MainLayout>
            <CompaniesTable userId={user.id} />
        </MainLayout>
    )
}

export default CompanyPage
