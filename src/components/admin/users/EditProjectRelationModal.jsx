// src/components/admin/users/EditProjectRelationModal.jsx
import { useState, useEffect } from "react"
import Button from "../../Button"
import Dropdown from "../../Dropdown/Dropdown"
import {
    getRelatedOptions,
    getNotRelatedProjects,
} from "../../../hooks/data/options/options"

const EditProjectRelationModal = ({
    title,
    relatedCompanies, // Compañías relacionadas para extraer el relationship_id
    onAddRelation,
    onClose,
    userId,
}) => {
    const [selectedRelationshipId, setSelectedRelationshipId] = useState("")
    const [selectedProject, setSelectedProject] = useState("")

    // Estados para proyectos asociados y disponibles según la compañía seleccionada
    const [associatedProjects, setAssociatedProjects] = useState([])
    const [availableProjects, setAvailableProjects] = useState([])

    const [isProjectsLoading, setIsProjectsLoading] = useState(false)
    const [projectsError, setProjectsError] = useState(null)

    // Al cambiar la compañía seleccionada se obtienen los proyectos asociados y no asociados
    useEffect(() => {
        const fetchProjects = async () => {
            if (selectedRelationshipId) {
                setIsProjectsLoading(true)
                setProjectsError(null)
                try {
                    const relatedData = await getRelatedOptions({
                        user_id: userId,
                        related_table: "project_company_table",
                        individual_table: "projects_table",
                        relationship_id: selectedRelationshipId,
                    })
                    const notRelatedData = await getNotRelatedProjects(
                        userId,
                        selectedRelationshipId
                    )
                    setAssociatedProjects(relatedData)
                    setAvailableProjects(notRelatedData)
                } catch (error) {
                    console.error(
                        "Error al obtener proyectos para la compañía seleccionada:",
                        error
                    )
                    setProjectsError(error.message)
                    setAssociatedProjects([])
                    setAvailableProjects([])
                } finally {
                    setIsProjectsLoading(false)
                }
            } else {
                setAssociatedProjects([])
                setAvailableProjects([])
            }
        }
        fetchProjects()
    }, [selectedRelationshipId, userId])

    const handleAddRelation = () => {
        if (selectedRelationshipId && selectedProject) {
            onAddRelation(selectedProject, selectedRelationshipId)
            setSelectedRelationshipId("")
            setSelectedProject("")
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-11/12 rounded bg-white p-6 shadow-lg md:w-2/3 lg:w-1/2">
                <h3 className="mb-4 text-xl font-bold">Editar {title}</h3>
                <div className="flex gap-4">
                    {/* Panel para mostrar proyectos ya asociados a la compañía seleccionada */}
                    <div className="w-1/2">
                        <h4 className="mb-2 text-lg font-semibold">
                            Asociados
                        </h4>
                        <ul className="max-h-64 overflow-y-auto">
                            {associatedProjects &&
                            associatedProjects.length > 0 ? (
                                associatedProjects.map((item) => (
                                    <li
                                        key={item.project_id}
                                        className="flex items-center justify-between border-b py-2"
                                    >
                                        <span>{item.option}</span>
                                    </li>
                                ))
                            ) : (
                                <li>No hay {title.toLowerCase()} asociados.</li>
                            )}
                        </ul>
                    </div>
                    {/* Panel para agregar nuevos proyectos */}
                    <div className="w-1/2">
                        <h4 className="mb-2 text-lg font-semibold">
                            Agregar {title}
                        </h4>
                        {/* Dropdown para seleccionar la compañía y obtener el relationship_id */}
                        <Dropdown
                            id="companyDropdown"
                            label="Seleccionar Compañía"
                            register={() => ({
                                onChange: (e) => {
                                    setSelectedRelationshipId(e.target.value)
                                    setSelectedProject("") // Reiniciamos el proyecto al cambiar la compañía
                                },
                                value: selectedRelationshipId,
                            })}
                            error={null}
                            isLoading={false}
                            isError={false}
                            items={relatedCompanies.map((item) => ({
                                id: item.relationship_id,
                                option: item.option,
                            }))}
                            loadingText="Cargando..."
                            errorText="Error al cargar"
                            useIdAsValue={true}
                        />
                        {/* Dropdown para seleccionar un proyecto no asociado */}
                        <Dropdown
                            id="projectDropdown"
                            label="Seleccionar Proyecto"
                            register={() => ({
                                onChange: (e) =>
                                    setSelectedProject(e.target.value),
                                value: selectedProject,
                            })}
                            error={
                                projectsError
                                    ? { message: projectsError }
                                    : null
                            }
                            isLoading={isProjectsLoading}
                            isError={!!projectsError}
                            items={availableProjects.map((item) => ({
                                id: item.project_id,
                                option: item.options,
                            }))}
                            loadingText="Cargando proyectos..."
                            errorText="Error al cargar proyectos"
                            useIdAsValue={true}
                        />
                        <Button
                            onClick={handleAddRelation}
                            disabled={
                                !selectedRelationshipId || !selectedProject
                            }
                        >
                            Agregar
                        </Button>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={onClose}>Cerrar</Button>
                </div>
            </div>
        </div>
    )
}

export default EditProjectRelationModal
