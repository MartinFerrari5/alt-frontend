import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
    getOptions,
    addOption as apiAddOption,
    updateOption as apiUpdateOption,
    deleteOption as apiDeleteOption,
} from "../hooks/data/options/optionsService"

import {
    getRelatedOptions,
    getNotRelatedCompanies,
    getNotRelatedProjects,
    addCompanyUserRelation as apiAddCompanyUserRelation,
    addProjectUserRelation as apiAddProjectUserRelation,
    deleteCompanyUserRelation as apiDeleteCompanyUserRelation,
} from "../hooks/data/options/relationsService"

const initialState = {
    companies_table: [],
    hour_type_table: [],
    projects_table: [],
    types_table: [],
    relatedOptions: [],
    notRelatedOptions: { companies: [], projects: [] },
    isLoading: false,
    error: null,
}

export const useOptionsStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            // Helpers para actualizar estado
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),

            // Opciones generales
            fetchOptions: async (table) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    const data = await getOptions(table)
                    set({ [table]: data })
                } catch (error) {
                    console.error(`Error en fetchOptions para ${table}:`, error)
                    get().setError(error.message)
                } finally {
                    get().setLoading(false)
                }
            },

            addOption: async (table, option) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    const newOption = await apiAddOption(table, option)
                    set((state) => ({
                        [table]: state[table]
                            ? [...state[table], newOption]
                            : [newOption],
                    }))
                } catch (error) {
                    console.error(`Error en addOption para ${table}:`, error)
                    get().setError(error.message)
                } finally {
                    get().setLoading(false)
                }
            },

            updateOption: async (table, id, updatedData) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    const updatedOption = await apiUpdateOption(
                        table,
                        id,
                        updatedData
                    )
                    set((state) => ({
                        [table]: state[table].map((item) =>
                            item.id === id ? updatedOption : item
                        ),
                    }))
                } catch (error) {
                    console.error(`Error en updateOption para ${table}:`, error)
                    get().setError(error.message)
                } finally {
                    get().setLoading(false)
                }
            },

            deleteOption: async (table, id) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    await apiDeleteOption(table, id)
                    set((state) => ({
                        [table]: state[table].filter((item) => item.id !== id),
                    }))
                } catch (error) {
                    console.error(`Error en deleteOption para ${table}:`, error)
                    get().setError(error.message)
                } finally {
                    get().setLoading(false)
                }
            },

            // Relaciones de usuario
            clearOptions: () => set(initialState),

            /**
             * Actualiza todas las relaciones para el usuario.
             * Se obtienen las compañías relacionadas y, si existen, se utiliza el primer relationship_id para
             * obtener los proyectos no relacionados.
             */
            updateRelations: async (user_id) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    // Se obtienen las compañías relacionadas
                    const relatedCompanies = await getRelatedOptions({
                        user_id,
                        related_table: "company_users_table",
                        individual_table: "companies_table",
                    })
                    // Se obtienen las compañías NO relacionadas
                    const notRelatedCompanies =
                        await getNotRelatedCompanies(user_id)
                    let notRelatedProjects = []
                    if (relatedCompanies && relatedCompanies.length > 0) {
                        const relationship_id =
                            relatedCompanies[0].relationship_id
                        notRelatedProjects = await getNotRelatedProjects(
                            user_id,
                            relationship_id
                        )
                    }
                    set({
                        relatedOptions: relatedCompanies,
                        notRelatedOptions: {
                            companies: notRelatedCompanies,
                            projects: notRelatedProjects,
                        },
                    })
                } catch (error) {
                    console.error(
                        `Error actualizando relaciones para usuario ${user_id}:`,
                        error
                    )
                    get().setError(error.message)
                } finally {
                    get().setLoading(false)
                }
            },

            fetchRelatedOptions: async (user_id) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    // Si se requiere filtrar por una tabla en específico, se pueden agregar los parámetros correspondientes.
                    const relatedOptions = await getRelatedOptions({
                        user_id,
                        related_table: "company_users_table",
                        individual_table: "companies_table",
                    })
                    set({ relatedOptions })
                } catch (error) {
                    console.error(
                        `Error en fetchRelatedOptions para usuario ${user_id}:`,
                        error
                    )
                    get().setError(error.message)
                } finally {
                    get().setLoading(false)
                }
            },

            fetchNotRelatedCompanies: async (user_id) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    const notRelatedCompanies =
                        await getNotRelatedCompanies(user_id)
                    set((state) => ({
                        notRelatedOptions: {
                            ...state.notRelatedOptions,
                            companies: notRelatedCompanies,
                        },
                    }))
                } catch (error) {
                    console.error(
                        `Error en fetchNotRelatedCompanies para usuario ${user_id}:`,
                        error
                    )
                    get().setError(error.message)
                } finally {
                    get().setLoading(false)
                }
            },

            fetchNotRelatedProjects: async (user_id, relationship_id) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    const notRelatedProjects = await getNotRelatedProjects(
                        user_id,
                        relationship_id
                    )
                    set((state) => ({
                        notRelatedOptions: {
                            ...state.notRelatedOptions,
                            projects: notRelatedProjects,
                        },
                    }))
                } catch (error) {
                    console.error(
                        `Error en fetchNotRelatedProjects para usuario ${user_id}:`,
                        error
                    )
                    get().setError(error.message)
                } finally {
                    get().setLoading(false)
                }
            },

            addCompanyUserRelation: async (relationData, user_id) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    await apiAddCompanyUserRelation(relationData)
                    await get().updateRelations(user_id)
                } catch (error) {
                    console.error("Error en addCompanyUserRelation:", error)
                    get().setError(error.message)
                } finally {
                    get().setLoading(false)
                }
            },

            addProjectUserRelation: async (relationData, user_id) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    await apiAddProjectUserRelation(relationData)
                    await get().updateRelations(user_id)
                } catch (error) {
                    console.error("Error en addProjectUserRelation:", error)
                    get().setError(error.message)
                } finally {
                    get().setLoading(false)
                }
            },

            deleteCompanyUserRelation: async (relationship_id, user_id) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    await apiDeleteCompanyUserRelation(relationship_id)
                    await get().updateRelations(user_id)
                } catch (error) {
                    console.error("Error en deleteCompanyUserRelation:", error)
                    get().setError(error.message)
                } finally {
                    get().setLoading(false)
                }
            },
        }),
        {
            name: "options-storage",
            getStorage: () => localStorage,
        }
    )
)
