// /src/components/admin/users/ProjectsSection.jsx
import { useState, useEffect } from "react"
import { Briefcase } from "lucide-react"
import { toast } from "react-toastify"
import { RelationSection } from "./RelationSection"
import { EditProjectRelationModal } from "./EditProjectRelationModal"
import { useRelationsStore } from "../../../store/modules/relationsStore"
import CompanySelector from "../../ui/CompanySelector"
import { mapCompanies } from "../../../util/mappers"

const ProjectsSection = ({ userId }) => {
    const [selectedCompanyRelId, setSelectedCompanyRelId] = useState("")

    const {
        relatedProjects,
        relatedCompanies,
        updateRelations,
        addProjectUserRelation,
        deleteProjectUserRelation,
    } = useRelationsStore()

    useEffect(() => {
        if (selectedCompanyRelId) {
            updateRelations(userId, selectedCompanyRelId).catch((error) => {
                console.error("Error al cargar relaciones de proyectos:", error)
                toast.error("Error al cargar proyectos de la compañía")
            })
        }
    }, [selectedCompanyRelId, updateRelations, userId])

    // Si no hay compañía seleccionada, se toma la primera disponible.
    useEffect(() => {
        if (relatedCompanies.length > 0 && !selectedCompanyRelId) {
            setSelectedCompanyRelId(relatedCompanies[0].relationship_id)
        }
    }, [relatedCompanies, selectedCompanyRelId])

    // Función para eliminar relación utilizando el store global
    const handleDeleteRelation = async (relation) => {
        if (!relation?.relationship_id) {
            toast.error("No se puede eliminar la relación: ID no válido.")
            console.error(
                "El objeto relación no contiene un ID válido:",
                relation
            )
            return
        }

        try {
            await deleteProjectUserRelation(
                relation.relationship_id,
                userId,
                selectedCompanyRelId
            )
            toast.success("Relación con el proyecto eliminada exitosamente")
        } catch (error) {
            console.error("Error al eliminar relación de proyecto:", error)
            toast.error("Error al eliminar relación de proyecto")
        }
    }

    const handleAddRelation = async (relationData) => {
        try {
            await addProjectUserRelation(
                relationData,
                userId,
                selectedCompanyRelId
            )
            toast.success("Relación con el proyecto creada exitosamente")
        } catch (error) {
            console.error("Error al agregar relación de proyecto:", error)
            toast.error("Error al agregar relación de proyecto")
        }
    }

    const ProjectModal = ({ onClose }) => (
        <EditProjectRelationModal
            title="Proyectos"
            onAddRelation={handleAddRelation}
            onClose={onClose}
            userId={userId}
        />
    )

    return (
        <div>
            <RelationSection
                icon={<Briefcase className="h-5 w-5 text-blue-600" />}
                title="Proyectos"
                relatedItems={relatedProjects}
                displayProp="option"
                customModal={ProjectModal}
                onDeleteRelation={handleDeleteRelation}
                customSelector={
                    <CompanySelector
                        mappedRelatedCompanies={mapCompanies(relatedCompanies)}
                        selectedCompanyRelId={selectedCompanyRelId}
                        setSelectedCompanyRelId={setSelectedCompanyRelId}
                    />
                }
            />
        </div>
    )
}

export default ProjectsSection
