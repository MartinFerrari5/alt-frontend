// src/components/admin/users/EditProjectRelationModal.jsx
import { useState } from "react"
import Button from "../../Button"
import Dropdown from "../../Dropdown/Dropdown"

const EditProjectRelationModal = ({
    title,
    associatedItems, // Proyectos ya asociados (para mostrarlos en lista)
    availableProjects, // Proyectos disponibles para agregar
    relatedCompanies, // Compañías relacionadas (se usará para extraer el relationship_id)
    onAddRelation,
    onClose,
}) => {
    const [selectedRelationshipId, setSelectedRelationshipId] = useState("")
    const [selectedProject, setSelectedProject] = useState("")

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
                    {/* Panel de elementos ya asociados */}
                    <div className="w-1/2">
                        <h4 className="mb-2 text-lg font-semibold">
                            Asociados
                        </h4>
                        <ul className="max-h-64 overflow-y-auto">
                            {associatedItems && associatedItems.length > 0 ? (
                                associatedItems.map((item) => (
                                    <li
                                        key={item.id}
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
                    {/* Panel de selección */}
                    <div className="w-1/2">
                        <h4 className="mb-2 text-lg font-semibold">
                            Agregar {title}
                        </h4>
                        {/* Dropdown para seleccionar la compañía (se extrae el relationship_id) */}
                        <Dropdown
                            id="companyDropdown"
                            label="Seleccionar Compañía"
                            register={() => ({
                                onChange: (e) =>
                                    setSelectedRelationshipId(e.target.value),
                                value: selectedRelationshipId,
                            })}
                            error={null}
                            isLoading={false}
                            isError={false}
                            // Mapeamos las compañías relacionadas para usar el relationship_id como value
                            items={relatedCompanies.map((item) => ({
                                id: item.relationship_id,
                                option: item.option, // nombre de la compañía
                            }))}
                            loadingText="Cargando..."
                            errorText="Error al cargar"
                            useIdAsValue={true}
                        />

                        {/* Dropdown para seleccionar el proyecto */}
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
                            items={availableProjects.map((item) => ({
                                id: item.id,
                                option: item.option,
                            }))}
                            loadingText="Cargando..."
                            errorText="Error al cargar"
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
