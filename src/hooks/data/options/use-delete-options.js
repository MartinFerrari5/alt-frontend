// src/hooks/data/use-delete-options.js
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../lib/axios"

export const useDeleteOptions = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ table, element }) => {
            try {
                console.log("📌 Eliminando table:", table)
                console.log("📌 Eliminando elemento:", element)

                // Send the table name in the body if needed
                const requestBody = { table }

                // Make the DELETE request with the body
                await api.delete(`/options/${element}`, { data: requestBody })
            } catch (error) {
                console.error(
                    "❌ Error al eliminar la opción:",
                    error.response?.data || error.message
                )
                throw error
            }
        },
        onSuccess: (_, { table, element }) => {
            queryClient.setQueryData([table], (oldData = []) =>
                oldData.filter((item) => item.id !== element.id)
            )
        },
    })
}
