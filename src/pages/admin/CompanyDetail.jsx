// /src/pages/CompanyDetail.jsx
import { useEffect, useState } from "react"
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

    // Estados para los filtros de búsqueda individuales
    const [filterRelated, setFilterRelated] = useState("")
    const [filterAvailable, setFilterAvailable] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                await updateCompanyProjects(id)
                await updateAvailableCompanyProjects(id)
            } catch (err) {
                toast.error(`Error al cargar los proyectos: ${err.message}`)
                console.error("Error fetching company projects:", err)
            }
        }
        fetchData()
    }, [id, updateCompanyProjects, updateAvailableCompanyProjects])

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

    // Filtrado por cada input de forma independiente
    const filteredCompanyProjects = companyProjects.filter((project) =>
        project.option.toLowerCase().includes(filterRelated.toLowerCase())
    )

    const filteredAvailableProjects = availableCompanyProjects.filter(
        (project) =>
            project.option.toLowerCase().includes(filterAvailable.toLowerCase())
    )

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

                {/* Contenedor responsivo para las dos tablas */}
                <div className="flex flex-col gap-6 md:flex-row">
                    {/* Tabla de Proyectos Relacionados */}
                    <div className="w-full md:w-1/2">
                        <h2 className="mb-2 text-lg font-bold text-foreground">
                            Proyectos Relacionados
                        </h2>
                        {/* Filtro exclusivo para Proyectos Relacionados */}
                        <input
                            type="text"
                            placeholder="Buscar proyecto..."
                            value={filterRelated}
                            onChange={(e) => setFilterRelated(e.target.value)}
                            className="input-edit mb-4"
                        />
                        {filteredCompanyProjects.length > 0 ? (
                            <div className="overflow-x-auto rounded-xl bg-white p-1 shadow">
                                {/* Contenedor con altura máxima y scroll vertical */}
                                <div className="max-h-64 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="sticky top-0 z-10 bg-popover">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
                                                    Proyecto
                                                </th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredCompanyProjects.map(
                                                (project) => (
                                                    <tr
                                                        key={
                                                            project.relationship_id
                                                        }
                                                        className="bg-white transition-colors hover:bg-gray-50"
                                                    >
                                                        <td className="px-4 py-2 text-sm text-foreground">
                                                            {project.option}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleRemoveProject(
                                                                        project.relationship_id
                                                                    )
                                                                }
                                                                className="btn bg-destructive text-sm text-white hover:bg-red-500"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted">
                                No hay proyectos relacionados.
                            </p>
                        )}
                    </div>

                    {/* Tabla de Proyectos Disponibles */}
                    <div className="w-full md:w-1/2">
                        <h2 className="mb-2 text-lg font-bold text-foreground">
                            Agregar Proyectos
                        </h2>
                        {/* Filtro exclusivo para Proyectos Disponibles */}
                        <input
                            type="text"
                            placeholder="Buscar proyecto..."
                            value={filterAvailable}
                            onChange={(e) => setFilterAvailable(e.target.value)}
                            className="input-edit mb-4"
                        />
                        {filteredAvailableProjects.length > 0 ? (
                            <div className="space-y-4 rounded-xl bg-white p-1 shadow">
                                {/* Contenedor con altura definida y scroll vertical */}
                                <div className="max-h-64 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="sticky top-0 z-10 bg-popover">
                                            <tr>
                                                <th className="px-4 py-5 text-left text-sm font-semibold text-foreground">
                                                    Proyecto
                                                </th>
                                                <th className="px-4 py-5 text-left text-sm font-semibold text-foreground">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredAvailableProjects.map(
                                                (project) => (
                                                    <tr
                                                        key={project.id}
                                                        className="cursor-pointer bg-white transition-colors hover:bg-gray-50"
                                                    >
                                                        <td className="px-4 py-5 text-sm text-foreground">
                                                            {project.option}
                                                        </td>
                                                        <td className="px-4 py-5">
                                                            <button
                                                                onClick={() =>
                                                                    handleAddProject(
                                                                        project.id
                                                                    )
                                                                }
                                                                className="btn btn-primary text-sm"
                                                            >
                                                                Agregar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted">
                                No hay proyectos disponibles para agregar.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default CompanyDetail
