// /src/store/relationsStore.js
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

const initialState = {
    // Relaciones de compañías
    relatedCompanies: [],
    notRelatedCompanies: [],
    // Relaciones de proyectos (proyecto-usuario)
    relatedProjects: [],
    notRelatedProjects: [],
    // Relaciones de compañía-proyecto
    companyProjects: [],
    error: null,
}

export const useRelationsStore = create((set, get) => ({
    ...initialState,

    setError: (error) => set({ error }),

    /**
     * Actualiza las relaciones de compañías y, opcionalmente, de proyectos asociados al usuario y la compañía.
     * @param {string|number} user_id - ID del usuario.
     * @param {string|number} [selectedCompanyId] - ID de la compañía seleccionada (para actualizar proyectos relacionados al usuario y la compañía).
     */
    updateRelations: async (user_id, selectedCompanyId = null) => {
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

            // Si se seleccionó una compañía, se actualizan las relaciones de proyectos (proyecto-usuario)
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
            console.error(
                `Error actualizando relaciones para usuario ${user_id}:`,
                error
            )
            get().setError(error.message)
        }
    },

    // Actualiza las relaciones de compañía-proyecto.
    updateCompanyProjects: async (company_id) => {
        try {
            const companyProjects = await getCompanyProjects(company_id)
            set({ companyProjects })
        } catch (error) {
            console.error(
                `Error actualizando proyectos de la compañía ${company_id}:`,
                error
            )
            get().setError(error.message)
        }
    },

    // Agrega relación compañía-usuario y actualiza las relaciones.
    addCompanyUserRelation: async (relationData, user_id) => {
        try {
            await addCompanyUserRelation(relationData)
            await get().updateRelations(user_id)
        } catch (error) {
            console.error("Error en addCompanyUserRelation:", error)
            get().setError(error.message)
        }
    },

    // Agrega relación proyecto-usuario y actualiza las relaciones.
    addProjectUserRelation: async (
        relationData,
        user_id,
        selectedCompanyId
    ) => {
        try {
            await addProjectUserRelation(relationData)
            await get().updateRelations(user_id, selectedCompanyId)
        } catch (error) {
            console.error("Error en addProjectUserRelation:", error)
            get().setError(error.message)
        }
    },

    // Agrega relación compañía-proyecto y actualiza las relaciones de la compañía.
    addCompanyProjectRelation: async (relationData, company_id) => {
        try {
            await addCompanyProjectRelation(relationData)
            await get().updateCompanyProjects(company_id)
        } catch (error) {
            console.error("Error en addCompanyProjectRelation:", error)
            get().setError(error.message)
        }
    },

    // Elimina relación compañía-usuario y actualiza las relaciones.
    deleteCompanyUserRelation: async (relationship_id, user_id) => {
        try {
            await deleteCompanyUserRelation(relationship_id)
            await get().updateRelations(user_id)
        } catch (error) {
            console.error("Error en deleteCompanyUserRelation:", error)
            get().setError(error.message)
        }
    },

    // Elimina relación proyecto-usuario y actualiza las relaciones.
    deleteProjectUserRelation: async (
        relationship_id,
        user_id,
        selectedCompanyId
    ) => {
        try {
            await deleteProjectUserRelation(relationship_id)
            await get().updateRelations(user_id, selectedCompanyId)
        } catch (error) {
            console.error("Error en deleteProjectUserRelation:", error)
            get().setError(error.message)
        }
    },

    // Elimina relación compañía-proyecto y actualiza las relaciones de la compañía.
    deleteCompanyProjectRelation: async (relationship_id, company_id) => {
        try {
            await deleteCompanyProjectRelation(relationship_id)
            await get().updateCompanyProjects(company_id)
        } catch (error) {
            console.error("Error en deleteCompanyProjectRelation:", error)
            get().setError(error.message)
        }
    },
}))
