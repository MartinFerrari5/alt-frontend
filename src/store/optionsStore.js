// src/store/optionsStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
    getOptions,
    addOption,
    updateOption,
    deleteOption,
} from "../hooks/data/options/options"

export const useOptionsStore = create(
    persist(
        (set) => ({
            // Estados iniciales para cada tabla
            companies: [],
            hourTypes: [],
            projects: [],

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
                    const newOption = await addOption(table, option)
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
                }
            },

            // Acción para eliminar una opción y limpiar el estado
            deleteOption: async (table, id) => {
                try {
                    await deleteOption(table, id)
                    set((state) => ({
                        [table]: state[table].filter((item) => item.id !== id),
                    }))
                } catch (error) {
                    console.error(`Error en deleteOption para ${table}:`, error)
                }
            },

            // Acción para limpiar todas las opciones
            clearOptions: () =>
                set({ companies: [], hourTypes: [], projects: [] }),
        }),
        {
            name: "options-storage", // Nombre de la key en localStorage
            getStorage: () => localStorage,
        }
    )
)
