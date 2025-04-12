// /src/store/modules/userStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as usersApi from "./../../hooks/data/users/useUserHooks"

// --- Estado Global con Zustand ---
// Este store mantiene una versión persistente (por localStorage)
// de la lista de usuarios y del usuario seleccionado, para usos globales.
const useUserStore = create(
    persist(
        (set, get) => ({
            users: [],
            selectedUser: null,
            isLoading: false,
            error: null,

            // Métodos para actualizar el estado global
            setUsers: (users) => set({ users }),
            setSelectedUser: (user) => set({ selectedUser: user }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),
        }),
        {
            name: "user-storage", // Clave para persistir en localStorage
            getStorage: () => localStorage,
        }
    )
)

// --- Hooks basados en React Query ---
// Las claves de consulta utilizadas para invalidar y refecthear información
export const userQueryKeys = {
    getAll: () => ["users", "getAll"],
    getById: (userId) => ["users", "getById", userId],
}

/**
 * Hook para obtener usuarios.
 * Si se pasa un userId se obtiene ese usuario, de lo contrario, se obtiene la lista.
 */
export const useGetUsers = (userId = null) => {
    const userStore = useUserStore()
    return useQuery({
        queryKey: userId
            ? userQueryKeys.getById(userId)
            : userQueryKeys.getAll(),
        queryFn: async () => {
            if (userId) {
                const response = await usersApi.getUserById(userId)
                // Se espera que la respuesta devuelva un array en la propiedad user para un único usuario
                const user = response.user
                userStore.setSelectedUser(user)
                return user
            } else {
                const response = await usersApi.getUsers()
                const users = Array.isArray(response.user) ? response.user : []
                userStore.setUsers(users)
                return users
            }
        },
    })
}

/**
 * Hook para crear un nuevo usuario.
 */
export const useCreateUser = () => {
    const queryClient = useQueryClient()
    const userStore = useUserStore()

    return useMutation({
        mutationFn: async (payload) => await usersApi.createUser(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries(userQueryKeys.getAll())
            // Actualiza el store global agregando el nuevo usuario
            userStore.setUsers((prevUsers) => [...prevUsers, data.user])
        },
    })
}

/**
 * Hook para actualizar los datos de un usuario.
 */
export const useUpdateUser = (user_id) => {
    const queryClient = useQueryClient()
    const userStore = useUserStore()

    return useMutation({
        mutationFn: async (payload) =>
            await usersApi.updateUser(user_id, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries(userQueryKeys.getAll())
            queryClient.invalidateQueries(userQueryKeys.getById(user_id))
            // Sincroniza en el store global
            userStore.setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === user_id ? data.user : user
                )
            )
        },
    })
}

/**
 * Hook para actualizar el rol de un usuario.
 */
export const useUpdateUserRole = (user_id) => {
    const queryClient = useQueryClient()
    const userStore = useUserStore()

    return useMutation({
        mutationFn: async (payload) =>
            await usersApi.updateUserRole(user_id, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries(userQueryKeys.getAll())
            queryClient.invalidateQueries(userQueryKeys.getById(user_id))
            userStore.setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === user_id ? data.user : user
                )
            )
        },
    })
}

/**
 * Hook para eliminar un usuario.
 */
export const useDeleteUser = (userId) => {
    const queryClient = useQueryClient()
    const userStore = useUserStore()

    return useMutation({
        mutationFn: async () => await usersApi.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(userQueryKeys.getAll())
            userStore.setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== userId)
            )
        },
        onError: (error) => {
            console.error("Error al eliminar el usuario:", error)
        },
    })
}

/**
 * Hook para enviar correo de reseteo de contraseña.
 */
export const useResetPassword = () => {
    return useMutation({
        mutationFn: async (payload) => await usersApi.resetPassword(payload),
    })
}

/**
 * Hook para cambiar la contraseña.
 */
export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (payload) => await usersApi.changePassword(payload),
    })
}

// Además, exportamos el store por si alguna parte de la aplicación
// requiere acceder o manipular el estado global directamente.
export { useUserStore }
