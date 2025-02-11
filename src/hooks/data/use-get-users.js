// src/hooks/data/use-get-users.js

import { useQuery } from "@tanstack/react-query"
import { api } from "../../lib/axios"
import useAuthStore from "../../store/authStore"

// Claves de consulta para react-query
const userQueryKeys = {
    getAll: () => ["users", "getAll"],
    getById: (userId) => ["users", "getById", userId],
}

export const useGetUsers = (userId = null) => {
    const role = useAuthStore((state) => state.role)

    return useQuery({
        queryKey: userId
            ? userQueryKeys.getById(userId)
            : userQueryKeys.getAll(),
        queryFn: async () => {
            if (role !== "admin") {
                throw new Error(
                    "No tienes permisos para obtener la información del usuario."
                )
            }
            try {
                const endpoint = userId ? `/users/${userId}` : "/users"
                const { data } = await api.get(endpoint)
                return userId ? data.user : data
            } catch (error) {
                console.error("❌ Error obteniendo los datos:", error)
                throw new Error("Error al obtener la información del usuario.")
            }
        },
        enabled: role === "admin" && (userId ? !!userId : true),
    })
}
