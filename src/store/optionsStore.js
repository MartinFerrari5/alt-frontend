// src/store/optionsStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
    getOptions,
    addOption as apiAddOption,
    updateOption as apiUpdateOption,
    deleteOption as apiDeleteOption,
    getRelatedOptions,
    getNotRelatedOptions,
} from "../hooks/data/options/options"

// Importar las funciones de relaciones desde companyUserRelations.js
import {
    createCompanyUserRelation as apiAddCompanyUserRelation,
    deleteCompanyUserRelation as apiDeleteCompanyUserRelation,
} from "../hooks/data/options/companyUserRelations"

const initialState = {
    companies: [],
    hourTypes: [],
    projects: [],
    typesTable: [],
    relatedOptions: [],
    notRelatedOptions: {
        companies: [],
        projects: [],
    },
}

export const useOptionsStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            // Obtiene opciones y actualiza el estado para la tabla indicada
            fetchOptions: async (table) => {
                try {
                    const data = await getOptions(table)
                    set({ [table]: data })
                } catch (error) {
                    console.error(`Error en fetchOptions para ${table}:`, error)
                }
            },

            // Agrega una opción y actualiza el estado
            addOption: async (table, option) => {
                try {
                    const newOption = await apiAddOption(table, option)
                    set((state) => ({
                        [table]: state[table]
                            ? [...state[table], newOption]
                            : [newOption],
                    }))
                } catch (error) {
                    console.error(`Error en addOption para ${table}:`, error)
                }
            },

            // Actualiza una opción existente en el estado
            updateOption: async (table, id, updatedData) => {
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
                }
            },

            // Elimina una opción y actualiza el estado
            deleteOption: async (table, id) => {
                try {
                    await apiDeleteOption(table, id)
                    set((state) => ({
                        [table]: state[table].filter((item) => item.id !== id),
                    }))
                } catch (error) {
                    console.error(`Error en deleteOption para ${table}:`, error)
                }
            },

            // Limpia todas las opciones
            clearOptions: () => set(initialState),

            // Actualiza las relaciones (opciones relacionadas y no relacionadas) para un usuario
            updateRelations: async (user_id) => {
                try {
                    const [relatedOptions, notRelatedOptions] =
                        await Promise.all([
                            getRelatedOptions(user_id),
                            getNotRelatedOptions(user_id),
                        ])
                    set({ relatedOptions, notRelatedOptions })
                } catch (error) {
                    console.error(
                        `Error actualizando relaciones para usuario ${user_id}:`,
                        error
                    )
                }
            },

            // Obtiene las opciones relacionadas para un usuario
            fetchRelatedOptions: async (user_id) => {
                try {
                    const relatedOptions = await getRelatedOptions(user_id)
                    set({ relatedOptions })
                } catch (error) {
                    console.error(
                        `Error en fetchRelatedOptions para usuario ${user_id}:`,
                        error
                    )
                }
            },

            // Obtiene las opciones NO relacionadas para un usuario
            fetchNotRelatedOptions: async (user_id) => {
                try {
                    const notRelatedOptions =
                        await getNotRelatedOptions(user_id)
                    set({ notRelatedOptions })
                } catch (error) {
                    console.error(
                        `Error en fetchNotRelatedOptions para usuario ${user_id}:`,
                        error
                    )
                }
            },

            // Crea la relación entre usuario, compañía y proyecto y actualiza las relaciones
            addCompanyUserRelation: async (relationData, user_id) => {
                try {
                    await apiAddCompanyUserRelation(relationData)
                    await get().updateRelations(user_id)
                } catch (error) {
                    console.error("Error en addCompanyUserRelation:", error)
                }
            },

            // Elimina la relación entre usuario, compañía y proyecto y actualiza las relaciones
            deleteCompanyUserRelation: async (ids, user_id) => {
                try {
                    await apiDeleteCompanyUserRelation(ids)
                    await get().updateRelations(user_id)
                } catch (error) {
                    console.error("Error en deleteCompanyUserRelation:", error)
                }
            },
        }),
        {
            name: "options-storage",
            getStorage: () => localStorage,
        }
    )
)
