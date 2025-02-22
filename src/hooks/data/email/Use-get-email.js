//  src/hooks/data/use-add-email.js

import { useQuery } from "@tanstack/react-query"
import { emailQueryKeys } from "../../../keys/queries"
import { api } from "../../../lib/axios"
import { useEmailStore } from "../../../store/emailStore"

export const useGetEmails = () => {
    // Obtenemos el estado actual y la función para actualizarlo desde Zustand
    const { emails, setEmails } = useEmailStore()

    const { data, isLoading, error } = useQuery({
        queryKey: emailQueryKeys.getAll(),
        queryFn: async () => {
            const response = await api.get("/emails")
            console.log("data", response.data)
            return response.data
        },
        onSuccess: (fetchedData) => {
            setEmails(fetchedData)
        },
        // Fuerza la revalidación al montar (opcional, para depurar)
        refetchOnMount: true,
    })

    // Si ya se obtuvo data por la query, se utiliza; de lo contrario, se utiliza el estado del store
    return { emails: data || emails, isLoading, error }
}
