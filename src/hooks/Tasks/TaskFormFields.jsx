import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { getCompanyProjects } from "../../hooks/data/options/optionsService"

/**
 * Hook para obtener y gestionar los proyectos de la compañía seleccionada.
 *
 * @param {string} selectedCompany - Id de la compañía seleccionada.
 * @param {Function} reset - Función reset del formulario.
 * @param {Function} watch - Función watch del formulario.
 * @returns {Array} Lista de proyectos filtrados.
 */
export const useCompanyProjects = (selectedCompany, reset, watch) => {
    const [filteredProjects, setFilteredProjects] = useState([])

    useEffect(() => {
        if (selectedCompany) {
            getCompanyProjects(selectedCompany)
                .then((projects) => {
                    setFilteredProjects(projects)
                    reset({
                        ...watch(),
                        project:
                            projects.length > 0 ? projects[0].project_id : "",
                    })
                })
                .catch((error) => toast.error(error.message))
        } else {
            setFilteredProjects([])
            reset({ ...watch(), project: "" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCompany])

    return filteredProjects
}
