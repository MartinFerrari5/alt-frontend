// /src/pages/admin/UsersDetail.jsx
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import Button from "../../components/Button"
import UserEditForm from "../../components/admin/users/UserEditForm"
import RelationSection from "../../components/admin/users/RelationSection"
import { useGetUsers, useUpdateUser } from "../../hooks/data/users/useUserHooks"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { schema } from "../../util/validationSchema"
import {
    addCompanyUserRelation,
    addProjectUserRelation,
    deleteCompanyUserRelation,
    getOptions,
    getRelatedOptions,
    getNotRelatedCompanies,
    getNotRelatedProjects,
} from "../../hooks/data/options/options"
import EditProjectRelationModal from "../../components/admin/users/EditProjectRelationModal"

const UsersDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [companiesTable, setCompaniesTable] = useState([])
    const [projectsTable, setProjectsTable] = useState([])
    // Relaciones separadas: compañías y proyectos
    const [relatedCompanies, setRelatedCompanies] = useState([])
    const [relatedProjects, setRelatedProjects] = useState([])
    const [notRelatedOptions, setNotRelatedOptions] = useState({
        companies: [],
        projects: [],
    })

    // Cargar opciones disponibles para compañías y proyectos
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const companiesData = await getOptions("companies_table")
                const projectsData = await getOptions("projects_table")
                setCompaniesTable(companiesData.options || [])
                setProjectsTable(projectsData.options || [])
            } catch (error) {
                console.error("Error al obtener opciones:", error)
            }
        }
        fetchOptions()
    }, [])

    // Configuración del formulario (para reiniciar valores)
    const { reset, watch } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            company: "",
            project: "",
            task_type: "",
            hour_type: "",
            task_description: "Tarea de prueba",
            entry_time: "09:00",
            exit_time: "18:00",
            lunch_hours: "2",
            status: "progreso",
        },
    })

    useEffect(() => {
        reset({
            ...watch(),
            company: companiesTable.length > 0 ? companiesTable[0].company : "",
            project: projectsTable.length > 0 ? projectsTable[0].project : "",
        })
    }, [companiesTable, projectsTable, reset, watch])

    const { data: user, isLoading, error } = useGetUsers(id)
    const updateUserMutation = useUpdateUser(id)
    const userData = Array.isArray(user) ? user[0] : user

    // 1. Obtener las compañías relacionadas al usuario
    useEffect(() => {
        if (id) {
            const fetchRelatedCompanies = async () => {
                try {
                    const companiesData = await getRelatedOptions({
                        user_id: id,
                        related_table: "company_users_table",
                        individual_table: "companies_table",
                    })
                    setRelatedCompanies(companiesData)
                } catch (error) {
                    console.error(
                        "Error al obtener compañías relacionadas:",
                        error
                    )
                }
            }
            fetchRelatedCompanies()
        }
    }, [id])

    // 2. Obtener los proyectos relacionados al usuario (tomando el relationship_id de la primera compañía)
    useEffect(() => {
        if (id && relatedCompanies.length > 0) {
            const fetchRelatedProjects = async () => {
                try {
                    const relationshipId = relatedCompanies[0].relationship_id
                    const projectsData = await getRelatedOptions({
                        user_id: id,
                        related_table: "project_company_table",
                        individual_table: "projects_table",
                        relationship_id: relationshipId,
                    })
                    setRelatedProjects(projectsData)
                } catch (error) {
                    console.error(
                        "Error al obtener proyectos relacionados:",
                        error
                    )
                }
            }
            fetchRelatedProjects()
        }
    }, [id, relatedCompanies])

    // Consultar opciones no relacionadas para compañías y proyectos
    useEffect(() => {
        if (id) {
            const fetchNotRelated = async () => {
                try {
                    const companiesNotRelated = await getNotRelatedCompanies(id)
                    let projectsNotRelated = []
                    if (relatedCompanies && relatedCompanies.length > 0) {
                        const relationshipId =
                            relatedCompanies[0].relationship_id
                        projectsNotRelated = await getNotRelatedProjects(
                            id,
                            relationshipId
                        )
                    }
                    setNotRelatedOptions({
                        companies: companiesNotRelated,
                        projects: projectsNotRelated,
                    })
                } catch (error) {
                    console.error(
                        "Error al obtener opciones no relacionadas:",
                        error
                    )
                }
            }
            fetchNotRelated()
        }
    }, [id, relatedCompanies])

    // Mapear relaciones para mostrar en la UI
    const mappedRelatedCompanies =
        relatedCompanies.map((r) => ({
            id: r.company_id,
            option: r.option,
        })) || []

    const mappedRelatedProjects =
        relatedProjects.map((r) => ({
            id: r.project_id,
            option: r.option,
        })) || []

    // Mapear opciones disponibles para compañías (se utiliza en la sección de compañías)
    const availableCompanies = notRelatedOptions.companies.map((item) => ({
        id: item.company_id,
        option: item.options,
    }))

    // Funciones para agregar y eliminar relaciones de compañías y proyectos
    const handleAddCompanyRelation = async (companyId) => {
        try {
            const relationData = { user_id: id, company_id: companyId }
            await addCompanyUserRelation(relationData)
            const updatedCompanies = await getRelatedOptions({
                user_id: id,
                related_table: "company_users_table",
                individual_table: "companies_table",
            })
            setRelatedCompanies(updatedCompanies)
            const updatedNotRelatedCompanies = await getNotRelatedCompanies(id)
            setNotRelatedOptions((prev) => ({
                ...prev,
                companies: updatedNotRelatedCompanies,
            }))
        } catch (error) {
            console.error("Error al agregar relación de compañía:", error)
        }
    }

    const handleDeleteCompanyRelation = async (relationId) => {
        try {
            await deleteCompanyUserRelation([relationId])
            const updatedCompanies = await getRelatedOptions({
                user_id: id,
                related_table: "company_users_table",
                individual_table: "companies_table",
            })
            setRelatedCompanies(updatedCompanies)
            const updatedNotRelatedCompanies = await getNotRelatedCompanies(id)
            setNotRelatedOptions((prev) => ({
                ...prev,
                companies: updatedNotRelatedCompanies,
            }))
        } catch (error) {
            console.error("Error al eliminar relación de compañía:", error)
        }
    }

    const handleAddProjectRelation = async (projectId, relationshipId) => {
        try {
            const relationData = {
                user_id: id,
                project_id: projectId,
                relationship_id: relationshipId,
            }
            await addProjectUserRelation(relationData)
            // Actualizar proyectos relacionados y opciones disponibles
            const updatedProjects = await getRelatedOptions({
                user_id: id,
                related_table: "project_company_table",
                individual_table: "projects_table",
                relationship_id: relationshipId,
            })
            setRelatedProjects(updatedProjects)
            const updatedNotRelatedProjects = await getNotRelatedProjects(
                id,
                relationshipId
            )
            setNotRelatedOptions((prev) => ({
                ...prev,
                projects: updatedNotRelatedProjects,
            }))
        } catch (error) {
            console.error("Error al agregar relación de proyecto:", error)
        }
    }

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
                {/* Formulario de edición de datos del usuario */}
                <UserEditForm
                    userData={userData}
                    updateUser={updateUserMutation.mutate}
                />
                {/* Sección para Compañías */}
                <RelationSection
                    title="Compañías"
                    relatedItems={mappedRelatedCompanies}
                    availableItems={availableCompanies}
                    displayProp="option"
                    onAddRelation={handleAddCompanyRelation}
                    onDeleteRelation={handleDeleteCompanyRelation}
                />
                {/* Sección para Proyectos con modal personalizado */}
                <RelationSection
                    title="Proyectos"
                    relatedItems={mappedRelatedProjects}
                    displayProp="option"
                    customModal={({ onClose }) => (
                        <EditProjectRelationModal
                            title="Proyectos"
                            relatedCompanies={relatedCompanies}
                            onAddRelation={handleAddProjectRelation}
                            onClose={onClose}
                            userId={id}
                        />
                    )}
                />
            </div>
        </div>
    )
}

export default UsersDetail
