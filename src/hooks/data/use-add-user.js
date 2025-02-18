// /src/hooks/data/use-add-user.js

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../lib/axios"
import useAuthStore from "../../store/authStore"

export const useAddUser = () => {
    const queryClient = useQueryClient()
    const token = useAuthStore((state) => state.token)

    return useMutation({
        mutationFn: async (newTask) => {
            try {
                const { data } = await api.post("/users", newTask, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                return data
            } catch (error) {
                console.error("❌ Error al agregar la tarea:", error)
                throw new Error("Error al agregar la tarea")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users", "getAll"])
        },
    })
}
