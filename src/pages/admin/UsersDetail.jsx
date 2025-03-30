// /src/pages/admin/UsersDetail.jsx
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import Sidebar from "../../components/layout/Sidebar"
import Button from "../../components/Button"
import UserEditForm from "../../components/admin/users/UserEditForm"
import { useGetUsers, useUpdateUser } from "../../hooks/data/users/useUserHooks"
import ProjectsSection from "../../components/admin/users/ProjectsSection"
import CompaniesSection from "../../components/admin/users/CompaniesSection"

const UsersDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [selectedCompanyRelId, setSelectedCompanyRelId] = useState("")
    const { data: user, isLoading, error } = useGetUsers(id)
    const updateUserMutation = useUpdateUser(id)
    const userData = Array.isArray(user) ? user[0] : user

    if (isLoading) return <div>Cargando información del usuario...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!userData)
        return <div>No se encontró información para este usuario.</div>

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            <div className="hidden lg:block lg:w-72">
                <Sidebar />
            </div>
            <div className="flex-1 overflow-auto px-4 py-6 sm:px-8">
                <Button onClick={() => navigate(-1)}>Volver</Button>
                <h1 className="my-4 text-2xl font-bold">Detalle del Usuario</h1>
                <UserEditForm
                    userData={userData}
                    updateUser={updateUserMutation.mutate}
                />
                <CompaniesSection
                    userId={id}
                    selectedCompanyRelId={selectedCompanyRelId}
                    setSelectedCompanyRelId={setSelectedCompanyRelId}
                />
                {/* Se usa el relationship_id de la compañía para obtener los proyectos */}
                <ProjectsSection
                    userId={id}
                    selectedCompanyRelId={selectedCompanyRelId}
                />
            </div>
        </div>
    )
}

export default UsersDetail
