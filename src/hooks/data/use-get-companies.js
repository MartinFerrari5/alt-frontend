// src/hooks/data/use-get-companies.js

import { useQuery } from "@tanstack/react-query"
import { api } from "../../lib/axios"

export const useGetCompanies = () => {
    return useQuery({
        queryKey: ["companies"],
        queryFn: async () => {
            try {
                const { data } = await api.get("/options/companies_table")
                // console.log("📌 Empresas obtenidas:", data)
                return data
            } catch (error) {
                console.error("❌ Error obteniendo las empresas:", error)
                throw new Error("Error al obtener las empresas.")
            }
        },
    })
}
