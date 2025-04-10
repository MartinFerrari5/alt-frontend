import { useState, useEffect, useCallback } from "react"
import Button from "../../Button"
import Dropdown from "../../Dropdown/Dropdown"
import { useRelationsStore } from "../../../store/modules/relationsStore"
import { DialogClose } from "../../ui/dialog"
import { LoadingSpinner } from "../../../util/LoadingSpinner"

export const EditProjectRelationModal = ({
    title,
    onAddRelation,
    onClose,
    userId,
}) => {
    const [selectedRelationshipId, setSelectedRelationshipId] = useState("")
    const [selectedProject, setSelectedProject] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Extraemos datos del store
    const {
        relatedCompanies,
        notRelatedProjects,
        relatedProjects,
        updateRelations,
        updateNotRelatedProjectsForUser,
    } = useRelationsStore()

    // Inicializar la compañía seleccionada si no hay ninguna seleccionada
    useEffect(() => {
        if (relatedCompanies.length > 0 && !selectedRelationshipId) {
            setSelectedRelationshipId(relatedCompanies[0].company_id)
        }
    }, [relatedCompanies, selectedRelationshipId])

    // Función para actualizar proyectos relacionados y no relacionados
    const refreshRelations = useCallback(async () => {
        if (!selectedRelationshipId) return

        setIsLoading(true)
        setError(null)
        try {
            // Actualiza proyectos relacionados
            await updateRelations(userId, selectedRelationshipId)
            // Actualiza proyectos no relacionados
            await updateNotRelatedProjectsForUser(
                userId,
                selectedRelationshipId
            )
        } catch (err) {
            console.error(
                "Error al actualizar relaciones:",
                err.response?.data || err
            )
            setError("Error al cargar la información")
        } finally {
            setIsLoading(false)
        }
    }, [
        selectedRelationshipId,
        updateRelations,
        updateNotRelatedProjectsForUser,
        userId,
    ])

    // Ejecutamos el refresco cada vez que cambia la compañía seleccionada
    useEffect(() => {
        refreshRelations()
    }, [refreshRelations])

    const handleAddRelation = useCallback(() => {
        if (selectedRelationshipId && selectedProject) {
            onAddRelation({
                user_id: userId,
                company_id: selectedRelationshipId,
                relationship_id: selectedProject,
            })
            // Reiniciar estados para el formulario
            setSelectedRelationshipId("")
            setSelectedProject("")
        }
    }, [onAddRelation, selectedRelationshipId, selectedProject, userId])

    const handleSave = () => {
        if (selectedRelationshipId && selectedProject) {
            handleAddRelation()
        }
        onClose?.()
    }

    return (
        <div>
            <div
                role="dialog"
                aria-labelledby="edit-project-relation-title"
                aria-describedby="edit-project-relation-description"
            >
                <h2
                    id="edit-project-relation-title"
                    className="text-xl font-bold"
                >
                    {title}
                </h2>
                <p
                    id="edit-project-relation-description"
                    className="text-sm text-gray-500"
                >
                    Selecciona una compañía y un proyecto para gestionar las
                    relaciones.
                </p>
                <div className="mt-4 flex gap-4">
                    {/* Lista de proyectos asociados */}
                    <div className="w-1/2">
                        <h4 className="mb-2 text-lg font-semibold">
                            Proyectos Asociados
                        </h4>
                        {error && <p className="text-red-500">{error}</p>}
                        <ul className="max-h-64 overflow-y-auto">
                            {relatedProjects && relatedProjects.length > 0 ? (
                                relatedProjects.map((item) => (
                                    <li
                                        key={item.project_id}
                                        className="flex items-center justify-between border-b py-2"
                                    >
                                        <span>
                                            {item.option || item.options}
                                        </span>
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
                            isLoading={isLoading}
                            isError={!!error}
                            items={
                                Array.isArray(relatedCompanies)
                                    ? relatedCompanies.map((item) => ({
                                          id: item.company_id,
                                          option: item.option,
                                      }))
                                    : []
                            }
                        />
                        <Dropdown
                            id="projectDropdown"
                            label="Seleccionar Proyecto"
                            register={() => ({
                                onChange: (e) =>
                                    setSelectedProject(e.target.value),
                                value: selectedProject,
                            })}
                            error={null}
                            isLoading={isLoading}
                            isError={!!error}
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
                        <Button variant="outline" disabled={isLoading}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleSave}
                        disabled={
                            !selectedRelationshipId ||
                            !selectedProject ||
                            isLoading
                        }
                    >
                        {isLoading ? <LoadingSpinner size="sm" /> : "Agregar"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
