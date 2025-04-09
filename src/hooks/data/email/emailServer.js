// /src/hooks/data/email/emailServer.js

import { api } from "../../../lib/axios"

/**
 * Obtiene todos los emails.
 */
export const getEmails = async () => {
    const { data } = await api.get("/emails")
    console.log("getEmails", data)

    return data
}

/**
 * Obtiene un email por su ID.
 * @param {string|number} id - ID del email.
 */
export const getEmail = async (id) => {
    const { data } = await api.get(`/emails/${id}`)
    return data
}

/**
 * Crea un nuevo email.
 * @param {Object} payload - Datos del nuevo email.
 */
export const postEmail = async (payload) => {
    const { data } = await api.post("/emails", payload)
    return data
}

/**
 * Actualiza un email existente.
 * @param {string|number} id - ID del email.
 * @param {Object} updatedData - Datos actualizados del email.
 */
export const putEmail = async (id, updatedData) => {
    const { data } = await api.put(`/emails?email_id=${id}`, updatedData)
    return data
}

/**
 * Elimina un email.
 * @param {string|number} id - ID del email a eliminar.
 */
export const deleteEmail = async (id) => {
    const { data } = await api.delete(`/emails?email_id=${id}`)
    return data
}
