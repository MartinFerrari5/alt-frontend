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

    // Extraemos relatedCompanies, companyProjects y la acción para actualizar desde el store.
    const {
        relatedCompanies,
        companyProjects,
        updateCompanyProjects,
        relatedProjects,
    } = useRelationsStore()

    // Cargar proyectos relacionados a la compañía seleccionada
    useEffect(() => {
        if (selectedRelationshipId) {
            updateCompanyProjects(selectedRelationshipId).catch((error) => {
                console.error(
                    "Error al cargar proyectos de la compañía:",
                    error.response?.data
                )
            })
        }
    }, [selectedRelationshipId, updateCompanyProjects])

    const handleAddRelation = () => {
        if (selectedRelationshipId && selectedProject) {

            onAddRelation({
                user_id: userId,
                company_id: selectedRelationshipId,
                relationship_id: selectedProject,
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
            <div>
                <h3 className="mb-4 text-xl font-bold">Editar {title}</h3>
                <div className="flex gap-4">
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
                            items={
                                relatedCompanies.map((item) => ({
                                    id: item.company_id,
                                    option: item.option,
                                })) || []
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
                            items={
                                companyProjects.map((item) => ({
                                    id: item.relationship_id,
                                    option: item.option,
                                })) || []
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
        </div>
    )
}
