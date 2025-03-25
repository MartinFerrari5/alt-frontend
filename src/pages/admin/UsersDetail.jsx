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
    deleteProjectUserRelation,
    getOptions,
    getRelatedOptions,
    getNotRelatedCompanies,
    getNotRelatedProjects,
} from "../../hooks/data/options/options"
import EditProjectRelationModal from "../../components/admin/users/EditProjectRelationModal"
import { toast } from "react-toastify"

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

    // Nuevo estado para la compañía seleccionada (por su relationship_id)
    const [selectedCompanyRelId, setSelectedCompanyRelId] = useState("")

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
                    toast.error("Error al obtener compañías relacionadas")
                }
            }
            fetchRelatedCompanies()
        }
    }, [id])

    // Al actualizar las compañías relacionadas, se establece el primer relationship_id si no hay ninguno seleccionado
    useEffect(() => {
        if (relatedCompanies.length > 0 && !selectedCompanyRelId) {
            setSelectedCompanyRelId(relatedCompanies[0].relationship_id)
        }
    }, [relatedCompanies, selectedCompanyRelId])

    // 2. Obtener los proyectos relacionados para la compañía seleccionada
    useEffect(() => {
        if (id && selectedCompanyRelId) {
            const fetchRelatedProjects = async () => {
                try {
                    const projectsData = await getRelatedOptions({
                        user_id: id,
                        related_table: "project_company_table",
                        individual_table: "projects_table",
                        relationship_id: selectedCompanyRelId,
                    })
                    setRelatedProjects(projectsData)
                } catch (error) {
                    console.error(
                        "Error al obtener proyectos relacionados:",
                        error
                    )
                    toast.error("Error al obtener proyectos relacionados")
                }
            }
            fetchRelatedProjects()
        }
    }, [id, selectedCompanyRelId])

    // Consultar opciones no relacionadas para compañías y proyectos
    useEffect(() => {
        if (id) {
            const fetchNotRelated = async () => {
                try {
                    const companiesNotRelated = await getNotRelatedCompanies(id)
                    let projectsNotRelated = []
                    if (relatedCompanies && relatedCompanies.length > 0) {
                        // Usar el relationship_id seleccionado para los proyectos
                        projectsNotRelated = await getNotRelatedProjects(
                            id,
                            selectedCompanyRelId
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
                    toast.error("Error al obtener opciones no relacionadas")
                }
            }
            fetchNotRelated()
        }
    }, [id, relatedCompanies, selectedCompanyRelId])

    // Mapear relaciones para mostrar en la UI
    // Para compañías se mantiene el mapping (se envía el objeto completo a delete)
    const mappedRelatedCompanies =
        relatedCompanies.map((r) => ({
            id: r.company_id,
            relationship_id: r.relationship_id,
            option: r.option,
        })) || []

    // Para proyectos, se usa el project_id como identificador único y se guarda también el relationship_id
    const mappedRelatedProjects =
        relatedProjects.map((r) => ({
            id: r.project_id, // identificador único para el listado
            relationshipId: r.relationship_id, // se usa para la eliminación
            option: r.option,
        })) || []

    // Opciones disponibles para compañías (se utiliza en la sección de compañías)
    const availableCompanies = notRelatedOptions.companies.map((item) => ({
        id: item.company_id,
        option: item.options,
    }))

    // Funciones para agregar y eliminar relaciones de compañías y proyectos
    const handleAddCompanyRelation = async (companyId) => {
        try {
            const relationData = { user_id: id, company_id: companyId }
            await addCompanyUserRelation(relationData)
            toast.success("Relación con la compañía creada exitosamente")
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
            toast.error("Error al agregar relación de compañía")
        }
    }

    const handleDeleteCompanyRelation = async (relation) => {
        try {
            // Se utiliza el relationship_id de la relación de compañía
            await deleteCompanyUserRelation(relation.relationship_id)
            toast.success("Relación con la compañía eliminada exitosamente")
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
            // Si la compañía eliminada era la seleccionada, se reinicia el selector
            if (relation.relationship_id === selectedCompanyRelId) {
                setSelectedCompanyRelId(
                    updatedCompanies.length > 0
                        ? updatedCompanies[0].relationship_id
                        : ""
                )
            }
        } catch (error) {
            console.error("Error al eliminar relación de compañía:", error)
            toast.error("Error al eliminar relación de compañía")
        }
    }

    // Se actualiza la función para eliminar un solo proyecto recibiendo el objeto completo de la relación
    const handleDeleteProjectRelation = async (relation) => {
        console.log("Relación a eliminar:", relation)
        try {
            // Se envían ambos identificadores para eliminar solo el proyecto específico
            await deleteProjectUserRelation(relation)
            toast.success("Relación con el proyecto eliminada exitosamente")
            if (selectedCompanyRelId) {
                const updatedProjects = await getRelatedOptions({
                    user_id: id,
                    related_table: "project_company_table",
                    individual_table: "projects_table",
                    relationship_id: selectedCompanyRelId,
                })
                setRelatedProjects(updatedProjects)
                const updatedNotRelatedProjects = await getNotRelatedProjects(
                    id,
                    selectedCompanyRelId
                )
                setNotRelatedOptions((prev) => ({
                    ...prev,
                    projects: updatedNotRelatedProjects,
                }))
            }
        } catch (error) {
            console.error("Error al eliminar relación de proyecto:", error)
            toast.error("Error al eliminar relación de proyecto")
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
            toast.success("Relación con el proyecto creada exitosamente")
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
            toast.error("Error al agregar relación de proyecto")
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
                {/* Selector de Compañía para filtrar proyectos */}
                {mappedRelatedCompanies.length > 0 && (
                    <div className="mb-4">
                        <label
                            htmlFor="companySelector"
                            className="mb-1 block font-bold"
                        >
                            Seleccionar Compañía:
                        </label>
                        <select
                            id="companySelector"
                            value={selectedCompanyRelId}
                            onChange={(e) =>
                                setSelectedCompanyRelId(e.target.value)
                            }
                            className="w-full rounded border p-2"
                        >
                            {mappedRelatedCompanies.map((company) => (
                                <option
                                    key={company.relationship_id}
                                    value={company.relationship_id}
                                >
                                    {company.option}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {/* Sección para Proyectos */}
                <RelationSection
                    title="Proyectos"
                    // Se envía el objeto completo para que el botón de eliminar
                    // invoque la función con todos los datos necesarios
                    relatedItems={mappedRelatedProjects}
                    displayProp="option"
                    onDeleteRelation={handleDeleteProjectRelation}
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
