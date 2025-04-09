import { useState, useEffect } from "react"
import Button from "../../Button"
import Dropdown from "../../Dropdown/Dropdown"
import { useRelationsStore } from "../../../store/modules/relationsStore"
import { DialogClose } from "../../ui/dialog"

export const EditProjectRelationModal = ({
    title,
    onAddRelation,
    onClose,
    userId,
}) => {
    const [selectedRelationshipId, setSelectedRelationshipId] = useState("")
    const [selectedProject, setSelectedProject] = useState("")

    // Extraemos datos del store:
    // relatedCompanies: para el selector de compañía.
    // relatedProjects y notRelatedProjects: para mostrar proyectos ya relacionados y los disponibles respectivamente.
    const {
        relatedCompanies,
        notRelatedProjects,
        relatedProjects,
        updateRelations,
        updateNotRelatedProjectsForUser,
    } = useRelationsStore()

    // Si aún no se ha seleccionado una compañía, se inicializa con la primera de la lista.
    useEffect(() => {
        if (relatedCompanies.length > 0 && !selectedRelationshipId) {
            setSelectedRelationshipId(relatedCompanies[0].company_id)
        }
    }, [relatedCompanies, selectedRelationshipId])

    // Al cambiar la compañía seleccionada, se refrescan las relaciones (proyectos relacionados y no relacionados)
    useEffect(() => {
        if (selectedRelationshipId) {
            // Actualiza los proyectos relacionados y no relacionados
            updateRelations(userId, selectedRelationshipId).catch((error) => {
                console.error(
                    "Error al cargar proyectos de la compañía:",
                    error.response?.data
                )
            })

            // Actualiza los proyectos no relacionados con el usuario pero relacionados con la compañía
            updateNotRelatedProjectsForUser(
                userId,
                selectedRelationshipId
            ).catch((error) => {
                console.error(
                    "Error al cargar proyectos no relacionados con el usuario:",
                    error.response?.data
                )
            })
        }
    }, [
        selectedRelationshipId,
        updateRelations,
        updateNotRelatedProjectsForUser,
        userId,
    ])

    const handleAddRelation = () => {
        if (selectedRelationshipId && selectedProject) {
            onAddRelation({
                user_id: userId,
                company_id: selectedRelationshipId,
                relationship_id: selectedProject, // Aquí se envía el project_id del proyecto a asociar
            })
            setSelectedRelationshipId("")
            setSelectedProject("")
        }
    }

    const handleSave = () => {
        if (selectedRelationshipId && selectedProject) {
            handleAddRelation()
        }
        onClose?.()
    }

    return (
        <div>
            <div className="flex gap-4">
                {/* Lista de proyectos ya relacionados para el usuario en la compañía seleccionada */}
                <div className="w-1/2">
                    <h4 className="mb-2 text-lg font-semibold">
                        Proyectos Asociados
                    </h4>
                    <ul className="max-h-64 overflow-y-auto">
                        {relatedProjects && relatedProjects.length > 0 ? (
                            relatedProjects.map((item) => (
                                <li
                                    key={item.project_id}
                                    className="flex items-center justify-between border-b py-2"
                                >
                                    <span>{item.option || item.options}</span>
                                </li>
                            ))
                        ) : (
                            <li>No hay {title.toLowerCase()} asociados.</li>
                        )}
                    </ul>
                </div>
                {/* Sección para agregar nuevos proyectos */}
                <div className="w-1/2">
                    <h4 className="mb-2 text-lg font-semibold">
                        Agregar {title}
                    </h4>
                    {/* Dropdown para seleccionar la compañía relacionada */}
                    <Dropdown
                        id="companyDropdown"
                        label="Seleccionar Compañía"
                        register={() => ({
                            onChange: (e) => {
                                setSelectedRelationshipId(e.target.value)
                                setSelectedProject("")
                            },
                            value: selectedRelationshipId,
                        })}
                        error={null}
                        isLoading={false}
                        isError={false}
                        items={
                            Array.isArray(relatedCompanies)
                                ? relatedCompanies.map((item) => ({
                                      id: item.company_id,
                                      option: item.option,
                                  }))
                                : []
                        }
                    />

                    {/* Dropdown para seleccionar el proyecto disponible (no relacionado al usuario) */}
                    <Dropdown
                        id="projectDropdown"
                        label="Seleccionar Proyecto"
                        register={() => ({
                            onChange: (e) => setSelectedProject(e.target.value),
                            value: selectedProject,
                        })}
                        error={null}
                        isLoading={false}
                        isError={false}
                        items={
                            Array.isArray(notRelatedProjects)
                                ? notRelatedProjects.map((item) => ({
                                      id: item.id,
                                      option: item.option,
                                  }))
                                : []
                        }
                    />
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
                <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                    onClick={handleSave}
                    disabled={!selectedRelationshipId || !selectedProject}
                >
                    Agregar
                </Button>
            </div>
        </div>
    )
}
