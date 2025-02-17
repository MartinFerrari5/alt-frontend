// src/hooks/data/options/use-delete-options.js
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../lib/axios"
import { useOptionsStore } from "../../../store/optionsStore"

export const useDeleteOptions = () => {
    const queryClient = useQueryClient()
    const { setCompanies, setHourTypes, setProjects } = useOptionsStore()

    // Mapeo para normalizar el nombre de la tabla
    const tableMapping = {
        companies_table: "companies",
        hour_type_table: "hourTypes",
        projects_table: "projects",
    }

    // Función que realiza la petición DELETE
    const deleteOption = async ({ table, id }) => {
        const requestBody = { table }
        await api.delete(`/options?table=${id}`, { data: requestBody })
    }

    return useMutation({
        mutationFn: deleteOption,

        onSuccess: (_, { table, id }) => {
            // Normalizamos el nombre de la tabla para actualizar React Query y Zustand
            const normalizedKey = tableMapping[table] || table

            // Actualiza la caché de React Query usando la clave normalizada
            queryClient.setQueryData([normalizedKey], (oldData = []) =>
                oldData.filter((item) => item.id !== id)
            )

            // Actualiza el store de Zustand según la clave normalizada
            switch (normalizedKey) {
                case "companies":
                    setCompanies((oldCompanies) =>
                        oldCompanies.filter((item) => item.id !== id)
                    )
                    break
                case "hourTypes":
                    setHourTypes((oldHourTypes) =>
                        oldHourTypes.filter((item) => item.id !== id)
                    )
                    break
                case "projects":
                    setProjects((oldProjects) =>
                        oldProjects.filter((item) => item.id !== id)
                    )
                    break
                default:
                    console.warn(
                        `Tabla "${table}" no reconocida para actualizar el store.`
                    )
                    break
            }
        },

        onError: (error) => {
            console.error(
                "❌ Error al eliminar la opción:",
                error.response?.data || error.message
            )
        },
    })
}
