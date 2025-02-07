// /src/hooks/data/use-get-typeHour.js

import { useQuery } from "@tanstack/react-query"
import { api } from "../../lib/axios"

export const useGetHourTypes = () => {
    return useQuery({
        queryKey: ["hour_types"],
        queryFn: async () => {
            try {
                const { data } = await api.get("/options/hour_type_table")
                // console.log("📌 Tipos de horas obtenidos:", data);
                return data
            } catch (error) {
                console.error("❌ Error obteniendo los tipos de horas:", error)
                throw new Error("Error al obtener los tipos de horas.")
            }
        },
    })
}
