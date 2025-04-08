// /src/hooks/data/options/relationsService.js
import { api } from "../../../lib/axios"
import { handleApiError } from "../../../lib/errorHandler"

/**
 * Obtiene las opciones relacionadas para un usuario y una compañía.
 * @param {Object} params - Parámetros necesarios.
 * @param {string|number} params.user_id - ID del usuario.
 * @param {string} params.related_table - Tabla de relaciones (ej.: "company_users_table" o "project_user_table").
 * @param {string} params.individual_table - Tabla individual (ej.: "companies_table" o "project_company_table").
 * @param {string} [params.company_id] - (Opcional) ID de la compañía cuando se buscan proyectos relacionados.
 * @param {string} [params.relationship_id] - (Opcional) ID de la relación para filtrar.
 * @returns {Promise<Array>} Array de opciones relacionadas.
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
        const fullMessage = handleApiError(
            error,
            `Error obteniendo opciones relacionadas para el usuario ${user_id}`
        )
        throw new Error(fullMessage)
    }
}

/**
 * Obtiene las compañías NO relacionadas con el usuario.
 * @param {string|number} user_id - ID del usuario.
 * @returns {Promise<Array>} Array de compañías no relacionadas.
 */
export const getNotRelatedCompanies = async (user_id) => {
    try {
        const { data } = await api.get("/options/notRelatedOptions", {
            params: { user_id },
        })
        return data
    } catch (error) {
        const fullMessage = handleApiError(
            error,
            `Error obteniendo compañías no relacionadas para el usuario ${user_id}`
        )
        throw new Error(fullMessage)
    }
}

/**
 * Obtiene los proyectos NO relacionados para una compañía.
 * @param {string|number} company_id - ID de la compañía.
 * @returns {Promise<Array>} Array de proyectos no relacionados.
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
        const fullMessage = handleApiError(
            error,
            `Error obteniendo proyectos no relacionados para la compañía ${company_id}`
        )
        throw new Error(fullMessage)
    }
}

/**
 * Crea la relación entre compañía y usuario.
 * @param {Object} relationData - { user_id, company_id }
 * @returns {Promise<Object>} Resultado de la creación.
 */
export const addCompanyUserRelation = async (relationData) => {
    try {
        const { data } = await api.post("/companyUser", relationData)
        return data
    } catch (error) {
        const fullMessage = handleApiError(
            error,
            "Error creando relación compañía-usuario"
        )
        throw new Error(fullMessage)
    }
}

/**
 * Elimina la relación entre compañía y usuario.
 * @param {string} relationship_id - ID de la relación.
 * @returns {Promise<Object>} Resultado de la eliminación.
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
        const fullMessage = handleApiError(
            error,
            "Error eliminando relación con la compañía"
        )
        throw new Error(fullMessage)
    }
}

/**
 * Crea la relación entre proyecto y usuario.
 * @param {Object} relationData - Datos de la relación.
 * @param {string|number} relationData.user_id - ID del usuario.
 * @param {string|number} relationData.company_id - ID de la compañía.
 * @param {string} relationData.relationship_id - ID de la relación.
 * @returns {Promise<Object>} Resultado de la creación.
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
        const fullMessage = handleApiError(
            error,
            "Error creando relación proyecto-usuario"
        )
        throw new Error(fullMessage)
    }
}

/**
 * Elimina la relación entre proyecto y usuario.
 * @param {string} relationship_id - ID de la relación project-user.
 * @returns {Promise<Object>} Resultado de la eliminación.
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
        const fullMessage = handleApiError(
            error,
            "Error eliminando relación con el proyecto"
        )
        throw new Error(fullMessage)
    }
}

/**
 * Obtiene los proyectos relacionados con una compañía.
 * @param {string|number} company_id - ID de la compañía.
 * @returns {Promise<Array>} Array de proyectos relacionados.
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
        const fullMessage = handleApiError(
            error,
            `Error obteniendo proyectos relacionados con la compañía ${company_id}`
        )
        throw new Error(fullMessage)
    }
}

/**
 * Crea la relación entre compañía y proyecto.
 * @param {Object} relationData - { company_id, project_id }
 * @returns {Promise<Object>} Resultado de la creación.
 */
export const addCompanyProjectRelation = async (relationData) => {
    try {
        const { data } = await api.post("/companyProject", relationData)

        return data
    } catch (error) {
        const fullMessage = handleApiError(
            error,
            "Error creando relación compañía-proyecto"
        )
        throw new Error(fullMessage)
    }
}

/**
 * Elimina la relación entre compañía y proyecto.
 * @param {string} relationship_id - ID de la relación.
 * @returns {Promise<Object>} Resultado de la eliminación.
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
        const fullMessage = handleApiError(
            error,
            "Error eliminando relación compañía-proyecto"
        )
        throw new Error(fullMessage)
    }
}
