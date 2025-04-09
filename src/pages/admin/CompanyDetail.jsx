// /src/pages/CompanyDetail.jsx
import { useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"
import { toast } from "react-toastify"
import MainLayout from "../../components/layout/MainLayout"
import { useRelationsStore } from "../../store/modules/relationsStore"

const CompanyDetail = () => {
    const { id } = useParams()
    const { search } = useLocation()
    const queryParams = new URLSearchParams(search)
    const companyNameFromQuery = queryParams.get("name") || `Compañía ${id}`

    // Extraer estado y métodos del store
    const {
        companyProjects,
        availableCompanyProjects,
        isLoading,
        error,
        updateCompanyProjects,
        updateAvailableCompanyProjects,
        addCompanyProjectRelation,
        deleteCompanyProjectRelation,
    } = useRelationsStore()

    // Efecto para cargar los datos de la compañía y sus proyectos
    useEffect(() => {
        const fetchData = async () => {
            try {
                await updateCompanyProjects(id)
                await updateAvailableCompanyProjects(id)
                console.log("Proyectos relacionados:", companyProjects)
            } catch (err) {
                toast.error(`Error al cargar los proyectos: ${err.message}`)
                console.error("Error fetching company projects:", err)
            }
        }
        fetchData()
    }, [id, updateCompanyProjects, updateAvailableCompanyProjects ])

    /**
     * Agrega un proyecto a la compañía y actualiza ambos listados.
     */
    const handleAddProject = async (projectId) => {
        try {
            await addCompanyProjectRelation(
                { company_id: id, project_id: projectId },
                id
            )
            toast.success("Proyecto agregado exitosamente")
        } catch (err) {
            toast.error(`Error al agregar el proyecto: ${err.message}`)
            console.error("Error adding project:", err)
        }
    }

    /**
     * Elimina un proyecto de la compañía y actualiza ambos listados.
     */
    const handleRemoveProject = async (projectId) => {
        try {
            await deleteCompanyProjectRelation(projectId, id)
            toast.success("Proyecto eliminado exitosamente")
        } catch (err) {
            toast.error(`Error al eliminar el proyecto: ${err.message}`)
            console.error("Error removing project:", err)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-muted">
                    Cargando detalles de la compañía...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-muted">Ocurrió un error: {error}</p>
            </div>
        )
    }

    return (
        <MainLayout>
            <div className="rounded-md bg-card p-6 shadow">
                <div className="mb-4">
                    <Link
                        to="/admin/companies"
                        className="text-greenApp hover:underline"
                    >
                        &larr; Volver a la lista de compañías
                    </Link>
                </div>
                <h1 className="mb-4 text-2xl font-bold text-foreground">
                    Compañía: {companyNameFromQuery}
                </h1>
                <p className="mb-4 text-sm text-muted">ID: {id}</p>

                <div className="mt-6">
                    <h2 className="mb-2 text-lg font-bold text-foreground">
                        Proyectos Relacionados
                    </h2>
                    {companyProjects.length > 0 ? (
                        <ul className="list-disc space-y-2 pl-5">
                            {companyProjects.map((project) => (
                                <li
                                    key={project.relationship_id} // Usar `relationship_id` como clave única
                                    className="flex items-center justify-between rounded bg-popover p-2"
                                >
                                    <span className="text-foreground">
                                        {project.option} {/* Mostrar `option` */}
                                    </span>
                                    <button
                                        onClick={() =>
                                            handleRemoveProject(project.relationship_id) // Usar `relationship_id`
                                        }
                                        className="btn bg-destructive text-white hover:bg-red-500"
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">
                            No hay proyectos relacionados.
                        </p>
                    )}
                </div>

                <div className="mt-6">
                    <h2 className="mb-2 text-lg font-bold text-foreground">
                        Agregar Proyectos
                    </h2>
                    {availableCompanyProjects.length > 0 ? (
                        <ul className="list-disc space-y-2 pl-5">
                            {availableCompanyProjects.map((project) => (
                                <li
                                    key={project.id} // Usar `id` como clave única
                                    className="flex items-center justify-between rounded bg-popover p-2"
                                >
                                    <span className="text-foreground">
                                        {project.option} {/* Mostrar `option` */}
                                    </span>
                                    <button
                                        onClick={() =>
                                            handleAddProject(project.id)
                                        }
                                        className="btn btn-primary"
                                    >
                                        Agregar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">
                            No hay proyectos disponibles para agregar.
                        </p>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}

export default CompanyDetail
