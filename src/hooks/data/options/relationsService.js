// /src/hooks/data/options/relationsService.js
import { api } from "../../../lib/axios"

/**
 * Obtiene las opciones relacionadas.
 */
export const getRelatedOptions = async ({
    user_id,
    related_table,
    individual_table,
    company_id,
    relationship_id,
}) => {
    try {
        const params = { user_id, related_table, individual_table }
        if (company_id) params.company_id = company_id
        if (relationship_id) params.relationship_id = relationship_id
        const { data } = await api.get("/options/relatedOptions", { params })
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}

/**
 * Obtiene las compañías NO relacionadas con el usuario.
 */
export const getNotRelatedCompanies = async (user_id) => {
    try {
        const { data } = await api.get("/options/notRelatedOptions", {
            params: { user_id },
        })
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}

/**
 * Obtiene los proyectos NO relacionados para una compañía.
 */
export const getNotRelatedProjects = async (company_id) => {
    if (!company_id) {
        throw new Error(
            "El ID de la compañía es obligatorio para obtener los proyectos no relacionados."
        )
    }
    try {
        const { data } = await api.get(
            `/options/notRelatedOptions?company_id=${company_id}&table=true`
        )
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}

/**
 * Obtiene los proyectos NO relacionados para un usuario.
 */
export const getNotRelatedProjectsForUser = async (user_id) => {
    if (!user_id) {
        throw new Error(
            "El ID del usuario es obligatorio para obtener los proyectos no relacionados."
        )
    }
    try {
        const { data } = await api.get(
            `/options/notRelatedOptions?user_id=${user_id}&table=project`
        )
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}

/**
 * Crea la relación entre compañía y usuario.
 */
export const addCompanyUserRelation = async (relationData) => {
    try {
        const { data } = await api.post("/companyUser", relationData)
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}

/**
 * Elimina la relación entre compañía y usuario.
 */
export const deleteCompanyUserRelation = async (relationship_id) => {
    if (!relationship_id) {
        throw new Error(
            "relationship_id es obligatorio para eliminar la relación."
        )
    }
    try {
        const { data } = await api.delete(
            `/companyUser?relationship_id=${relationship_id}`
        )
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}

/**
 * Crea la relación entre proyecto y usuario.
 */
export const addProjectUserRelation = async (relationData) => {
    try {
        const { data } = await api.post("/projectUser", {
            user_id: relationData.user_id,
            company_id: relationData.company_id,
            relationship_id: relationData.relationship_id,
        })
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}

/**
 * Elimina la relación entre proyecto y usuario.
 */
export const deleteProjectUserRelation = async (relationship_id) => {
    if (!relationship_id) {
        throw new Error(
            "relationship_id es obligatorio para eliminar la relación de proyecto-usuario."
        )
    }
    try {
        const { data } = await api.delete(
            `/projectUser?relationship_id=${relationship_id}`
        )
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}

/**
 * Obtiene los proyectos relacionados con una compañía.
 */
export const getCompanyProjects = async (company_id) => {
    if (!company_id) {
        throw new Error(
            "El ID de la compañía es obligatorio para obtener los proyectos relacionados."
        )
    }
    try {
        const { data } = await api.get(
            `/companyProject?company_id=${company_id}`
        )
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}

/**
 * Crea la relación entre compañía y proyecto.
 */
export const addCompanyProjectRelation = async (relationData) => {
    try {
        const { data } = await api.post("/companyProject", relationData)
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}

/**
 * Elimina la relación entre compañía y proyecto.
 */
export const deleteCompanyProjectRelation = async (relationship_id) => {
    if (!relationship_id) {
        throw new Error(
            "relationship_id es obligatorio para eliminar la relación compañía-proyecto."
        )
    }
    try {
        const { data } = await api.delete(
            `/companyProject?relationship_id=${relationship_id}`
        )
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}

/**
 * Obtiene los usuarios relacionados con un proyecto.
 */
export const getProjectUsers = async (project_id) => {
    if (!project_id) {
        throw new Error(
            "El ID del proyecto es obligatorio para obtener los usuarios relacionados."
        )
    }
    try {
        const { data } = await api.get(`/projectUser?project_id=${project_id}`)
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}

/**
 * Obtiene los usuarios NO relacionados con un proyecto.
 */
export const getNotRelatedProjectUsers = async (project_id) => {
    if (!project_id) {
        throw new Error(
            "El ID del proyecto es obligatorio para obtener los usuarios no relacionados."
        )
    }
    try {
        const { data } = await api.get(
            `/options/notRelatedOptions?project_id=${project_id}&table=project`
        )
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(backendMsg)
    }
}
