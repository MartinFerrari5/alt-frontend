// src/hooks/data/use-add-options.js

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { optionMutationKeys } from "../../../keys/mutations" // Asegúrate de definir estas claves
import { optionQueryKeys } from "../../../keys/queries"
import { api } from "../../../lib/axios"

export const useAddOptions = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: optionMutationKeys.add(),
        mutationFn: async (option) => {
            try {
                const { data } = await api.post(`/options?table=${option}`)
                return data
            } catch (error) {
                console.error(
                    `Error al crear opción en ${option.table}`,
                    error.response?.data || error.message
                )
                throw error
            }
        },
        onSuccess: (createdOption) => {
            queryClient.setQueryData(
                optionQueryKeys.getAll(),
                (oldOptions = []) => [...oldOptions, createdOption]
            )
        },
    })
}
