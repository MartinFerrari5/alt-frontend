// /src/components/admin/users/ProjectsSection.jsx
import { useEffect, useState } from "react"
import { RelationSection } from "./RelationSection"
import { EditProjectRelationModal } from "./EditProjectRelationModal"
import {
    getRelatedOptions,
    getNotRelatedProjects,
    deleteProjectUserRelation,
    addProjectUserRelation,
} from "../../../hooks/data/options/relationsService"
import { toast } from "react-toastify"

const ProjectsSection = ({ userId, selectedCompanyRelId }) => {
    const [relatedProjects, setRelatedProjects] = useState([])
    const [notRelatedProjects, setNotRelatedProjects] = useState([])
    const [relatedCompanies, setRelatedCompanies] = useState([])

    // Obtener compañías relacionadas con el usuario
    useEffect(() => {
        if (userId) {
            /**
             * Fetches and sets the companies related to the user.
             */
            const fetchRelatedCompanies = async () => {
                try {
                    // Fetch related companies data from the service
                    const companiesData = await getRelatedOptions({
                        user_id: userId,
                        related_table: "company_users_table",
                        individual_table: "companies_table",
                    })
                    // Update state with the fetched companies data
                    setRelatedCompanies(companiesData)
                } catch (error) {
                    // Log error and show error notification
                    console.error(
                        "Error al obtener compañías relacionadas:",
                        error
                    )
                    toast.error("Error al obtener compañías relacionadas")
                }
            }
            fetchRelatedCompanies()
        }
    }, [userId])

    // Cargar proyectos relacionados para la compañía seleccionada
    useEffect(() => {
        if (userId && selectedCompanyRelId) {
            /**
             * Fetches and sets the related projects for the selected company.
             * @param {string} userId - ID of the user.
             * @param {string} selectedCompanyRelId - ID of the selected company.
             */
            const fetchRelatedProjects = async () => {
                try {
                    // Fetch related projects data from the service
                    const projectsData = await getRelatedOptions({
                        user_id: userId,
                        related_table: "projects_table",
                        individual_table: "projects_table",
                        relationship_id: selectedCompanyRelId,
                    })
                    // Update state with the fetched projects data
                    setRelatedProjects(projectsData)
                } catch (error) {
                    // Log error and show error notification
                    console.error(
                        "Error al obtener proyectos relacionados:",
                        error
                    )
                    toast.error("Error al obtener proyectos relacionados")
                }
            }
            fetchRelatedProjects()
        }
    }, [userId, selectedCompanyRelId])

    // Cargar proyectos que aún no están relacionados
    useEffect(() => {
        if (userId && selectedCompanyRelId) {
            /**
             * Fetches and sets the projects that are not related to the selected company.
             */
            const fetchNotRelatedProjects = async () => {
                try {
                    // Fetch projects not related to the selected company
                    const projectsNotRelated =
                        await getNotRelatedProjects(userId)

                    // Update the state with the fetched projects
                    setNotRelatedProjects(projectsNotRelated)
                } catch (error) {
                    // Log error and show error notification
                    console.error(
                        "Error al obtener proyectos no relacionados:",
                        error
                    )
                    toast.error("Error al obtener proyectos no relacionados")
                }
            }
            fetchNotRelatedProjects()
        }
    }, [userId, selectedCompanyRelId])

    const mappedRelatedProjects = relatedProjects.map((r) => ({
        id: r.project_id,
        relationshipId: r.relationship_id,
        option: r.option,
    }))

    /**
     * Elimina una relación de proyecto con el usuario actual.
     * @param {Object} relation - La relación a eliminar.
     */
    const handleDeleteRelation = async (relation) => {
        try {
            // Eliminar la relación de proyecto con el usuario
            await deleteProjectUserRelation(relation.id)
            toast.success("Relación con el proyecto eliminada exitosamente")

            // Actualizar la lista de proyectos relacionados
            const updatedProjects = await getRelatedOptions({
                user_id: userId,
                related_table: "projects_table",
                individual_table: "projects_table",
                relationship_id: selectedCompanyRelId,
            })
            setRelatedProjects(updatedProjects)

            // Actualizar la lista de proyectos no relacionados
            const updatedNotRelated = await getNotRelatedProjects(userId)
            setNotRelatedProjects(updatedNotRelated)
        } catch (error) {
            // Log error and show error notification
            console.error("Error al eliminar relación de proyecto:", error)
            toast.error("Error al eliminar relación de proyecto")
        }
    }

    /**
     * Agrega una relación de proyecto con el usuario actual.
     * @param {number} projectId - ID del proyecto a relacionar.
     * @param {string} relationshipId - ID de la relación company-user.
     */
    const handleAddRelation = async (projectId, relationshipId) => {
        try {
            const relationData = {
                user_id: userId,
                project_id: projectId,
                relationship_id: relationshipId,
            }
            // Agregar la relación de proyecto con el usuario
            await addProjectUserRelation(relationData)
            toast.success("Relación con el proyecto creada exitosamente")

            // Actualizar la lista de proyectos relacionados
            const updatedProjects = await getRelatedOptions({
                user_id: userId,
                related_table: "projects_table",
                individual_table: "projects_table",
                relationship_id: relationshipId,
            })
            setRelatedProjects(updatedProjects)

            // Actualizar la lista de proyectos no relacionados
            const updatedNotRelated = await getNotRelatedProjects(userId)
            setNotRelatedProjects(updatedNotRelated)
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
