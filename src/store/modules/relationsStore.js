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
import { handleApiError } from "../../lib/errorHandler"

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
     * Actualiza las relaciones de compañías y, opcionalmente, las de proyectos asociados al usuario y la compañía seleccionada.
     * @param {string|number} user_id - ID del usuario.
     * @param {string|number} [selectedCompanyId] - ID de la compañía seleccionada.
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

            // Actualizar relaciones de proyectos si se proporcionó selectedCompanyId
            if (selectedCompanyId) {
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
                set({
                    relatedProjects: [],
                    notRelatedProjects: [],
                })
            }
        } catch (error) {
            set({
                error: handleApiError(
                    error,
                    `Error actualizando relaciones para el usuario ${user_id}`
                ),
            })
        } finally {
            set({ isLoading: false })
        }
    },

    /**
     * Actualiza las relaciones de compañía-proyecto.
     * @param {string|number} company_id - ID de la compañía.
     */
    updateCompanyProjects: async (company_id) => {
        set({ isLoading: true, error: null })
        try {
            const companyProjects = await getCompanyProjects(company_id)
            set({ companyProjects })
        } catch (error) {
            set({
                error: handleApiError(
                    error,
                    `Error actualizando proyectos de la compañía ${company_id}`
                ),
            })
        } finally {
            set({ isLoading: false })
        }
    },

    /**
     * Agrega relación compañía-usuario y actualiza las relaciones del usuario.
     * @param {Object} relationData - Datos de la relación { user_id, company_id }.
     * @param {string|number} user_id - ID del usuario.
     */
    addCompanyUserRelation: async (relationData, user_id) => {
        set({ isLoading: true, error: null })
        try {
            await addCompanyUserRelation(relationData)
            await get().updateRelations(user_id)
        } catch (error) {
            set({
                error: handleApiError(error, "Error en addCompanyUserRelation"),
            })
        } finally {
            set({ isLoading: false })
        }
    },

    /**
     * Agrega relación proyecto-usuario y actualiza las relaciones. Retorna la respuesta para usar el mensaje de la API.
     * @param {Object} relationData - Datos de la relación.
     * @param {string|number} user_id - ID del usuario.
     * @param {string|number} selectedCompanyId - ID de la compañía seleccionada.
     * @returns {Promise<Object>} Respuesta de la API.
     */
    addProjectUserRelation: async (
        relationData,
        user_id,
        selectedCompanyId
    ) => {
        set({ isLoading: true, error: null })
        try {
            const response = await addProjectUserRelation(relationData)
            await get().updateRelations(user_id, selectedCompanyId)
            return response
        } catch (error) {
            set({
                error: handleApiError(error, "Error en addProjectUserRelation"),
            })
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    /**
     * Agrega relación compañía-proyecto y actualiza las relaciones de la compañía.
     * @param {Object} relationData - Datos de la relación { company_id, project_id }.
     * @param {string|number} company_id - ID de la compañía.
     */
    addCompanyProjectRelation: async (relationData, company_id) => {
        set({ isLoading: true, error: null })
        try {
            await addCompanyProjectRelation(relationData)
            await get().updateCompanyProjects(company_id)
        } catch (error) {
            set({
                error: handleApiError(
                    error,
                    "Error en addCompanyProjectRelation"
                ),
            })
        } finally {
            set({ isLoading: false })
        }
    },

    /**
     * Elimina relación compañía-usuario y actualiza las relaciones.
     * @param {string} relationship_id - ID de la relación.
     * @param {string|number} user_id - ID del usuario.
     */
    deleteCompanyUserRelation: async (relationship_id, user_id) => {
        set({ isLoading: true, error: null })
        try {
            await deleteCompanyUserRelation(relationship_id)
            await get().updateRelations(user_id)
        } catch (error) {
            set({
                error: handleApiError(
                    error,
                    "Error en deleteCompanyUserRelation"
                ),
            })
        } finally {
            set({ isLoading: false })
        }
    },

    /**
     * Elimina relación proyecto-usuario y actualiza las relaciones.
     * @param {string} relationship_id - ID de la relación.
     * @param {string|number} user_id - ID del usuario.
     * @param {string|number} selectedCompanyId - ID de la compañía seleccionada.
     */
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
            set({
                error: handleApiError(
                    error,
                    "Error en deleteProjectUserRelation"
                ),
            })
        } finally {
            set({ isLoading: false })
        }
    },

    /**
     * Elimina relación compañía-proyecto y actualiza las relaciones de la compañía.
     * @param {string} relationship_id - ID de la relación.
     * @param {string|number} company_id - ID de la compañía.
     */
    deleteCompanyProjectRelation: async (relationship_id, company_id) => {
        set({ isLoading: true, error: null })
        try {
            await deleteCompanyProjectRelation(relationship_id)
            await get().updateCompanyProjects(company_id)
        } catch (error) {
            set({
                error: handleApiError(
                    error,
                    "Error en deleteCompanyProjectRelation"
                ),
            })
        } finally {
            set({ isLoading: false })
        }
    },
}))
