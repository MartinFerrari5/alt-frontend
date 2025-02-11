// src/hooks/data/use-update-user.js
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { userMutationKeys } from "../../keys/mutations"
import { userQueryKeys } from "../../keys/queries"
import { api } from "../../lib/axios"

export const useUpdateUser = (userId) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: userMutationKeys.update(userId),
        mutationFn: async (data) => {
            const { data: updatedUser } = await api.put(`/users/${userId}`, {
                full_name: data?.full_name?.trim(),
                email: data?.email?.trim(),
                role: data?.role,
            })
            return updatedUser
        },
        retry: 2,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(userQueryKeys.getAll(), (oldUsers) => {
                return oldUsers
                    ? oldUsers.map((user) =>
                          user.id === userId ? updatedUser : user
                      )
                    : []
            })

            queryClient.setQueryData(userQueryKeys.getOne(userId), updatedUser)
        },
        onError: (error) => {
            console.error("🔴 Error al actualizar usuario:", error)
        },
    })
}
