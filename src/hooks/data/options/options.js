import { api } from "../../../lib/axios"

/**
 * Obtiene las opciones para una tabla específica.
 * @param {string} table - Nombre de la tabla.
 * @returns {Promise<Object>} Datos de las opciones.
 */
export const getOptions = async (table) => {
    const { data } = await api.get(`/options?table=${table}`)
    return data
}

/**
 * Crea una nueva opción en una tabla.
 * @param {string} table - Nombre de la tabla.
 * @param {any} option - Opción a crear.
 * @returns {Promise<any>} La opción creada.
 */
export const addOption = async (table, option) => {
    const { data } = await api.post("/options", { table, option })
    return data.option
}

/**
 * Actualiza una opción existente.
 * @param {string} table - Nombre de la tabla.
 * @param {number|string} id - ID de la opción.
 * @param {Object} updatedData - Datos actualizados.
 * @returns {Promise<any>} La opción actualizada.
 */
export const updateOption = async (table, id, updatedData) => {
    const { data } = await api.put(`/options?options_id=${id}`, {
        table,
        option: updatedData,
    })
    return data.option
}

/**
 * Elimina una opción de una tabla.
 * @param {string} table - Nombre de la tabla.
 * @param {number|string} id - ID de la opción.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export const deleteOption = async (table, id) => {
    const { data } = await api.delete(`/options?options_id=${id}`, {
        data: { table },
    })
    return data
}

/**
 * Obtiene las opciones relacionadas para un usuario.
 * @param {number|string} user_id - ID del usuario.
 * @returns {Promise<Object>} Opciones relacionadas.
 */
export const getRelatedOptions = async (user_id) => {
    const { data } = await api.get(`/options/relatedOptions`, {
        params: { user_id },
    })
    return data
}

/**
 * Obtiene las opciones no relacionadas para un usuario.
 * @param {number|string} user_id - ID del usuario.
 * @returns {Promise<Object>} Opciones no relacionadas.
 */
export const getNotRelatedOptions = async (user_id) => {
    const { data } = await api.get(`/options/notRelatedOptions`, {
        params: { user_id },
    })
    return data
}

/**
 * Crea la relación entre compañía y usuario.
 * @param {Object} relationData - Datos de la relación.
 * @returns {Promise<Object>} Resultado de la creación.
 */
export const addCompanyUserRelation = async (relationData) => {
    const { data } = await api.post(`/companyUser`, relationData)
    return data
}

/**
 * Elimina la relación entre compañía y usuario.
 * @param {Array} ids - IDs de las relaciones a eliminar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export const deleteCompanyUserRelation = async (ids) => {
    const { data } = await api.delete(`/companyUser`, { data: { ids } })
    return data
}
