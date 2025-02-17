// src/hooks/data/use-delete-user.js
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { userMutationKeys } from "../../keys/mutations"
import { userQueryKeys } from "../../keys/queries"
import { api } from "../../lib/axios"

/**
 * Hook para eliminar un usuario.
 * @param {string} userId - ID del usuario a eliminar.
 */
export const useDeleteUser = (userId) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: userMutationKeys.delete(userId),
        mutationFn: async () => {
            const { data: deletedUser } = await api.delete(`/users/${userId}`)
            return deletedUser
        },
        onSuccess: () => {
            // Actualizamos la lista de usuarios eliminando el usuario borrado
            queryClient.setQueryData(userQueryKeys.getAll(), (oldUsers) => {
                return oldUsers
                    ? oldUsers.filter((user) => user.id !== userId)
                    : []
            })
        },
        onError: (error) => {
            console.error("🔴 Error al eliminar el usuario:", error)
        },
    })
}
