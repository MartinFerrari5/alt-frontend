// src/pages/admin/UsersDetail.jsx
import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import Button from "../../components/Button"
import UserEditForm from "../../components/admin/users/UserEditForm"
import RelationSection from "../../components/admin/users/RelationSection"
import { useGetUsers, useUpdateUser } from "../../hooks/data/users/useUserHooks"
import { useOptionsStore } from "../../store/optionsStore"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { schema } from "../../util/validationSchema"

const UsersDetail = () => {
    // Obtención de datos y funciones del store
    const {
        companies_table,
        projects_table,
        fetchOptions,
        relatedOptions,
        updateRelations,
        addCompanyUserRelation,
        removeCompanyUserRelation, // Función para eliminar (ya debe estar implementada en el store)
    } = useOptionsStore()

    // Cargar opciones de compañías y proyectos disponibles
    useEffect(() => {
        fetchOptions("companies_table")
        fetchOptions("projects_table")
    }, [fetchOptions])

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
            company:
                companies_table && companies_table.length > 0
                    ? companies_table[0].company
                    : "",
            project:
                projects_table && projects_table.length > 0
                    ? projects_table[0].project
                    : "",
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companies_table, projects_table])

    const { id } = useParams()
    const navigate = useNavigate()
    const { data: user, isLoading, error } = useGetUsers(id)
    const updateUserMutation = useUpdateUser(id)

    // Si el dato del usuario llega como arreglo, se toma el primer elemento
    const userData = Array.isArray(user) ? user[0] : user

    // Actualizar relaciones del usuario
    useEffect(() => {
        if (id) {
            updateRelations(id)
        }
    }, [id, updateRelations])

    // Convertir la respuesta de relatedOptions (array de objetos con comp_option y proj_option)
    const relatedCompanies = relatedOptions
        ? relatedOptions.map((r) => ({ id: r.id, company: r.comp_option }))
        : []
    const relatedProjects = relatedOptions
        ? relatedOptions.map((r) => ({ id: r.id, project: r.proj_option }))
        : []

    // Función para agregar relación de compañía
    const handleAddCompanyRelation = async (companyId) => {
        const relationData = {
            user_id: [id],
            company_id: [companyId],
            project_id: [null],
        }
        await addCompanyUserRelation(relationData, id)
    }

    // Función para eliminar relación de compañía
    const handleDeleteCompanyRelation = async (relationId) => {
        await removeCompanyUserRelation(relationId, id)
    }

    // Función para agregar relación de proyecto
    const handleAddProjectRelation = async (projectId) => {
        const relationData = {
            user_id: [id],
            company_id: [null],
            project_id: [projectId],
        }
        await addCompanyUserRelation(relationData, id)
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
                    availableItems={companies_table || []}
                    displayProp="option"
                    onAddRelation={handleAddCompanyRelation}
                    onDeleteRelation={handleDeleteCompanyRelation}
                />
                {/* Sección para Proyectos */}
                <RelationSection
                    title="Proyectos"
                    relatedItems={relatedProjects}
                    availableItems={projects_table || []}
                    displayProp="option"
                    onAddRelation={handleAddProjectRelation}
                />
            </div>
        </div>
    )
}

export default UsersDetail
