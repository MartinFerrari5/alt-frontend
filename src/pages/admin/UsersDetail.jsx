// /src/pages/admin/UsersDetail.jsx
import { useState, useEffect } from "react"
import { ArrowLeft, User, Calendar, Loader2 } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { toast } from "react-toastify"
import UserEditForm from "../../components/admin/users/UserEditForm"
// import {
//     useGetUsers,
//     useUpdateUser,
//     useUpdateUserRole,
// } from "../../hooks/data/users/useUserHooks"
import ProjectsSection from "../../components/admin/users/ProjectsSection"
import CompaniesSection from "../../components/admin/users/CompaniesSection"
import useNavigationStore from "../../store/ui/navigationStore"
import MainLayout from "../../components/layout/MainLayout"
import {
    useGetUsers,
    useUpdateUser,
    useUpdateUserRole,
} from "../../store/modules/userStore"

const UsersDetail = () => {
    const { id } = useParams()
    const { setActiveRoute } = useNavigationStore()
    const [selectedCompanyRelId, setSelectedCompanyRelId] = useState("")

    // Se obtiene la data del usuario mediante un hook personalizado
    const { data: user, isLoading, error } = useGetUsers(id)
    const updateUserMutation = useUpdateUser(id)
    const updateUserRoleMutation = useUpdateUserRole(id)
    const userData = Array.isArray(user) ? user[0] : user

    // Establece la ruta activa en el sidebar
    useEffect(() => {
        setActiveRoute("users")
    }, [setActiveRoute])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
            return "Invalid date"
        }
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="text-green h-10 w-10 animate-spin" />
            </div>
        )
    }

    if (error) return <div>Error: {error.message}</div>
    if (!userData)
        return <div>No se encontró información para este usuario.</div>

    const handleSave = (updatedUser) => {
        const promises = []

        // Actualiza nombre y correo si han cambiado
        if (
            updatedUser.full_name !== userData.full_name ||
            updatedUser.email !== userData.email
        ) {
            promises.push(
                updateUserMutation.mutateAsync({
                    full_name: updatedUser.full_name,
                    email: updatedUser.email,
                })
            )
        }

        // Actualiza el rol si ha cambiado
        if (updatedUser.role && updatedUser.role !== userData.role) {
            promises.push(
                updateUserRoleMutation.mutateAsync({ role: updatedUser.role })
            )
        }

        Promise.all(promises)
            .then(() => toast.success("User updated successfully"))
            .catch((err) => {
                console.error(err)
                toast.error("Failed to update user")
            })
    }

    return (
        <MainLayout>
            <div className="flex min-h-screen flex-col lg:flex-row">
                <div className="flex-1 overflow-auto px-4 py-6 sm:px-8">
                    <div className="mb-6 flex items-center gap-2">
                        <Link
                            to="/rraa/admin/users"
                            className="hover:text-green hover:bg-grey-bg rounded-full p-2 text-gray-500 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-main-color text-2xl font-bold">
                            Detalle del Usuario
                        </h1>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* User information column */}
                        <div className="md:col-span-1">
                            <article className="mb-6 rounded-lg bg-white p-4 shadow transition-transform">
                                <header className="mb-4 flex flex-col items-center text-center">
                                    <div className="bg-green mb-3 flex h-20 w-20 items-center justify-center rounded-full text-white">
                                        <User className="h-10 w-10" />
                                    </div>
                                    <h2 className="text-main-color text-xl font-semibold">
                                        {userData.full_name}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {userData.email}
                                    </p>
                                    <div className="bg-grey-bg mt-4 w-full rounded-md p-2 text-center text-sm">
                                        {/* <strong className="font-medium">
                                            ID:{" "}
                                        </strong> */}
                                        {/* <span className="text-gray-500">
                                            {userData.id}
                                        </span> */}
                                    </div>
                                </header>

                                <section className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between border-b border-gray-200 py-2">
                                        <span className="text-gray-500">
                                            Fecha de Creación
                                        </span>
                                        <div className="text-main-color flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {formatDate(
                                                    userData.createdAt ||
                                                        userData.created_at
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    {/*
                                        <div className="flex items-center justify-between py-2">
                                        <span className="text-gray-500">Último Acceso</span>
                                        <div className="flex items-center gap-1 text-main-color">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDate(userData.lastLogin || userData.last_login || "N/A")}</span>
                                        </div>
                                        </div>
                                    */}
                                </section>
                            </article>

                            <div className="card-container rounded-lg bg-white p-4 shadow">
                                <h3 className="section-title mb-2 text-lg font-semibold">
                                    Editar usuario
                                </h3>
                                <UserEditForm
                                    user={userData}
                                    onSave={handleSave}
                                />
                            </div>
                        </div>

                        {/* Columna de relaciones (empresas y proyectos) */}
                        <div className="md:col-span-2">
                            <div className="card-container rounded-lg bg-white p-4 shadow">
                                <CompaniesSection
                                    userId={id}
                                    selectedCompanyRelId={selectedCompanyRelId}
                                    setSelectedCompanyRelId={
                                        setSelectedCompanyRelId
                                    }
                                />
                            </div>
                            <div className="card-container mt-4 rounded-lg bg-white p-4 shadow">
                                <ProjectsSection
                                    userId={id}
                                    selectedCompanyRelId={selectedCompanyRelId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default UsersDetail
