// /src/components/admin/users/ProjectsSection.jsx
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

    // Actualiza las relaciones cada vez que se selecciona una compañía.
    useEffect(() => {
        if (selectedCompanyRelId) {
            updateRelations(userId, selectedCompanyRelId).catch((error) => {
                console.error("Error al cargar relaciones de proyectos:", error)
                toast.error("Error al cargar proyectos de la compañía")
            })
        }
    }, [selectedCompanyRelId, updateRelations, userId])

    // Selecciona la primera compañía si aún no hay seleccionada.
    useEffect(() => {
        if (relatedCompanies.length > 0 && !selectedCompanyRelId) {
            setSelectedCompanyRelId(relatedCompanies[0].relationship_id)
        }
    }, [relatedCompanies, selectedCompanyRelId])

    const handleAddRelation = async (relationData) => {
        try {
            await addProjectUserRelation(relationData, userId, selectedCompanyRelId)
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
        <div className="mb-8">
            <RelationSection
                icon={<Briefcase className="h-5 w-5 text-blue-600" />}
                title="Proyectos"
                relatedItems={mapProjects(relatedProjects || [])}
                displayProp="option"
                customModal={ProjectModal}
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