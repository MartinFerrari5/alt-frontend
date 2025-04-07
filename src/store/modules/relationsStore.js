// /src/store/modules/relationsStore.js
import { create } from "zustand"
import {
    addCompanyUserRelation,
    addProjectUserRelation,
    deleteCompanyUserRelation,
    deleteProjectUserRelation,
    getNotRelatedCompanies,
    getNotRelatedProjects,
    getRelatedOptions,
    getCompanyProjects,
    addCompanyProjectRelation,
    deleteCompanyProjectRelation,
} from "../../hooks/data/options/relationsService"

const initialState = {
    // Relaciones de compañías
    relatedCompanies: [],
    notRelatedCompanies: [],
    // Relaciones de proyectos (proyecto-usuario)
    relatedProjects: [],
    notRelatedProjects: [],
    // Relaciones de compañía-proyecto
    companyProjects: [],
    // Estado de error y carga global
    error: null,
    isLoading: false,
}

export const useRelationsStore = create((set, get) => ({
    ...initialState,

    setError: (error) => set({ error }),
    setLoading: (loading) => set({ isLoading: loading }),

    /**
     * Actualiza las relaciones de compañías y, opcionalmente, las de proyectos
     * asociados al usuario y la compañía seleccionada.
     * @param {string|number} user_id - ID del usuario.
     * @param {string|number} [selectedCompanyId] - ID de la compañía seleccionada.
     *
     * Si se proporciona un selectedCompanyId, se actualizan las relaciones de
     * proyectos asociadas a la compañía seleccionada.
     */
    updateRelations: async (user_id, selectedCompanyId = null) => {
        set({ isLoading: true, error: null })
        try {
            // Actualizar relaciones de compañías
            const relatedCompanies = await getRelatedOptions({
                user_id,
                related_table: "company_users_table",
                individual_table: "companies_table",
            })
            const notRelatedCompanies = await getNotRelatedCompanies(user_id)

            set({
                relatedCompanies,
                notRelatedCompanies,
            })

            // Si se proporciona un selectedCompanyId, actualizar relaciones de proyectos
            if (selectedCompanyId) {
                // Actualizar relaciones de proyectos asociadas a la compañía seleccionada
                const relatedProjects = await getRelatedOptions({
                    user_id,
                    related_table: "project_user_table",
                    individual_table: "project_company_table",
                    company_id: selectedCompanyId,
                })
                const notRelatedProjects =
                    await getNotRelatedProjects(selectedCompanyId)
                set({
                    relatedProjects,
                    notRelatedProjects,
                })
            } else {
                // Si no se proporciona un selectedCompanyId, limpiar relaciones de proyectos
                set({
                    relatedProjects: [],
                    notRelatedProjects: [],
                })
            }
        } catch (error) {
            console.error(
                `Error actualizando relaciones para el usuario ${user_id}:`,
                error
            )
            set({ error: error.message })
        } finally {
            set({ isLoading: false })
        }
    },

    /**
     * Actualiza las relaciones de compañía-proyecto.
     * @param {string|number} company_id - ID de la compañía.
     * @returns {Promise<void>}
     */
    updateCompanyProjects: async (company_id) => {
        set({ isLoading: true, error: null })
        try {
            // Actualiza las relaciones de proyectos asociadas a la
            // compañía seleccionada
            const companyProjects = await getCompanyProjects(company_id)
            // Asigna el resultado a la propiedad companyProjects del state
            set({ companyProjects })
        } catch (error) {
            console.error(
                `Error actualizando proyectos de la compañía ${company_id}:`,
                error
            )
            // Asigna el mensaje de error a la propiedad error del state
            set({ error: error.message })
        } finally {
            // Desactiva el estado de carga
            set({ isLoading: false })
        }
    },

    /**
     * Adds a company-user relationship and updates the user's relations.
     * @param {Object} relationData - Data for the relationship { user_id, company_id }.
     * @param {string|number} user_id - ID of the user.
     * @returns {Promise<void>}
     */
    addCompanyUserRelation: async (relationData, user_id) => {
        // Set loading state and clear previous errors
        set({ isLoading: true, error: null })
        try {
            // Call the service to add a company-user relation
            await addCompanyUserRelation(relationData)
            // Update relations for the user
            await get().updateRelations(user_id)
        } catch (error) {
            // Log the error and set the error state
            console.error("Error in addCompanyUserRelation:", error)
            set({ error: error.message })
        } finally {
            // Reset the loading state
            set({ isLoading: false })
        }
    },

    // Agrega relación proyecto-usuario y actualiza las relaciones.
    // Después: Se retorna la respuesta para poder utilizar el mensaje de la API
    addProjectUserRelation: async (
        relationData,
        user_id,
        selectedCompanyId
    ) => {
        set({ isLoading: true, error: null })
        try {
            const response = await addProjectUserRelation(relationData)
            await get().updateRelations(user_id, selectedCompanyId)
            return response // Aquí se retorna el objeto de respuesta (con el mensaje)
        } catch (error) {
            console.error("Error en addProjectUserRelation:", error)
            set({ error: error.message })
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    // Agrega relación compañía-proyecto y actualiza las relaciones de la compañía.
    addCompanyProjectRelation: async (relationData, company_id) => {
        set({ isLoading: true, error: null })
        try {
            await addCompanyProjectRelation(relationData)
            await get().updateCompanyProjects(company_id)
        } catch (error) {
            console.error("Error en addCompanyProjectRelation:", error)
            set({ error: error.message })
        } finally {
            set({ isLoading: false })
        }
    },

    // Elimina relación compañía-usuario y actualiza las relaciones.
    deleteCompanyUserRelation: async (relationship_id, user_id) => {
        set({ isLoading: true, error: null })
        try {
            await deleteCompanyUserRelation(relationship_id)
            await get().updateRelations(user_id)
        } catch (error) {
            console.error("Error en deleteCompanyUserRelation:", error)
            set({ error: error.message })
        } finally {
            set({ isLoading: false })
        }
    },

    // Elimina relación proyecto-usuario y actualiza las relaciones.
    deleteProjectUserRelation: async (
        relationship_id,
        user_id,
        selectedCompanyId
    ) => {
        set({ isLoading: true, error: null })
        try {
            await deleteProjectUserRelation(relationship_id)
            await get().updateRelations(user_id, selectedCompanyId)
        } catch (error) {
            console.error("Error en deleteProjectUserRelation:", error)
            set({ error: error.message })
        } finally {
            set({ isLoading: false })
        }
    },

    // Elimina relación compañía-proyecto y actualiza las relaciones de la compañía.
    deleteCompanyProjectRelation: async (relationship_id, company_id) => {
        set({ isLoading: true, error: null })
        try {
            await deleteCompanyProjectRelation(relationship_id)
            await get().updateCompanyProjects(company_id)
        } catch (error) {
            console.error("Error en deleteCompanyProjectRelation:", error)
            set({ error: error.message })
        } finally {
            set({ isLoading: false })
        }
    },
}))
