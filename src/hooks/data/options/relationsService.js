// /src/hooks/data/options/relationsService.js
import { api } from "../../../lib/axios"

/**
 * Obtiene las opciones relacionadas para un usuario.
 * @param {Object} params - Parámetros necesarios.
 * @param {string|number} params.user_id - ID del usuario.
 * @param {string} params.related_table - Tabla de relaciones (ej.: "company_users_table").
 * @param {string} params.individual_table - Tabla individual (ej.: "companies_table").
 * @param {string} [params.relationship_id] - (Opcional) relationship_id.
 * @returns {Promise<Array>} Array de opciones relacionadas.
 */
export const getRelatedOptions = async ({
    user_id,
    related_table,
    individual_table,
    relationship_id,
}) => {
    try {
        const params = { user_id, related_table, individual_table }
        if (relationship_id) {
            params.relationship_id = relationship_id
        }
        const { data } = await api.get("/options/relatedOptions", { params })
        return data
    } catch (error) {
        throw new Error(
            `Error obteniendo opciones relacionadas para el usuario ${user_id}: ${error.message}`
        )
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
        throw new Error(
            `Error obteniendo compañías no relacionadas para el usuario ${user_id}: ${error.message}`
        )
    }
}

/**
 * Obtiene los proyectos NO relacionados con el usuario.
 * @param {string|number} user_id - ID del usuario.
 * @returns {Promise<Array>} Array de proyectos no relacionados.
 */
export const getNotRelatedProjects = async (user_id) => {
    try {
        const { data } = await api.get("/options/notRelatedOptions", {
            params: { user_id, table: true },
        })
        return data
    } catch (error) {
        throw new Error(
            `Error obteniendo proyectos no relacionados para el usuario ${user_id}: ${error.message}`
        )
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
        const backendMessage = error.response?.data?.message || error.message
        throw new Error(
            `Error creando relación compañía-usuario: ${backendMessage}`
        )
    }
}

/**
 * Crea la relación entre proyecto y usuario.
 * @param {Object} relationData - { user_id, project_id, relationship_id }
 * @returns {Promise<Object>} Resultado de la creación.
 */
export const addProjectUserRelation = async (relationData) => {
    try {
        const { data } = await api.post("/projectUser", relationData)
        return data
    } catch (error) {
        throw new Error(
            `Error creando relación proyecto-usuario: ${error.message}`
        )
    }
}

/**
 * Elimina la relación entre compañía y usuario.
 * @param {string} relationship_id - ID de la relación.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export const deleteCompanyUserRelation = async (relationship_id) => {
    try {
        const { data } = await api.delete("/companyUser", {
            params: { relationship_id },
        })
        return data
    } catch (error) {
        throw new Error(
            `Error eliminando relación con la compañía: ${error.message}`
        )
    }
}

/**
 * Elimina la relación entre proyecto y usuario.
 * @param {string} relationship_id - ID de la relación.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export const deleteProjectUserRelation = async (relationship_id) => {
    try {
        const { data } = await api.delete(
            `/projectUser?relationship_id=${relationship_id}`
        )
        return data
    } catch (error) {
        throw new Error(
            `Error eliminando relación con el proyecto: ${error.message}`
        )
    }
}
