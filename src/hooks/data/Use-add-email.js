// // src/hooks/data/use-add-email.js

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { emailMutationKeys } from "../../keys/mutations"
import { emailQueryKeys } from "../../keys/queries"
import { api } from "../../lib/axios"

export const useAddEmail = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: emailMutationKeys.add(),
        mutationFn: async (email) => {
            try {
                const { data } = await api.post("/emails", email)
                return data
            } catch (error) {
                console.error(
                    "Error al crear el email:",
                    error.response?.data || error.message
                )
                throw error
            }
        },
        onSuccess: (createdEmail) => {
            queryClient.setQueryData(
                emailQueryKeys.getAll(),
                (oldEmails = []) => [...oldEmails, createdEmail]
            )
        },
    })
}
