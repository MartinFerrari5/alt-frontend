// /src/components/admin/users/EditProjectRelationModal.jsx
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
    const [loading, setLoading] = useState(false);

    // Extraemos las propiedades del store para compañías y proyectos
    const {
        relatedCompanies, // Ahora lo obtenemos directamente desde el store
        relatedProjects,
        notRelatedProjects,
        updateRelations,
    } = useRelationsStore()

        const handleSave = async () => {
        try {
            setLoading(true)
            if (selectedRelationshipId && selectedProject) {
                await handleAddRelation()
            }
            onClose?.()
        } catch (error) {
            console.error("Error al guardar:", error)
        } finally {
            setLoading(false)
        }
    }

    // Actualiza proyectos asociados y disponibles cuando cambia la compañía seleccionada
    useEffect(() => {
        if (selectedRelationshipId) {
            updateRelations(userId, selectedRelationshipId)
        }
    }, [selectedRelationshipId, userId, updateRelations])

    const handleAddRelation = () => {
        if (selectedRelationshipId && selectedProject) {
            onAddRelation(selectedProject, selectedRelationshipId)
            setSelectedRelationshipId("")
            setSelectedProject("")
        }
    }

    return (
        <div>
            <div>
                <h3 className="mb-4 text-xl font-bold">Editar {title}</h3>
                <div className="flex gap-4">
                    {/* Panel de proyectos ya asociados */}
                    <div className="w-1/2">
                        <h4 className="mb-2 text-lg font-semibold">
                            Asociados
                        </h4>
                        <ul className="max-h-64 overflow-y-auto">
                            {relatedProjects && relatedProjects.length > 0 ? (
                                relatedProjects.map((item) => (
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
                        {/* Dropdown para seleccionar la compañía (relationship_id) */}
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
                                id: item.company_id,
                                option: item.option,
                            }))}
                            loadingText="Cargando..."
                            errorText="Error al cargar"
                            useIdAsValue={true}
                        />
                        {/* Dropdown para seleccionar un proyecto disponible */}
                        <Dropdown
                            id="projectDropdown"
                            label="Seleccionar Proyecto"
                            register={() => ({
                                onChange: (e) =>
                                    setSelectedProject(e.target.value),
                                value: selectedProject,
                            })}
                            error={null}
                            isLoading={false}
                            isError={false}
                            items={notRelatedProjects.map((item) => ({
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
            <div className="mt-6 flex justify-end gap-3">
                <DialogClose asChild>
                    <Button 
                        variant="outline" 
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                </DialogClose>
                <Button
                    disabled={loading || !selectedProject || !selectedRelationshipId}
                    onClick={handleSave}
                >
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>
            </div>
        </div>
    )
}
