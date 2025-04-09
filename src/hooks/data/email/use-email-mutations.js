// src/hooks/data/use-email-mutations.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { emailMutationKeys } from "../../../keys/mutations"
import { emailQueryKeys } from "../../../keys/queries"
import {
    getEmails,
    getEmail,
    postEmail,
    putEmail,
    deleteEmail,
} from "./emailServer.js"
import { useEmailStore } from "../../../store/modules/emailStore.js"

/**
 * Hook para obtener todos los emails.
 *
 * Este hook utiliza React Query para realizar una consulta GET a la API y obtener
 * la lista de emails. Además, sincroniza los datos obtenidos con el store de Zustand.
 *
 * @returns {Object} Objeto que contiene:
 *  - emails: Arreglo de emails obtenidos.
 *  - isLoading: Indicador del estado de carga.
 *  - error: Error en caso de que ocurra alguno durante la consulta.
 */
export const useGetEmails = () => {
    const { emails, setEmails } = useEmailStore()

    const { data, isLoading, error } = useQuery({
        queryKey: emailQueryKeys.getAll(),
        queryFn: async () => {
            const response = await getEmails()
            return response.data // Extrae solo el array de emails
        },
        onSuccess: (fetchedData) => {
            setEmails(fetchedData) // Guarda solo el array de emails en el store
        },
        refetchOnMount: true,
    })

    return { emails: data || emails, isLoading, error }
}

/**
 * Hook para obtener un email por su ID.
 *
 * Realiza una consulta GET a la API para obtener un email específico.
 *
 * @param {string|number} id - ID del email a obtener.
 * @returns {Object} Objeto que contiene:
 *  - email: El email obtenido.
 *  - isLoading: Indicador del estado de carga.
 *  - error: Error en caso de fallar la consulta.
 */
export const useGetEmail = (id) => {
    const { data, isLoading, error } = useQuery({
        queryKey: emailQueryKeys.getById(id),
        queryFn: async () => {
            return await getEmail(id)
        },
    })

    return { email: data, isLoading, error }
}

/**
 * Hook para gestionar las mutaciones de emails: agregar, editar y eliminar.
 *
 * Cada función de mutación realiza la llamada correspondiente a la API y,
 * en caso de éxito, actualiza tanto la caché de React Query como el store de Zustand.
 *
 * @returns {Object} Objeto que contiene las mutaciones:
 *  - add: Función para agregar un nuevo email.
 *  - edit: Función para editar un email existente.
 *  - remove: Función para eliminar un email.
 */
export const useEmailMutations = () => {
    const queryClient = useQueryClient()
    const { addEmail, updateEmail, removeEmail } = useEmailStore()

    const add = useMutation({
        mutationKey: emailMutationKeys.add(),
        mutationFn: async (newEmail) => {
            return await postEmail(newEmail)
        },
        onSuccess: (createdEmail) => {
            queryClient.invalidateQueries(emailQueryKeys.getAll())
            addEmail(createdEmail)
        },
    })

    const edit = useMutation({
        mutationKey: emailMutationKeys.edit(),
        mutationFn: async (emailToUpdate) => {
            return await putEmail(emailToUpdate.id, emailToUpdate)
        },
        onSuccess: (updatedEmail) => {
            queryClient.invalidateQueries(emailQueryKeys.getAll())
            updateEmail(updatedEmail)
        },
    })

    const remove = useMutation({
        mutationKey: emailMutationKeys.remove(),
        mutationFn: async (id) => {
            return await deleteEmail(id)
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries(emailQueryKeys.getAll())
            removeEmail(id)
        },
    })

    return { add, edit, remove }
}
