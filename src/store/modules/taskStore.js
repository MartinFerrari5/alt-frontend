// src/store/taskStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * Store para la gestión de tareas con persistencia en localStorage.
 * Incluye estado de paginación (current, total).
 */
const useTaskStore = create(
    persist(
        (set, get) => ({
            // Lista de tareas de la página actual
            tasks: [],
            // Metadata de paginación
            pages: { current: 1, total: 1 },

            /**
             * Agrega una nueva tarea al listado.
             * @param {Object} newTask - La nueva tarea a agregar.
             */
            addTask: (newTask) =>
                set((state) => ({ tasks: [...state.tasks, newTask] })),

            /**
             * Actualiza una tarea existente.
             * @param {string|number} taskId - ID de la tarea.
             * @param {Object} updatedTask - Campos a actualizar.
             */
            updateTask: (taskId, updatedTask) =>
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        String(task.id) === String(taskId)
                            ? { ...task, ...updatedTask }
                            : task
                    ),
                })),

            /**
             * Elimina una tarea del listado.
             * @param {string|number} taskId - ID de la tarea a eliminar.
             */
            deleteTask: (taskId) =>
                set((state) => ({
                    tasks: state.tasks.filter(
                        (task) => String(task.id) !== String(taskId)
                    ),
                })),

            /**
             * Establece el listado completo de tareas.
             * @param {Array} tasksArray - Array de tareas.
             */
            setTasks: (tasksArray) =>
                set({ tasks: Array.isArray(tasksArray) ? tasksArray : [] }),

            /**
             * Actualiza los datos de paginación.
             * @param {{current: number, total: number}} pagesObj
             */
            setPages: (pagesObj) => set({ pages: pagesObj }),

            /**
             * Obtiene una tarea por su ID.
             * @param {string|number} taskId
             * @returns {Object|undefined}
             */
            getTaskById: (taskId) =>
                get().tasks.find((task) => String(task.id) === String(taskId)),

            /**
             * Limpia todas las tareas y resetea paginación.
             */
            clearTasks: () =>
                set({ tasks: [], pages: { current: 1, total: 1 } }),
        }),
        {
            name: "task-storage",
            getStorage: () => localStorage,
            partialize: (state) => ({ tasks: state.tasks, pages: state.pages }),
        }
    )
)

export default useTaskStore
