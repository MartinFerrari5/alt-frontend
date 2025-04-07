// /src/hooks/data/options/relationsService.js
import { api } from "../../../lib/axios"

/**
 * Obtiene las Proyecto relacionadas para un usuario y una companía.
 * @param {Object} params - Parámetros necesarios.
 * @param {string|number} params.user_id - ID del usuario.
 * @param {string} params.related_table - Tabla de relaciones (ej.: "company_users_table" o "project_user_table").
 * @param {string} params.individual_table - Tabla individual (ej.: "companies_table" o "project_company_table").
 * @param {string} [params.company_id] - (Opcional) ID de la compañía cuando se buscan proyectos relacionados.
 * @param {string} [params.relationship_id] - (Opcional) ID de la relación para filtrar.
 * @returns {Promise<Array>} Array de proyectos relacionadas.
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
        console.log("getRelatedOptions:", data)
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
        console.error(
            `Error obteniendo proyectos no relacionados para la compañía ${company_id}:`,
            error
        )

        if (error.response?.data) {
            throw new Error(
                `Error obteniendo proyectos no relacionados para la compañía ${company_id}: ${error.response.data}`
            )
        }

        throw new Error(
            `Error obteniendo proyectos no relacionados para la compañía ${company_id}: ${error.message}`
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
        console.log("addCompanyUserRelation:", data)
        return data
    } catch (error) {
        const backendMessage = error.response?.data?.message || error.message
        throw new Error(
            `Error creando relación compañía-usuario: ${backendMessage}`
        )
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
        console.log("deleteCompanyUserRelation:", data)
        return data
    } catch (error) {
        throw new Error(
            `Error eliminando relación con la compañía: ${error.message}`
        )
    }
}

/**
 * Creates the relationship between a project and a user.
 * @param {Object} relationData - Object containing relationship data.
 * @param {string|number} relationData.user_id - ID of the user.
 * @param {string|number} relationData.company_id - ID of the company.
 * @param {string} relationData.relationship_id - ID of the relationship.
 * @returns {Promise<Object>} Result of the creation.
 */
export const addProjectUserRelation = async (relationData) => {
    console.log("addProjectUserRelation", relationData)
    try {
        const { data } = await api.post("/projectUser", {
            user_id: relationData.user_id,
            company_id: relationData.company_id,
            relationship_id: relationData.relationship_id,
        })
        console.log("addProjectUserRelation:", data)
        return data 
    } catch (error) {
        const backendMessage = error.response?.data?.message || error.message
        console.error(
            "Error en addProjectUserRelation:",
            error.response?.data || error
        )
        throw new Error(
            `Error creando relación proyecto-usuario: ${backendMessage}`
        )
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
        console.log("deleteProjectUserRelation:", data)
        return data
    } catch (error) {
        throw new Error(
            `Error eliminando relación con el proyecto: ${error.message}`
        )
    }
}

/**
 * Obtiene los proyectos relacionados con una compañía.
 * @param {string|number} company_id - ID de la compañía.
 * @returns {Promise<Array>} Array de proyectos relacionados.
 */
export const getCompanyProjects = async (company_id) => {
    console.log("company_id", company_id)
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
        console.error(
            `Error obteniendo proyectos relacionados con la compañía ${company_id}:`,
            error
        )

        if (error.response?.data) {
            throw new Error(
                `Error obteniendo proyectos relacionados con la compañía ${company_id}: ${error.response.data}`
            )
        }

        throw new Error(
            `Error obteniendo proyectos relacionados con la compañía ${company_id}: ${error.message}`
        )
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
        console.log("addCompanyProjectRelation:", data)
        return data
    } catch (error) {
        const backendMessage = error.response?.data?.message || error.message
        throw new Error(
            `Error creando relación compañía-proyecto: ${backendMessage}`
        )
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
        console.log("deleteCompanyProjectRelation:", data)
        return data
    } catch (error) {
        throw new Error(
            `Error eliminando relación compañía-proyecto: ${error.message}`
        )
    }
}
