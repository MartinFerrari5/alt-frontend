// src/hooks/data/options/options.js
import { api } from "../../../lib/axios"

/**
 * Ejecuta una petición y maneja errores de forma genérica.
 * @param {Function} requestFn - Función asíncrona que realiza la petición.
 * @param {string} errorMsg - Mensaje de error personalizado.
 * @returns {Promise<any>} Resultado de la petición.
 */
const handleRequest = async (requestFn, errorMsg) => {
  try {
    return await requestFn()
  } catch (error) {
    console.error(errorMsg, error)
    throw error
  }
}

/**
 * Obtiene las opciones según la tabla.
 * @param {string} table - Nombre de la tabla (ej: companies, hourTypes, projects)
 */
export const getOptions = (table) =>
  handleRequest(
    () => api.get(`/options?table=${table}`).then(({ data }) => data),
    `Error obteniendo opciones de ${table}:`
  )

/**
 * Crea una nueva opción en la tabla indicada.
 * @param {string} table - Nombre de la tabla.
 * @param {object} option - Datos de la nueva opción.
 */
export const addOption = (table, option) =>
  handleRequest(
    () =>
      api.post(`/options`, { table, option }).then(({ data }) => data.option),
    `Error creando opción en ${table}:`
  )

/**
 * Actualiza una opción existente.
 * @param {string} table - Nombre de la tabla.
 * @param {number|string} id - Identificador de la opción.
 * @param {object} updatedData - Datos a actualizar.
 */
export const updateOption = (table, id, updatedData) =>
  handleRequest(
    () =>
      api
        .put(`/options?options_id=${id}`, { table, option: updatedData })
        .then(({ data }) => data.option),
    `Error actualizando opción en ${table}:`
  )

/**
 * Elimina una opción de la tabla.
 * @param {string} table - Nombre de la tabla.
 * @param {number|string} id - Identificador de la opción.
 */
export const deleteOption = (table, id) =>
  handleRequest(
    () =>
      api
        .delete(`/options?options_id=${id}`, { data: { table } })
        .then(({ data }) => data),
    `Error eliminando opción en ${table}:`
  )

/**
 * Obtiene las opciones relacionadas para un usuario.
 * @param {number|string} user_id - Identificador del usuario.
 */
export const getRelatedOptions = (user_id) =>
  handleRequest(
    () =>
      api.get(`/options/related?user_id=${user_id}`).then(({ data }) => data),
    `Error obteniendo opciones relacionadas para usuario ${user_id}:`
  )

/**
 * Obtiene las opciones no relacionadas para un usuario.
 * @param {number|string} user_id - Identificador del usuario.
 */
export const getNotRelatedOptions = (user_id) =>
  handleRequest(
    () =>
      api.get(`/options/not-related?user_id=${user_id}`).then(({ data }) => data),
    `Error obteniendo opciones no relacionadas para usuario ${user_id}:`
  )

/**
 * Crea la relación entre compañía, usuario y proyecto.
 * @param {object} relationData - Datos de la relación.
 */
export const addCompanyUserRelation = (relationData) =>
  handleRequest(
    () =>
      api
        .post(`/options/company-user-relation`, relationData)
        .then(({ data }) => data),
    "Error creando relación de compañía-usuario:"
  )

/**
 * Elimina relación(es) entre compañía, usuario y proyecto.
 * @param {object|array} ids - Identificador(es) de la relación a eliminar.
 */
export const deleteCompanyUserRelation = (ids) =>
  handleRequest(
    () =>
      api
        .delete(`/options/company-user-relation`, { data: ids })
        .then(({ data }) => data),
    "Error eliminando relación de compañía-usuario:"
  )
