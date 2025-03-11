// /src\hooks\data\users\useUserHooks.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
    createUser,
    resetPassword,
    changePassword,
    updateUser,
    getUsers,
    getUserById,
    deleteUser,
} from "./usersAlt"
import useAuthStore from "../../../store/authStore"

/**
 * Claves de consulta para usuarios.
 */
export const userQueryKeys = {
    getAll: () => ["users", "getAll"],
    getById: (userId) => ["users", "getById", userId],
}

/**
 * Hook para obtener usuarios.
 * Si se proporciona un userId, retorna el usuario correspondiente;
 * de lo contrario, retorna la lista completa.
 * Solo usuarios con rol "admin" pueden acceder a esta información.
 *
 * @param {string|null} userId - ID del usuario a obtener (opcional).
 */
export const useGetUsers = (userId = null) => {
    const role = useAuthStore((state) => state.role)

    return useQuery({
        queryKey: userId ? userQueryKeys.getById(userId) : userQueryKeys.getAll(),
        queryFn: async () => {
            if (role !== "admin") {
                throw new Error(
                    "No tienes permisos para obtener la información del usuario."
                )
            }
            return userId ? await getUserById(userId) : await getUsers()
        },
        // La consulta se ejecuta solo si el usuario es admin y, en caso de solicitar un solo usuario, se tenga un ID válido
        enabled: role === "admin" && (userId ? Boolean(userId) : true),
    })
}

/**
 * Hook para crear un nuevo usuario.
 * @returns {Object} - Objeto con la función de mutación para crear usuario.
 */
export const useCreateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload) => {
            return await createUser(payload)
        },
        onSuccess: () => {
            // Invalida la consulta de usuarios para refrescar la lista
            queryClient.invalidateQueries(userQueryKeys.getAll())
        },
    })
}

/**
 * Hook para enviar correo de reseteo de contraseña.
 * @returns {Object} - Objeto con la función de mutación para resetear la contraseña.
 */
export const useResetPassword = () => {
    return useMutation({
        mutationFn: async (payload) => {
            return await resetPassword(payload)
        },
    })
}

/**
 * Hook para cambiar la contraseña del usuario.
 * @returns {Object} - Objeto con la función de mutación para cambiar la contraseña.
 */
export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (payload) => {
            return await changePassword(payload)
        },
    })
}

/**
 * Hook para actualizar los datos del usuario.
 * @param {string} user_id - ID del usuario a actualizar.
 * @returns {Object} - Objeto con la función de mutación para actualizar usuario.
 */
export const useUpdateUser = (user_id) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload) => {
            return await updateUser(user_id, payload)
        },
        onSuccess: () => {
            // Actualiza la lista global de usuarios y la caché del usuario específico
            queryClient.invalidateQueries(userQueryKeys.getAll())
            queryClient.invalidateQueries(userQueryKeys.getById(user_id))
        },
    })
}

/**
 * Hook para eliminar un usuario.
 * @param {string} userId - ID del usuario a eliminar.
 * @returns {Object} - Objeto con la función de mutación para eliminar usuario.
 */
export const useDeleteUser = (userId) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            return await deleteUser(userId)
        },
        onSuccess: () => {
            // Actualiza la lista de usuarios eliminando el usuario borrado
            queryClient.setQueryData(userQueryKeys.getAll(), (oldUsers) => {
                return oldUsers ? oldUsers.filter((user) => user.id !== userId) : []
            })
        },
        onError: (error) => {
            console.error("🔴 Error al eliminar el usuario:", error)
        },
    })
}
