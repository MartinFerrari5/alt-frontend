// src/api/options.js
import { api } from "../../../lib/axios"

/**
 * Obtiene las opciones según la tabla
 * @param {string} table - Nombre de la tabla (ej: companies, hourTypes, projects)
 */
export const getOptions = async (table) => {
    try {
        const { data } = await api.get(`/options?table=${table}`)
        return data
    } catch (error) {
        console.error(`Error obteniendo opciones de ${table}:`, error)
        throw error
    }
}

/**
 * Crea una nueva opción en la tabla indicada
 * @param {string} table - Nombre de la tabla
 * @param {object} option - Datos de la nueva opción
 */
export const addOption = async (table, option) => {
    try {
        // Se arma el payload que incluye table y option
        const payload = { table, option }
        const { data } = await api.post(`/options`, payload)
        return data.option
    } catch (error) {
        console.error(`Error creando opción en ${table}:`, error)
        throw error
    }
}

/**
 * Actualiza una opción existente
 * @param {string} table - Nombre de la tabla
 * @param {number|string} id - Identificador de la opción
 * @param {object} updatedData - Datos a actualizar
 */
export const updateOption = async (table, id, updatedData) => {
    try {
        const payload = { table, option: updatedData }
        const { data } = await api.put(`/options?options_id=${id}`, payload)
        console.log("🟢 Data:", data)
        return data
    } catch (error) {
        console.error(`Error actualizando opción en ${table}:`, error)
        throw error
    }
}

/**
 * Elimina una opción de la tabla
 * @param {string} table - Nombre de la tabla
 * @param {number|string} id - Identificador de la opción
 */
export const deleteOption = async (table, id) => {
    // Se arma el payload que incluye table y id
    try {
        const requestBody = { table }
        const { data } = await api.delete(`/options?options_id=${id}`, {
            data: requestBody,
        })
        return data
    } catch (error) {
        console.error(`Error eliminando opción en ${table}:`, error)
        throw error
    }
}
