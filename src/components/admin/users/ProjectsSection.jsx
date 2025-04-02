// /src/components/admin/users/ProjectsSection.jsx
import { useEffect } from "react"
import { RelationSection } from "./RelationSection"
import { EditProjectRelationModal } from "./EditProjectRelationModal"
import { toast } from "react-toastify"
import { useRelationsStore } from "../../../store/modules/relationsStore"

const ProjectsSection = ({ userId, selectedCompanyRelId }) => {
    const {
        relatedProjects,
        relatedCompanies,
        updateRelations,
        addProjectUserRelation,
        deleteProjectUserRelation,
    } = useRelationsStore()

    // Actualizar relaciones de proyectos cada vez que cambia la compañía seleccionada
    useEffect(() => {
        if (userId && selectedCompanyRelId) {
            updateRelations(userId, selectedCompanyRelId)
        }
    }, [userId, selectedCompanyRelId, updateRelations])

    // Mapea los proyectos relacionados para el diseño
    const mappedRelatedProjects = relatedProjects.map((r) => ({
        id: r.project_id,
        relationshipId: r.relationship_id,
        option: r.option,
    }))

    const handleDeleteRelation = async (relation) => {
        try {
            // Se utiliza el project_id para eliminar la relación
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

    const handleAddRelation = async (projectId, relationshipId) => {
        try {
            const relationData = {
                user_id: userId,
                project_id: projectId,
                relationship_id: relationshipId,
            }
            await addProjectUserRelation(relationData, userId, relationshipId)
            toast.success("Relación con el proyecto creada exitosamente")
        } catch (error) {
            console.error("Error al agregar relación de proyecto:", error)
            toast.error("Error al agregar relación de proyecto")
        }
    }

    return (
        <RelationSection
            title="Proyectos"
            relatedItems={mappedRelatedProjects}
            displayProp="option"
            onDeleteRelation={handleDeleteRelation}
            customModal={({ onClose }) => (
                <EditProjectRelationModal
                    title="Proyectos"
                    relatedCompanies={relatedCompanies}
                    onAddRelation={handleAddRelation}
                    onClose={onClose}
                    userId={userId}
                />
            )}
        />
    )
}

export default ProjectsSection
