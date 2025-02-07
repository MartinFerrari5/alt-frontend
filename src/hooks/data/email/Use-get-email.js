// // src/hooks/data/use-add-email.js

import { useQuery } from "@tanstack/react-query"
import { api } from "../../../lib/axios"

export const useGetEmail = () => {
    return useQuery({
        queryKey: ["emails"],
        queryFn: async () => {
            try {
                const { data } = await api.get("/emails")
                console.log("📌 Emails obtenidas:", data)
                return data
            } catch (error) {
                console.error("❌ Error obteniendo los Emails:", error)
                throw new Error("Error al obtener los Emails.")
            }
        },
    })
}
