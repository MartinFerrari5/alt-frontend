// src/hooks/data/options/use-get-options.js
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../lib/axios"
import { useOptionsStore } from "../../../store/optionsStore"

export const useGetOptions = (endpoint, queryKey) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: [queryKey],
        queryFn: async () => {
            try {
                const { data } = await api.get(`/options/${endpoint}`)
                return data
            } catch (error) {
                console.error(
                    `❌ Error obteniendo los datos de ${queryKey}:`,
                    error
                )
                throw new Error(`Error al obtener los datos de ${queryKey}.`)
            }
        },
    })

    // Actualizamos el estado del store según el queryKey recibido
    const setStoreData = useOptionsStore((state) => {
        switch (queryKey) {
            case "companies":
                return state.setCompanies
            case "hourTypes":
                return state.setHourTypes
            case "projects":
                return state.setProjects
            default:
                return () => {}
        }
    })

    // Si se obtuvo data, se actualiza el store
    if (data) {
        setStoreData(data)
    }

    return { data, isLoading, isError, error }
}
