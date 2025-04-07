import { useState, useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"
import { toast } from "react-toastify"
import MainLayout from "../../components/layout/MainLayout"
import {
    getCompanyProjects,
    getNotRelatedProjects,
    addCompanyProjectRelation,
    deleteCompanyProjectRelation,
} from "../../hooks/data/options/relationsService"

/**
 * Componente que muestra los detalles de una compañía y permite agregar y eliminar
 * proyectos relacionados.
 *
 * @returns {ReactElement}
 */
const CompanyDetail = () => {
    const { id } = useParams()
    const { search } = useLocation()

    // Extraer el nombre de la compañía desde la query string
    const queryParams = new URLSearchParams(search)
    const companyNameFromQuery = queryParams.get("name") || `Compañía ${id}`

    const [company, setCompany] = useState(null)
    const [projects, setProjects] = useState([])
    const [availableProjects, setAvailableProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                setIsLoading(true)

                // Obtener proyectos relacionados
                const relatedProjects = await getCompanyProjects(id)
                setProjects(relatedProjects)

                // Obtener proyectos disponibles
                const notRelatedProjects = await getNotRelatedProjects(id)
                setAvailableProjects(notRelatedProjects)

                // Asignar detalles de la compañía usando el nombre obtenido de la URL
                setCompany({ id, name: companyNameFromQuery })
            } catch (error) {
                toast.error(
                    `Error al cargar los detalles de la compañía: ${error.message}`
                )
                console.error("Error fetching company details:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCompanyDetails()
    }, [id, companyNameFromQuery])

    /**
     * Agrega un proyecto a la lista de proyectos relacionados.
     * @param {number} projectId El ID del proyecto a agregar.
     */
    const handleAddProject = async (projectId) => {
        try {
            await addCompanyProjectRelation({
                company_id: id,
                project_id: projectId,
            })
            toast.success("Proyecto agregado exitosamente")

            // Actualizar proyectos relacionados y disponibles
            const updatedProjects = await getCompanyProjects(id)
            setProjects(updatedProjects)

            const updatedAvailableProjects = await getNotRelatedProjects(id)
            setAvailableProjects(updatedAvailableProjects)
        } catch (error) {
            toast.error("Error al agregar el proyecto")
            console.error("Error adding project:", error)
        }
    }

    /**
     * Elimina un proyecto de la lista de proyectos relacionados.
     * @param {number} relationshipId El ID de la relación.
     */
    const handleRemoveProject = async (relationshipId) => {
        try {
            await deleteCompanyProjectRelation(relationshipId)
            toast.success("Proyecto eliminado exitosamente")

            // Actualizar proyectos relacionados y disponibles
            const updatedProjects = await getCompanyProjects(id)
            setProjects(updatedProjects)

            const updatedAvailableProjects = await getNotRelatedProjects(id)
            setAvailableProjects(updatedAvailableProjects)
        } catch (error) {
            toast.error("Error al eliminar el proyecto")
            console.error("Error removing project:", error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-muted">Cargando detalles de la compañía...</p>
            </div>
        )
    }

    if (!company) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-muted">No se encontró la compañía.</p>
            </div>
        )
    }

    return (
        <MainLayout>
            <div className="p-6 bg-card rounded-md shadow">
                <div className="mb-4">
                    <Link
                        to="/admin/companies"
                        className="text-greenApp hover:underline"
                    >
                        &larr; Volver a la lista de compañías
                    </Link>
                </div>
                <h1 className="mb-4 text-2xl font-bold text-foreground">
                    Compañia: {company.name}
                </h1>
                <p className="mb-4 text-sm text-muted">ID: {company.id}</p>

                <div className="mt-6">
                    <h2 className="mb-2 text-lg font-bold text-foreground">
                        Proyectos Relacionados
                    </h2>
                    {projects.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                            {projects.map((project) => (
                                <li
                                    key={project.relationship_id}
                                    className="flex items-center justify-between bg-popover rounded p-2"
                                >
                                    <span className="text-foreground">
                                        {project.option}
                                    </span>
                                    <button
                                        onClick={() =>
                                            handleRemoveProject(
                                                project.relationship_id
                                            )
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
                    {availableProjects.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                            {availableProjects.map((project) => (
                                <li
                                    key={project.project_id}
                                    className="flex items-center justify-between bg-popover rounded p-2"
                                >
                                    <span className="text-foreground">
                                        {project.options}
                                    </span>
                                    <button
                                        onClick={() =>
                                            handleAddProject(project.project_id)
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
