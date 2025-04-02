// src/hooks/data/use-get-users.js
import { useQuery } from "@tanstack/react-query"
import { api } from "../../lib/axios"
import useAuthStore from "../../store/modules/authStore"

/**
 * Claves de consulta para usuarios.
 */
export const userQueryKeys = {
    getAll: () => ["users", "getAll"],
    getById: (userId) => ["users", "getById", userId],
}

/**
 * Hook para obtener usuarios.
 * Si se proporciona un userId, retorna el usuario correspondiente;
 * de lo contrario, retorna la lista completa.
 * Solo usuarios con rol "admin" pueden acceder a esta información.
 *
 * @param {string|null} userId - ID del usuario a obtener (opcional).
 */
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
            const endpoint = userId ? `/users/${userId}` : "/users"
            try {
                const { data } = await api.get(endpoint)
                // Si se consulta un solo usuario, asumimos que está en data.user; de lo contrario, data es la lista
                return userId ? data.user : data
            } catch (error) {
                console.error("❌ Error obteniendo los datos:", error)
                throw new Error("Error al obtener la información del usuario.")
            }
        },
        // La consulta solo se ejecuta si el usuario es admin y, en caso de solicitar un solo usuario, se tenga un ID válido
        enabled: role === "admin" && (userId ? Boolean(userId) : true),
    })
}
