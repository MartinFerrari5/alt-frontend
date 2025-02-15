// src/hooks/data/options/use-edit-options.js
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../lib/axios"
import { optionMutationKeys } from "../../../keys/mutations" // Import optionMutationKeys

export const useEditOptions = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: optionMutationKeys.update(), // Use the update key
        mutationFn: async ({ table, id, updatedData }) => {
            try {
                console.log("📌 Opción a actualizar:", updatedData)
                const { data } = await api.put(`/options?table=${id}`, updatedData)
                return data
            } catch (error) {
                console.error(
                    `Error al actualizar opción en ${table}`,
                    error.response?.data || error.message
                )
                throw error
            }
        },
        onSuccess: (updatedOption, { table }) => {
            queryClient.setQueryData([table], (oldData = []) =>
                oldData.map((item) =>
                    item.id === updatedOption.id ? updatedOption : item
                )
            )
        },
    })
}
