// /src/hooks/data/options/optionsService.js
import { api } from "../../../lib/axios"

/**
 * Obtiene las opciones para una tabla específica.
 * @param {string} table - Nombre de la tabla.
 * @returns {Promise<Array>} Array con las opciones.
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
 * Obtiene los proyectos relacionados a una compañía utilizando su relationship_id.
 * @param {string} relationship_id - ID de la relación de la compañía.
 * @returns {Promise<Array>} Array con los proyectos.
 */
export const getCompanyProjects = async (relationship_id) => {
    try {
        const table = "projects_table"
        const { data } = await api.get("/options", {
            params: { table, relationship_id },
        })
        console.log(data)
        return data
    } catch (error) {
        throw new Error(
            `Error obteniendo proyectos para la compañía con relationship_id ${relationship_id}: ${error.message}`
        )
    }
}

/**
 * Crea una nueva opción en una tabla.
 * @param {string} table - Nombre de la tabla.
 * @param {Object} option - Objeto con la propiedad "option".
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
 * @param {string|number} id - ID de la opción.
 * @param {Object} updatedData - Objeto con los datos actualizados.
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
 * @param {string|number} id - ID de la opción.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export const deleteOption = async (table, id) => {
    try {
        const { data } = await api.delete(`/options?options_id=${id}`, {
            data: { table },
        })
        return data
    } catch (error) {
        throw new Error(
            `Error eliminando opción ${id} en ${table}: ${error.message}`
        )
    }
}
