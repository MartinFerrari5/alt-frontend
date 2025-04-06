// /src/components/admin/users/ProjectsSection.jsx
import { useState, useEffect } from "react"
import { RelationSection } from "./RelationSection"
import { EditProjectRelationModal } from "./EditProjectRelationModal"
import { toast } from "react-toastify"
import { useRelationsStore } from "../../../store/modules/relationsStore"
import { Briefcase } from "lucide-react"
import CompanySelector from "../../ui/CompanySelector"
import { mapCompanies, mapProjects } from "../../../util/mappers"
import { useUpdateRelationsOnCompanyChange } from "../../../hooks/useUpdateRelationsOnCompanyChange"

const ProjectsSection = ({ userId }) => {
    const [selectedCompanyRelId, setSelectedCompanyRelId] = useState("")

    const {
        relatedProjects,
        relatedCompanies,
        addProjectUserRelation,
        deleteProjectUserRelation,
    } = useRelationsStore()

    // Cuando cambie el listado de compañías, si no hay compañía seleccionada, se asigna la primera.
    useEffect(() => {
        if (relatedCompanies.length > 0 && !selectedCompanyRelId) {
            setSelectedCompanyRelId(relatedCompanies[0].relationship_id)
        }
    }, [relatedCompanies, selectedCompanyRelId])

    // Actualiza las relaciones cada vez que cambia la compañía seleccionada
    useUpdateRelationsOnCompanyChange(userId, selectedCompanyRelId)

    const mappedRelatedCompanies = mapCompanies(relatedCompanies)
    const mappedRelatedProjects = mapProjects(relatedProjects)

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

    const handleAddRelation = async (projectId, companyId) => {
        try {
            const relationData = {
                user_id: userId,
                project_id: projectId,
                company_id: companyId,
            }
            await addProjectUserRelation(relationData, userId, companyId)
            toast.success("Relación con el proyecto creada exitosamente")
        } catch (error) {
            console.error("Error al agregar relación de proyecto:", error)
            toast.error("Error al agregar relación de proyecto")
        }
    }

    // Modal para agregar una nueva relación de proyecto
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
        </div>
    )
}

export default ProjectsSection
