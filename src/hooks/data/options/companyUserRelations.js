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
        // Manejo de errores más detallado
        if (error.response) {
            // La solicitud se realizó y el servidor respondió con un código de estado que no está en el rango de 2xx
            console.error(
                `${errorMsg} Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`
            )
        } else if (error.request) {
            // La solicitud se realizó pero no se recibió respuesta
            console.error(`${errorMsg} No response received: ${error.request}`)
        } else {
            // Algo sucedió al configurar la solicitud que lanzó un error
            console.error(`${errorMsg} Error: ${error.message}`)
        }
        throw error // Re-lanzar el error para que pueda ser manejado en otro lugar si es necesario
    }
}

/**
 * Crea una relación entre usuario, compañía y proyecto.
 * Ruta: POST reportes/companyUser
 */
export const createCompanyUserRelation = (relationData) =>
    handleRequest(
        () => api.post(`/companyUser`, relationData).then(({ data }) => data),
        "Error creando relación de compañía-usuario:"
    )

/**
 * Elimina relación(es) entre compañía, usuario y proyecto.
 * Ruta: DELETE reportes/companyUser
 */
export const deleteCompanyUserRelation = (ids) =>
    handleRequest(
        () =>
            api
                .delete(`/companyUser`, { data: { ids } })
                .then(({ data }) => data),
        "Error eliminando relación de compañía-usuario:"
    )
