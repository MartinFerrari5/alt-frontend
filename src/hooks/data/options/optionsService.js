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
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(
            `Error obteniendo opciones para la tabla ${table}: ${backendMsg}`
        )
    }
}

/**
 * Obtiene los proyectos relacionados a una compañía utilizando su relationship_id.
 * @param {string} relationship_id - ID de la relación de la compañía.
 * @returns {Promise<Array>} Array con los proyectos.
 */
export const getCompanyProjects = async (company_id) => {
    console.log("company_id: ", company_id)
    if (!company_id) {
        throw new Error(
            "El ID de la relación es obligatorio para obtener los proyectos."
        )
    }
    try {
        const table = "projects_table"
        const { data } = await api.get("/options", {
            params: { table, company_id },
        })
        return data.data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(
            `Error obteniendo proyectos para la compañía con company_id ${company_id}: ${backendMsg}`
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
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(
            `Error creando opción en ${table}. Verifica que los datos sean correctos: ${backendMsg}`
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
        return data
    } catch (error) {
        const backendMsg = error.response?.data?.message || error.message
        throw new Error(
            `Error actualizando opción ${id} en ${table}: ${backendMsg}`
        )
    }
}

/**
 * Elimina una opción de una tabla.
 * @param {string} table - Nombre de la tabla.
 * @param {string|number} id - ID de la opción.
 * @returns {Promise<Object>} Resultado de la eliminación.
 * @throws {Error} Si ocurre un error durante la eliminación.
 */
export const deleteOption = async (table, id) => {
    try {
        const { data } = await api.delete(`/options?options_id=${id}`, {
            data: { table },
        })
        return data
    } catch (error) {
        console.error("Error en deleteOption:", error.response || error.message)
        const backendMsg = error.response?.data?.message || error.message
        let userMessage = `Error eliminando opción ${id} en ${table}: ${backendMsg}`

        // Puedes agregar lógica adicional según el status para refinar el mensaje.
        if (error.response) {
            if (error.response.status === 404) {
                userMessage = "El elemento que intentas eliminar no existe."
            } else if (error.response.status === 500) {
                userMessage =
                    "Ocurrió un error en el servidor. Intenta nuevamente."
            }
        }

        throw new Error(userMessage)
    }
}
