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

      /**
       * Obtiene las opciones para una tabla específica y actualiza el estado.
       * @param {string} table - Nombre de la tabla.
       */
      fetchOptions: async (table) => {
        try {
          const data = await getOptions(table)
          set({ [table]: data })
        } catch (error) {
          console.error(`Error en fetchOptions para ${table}:`, error)
        }
      },

      /**
       * Agrega una nueva opción y actualiza el estado.
       * @param {string} table - Nombre de la tabla.
       * @param {any} option - Opción a agregar.
       */
      addOption: async (table, option) => {
        try {
          const newOption = await apiAddOption(table, option)
          set((state) => ({
            [table]: state[table] ? [...state[table], newOption] : [newOption],
          }))
        } catch (error) {
          console.error(`Error en addOption para ${table}:`, error)
        }
      },

      /**
       * Actualiza una opción existente y actualiza el estado.
       * @param {string} table - Nombre de la tabla.
       * @param {number|string} id - ID de la opción.
       * @param {Object} updatedData - Datos actualizados.
       */
      updateOption: async (table, id, updatedData) => {
        try {
          const updatedOption = await apiUpdateOption(table, id, updatedData)
          set((state) => ({
            [table]: state[table].map((item) =>
              item.id === id ? updatedOption : item
            ),
          }))
        } catch (error) {
          console.error(`Error en updateOption para ${table}:`, error)
        }
      },

      /**
       * Elimina una opción y actualiza el estado.
       * @param {string} table - Nombre de la tabla.
       * @param {number|string} id - ID de la opción.
       */
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

      /**
       * Limpia todas las opciones almacenadas en el estado.
       */
      clearOptions: () => set(initialState),

      /**
       * Actualiza las relaciones de opciones (relacionadas y no relacionadas) para un usuario.
       * @param {number|string} user_id - ID del usuario.
       */
      updateRelations: async (user_id) => {
        try {
          const [relatedOptions, notRelatedOptions] = await Promise.all([
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

      /**
       * Obtiene las opciones relacionadas para un usuario y actualiza el estado.
       * @param {number|string} user_id - ID del usuario.
       */
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

      /**
       * Obtiene las opciones no relacionadas para un usuario y actualiza el estado.
       * @param {number|string} user_id - ID del usuario.
       */
      fetchNotRelatedOptions: async (user_id) => {
        try {
          const notRelatedOptions = await getNotRelatedOptions(user_id)
          set({ notRelatedOptions })
        } catch (error) {
          console.error(
            `Error en fetchNotRelatedOptions para usuario ${user_id}:`,
            error
          )
        }
      },

      /**
       * Crea la relación entre usuario, compañía y proyecto y actualiza las relaciones.
       * @param {Object} relationData - Datos de la relación.
       * @param {number|string} user_id - ID del usuario.
       */
      addCompanyUserRelation: async (relationData, user_id) => {
        try {
          await apiAddCompanyUserRelation(relationData)
          await get().updateRelations(user_id)
        } catch (error) {
          console.error("Error en addCompanyUserRelation:", error)
        }
      },

      /**
       * Elimina la relación entre usuario, compañía y proyecto y actualiza las relaciones.
       * @param {Array} ids - IDs de las relaciones a eliminar.
       * @param {number|string} user_id - ID del usuario.
       */
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
