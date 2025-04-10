// /src/hooks/data/users/useUserHooks.js

import { api } from "../../../lib/axios"

/**
 * Crea un nuevo usuario.
 */
export const createUser = async (payload) => {
    try {
        const { data } = await api.post("/users", payload)
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
 */
export const resetPassword = async (payload) => {
    try {
        const { data } = await api.post("/users/newpassword", payload)
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
 */
export const changePassword = async (payload) => {
    try {
        const { data } = await api.post("/users/changepassword", payload)
        return data
    } catch (error) {
        console.error("Error al cambiar contraseña:", error)
        throw new Error(
            error.response?.data?.message || "Error al cambiar la contraseña"
        )
    }
}

/**
 * Actualiza los datos del usuario.
 */
export const updateUser = async (user_id, payload) => {
    try {
        const { data } = await api.put(`/users?user_id=${user_id}`, payload)
        return data
    } catch (error) {
        console.error("Error al actualizar usuario:", error)
        throw new Error(
            error.response?.data?.message || "Error al actualizar el usuario"
        )
    }
}

/**
 * Actualiza el rol del usuario.
 */
export const updateUserRole = async (user_id, payload) => {
    try {
        const { data } = await api.put(`/users?user_id=${user_id}`, payload)
        return data
    } catch (error) {
        console.error("Error al actualizar rol del usuario:", error)
        throw new Error(
            error.response?.data?.message ||
                "Error al actualizar el rol del usuario"
        )
    }
}

/**
 * Obtiene todos los usuarios.
 */
export const getUsers = async () => {
    try {
        const { data } = await api.get("/users")
        return data
    } catch (error) {
        console.error("Error al obtener usuarios:", error)
        throw new Error(
            error.response?.data?.message || "Error al obtener usuarios"
        )
    }
}

/**
 * Obtiene un usuario por su ID.
 */
export const getUserById = async (userId) => {
    try {
        const { data } = await api.get(`/users/user?user_id=${userId}`)
        return data
    } catch (error) {
        console.error("Error al obtener el usuario:", error)
        throw new Error(
            error.response?.data?.message || "Error al obtener el usuario"
        )
    }
}

/**
 * Elimina un usuario por su ID.
 */
export const deleteUser = async (userId) => {
    try {
        const { data } = await api.delete(`/users/${userId}`)
        return data
    } catch (error) {
        console.error("Error al eliminar usuario:", error)
        throw new Error(
            error.response?.data?.message || "Error al eliminar el usuario"
        )
    }
}
