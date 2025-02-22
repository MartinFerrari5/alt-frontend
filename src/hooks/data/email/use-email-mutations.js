// src/hooks/data/use-email-mutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { emailMutationKeys } from "../../../keys/mutations"
import { emailQueryKeys } from "../../../keys/queries"
import { api } from "../../../lib/axios"
import { useEmailStore } from "../../../store/emailStore"

export const useEmailMutations = () => {
    const queryClient = useQueryClient()
    const { addEmail, updateEmail, removeEmail } = useEmailStore()

    // Agregar email
    const add = useMutation({
        mutationKey: emailMutationKeys.add(),
        mutationFn: async (email) => {
            try {
                console.log("email a crear:", email)
                const data = await api.post("/emails", email)
                console.log("new email creado: ", data)
                return data
            } catch (error) {
                console.error(
                    "Error al crear el email:",
                    error.response?.data || error.message
                )
                throw error
            }
        },
        onSuccess: (createdEmail) => {
            queryClient.setQueryData(
                emailQueryKeys.getAll(),
                (oldEmails = []) => [...oldEmails, createdEmail]
            )
            addEmail(createdEmail)
        },
    })

    // Editar email (requiere agregar la ruta PUT en el backend)
    const edit = useMutation({
        mutationKey: emailMutationKeys.edit(),
        mutationFn: async (email) => {
            try {
                // Se asume que el endpoint para actualizar es /emails/:id
                const { data } = await api.put(`/emails/${email.id}`, email)
                return data
            } catch (error) {
                console.error(
                    "Error al editar el email:",
                    error.response?.data || error.message
                )
                throw error
            }
        },
        onSuccess: (updatedEmail) => {
            queryClient.setQueryData(
                emailQueryKeys.getAll(),
                (oldEmails = []) =>
                    oldEmails.map((email) =>
                        email.id === updatedEmail.id ? updatedEmail : email
                    )
            )
            updateEmail(updatedEmail)
        },
    })

    // Eliminar email
    const remove = useMutation({
        mutationKey: emailMutationKeys.remove(),
        mutationFn: async (id) => {
            try {
                const { data } = await api.delete(`/emails?email_id=${id}`)
                return data
            } catch (error) {
                console.error(
                    "Error al eliminar el email:",
                    error.response?.data || error.message
                )
                throw error
            }
        },
        onSuccess: (_, id) => {
            queryClient.setQueryData(
                emailQueryKeys.getAll(),
                (oldEmails = []) => oldEmails.filter((email) => email.id !== id)
            )
            removeEmail(id)
        },
    })

    return { add, edit, remove }
}
