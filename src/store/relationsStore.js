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
} from "../hooks/data/options/relationsService"

const initialState = {
    // Relaciones de compañías
    relatedCompanies: [],
    notRelatedCompanies: [],
    // Relaciones de proyectos
    relatedProjects: [],
    notRelatedProjects: [],
    error: null,
}

export const useRelationsStore = create((set, get) => ({
    ...initialState,

    setError: (error) => set({ error }),

    /**
     * Actualiza las relaciones de compañías y, opcionalmente, de proyectos.
     * Si se pasa selectedCompanyRelId, se actualizarán también los proyectos relacionados.
     */
    updateRelations: async (user_id, selectedCompanyRelId = null) => {
        try {
            // Actualizar relaciones de compañías
            const relatedCompanies = await getRelatedOptions({
                user_id,
                related_table: "company_users_table",
                individual_table: "companies_table",
            })
            const notRelatedCompanies = await getNotRelatedCompanies(user_id)

            // Actualiza estado de compañías
            set({
                relatedCompanies,
                notRelatedCompanies,
            })

            // Si se pasa una compañía seleccionada, actualizar relaciones de proyectos
            if (selectedCompanyRelId) {
                const relatedProjects = await getRelatedOptions({
                    user_id,
                    related_table: "projects_table",
                    individual_table: "projects_table",
                    relationship_id: selectedCompanyRelId,
                })
                const notRelatedProjects = await getNotRelatedProjects(user_id)
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
        selectedCompanyRelId
    ) => {
        try {
            await addProjectUserRelation(relationData)
            await get().updateRelations(user_id, selectedCompanyRelId)
        } catch (error) {
            console.error("Error en addProjectUserRelation:", error)
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
        project_id,
        user_id,
        selectedCompanyRelId
    ) => {
        try {
            await deleteProjectUserRelation(project_id)
            await get().updateRelations(user_id, selectedCompanyRelId)
        } catch (error) {
            console.error("Error en deleteProjectUserRelation:", error)
            get().setError(error.message)
        }
    },
}))
