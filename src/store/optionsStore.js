import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
    addOption,
    deleteOption,
    getOptions,
    updateOption,
} from "../hooks/data/options/optionsService"

const initialState = {
    companies_table: [],
    hour_type_table: [],
    projects_table: [],
    types_table: [],
    error: null,
}

export const useOptionsStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            setError: (error) => set({ error }),

            fetchOptions: async (table) => {
                try {
                    const data = await getOptions(table)
                    set({ [table]: data })
                } catch (error) {
                    console.error(`Error en fetchOptions para ${table}:`, error)
                    get().setError(error.message)
                    throw error // Re-lanza el error
                }
            },

            addOption: async (table, option) => {
                try {
                    const newOption = await addOption(table, option)
                    set((state) => ({
                        [table]: [...state[table], newOption],
                    }))
                } catch (error) {
                    console.error(`Error en addOption para ${table}:`, error)
                    get().setError(error.message)
                    throw error // Re-lanza el error
                }
            },

            updateOption: async (table, id, updatedData) => {
                try {
                    const updatedOption = await updateOption(
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
                    throw error // Re-lanza el error
                }
            },

            deleteOption: async (table, id) => {
                try {
                    await deleteOption(table, id)
                    set((state) => ({
                        [table]: state[table].filter((item) => item.id !== id),
                    }))
                } catch (error) {
                    console.error(`Error en deleteOption para ${table}:`, error)
                    get().setError(error.message)
                    throw error // Re-lanza el error
                }
            },
        }),
        { name: "options-storage", getStorage: () => localStorage }
    )
)
