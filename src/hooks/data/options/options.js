import { api } from "../../../lib/axios"

/**
 * Obtiene las opciones para una tabla específica.
 * @param {string} table - Nombre de la tabla.
 * @returns {Promise<Object>} Datos de las opciones.
 */
export const getOptions = async (table) => {
    try {
        const { data } = await api.get("/options", { params: { table } })
        return data
    } catch (error) {
        throw new Error(
            `Error obteniendo opciones para la tabla ${table}: ${error.message}`
        )
    }
}

/**
 * Crea una nueva opción en una tabla.
 * @param {string} table - Nombre de la tabla.
 * @param {any} option - Opción a crear.
 * @returns {Promise<any>} La opción creada.
 */
export const addOption = async (table, option) => {
    try {
        const { data } = await api.post("/options", { table, option })
        return data.option
    } catch (error) {
        throw new Error(`Error creando opción en ${table}: ${error.message}`)
    }
}

/**
 * Actualiza una opción existente.
 * @param {string} table - Nombre de la tabla.
 * @param {number|string} id - ID de la opción.
 * @param {Object} updatedData - Datos actualizados.
 * @returns {Promise<any>} La opción actualizada.
 */
export const updateOption = async (table, id, updatedData) => {
    try {
        const { data } = await api.put("/options", {
            table,
            option: updatedData,
            options_id: id,
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
        const { data } = await api.delete("/options", {
            data: { table, options_id: id },
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
 * @param {number|string} user_id - ID del usuario.
 * @returns {Promise<Object>} Opciones relacionadas.
 */
export const getRelatedOptions = async (user_id) => {
    try {
        const { data } = await api.get("/options/relatedOptions", {
            params: { user_id },
        })
        return data
    } catch (error) {
        throw new Error(
            `Error obteniendo opciones relacionadas para el usuario ${user_id}: ${error.message}`
        )
    }
}

/**
 * Obtiene las opciones no relacionadas para un usuario.
 * @param {number|string} user_id - ID del usuario.
 * @returns {Promise<Object>} Opciones no relacionadas.
 */
export const getNotRelatedOptions = async (user_id) => {
    try {
        const { data } = await api.get("/options/notRelatedOptions", {
            params: { user_id },
        })
        return data
    } catch (error) {
        throw new Error(
            `Error obteniendo opciones no relacionadas para el usuario ${user_id}: ${error.message}`
        )
    }
}

/**
 * Crea la relación entre compañía/proyecto y usuario.
 * @param {Object} relationData - Datos de la relación.
 * @returns {Promise<Object>} Resultado de la creación.
 */
export const addCompanyUserRelation = async (relationData) => {
    console.log("addCompanyUserRelation ->", relationData)
    try {
        const { data } = await api.post("/companyUser", relationData)
        console.log("addCompanyUserRelation ->", data)
        return data
    } catch (error) {
        throw new Error(
            `Error creando relación compañía-usuario: ${error.message}`
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
