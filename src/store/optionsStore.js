// src/store/optionsStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useOptionsStore = create(
    persist(
        (set, get) => ({
            // Estado para companies
            companies: null,
            setCompanies: (data) =>
                set((state) => ({
                    companies:
                        typeof data === "function"
                            ? data(state.companies ?? [])
                            : data,
                })),
            updateCompany: (id, updatedData) =>
                set((state) => ({
                    companies: state.companies
                        ? state.companies.map((item) =>
                              item.id === id
                                  ? { ...item, ...updatedData }
                                  : item
                          )
                        : [],
                })),

            // Estado para hourTypes
            hourTypes: null,
            setHourTypes: (data) =>
                set((state) => ({
                    hourTypes:
                        typeof data === "function"
                            ? data(state.hourTypes ?? [])
                            : data,
                })),
            updateHourType: (id, updatedData) =>
                set((state) => ({
                    hourTypes: state.hourTypes
                        ? state.hourTypes.map((item) =>
                              item.id === id
                                  ? { ...item, ...updatedData }
                                  : item
                          )
                        : [],
                })),

            // Estado para projects
            projects: null,
            setProjects: (data) =>
                set((state) => ({
                    projects:
                        typeof data === "function"
                            ? data(state.projects ?? [])
                            : data,
                })),
            updateProject: (id, updatedData) =>
                set((state) => ({
                    projects: state.projects
                        ? state.projects.map((item) =>
                              item.id === id
                                  ? { ...item, ...updatedData }
                                  : item
                          )
                        : [],
                })),

            // Función para limpiar todos los datos de options
            clearOptions: () =>
                set({ companies: null, hourTypes: null, projects: null }),

            // Función para agregar una opción a la tabla correspondiente
            addOption: (table, option) => {
                // Mapeo para normalizar el nombre de la tabla
                const tableMapping = {
                    companies_table: "companies",
                    hour_type_table: "hourTypes",
                    projects_table: "projects",
                    emails_table: "emails", // En caso de que manejes emails
                }

                const normalizedKey = tableMapping[table] || table

                set((state) => ({
                    [normalizedKey]:
                        state[normalizedKey] &&
                        Array.isArray(state[normalizedKey])
                            ? [...state[normalizedKey], option]
                            : [option],
                }))
            },
        }),
        {
            name: "options-storage", // Nombre único para la key en localStorage
            getStorage: () => localStorage,
        }
    )
)
