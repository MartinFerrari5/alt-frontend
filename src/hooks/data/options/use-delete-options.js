// src/hooks/data/use-delete-options.js

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../lib/axios"

export const useDeleteOptions = (id, option) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            try {
                console.log("📌 Eliminando opción con ID:", option)
                await api.delete(`/options/${id}`, option)
            } catch (error) {
                console.error(
                    "❌ Error al eliminar la opción:",
                    error.response?.data || error.message
                )
                throw error
            }
        },
        onSuccess: (_, id) => {
            queryClient.setQueryData(["options"], (oldOptions = []) =>
                oldOptions.filter((option) => option.id !== id)
            )
        },
    })
}
