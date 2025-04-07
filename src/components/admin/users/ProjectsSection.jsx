import { useState, useEffect } from "react"
import { Briefcase } from "lucide-react"
import { toast } from "react-toastify"
import { RelationSection } from "./RelationSection"
import { EditProjectRelationModal } from "./EditProjectRelationModal"
import { useRelationsStore } from "../../../store/modules/relationsStore"
import CompanySelector from "../../ui/CompanySelector"
import { mapCompanies, mapProjects } from "../../../util/mappers"

const ProjectsSection = ({ userId }) => {
    const [selectedCompanyRelId, setSelectedCompanyRelId] = useState("")

    const {
        relatedProjects,
        relatedCompanies,
        updateRelations,
        addProjectUserRelation,
        deleteProjectUserRelation,
    } = useRelationsStore()

    // Cada vez que se seleccione una compañía, se actualizan las relaciones de proyectos (del usuario y esa compañía)
    useEffect(() => {
        if (selectedCompanyRelId) {
            updateRelations(userId, selectedCompanyRelId).catch((error) => {
                console.error("Error al cargar relaciones de proyectos:", error)
                toast.error("Error al cargar proyectos de la compañía")
            })
        }
    }, [selectedCompanyRelId, updateRelations, userId])

    // Seleccionar la primera compañía si aún no se ha seleccionado ninguna
    useEffect(() => {
        if (relatedCompanies.length > 0 && !selectedCompanyRelId) {
            setSelectedCompanyRelId(relatedCompanies[0].relationship_id)
        }
    }, [relatedCompanies, selectedCompanyRelId])

    // Mapeo de datos
    const mappedRelatedCompanies = mapCompanies(relatedCompanies)
    const mappedRelatedProjects = mapProjects(relatedProjects || [])

    const handleDeleteRelation = async (relation) => {
        try {
            await deleteProjectUserRelation(
                relation.id,
                userId,
                selectedCompanyRelId
            )
            toast.success("Relación con el proyecto eliminada exitosamente")
        } catch (error) {
            console.error("Error al eliminar relación de proyecto:", error)
            toast.error("Error al eliminar relación de proyecto")
        }
    }

    /**
     * Crea una relación entre un proyecto y un usuario.
     * @param {Object} relationData - Datos de la relación.
     * @returns {Promise<void>}
     */
    const handleAddRelation = async (relationData) => {
        try {
            // Llamar al servicio con los parámetros correctos
            await addProjectUserRelation(relationData)
            toast.success("Relación con el proyecto creada exitosamente")
        } catch (error) {
            console.error("Error al agregar relación de proyecto:", error)
            toast.error("Error al agregar relación de proyecto")
        }
    }

    const ProjectModal = ({ onClose }) => (
        <EditProjectRelationModal
            title="Proyectos"
            relatedCompanies={relatedCompanies}
            onAddRelation={handleAddRelation}
            onClose={onClose}
            userId={userId}
        />
    )

    return (
        <div className="mb-8">
            <RelationSection
                icon={<Briefcase className="h-5 w-5 text-blue-600" />}
                title="Proyectos"
                relatedItems={mappedRelatedProjects}
                displayProp="option"
                onDeleteRelation={handleDeleteRelation}
                customModal={ProjectModal}
            />
            <CompanySelector
                mappedRelatedCompanies={mappedRelatedCompanies}
                selectedCompanyRelId={selectedCompanyRelId}
                setSelectedCompanyRelId={setSelectedCompanyRelId}
            />
            <div className="mt-4">
                <h4 className="text-lg font-semibold">
                    Proyectos de la Compañía
                </h4>
                <ul>
                    {mappedRelatedProjects.length > 0 ? (
                        mappedRelatedProjects.map((project) => (
                            <li key={project.id}>{project.option}</li>
                        ))
                    ) : (
                        <li>
                            No hay proyectos relacionados con esta compañía.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default ProjectsSection
