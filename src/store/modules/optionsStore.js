// /src/store/optionsStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
    addOption,
    deleteOption,
    getOptions,
    updateOption,
} from "../../hooks/data/options/optionsService"

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
                    const response = await getOptions(table)
                    const data = response.data
                    // const data = Array.isArray(response.data)
                    //     ? response.data // Si es un array, úsalo directamente
                    //     : response.data !== null && typeof response.data === "object"
                    //     ? [response.data] // Si es un objeto, conviértelo en un array
                    //     : [] // Si no es ni un array ni un objeto, usa un array vacío
                    console.log(`Opciones para ${table}:`, data)
                    set({ [table]: data }) // Almacena solo la propiedad `data`
                } catch (error) {
                    console.error(`Error en fetchOptions para ${table}:`, error)
                    get().setError(error.message)
                    throw error
                }
            },

            addOption: async (table, option) => {
                try {
                    const response = await addOption(table, option)
                    const newOption = response.data
                    set((state) => ({
                        ...state,
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
                    const response = await updateOption(table, id, updatedData)
                    const updatedOption = response.data
                    set((state) => ({
                        ...state,
                        [table]: state[table].map((item) =>
                            item.id === id ? updatedOption : item
                        ),
                    }))
                } catch (error) {
                    console.error(`Error en updateOption para ${table}:`, error)
                    get().setError(error.message)
                    throw error
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
                    throw error 
                }
            },
        }),
        { name: "options-storage", getStorage: () => localStorage }
    )
)
