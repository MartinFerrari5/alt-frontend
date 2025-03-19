import { api } from "../../../lib/axios"

/**
 * Crea una relación entre usuario, compañía y proyecto.
 * Ruta: POST /companyUser.
 * @param {Object} relationData - Datos de la relación.
 * @returns {Promise<Object>} Resultado de la creación.
 */
export const createCompanyUserRelation = async (relationData) => {
  const { data } = await api.post(`/companyUser`, relationData)
  return data
}

/**
 * Elimina relación(es) entre compañía, usuario y proyecto.
 * Ruta: DELETE /companyUser.
 * @param {Array} ids - IDs de las relaciones a eliminar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export const deleteCompanyUserRelation = async (ids) => {
  const { data } = await api.delete(`/companyUser`, { data: { ids } })
  return data
}
