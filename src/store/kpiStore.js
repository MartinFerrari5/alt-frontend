import { create } from "zustand"
import { persist } from "zustand/middleware"

const useKpiStore = create(
    persist(
        (set) => ({
            // Almacenamos cada reporte en una clave según la tabla
            kpiReports: {
                hour_type: null,
                task_type: null,
                project: null,
                company: null,
            },
            /**
             * Guarda el reporte KPI para una tabla específica.
             * @param {string} group - Nombre de la tabla (ej. "task_type").
             * @param {any} report - Datos del reporte.
             */
            setKpiReport: (group, report) =>
                set((state) => ({
                    kpiReports: {
                        ...state.kpiReports,
                        [group]: report,
                    },
                })),
            /**
             * Limpia el reporte KPI.
             * Si se pasa un grupo, solo limpia ese; si no, limpia todos.
             * @param {string} [group] - Nombre de la tabla a limpiar.
             */
            clearKpiReport: (group) =>
                set((state) => {
                    if (group) {
                        return {
                            kpiReports: {
                                ...state.kpiReports,
                                [group]: null,
                            },
                        }
                    }
                    return {
                        kpiReports: {
                            hour_type: null,
                            task_type: null,
                            project: null,
                            company: null,
                        },
                    }
                }),
        }),
        {
            name: "kpi-report-storage",
            getStorage: () => localStorage,
        }
    )
)

export default useKpiStore
