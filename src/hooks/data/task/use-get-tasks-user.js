// src/hooks/data/use-get-tasks.js

import { useQuery } from "@tanstack/react-query"
import { taskQueryKeys } from "../../../keys/queries"
import { api } from "../../../lib/axios"

// Función para decodificar el token JWT y extraer el payload
const decodeToken = (token) => {
    try {
        const payload = token.split(".")[1] // Extraer la segunda parte (payload)
        return JSON.parse(atob(payload)) // Decodificar de Base64 a JSON
    } catch (error) {
        console.error("Error al decodificar el token:", error)
        return null
    }
}

export const useGetTasks = () => {
    const storedTokens = localStorage.getItem("authTokens")
    const authTokens = storedTokens ? JSON.parse(storedTokens) : null

    const decodedToken = authTokens?.accessToken
        ? decodeToken(authTokens.accessToken)
        : null
    const userId = decodedToken?.userId || decodedToken?.userID

    return useQuery({
        queryKey: taskQueryKeys.getAll(),
        queryFn: async () => {
            if (!userId) {
                throw new Error("No se encontró el ID del usuario.")
            }
            try {
                const { data } = await api.get(`/tasks/user/${userId}`)
                console.log("📌 Tareas obtenidas:", data.tasks)
                return data.tasks
            } catch (error) {
                console.error("❌ Error obteniendo las tareas:", error)
                throw new Error("Error al obtener las tareas.")
            }
        },
        enabled: !!userId,
    })
}
