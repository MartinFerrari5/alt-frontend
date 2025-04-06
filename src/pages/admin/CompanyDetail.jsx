import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
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
    const [company, setCompany] = useState(null)
    const [projects, setProjects] = useState([])
    const [availableProjects, setAvailableProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                setIsLoading(true)

                // Fetch related projects
                const relatedProjects = await getCompanyProjects(id)
                setProjects(relatedProjects)

                // Fetch available projects
                const notRelatedProjects = await getNotRelatedProjects(id)
                setAvailableProjects(notRelatedProjects)

                // Mock company details (replace with actual API call if needed)
                setCompany({ id, name: `Compañía ${id}` })
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
    }, [id])

    /**
     * Agrega un proyecto a la lista de proyectos relacionados de la compañía.
     * @param {number} projectId El ID del proyecto a agregar.
     */
    const handleAddProject = async (projectId) => {
        try {
            await addCompanyProjectRelation({
                company_id: id,
                project_id: projectId,
            })
            toast.success("Proyecto agregado exitosamente")

            // Refresh related and available projects
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
     * Elimina un proyecto de la lista de proyectos relacionados de la compañía.
     * @param {number} relationshipId El ID de la relación entre la compañía y el proyecto.
     */
    const handleRemoveProject = async (relationshipId) => {
        try {
            await deleteCompanyProjectRelation(relationshipId)
            toast.success("Proyecto eliminado exitosamente")

            // Refresh related and available projects
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
                <p>Cargando detalles de la compañía...</p>
            </div>
        )
    }

    if (!company) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p>No se encontró la compañía.</p>
            </div>
        )
    }

    return (
        <MainLayout>
            <div className="p-6">
                <div className="mb-4">
                    <Link
                        to="/admin/companies"
                        className="text-blue-500 hover:underline"
                    >
                        &larr; Volver a la lista de compañías
                    </Link>
                </div>
                <h1 className="mb-4 text-2xl font-bold">{company.name}</h1>
                <p className="mb-4 text-gray-600">ID: {company.id}</p>

                <div className="mt-6">
                    <h2 className="mb-2 text-lg font-bold">
                        Proyectos Relacionados
                    </h2>
                    {projects.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {projects.map((project) => (
                                <li
                                    key={project.relationship_id}
                                    className="flex justify-between"
                                >
                                    <span>{project.option}</span>
                                    <button
                                        onClick={() =>
                                            handleRemoveProject(
                                                project.relationship_id
                                            )
                                        }
                                        className="text-red-500 hover:underline"
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay proyectos relacionados.</p>
                    )}
                </div>

                <div className="mt-6">
                    <h2 className="mb-2 text-lg font-bold">
                        Agregar Proyectos
                    </h2>
                    {availableProjects.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {availableProjects.map((project) => (
                                <li
                                    key={project.project_id}
                                    className="flex justify-between"
                                >
                                    <span>{project.options}</span>
                                    <button
                                        onClick={() =>
                                            handleAddProject(project.project_id)
                                        }
                                        className="text-blue-500 hover:underline"
                                    >
                                        Agregar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay proyectos disponibles para agregar.</p>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}

export default CompanyDetail
