import { useState, useEffect, useCallback } from "react"
import Button from "../../Button"
import Dropdown from "../../Dropdown/Dropdown"
import { useRelationsStore } from "../../../store/modules/relationsStore"
import { DialogClose } from "../../ui/dialog"
import { LoadingSpinner } from "../../../util/LoadingSpinner"
import { Save, X } from "lucide-react"

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

    const {
        relatedCompanies,
        notRelatedProjects,
        relatedProjects,
        updateRelations,
        updateNotRelatedProjectsForUser,
    } = useRelationsStore()

    // Inicializar la compañía seleccionada si aún no hay una
    useEffect(() => {
        if (relatedCompanies.length > 0 && !selectedRelationshipId) {
            setSelectedRelationshipId(relatedCompanies[0].company_id)
        }
    }, [relatedCompanies, selectedRelationshipId])

    // Función para actualizar relaciones y proyectos no relacionados
    const refreshRelations = useCallback(async () => {
        if (!selectedRelationshipId) return
        setIsLoading(true)
        setError(null)
        try {
            await updateRelations(userId, selectedRelationshipId)
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
            // Reiniciar estados después de agregar
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
        <div
            role="dialog"
            aria-labelledby="edit-project-relation-title"
            aria-describedby="edit-project-relation-description"
            className="max-h-[90vh] overflow-y-auto p-4"
        >
            {/* Contenedor principal del modal con ancho responsivo aumentado */}
            {/* Clases max-w aumentadas: sm:max-w-4xl, md:max-w-6xl, lg:max-w-7xl */}
            <div className="mx-auto w-full max-w-[95vw] rounded-lg bg-white p-8 shadow-xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl">
                {/* Encabezado */}
                <header className="mb-8">
                    <h2
                        id="edit-project-relation-title"
                        className="text-2xl font-bold text-gray-800"
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
                </header>

                {/* Contenido principal */}
                <section className="flex flex-col gap-8 md:flex-row">
                    {/* Panel de proyectos asociados */}
                    <article className="md:w-1/2">
                        <h3 className="mb-4 text-xl font-bold text-gray-800">
                            Proyectos Asociados
                        </h3>
                        {error && <p className="mb-2 text-red-500">{error}</p>}
                        {/* Aumentada la altura máxima de la lista */}
                        <ul className="max-h-80 overflow-y-auto rounded-lg border border-gray-200 p-4">
                            {relatedProjects && relatedProjects.length > 0 ? (
                                relatedProjects.map((item) => (
                                    <li
                                        key={item.project_id}
                                        className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0"
                                    >
                                        <span className="text-gray-700">
                                            {item.option || item.options}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <li className="py-2 italic text-gray-500">
                                    No hay {title.toLowerCase()} asociados.
                                </li>
                            )}
                        </ul>
                    </article>

                    {/* Panel para agregar nuevos proyectos */}
                    <article className="md:w-1/2">
                        <h3 className="mb-4 text-xl font-bold text-gray-800">
                            Agregar {title}
                        </h3>
                        <div className="flex flex-col gap-4">
                            <Dropdown
                                id="companyDropdown"
                                label="Seleccionar Compañía"
                                register={() => ({
                                    onChange: (e) => {
                                        setSelectedRelationshipId(
                                            e.target.value
                                        )
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
                    </article>
                </section>

                {/* Pie de modal con botones */}
                <footer className="mt-8 flex justify-end gap-4">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            disabled={isLoading}
                            className="text-red-600 hover:bg-red-100"
                        >
                            <X className="h-4 w-4" />
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
                        {isLoading ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isLoading ? "" : "Agregar"}
                    </Button>
                </footer>
            </div>
        </div>
    )
}
