// src/hooks/data/use-get-companies.js

import { useQuery } from "@tanstack/react-query"
import { api } from "../../lib/axios"

export const useGetProjects = () => {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            try {
                const { data } = await api.get("/options/projects_table")
                // console.log("📌 Empresas obtenidas:", data)
                return data
            } catch (error) {
                console.error("❌ Error obteniendo los proyectos:", error)
                throw new Error("Error al obtener los proyetos.")
            }
        },
    })
}
