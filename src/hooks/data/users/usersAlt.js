import { api } from "../../../lib/axios"


/**
 * Crea un nuevo usuario.
 * @param {Object} payload - Datos del nuevo usuario.
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del usuario creado.
 * @throws {Error} - Si ocurre un error al crear el usuario.
 *
 * Errores:
 *  1. Email ya registrado en la tabla de _emails_ válidos.
 *  2. Falta de relleno de campos.
 *  3. Formato incorrecto de los campos (por ejemplo, contraseña sin mayúsculas).
 */
export const createUser = async (payload) => {
    try {
        const { data } = await api.post("/users", payload)
        console.log("Usuario creado:", data)
        return data
    } catch (error) {
        console.error("Error al crear usuario:", error)
        throw new Error(
            error.response?.data?.message || "Error al crear el usuario"
        )
    }
}

/**
 * Envía correo para resetear la contraseña.
 * @param {Object} payload - Datos que incluyen el email del usuario.
 * @returns {Promise<Object>} - Promesa que resuelve con la respuesta del servidor.
 * @throws {Error} - Si ocurre un error al enviar el correo.
 *
 * Errores:
 *  1. Email NO registrado en la tabla de _alt_users_.
 *  2. Falta de relleno de campos.
 */
export const resetPassword = async (payload) => {
    try {
        const { data } = await api.post("/users/newpassword", payload)
        console.log("Correo de reseteo enviado:", data)
        return data
    } catch (error) {
        console.error("Error al enviar correo de reseteo:", error)
        throw new Error(
            error.response?.data?.message ||
                "Error al enviar el correo para resetear la contraseña"
        )
    }
}

/**
 * Cambia la contraseña del usuario.
 * @param {Object} payload - Datos que incluyen email, old_password y new_password.
 * @returns {Promise<Object>} - Promesa que resuelve con la respuesta del servidor.
 * @throws {Error} - Si ocurre un error al cambiar la contraseña.
 *
 * Errores:
 *  1. Email NO registrado en la tabla de _alt_users_.
 *  2. Falta de relleno de campos.
 *  3. La contraseña vieja no coincide.
 *  4. La nueva contraseña no cumple con los parámetros requeridos (mayúsculas, minúsculas, etc).
 */
export const changePassword = async (payload) => {
    try {
        const { data } = await api.post("/users/changepassword", payload)
        console.log("Contraseña cambiada:", data)
        return data
    } catch (error) {
        console.error("Error al cambiar contraseña:", error)
        throw new Error(
            error.response?.data?.message || "Error al cambiar la contraseña"
        )
    }
}

/**
 * Actualiza los datos del usuario (nombre completo y/o email).
 * @param {string} user_id - ID del usuario a actualizar.
 * @param {Object} payload - Datos a actualizar.
 * @returns {Promise<Object>} - Promesa que resuelve con la respuesta del servidor.
 * @throws {Error} - Si ocurre un error al actualizar el usuario.
 *
 * Errores:
 *  1. Email NO registrado en la tabla de _emails_.
 *  2. El email ya existe en la tabla _alt_users_.
 */
export const updateUser = async (user_id, payload) => {
    try {
        const { data } = await api.put(`/users/user?user_id=${user_id}`, payload)
        console.log("Usuario actualizado:", data)
        return data
    } catch (error) {
        console.error("Error al actualizar usuario:", error)
        throw new Error(
            error.response?.data?.message || "Error al actualizar el usuario"
        )
    }
}

/**
 * Obtiene todos los usuarios.
 * @returns {Promise<Array>} - Promesa que resuelve con la lista de usuarios.
 * @throws {Error} - Si ocurre un error al obtener los usuarios.
 */
export const getUsers = async () => {
    try {
        const { data } = await api.get("/users")
        console.log("Usuarios obtenidos:", data)
        // Se asume que la respuesta retorna un arreglo en data.users o directamente data
        return data.users || data
    } catch (error) {
        console.error("Error al obtener usuarios:", error)
        throw new Error(
            error.response?.data?.message || "Error al obtener usuarios"
        )
    }
}

/**
 * Obtiene un usuario por su ID.
 * @param {string} userId - ID del usuario.
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario encontrado.
 * @throws {Error} - Si ocurre un error al obtener el usuario.
 */
export const getUserById = async (userId) => {
    try {
        const { data } = await api.get(`/users/user?user_id=${userId}`)
        console.log("Usuario obtenido: ", data)
        return data.user || data
    } catch (error) {
        console.error("Error al obtener el usuario:", error)
        throw new Error(
            error.response?.data?.message || "Error al obtener el usuario"
        )
    }
}

/**
 * Elimina un usuario por su ID.
 * @param {string} userId - ID del usuario a eliminar.
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario eliminado.
 * @throws {Error} - Si ocurre un error al eliminar el usuario.
 */
export const deleteUser = async (userId) => {
    try {
        const { data } = await api.delete(`/users/${userId}`)
        console.log("Usuario eliminado:", data)
        return data
    } catch (error) {
        console.error("Error al eliminar usuario:", error)
        throw new Error(
            error.response?.data?.message || "Error al eliminar el usuario"
        )
    }
}
