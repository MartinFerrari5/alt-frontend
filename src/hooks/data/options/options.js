import { api } from "../../../lib/axios"

/**
 * Obtiene las opciones para una tabla específica.
 * @param {string} table - Nombre de la tabla.
 * @returns {Promise<Object>} Datos de las opciones. El objeto contiene un arreglo
 * de opciones en la propiedad "options".
 */
export const getOptions = async (table) => {
    try {
        // Realiza una petición GET a la API para obtener las opciones para la
        // tabla especificada.
        const { data } = await api.get("/options", { params: { table } })

        // La respuesta debe contener un objeto con una propiedad "options" que sea
        // un arreglo de objetos, cada uno representando una opción.
        return data
    } catch (error) {
        // Si ocurre un error, se lanza un error con un mensaje que indica que hubo
        // un problema al obtener las opciones para la tabla especificada.
        throw new Error(
            `Error obteniendo opciones para la tabla ${table}: ${error.message}`
        )
    }
}

/**
 * Crea una nueva opción en una tabla.
 * @param {string} table - Nombre de la tabla donde se creará la opción.
 * @param {Object} option - Datos de la opción a crear. Debe contener el valor y
 * el texto de la opción.
 * @returns {Promise<Object>} La opción creada. El objeto contiene la propiedad
 * "option" con el valor y texto de la opción.
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
        // Realiza una petición PUT a la API para actualizar la opción
        // especificada.
        const { data } = await api.put("/options", {
            table,
            option: updatedData,
            options_id: id,
        })

        // La respuesta debe contener un objeto con la propiedad "option" que sea
        // la opción actualizada.
        return data.option
    } catch (error) {
        // Si ocurre un error, se lanza un error con un mensaje que indica que
        // hubo un problema al actualizar la opción.
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
 *
 * La respuesta contiene un objeto con la siguiente estructura:
 * {
 *     "options_id": number, // ID de la opción eliminada.
 *     "table": string, // Nombre de la tabla en la que se encuentra la opción.
 * }
 */
export const deleteOption = async (table, id) => {
    try {
        // Realiza una petición DELETE a la API para eliminar la opción
        // especificada.
        const { data } = await api.delete("/options", {
            data: { table, options_id: id },
        })

        // La respuesta debe contener un objeto con la propiedad "options_id" que
        // sea el ID de la opción eliminada.
        return data
    } catch (error) {
        // Si ocurre un error, se lanza un error con un mensaje que indica que
        // hubo un problema al eliminar la opción.
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
