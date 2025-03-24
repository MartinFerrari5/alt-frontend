// /src/hooks/data/options/options.js
import { api } from "../../../lib/axios"

/**
 * Obtiene las opciones para una tabla específica.
 * @param {string} table - Nombre de la tabla.
 * @returns {Promise<Object>} Datos de las opciones.
 */
export const getOptions = async (table) => {
    try {
        const { data } = await api.get("/options", { params: { table } })
        console.log("data", data)
        return data
    } catch (error) {
        throw new Error(
            `Error obteniendo opciones para la tabla ${table}: ${error.message}`
        )
    }
}

/**
 * Crea una nueva opción en una tabla.
 * @param {string} table - Nombre de la tabla donde se creará la opción.
 * @param {Object} option - Datos de la opción a crear.
 * @returns {Promise<Object>} La opción creada.
 */
export const addOption = async (table, option) => {
    try {
        const { data } = await api.post("/options", { table, option })
        return data.option
    } catch (error) {
        throw new Error(
            `Error creando opción en ${table}. Verifica que los datos sean correctos: ${error.message}`
        )
    }
}

/**
 * Actualiza una opción existente.
 * @param {string} table - Nombre de la tabla.
 * @param {number|string} id - ID de la opción.
 * @param {Object} updatedData - Datos actualizados.
 * @returns {Promise<Object>} La opción actualizada.
 */
export const updateOption = async (table, id, updatedData) => {
    try {
        const { data } = await api.put(`/options?options_id=${id}`, {
            table,
            option: updatedData,
        })
        return data.option
    } catch (error) {
        throw new Error(
            `Error actualizando opción ${id} en ${table}: ${error.message}`
        )
    }
}

/**
 * Elimina una opción de una tabla.
 * @param {string} table - Nombre de la tabla.
 * @param {number|string} id - ID de la opción.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export const deleteOption = async (table, id) => {
    try {
        const { data } = await api.delete(`/options?options_id=${id}`, {
            data: { table},
        })
        return data
    } catch (error) {
        throw new Error(
            `Error eliminando opción ${id} en ${table}: ${error.message}`
        )
    }
}

/**
 * Obtiene las opciones relacionadas para un usuario.
 *
 * Obtiene las opciones relacionadas para un usuario en una tabla específica.
 * Por ejemplo, si se proporciona la tabla "projects", se devuelve un array de
 * objetos con las opciones relacionadas del usuario en la tabla de proyectos.
 *
 * @param {{ user_id: string|number, related_table: string, individual_table: string, relationship_id?: string }} params
 * @param {string|number} params.user_id - ID del usuario.
 * @param {string} params.related_table - Tabla que contiene las opciones relacionadas.
 * @param {string} params.individual_table - Tabla que se relaciona con la tabla relacionada.
 * @param {string} [params.relationship_id] - ID de la relación (opcional).
 * @returns {Promise<Object>} Opciones relacionadas.
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
 * Obtiene las compañías y proyectos donde el usuario NO trabaja.
 *
 * Endpoint: GET /options/notRelatedOptions?user_id=...
 *
 * @param {number|string} user_id - ID del usuario.
 * @returns {Promise<Array>} Array de objetos con la propiedad "options".
 *
 * @throws Will throw an error if the request fails.
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
 * Obtiene los proyectos NO relacionados con las compañías en las que trabaja el usuario.
 *
 * Endpoint: GET /options/notRelatedOptions?user_id=...&relationship_id=...
 *
 * @param {number|string} user_id - ID del usuario.
 * @param {string} relationship_id - ID de la relación (company-user).
 * @returns {Promise<Array>} Array de objetos con la propiedad "options".
 * @throws Will throw an error if the request fails.
 */
export const getNotRelatedProjects = async (user_id, relationship_id) => {
    try {
        const { data } = await api.get("/options/notRelatedOptions", {
            params: { user_id, relationship_id },
        })
        return data
    } catch (error) {
        throw new Error(
            `Error obteniendo proyectos no relacionados para el usuario ${user_id} con relationship_id ${relationship_id}: ${error.message}`
        )
    }
}

/**
 * Creates a relationship between a company and a user.
 *
 * This function creates a new relationship between a company and a user.
 * It makes a POST request to the "/companyUser" endpoint with the
 * provided data and returns the result of the creation.
 *
 * @param {Object} relationData - Data for the relationship.
 *        { user_id: string, company_id: string }
 * @returns {Promise<Object>} The result of the creation.
 * @throws Will throw an error if the creation fails.
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
 * Creates a relationship between a project and a user.
 *
 * This function creates a new relationship between a project and a user.
 * It makes a POST request to the "/projectUser" endpoint with the
 * provided data and returns the result of the creation.
 *
 * @param {Object} relationData - Data for the relationship.
 * @param {string} relationData.user_id - The ID of the user.
 * @param {string} relationData.project_id - The ID of the project.
 * @param {string} relationData.relationship_id - The ID of the relationship.
 * @returns {Promise<Object>} The result of the creation.
 * @throws Will throw an error if the creation fails.
 */
export const addProjectUserRelation = async (relationData) => {
    try {
        // Make a POST request to create the project-user relationship
        const { data } = await api.post("/projectUser", relationData)
        return data // Return the resulting data
    } catch (error) {
        // Throw a new error with a message if the request fails
        throw new Error(
            `Error creating project-user relationship: ${error.message}`
        )
    }
}

/**
 * Elimina la relación entre compañía/proyecto y usuario.
 * @param {Array} ids - IDs de las relaciones a eliminar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export const deleteCompanyUserRelation = async (ids) => {
    try {
        const { data } = await api.delete("/companyUser", { data: { ids } })
        return data
    } catch (error) {
        throw new Error(
            `Error eliminando relación compañía-usuario: ${error.message}`
        )
    }
}
