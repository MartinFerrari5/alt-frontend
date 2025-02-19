// src/store/optionsStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
    getOptions,
    addOption as apiAddOption,
    updateOption as apiUpdateOption,
    deleteOption as apiDeleteOption,
} from "../hooks/data/options/options"

export const useOptionsStore = create(
    persist(
        (set) => ({
            // Estados iniciales para cada tabla
            companies: [],
            hourTypes: [],
            projects: [],
            typesTable: [],

            // Acción para obtener opciones y actualizar el estado
            fetchOptions: async (table) => {
                try {
                    const data = await getOptions(table)
                    set({ [table]: data })
                } catch (error) {
                    console.error(`Error en fetchOptions para ${table}:`, error)
                }
            },

            // Acción para agregar una opción y actualizar el estado
            addOption: async (table, option) => {
                try {
                    // Se llama a la función de la API que retorna el nuevo elemento con id
                    const newOption = await apiAddOption(table, option)
                    // Se actualiza el estado con el nuevo elemento
                    console.log(newOption)
                    set((state) => ({
                        [table]: state[table]
                            ? [...state[table], newOption]
                            : [newOption],
                    }))
                } catch (error) {
                    console.error(`Error en addOption para ${table}:`, error)
                }
            },

            // Acción para actualizar una opción y modificar el estado
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

            // Acción para eliminar una opción y limpiar el estado
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

            // Acción para limpiar todas las opciones
            clearOptions: () =>
                set({ companies: [], hourTypes: [], projects: [],  typesTable: [] }),
        }),
        {
            name: "options-storage", // Nombre de la key en localStorage
            getStorage: () => localStorage,
        }
    )
)
