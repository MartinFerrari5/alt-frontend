// src/pages/admin/UsersDetail.jsx
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
    deleteCompanyUserRelation,
    getOptions,
    getRelatedOptions,
    getNotRelatedOptions,
} from "../../hooks/data/options/options"

const UsersDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    // Estados para opciones y relaciones
    const [companiesTable, setCompaniesTable] = useState([])
    const [projectsTable, setProjectsTable] = useState([])
    const [relatedOptions, setRelatedOptions] = useState([])
    // Estado para opciones no relacionadas
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

    // Configuración del formulario (solo para reiniciar valores)
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

    // Consultar relaciones existentes para el usuario
    useEffect(() => {
        if (id) {
            const fetchRelated = async () => {
                try {
                    const relatedData = await getRelatedOptions(id)
                    setRelatedOptions(relatedData)
                } catch (error) {
                    console.error("Error al obtener relaciones:", error)
                }
            }
            fetchRelated()
        }
    }, [id])

    // Consultar opciones no relacionadas para el usuario
    useEffect(() => {
        if (id) {
            const fetchNotRelated = async () => {
                try {
                    const notRelatedData = await getNotRelatedOptions(id)
                    setNotRelatedOptions(notRelatedData)
                } catch (error) {
                    console.error(
                        "Error al obtener opciones no relacionadas:",
                        error
                    )
                }
            }
            fetchNotRelated()
        }
    }, [id])

    // Mapear relaciones existentes: se asigna la propiedad "option"
    const relatedCompanies =
        relatedOptions.map((r) => ({ id: r.id, option: r.comp_option })) || []
    const relatedProjects =
        relatedOptions.map((r) => ({ id: r.id, option: r.proj_option })) || []

    // Mapear opciones disponibles: se agrega la propiedad "option" a cada objeto
    const availableCompanies = notRelatedOptions.companies
        ? notRelatedOptions.companies.map((item) => ({
              ...item,
              option: item.company,
          }))
        : companiesTable.map((item) => ({ ...item, option: item.company }))

    const availableProjects = notRelatedOptions.projects
        ? notRelatedOptions.projects.map((item) => ({
              ...item,
              option: item.project,
          }))
        : projectsTable.map((item) => ({ ...item, option: item.project }))

    // Funciones para agregar y eliminar relaciones
    const handleAddCompanyRelation = async (companyId) => {
        try {
            const relationData = {
                user_id: [id],
                company_id: [companyId],
                project_id: [null],
            }
            await addCompanyUserRelation(relationData)
            const updatedRelated = await getRelatedOptions(id)
            setRelatedOptions(updatedRelated)
            const updatedNotRelated = await getNotRelatedOptions(id)
            setNotRelatedOptions(updatedNotRelated)
        } catch (error) {
            console.error("Error al agregar relación de compañía:", error)
        }
    }

    const handleDeleteCompanyRelation = async (relationId) => {
        try {
            await deleteCompanyUserRelation([relationId])
            const updatedRelated = await getRelatedOptions(id)
            setRelatedOptions(updatedRelated)
            const updatedNotRelated = await getNotRelatedOptions(id)
            setNotRelatedOptions(updatedNotRelated)
        } catch (error) {
            console.error("Error al eliminar relación de compañía:", error)
        }
    }

    const handleAddProjectRelation = async (projectId) => {
        try {
            const relationData = {
                user_id: [id],
                company_id: [null],
                project_id: [projectId],
            }
            await addCompanyUserRelation(relationData)
            const updatedRelated = await getRelatedOptions(id)
            setRelatedOptions(updatedRelated)
            const updatedNotRelated = await getNotRelatedOptions(id)
            setNotRelatedOptions(updatedNotRelated)
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
                    relatedItems={relatedCompanies}
                    availableItems={availableCompanies}
                    displayProp="option"
                    onAddRelation={handleAddCompanyRelation}
                    onDeleteRelation={handleDeleteCompanyRelation}
                />
                {/* Sección para Proyectos */}
                <RelationSection
                    title="Proyectos"
                    relatedItems={relatedProjects}
                    availableItems={availableProjects}
                    displayProp="option"
                    onAddRelation={handleAddProjectRelation}
                />
            </div>
        </div>
    )
}

export default UsersDetail
