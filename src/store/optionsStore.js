// src/store/optionsStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
    getOptions,
    addOption as apiAddOption,
    updateOption as apiUpdateOption,
    deleteOption as apiDeleteOption,
    addCompanyUserRelation as apiAddCompanyUserRelation,
    addProjectUserRelation as apiAddProjectUserRelation,
    deleteCompanyUserRelation as apiDeleteCompanyUserRelation,
    getRelatedOptions,
    getNotRelatedCompanies,
    getNotRelatedProjects,
} from "../hooks/data/options/options"

const initialState = {
    companies: [],
    hourTypes: [],
    projects: [],
    typesTable: [],
    relatedOptions: [],
    // Se separa la información de no relacionadas para cada tipo:
    notRelatedOptions: { companies: [], projects: [] },
    isLoading: false,
    error: null,
}

export const useOptionsStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            // Función para establecer loading y error de forma genérica
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),

            // Obtiene opciones de una tabla y actualiza el estado
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

            // Agrega una opción y la sincroniza en el estado
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

            // Actualiza una opción y sincroniza el estado
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

            // Elimina una opción y sincroniza el estado
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

            // Reinicia todas las opciones
            clearOptions: () => set(initialState),

            // Actualiza (sincroniza) las relaciones de opciones para un usuario
            updateRelations: async (user_id) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    const [relatedOptions, notRelatedCompanies] =
                        await Promise.all([
                            getRelatedOptions(user_id),
                            getNotRelatedCompanies(user_id),
                        ])
                    let notRelatedProjects = []
                    if (relatedOptions && relatedOptions.length > 0) {
                        const relationship_id =
                            relatedOptions[0].relationship_id
                        notRelatedProjects = await getNotRelatedProjects(
                            user_id,
                            relationship_id
                        )
                    }
                    set({
                        relatedOptions,
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

            // Actualiza solo las opciones relacionadas para un usuario
            fetchRelatedOptions: async (user_id) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    const relatedOptions = await getRelatedOptions(user_id)
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

            // Actualiza solo las compañías no relacionadas para un usuario
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

            // Actualiza solo los proyectos no relacionados para un usuario, dado un relationship_id
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

            // Crea la relación entre usuario y compañía y actualiza las relaciones
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

            // Crea la relación entre usuario y proyecto y actualiza las relaciones
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

            // Elimina la(s) relación(es) y actualiza las relaciones
            deleteCompanyUserRelation: async (ids, user_id) => {
                get().setLoading(true)
                get().setError(null)
                try {
                    await apiDeleteCompanyUserRelation(ids)
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
