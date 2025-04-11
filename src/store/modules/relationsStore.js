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
    // Nuevas funciones para manejo desde la perspectiva del proyecto:
    getProjectUsers,
    getNotRelatedProjectUsers,
    getNotRelatedProjectsForUser,
} from "../../hooks/data/options/relationsService"
import { handleApiError } from "../../lib/errorHandler"

const initialState = {
    // Relaciones Usuario-Compañía
    relatedCompanies: [],
    notRelatedCompanies: [],
    // Relaciones Proyecto-Compañía
    companyProjects: [],
    availableCompanyProjects: [],
    // Relaciones Usuario-Proyecto (según la compañía seleccionada)
    relatedProjects: [],
    notRelatedProjects: [],
    // Relaciones Proyecto-Usuario (vista desde el proyecto)
    projectUsers: [],
    notRelatedProjectUsers: [],
    // Estado global de error y carga
    error: null,
    isLoading: false,
}

export const useRelationsStore = create((set, get) => ({
    ...initialState,

    setError: (error) => set({ error }),
    setLoading: (loading) => set({ isLoading: loading }),

    /**
     * Actualiza las relaciones de compañías para el usuario.
     * Adicionalmente, si se provee selectedCompanyId, actualiza las relaciones de proyectos asociados a dicha compañía.
     * @param {string|number} user_id - ID del usuario.
     * @param {string|number} [selectedCompanyId] - ID de la compañía seleccionada.
     */
    updateRelations: async (user_id, selectedCompanyId = null) => {
        set({ isLoading: true, error: null })
        try {
            // Actualizar relaciones Usuario-Compañía
            const relatedCompaniesResponse = await getRelatedOptions({
                user_id,
                related_table: "company_users_table",
                individual_table: "companies_table",
            })

            // Accede a la propiedad `data` del objeto de respuesta
            const relatedCompanies = relatedCompaniesResponse.data
            const response = await getNotRelatedCompanies(user_id)
            console.log("getNotRelatedCompanies: ", response)
            const notRelatedCompanies = response.data

            set({
                relatedCompanies,
                notRelatedCompanies,
            })

            // Actualizar relaciones Usuario-Proyecto (en el contexto de una compañía)
            if (selectedCompanyId) {
                const relatedProjectsResponse = await getRelatedOptions({
                    user_id,
                    related_table: "project_user_table",
                    individual_table: "project_company_table",
                    company_id: selectedCompanyId,
                })

                const relatedProjects = relatedProjectsResponse.data

                const { data } = await getNotRelatedProjects(selectedCompanyId)
                const notRelatedProjects = Array.isArray(data)
                    ? data.map((project) => ({
                          id: project.id,
                          option: project.option,
                      }))
                    : []

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
     * Actualiza las relaciones de proyectos no relacionados con una compañía.
     * @param {string|number} company_id - ID de la compañía.
     */
    updateAvailableCompanyProjects: async (company_id) => {
        set({ isLoading: true, error: null })
        try {
            const response = await getNotRelatedProjects(company_id)
            const availableCompanyProjects = Array.isArray(response.data)
                ? response.data
                : []
            set({ availableCompanyProjects })
        } catch (error) {
            set({
                error: handleApiError(
                    error,
                    `Error actualizando proyectos disponibles de la compañía ${company_id}`
                ),
            })
        } finally {
            set({ isLoading: false })
        }
    },

    /**
     * Actualiza las relaciones de proyectos relacionados con una compañía.
     * @param {string|number} company_id - ID de la compañía.
     */
    updateCompanyProjects: async (company_id) => {
        set({ isLoading: true, error: null })
        try {
            const response = await getCompanyProjects(company_id)
            const companyProjects = Array.isArray(response.data)
                ? response.data
                : []
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
     * Actualiza las relaciones Proyecto-Usuario (vista desde un proyecto).
     * @param {string|number} project_id - ID del proyecto.
     */
    updateProjectUsers: async (project_id) => {
        set({ isLoading: true, error: null })
        try {
            const projectUsers = await getProjectUsers(project_id)
            const notRelatedProjectUsersRaw =
                await getNotRelatedProjectUsers(project_id)

            // Unificar las claves de los datos
            const notRelatedProjectUsers = notRelatedProjectUsersRaw.map(
                (user) => ({
                    id: user.id || user.user_id,
                    option: user.option || user.options,
                })
            )

            set({
                projectUsers,
                notRelatedProjectUsers,
            })
        } catch (error) {
            set({
                error: handleApiError(
                    error,
                    `Error actualizando usuarios para el proyecto ${project_id}`
                ),
            })
        } finally {
            set({ isLoading: false })
        }
    },

    /**
     * Agrega relación Usuario-Compañía y actualiza las relaciones.
     * @param {Object} relationData - { user_id, company_id }.
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
     * Agrega relación Usuario-Proyecto y actualiza las relaciones.
     * @param {Object} relationData - Datos de la relación { user_id, company_id, relationship_id }.
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
     * Agrega una relación entre compañía y proyecto.
     * @param {Object} relationData - Datos de la relación { company_id, project_id }.
     * @param {string|number} company_id - ID de la compañía.
     */
    addCompanyProjectRelation: async (relationData, company_id) => {
        set({ isLoading: true, error: null })
        try {
            await addCompanyProjectRelation(relationData)
            await get().updateCompanyProjects(company_id)
            await get().updateAvailableCompanyProjects(company_id)
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
     * Elimina relación Usuario-Compañía y actualiza las relaciones.
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
     * Elimina relación Usuario-Proyecto y actualiza las relaciones.
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
     * Elimina una relación entre compañía y proyecto.
     * @param {string} relationship_id - ID de la relación.
     * @param {string|number} company_id - ID de la compañía.
     */
    deleteCompanyProjectRelation: async (relationship_id, company_id) => {
        set({ isLoading: true, error: null })
        try {
            await deleteCompanyProjectRelation(relationship_id)
            await get().updateCompanyProjects(company_id)
            await get().updateAvailableCompanyProjects(company_id)
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

    /**
     * (Placeholder) Elimina relación Proyecto-Usuario y actualiza el listado de usuarios para el proyecto.
     * @param {string} relationship_id - ID de la relación en el proyecto.
     * @param {string|number} project_id - ID del proyecto.
     */
    deleteProjectUserRelationFromProject: async (
        relationship_id,
        project_id
    ) => {
        set({ isLoading: true, error: null })
        try {
            // Suponiendo que el endpoint es el mismo que deleteProjectUserRelation
            await deleteProjectUserRelation(relationship_id)
            await get().updateProjectUsers(project_id)
        } catch (error) {
            set({
                error: handleApiError(
                    error,
                    "Error eliminando relación en el proyecto"
                ),
            })
        } finally {
            set({ isLoading: false })
        }
    },

    /**
     * Actualiza las relaciones de proyectos no relacionados con un usuario y una compañía.
     * @param {string|number} user_id - ID del usuario.
     * @param {string|number} company_id - ID de la compañía.
     */
    updateNotRelatedProjectsForUser: async (user_id, company_id) => {
        set({ isLoading: true, error: null })
        try {
            const response = await getNotRelatedProjectsForUser(
                user_id,
                company_id
            )
            const notRelatedProjects = response.data

            set({ notRelatedProjects })
        } catch (error) {
            set({
                error: handleApiError(
                    error,
                    `Error actualizando proyectos no relacionados para el usuario ${user_id} y la compañía ${company_id}`
                ),
            })
        } finally {
            set({ isLoading: false })
        }
    },
}))
