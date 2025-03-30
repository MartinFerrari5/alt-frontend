// src/store/taskStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * Store para la gestión de tareas con persistencia en localStorage.
 */
const useTaskStore = create(
    persist(
        (set, get) => ({
            tasks: [],

            /**
             * Agrega una nueva tarea al listado.
             * @param {Object} newTask - La nueva tarea a agregar.
             */
            addTask: (newTask) =>
                set((state) => ({
                    tasks: [...state.tasks, newTask],
                })),

            /**
             * Actualiza una tarea existente.
             * Se comparan los IDs convertidos a string para evitar discrepancias.
             * @param {string|number} taskId - El identificador de la tarea.
             * @param {Object} updatedTask - Los campos a actualizar.
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
             * @param {string|number} taskId - El identificador de la tarea a eliminar.
             */
            deleteTask: (taskId) =>
                set((state) => ({
                    tasks: state.tasks.filter(
                        (task) => String(task.id) !== String(taskId)
                    ),
                })),

            /**
             * Establece el listado completo de tareas.
             * @param {Array} tasks - Array de tareas.
             */
            setTasks: (tasks) => set({ tasks }),

            /**
             * Obtiene una tarea por su ID.
             * @param {string|number} taskId - El identificador de la tarea.
             * @returns {Object|undefined} La tarea encontrada o undefined.
             */
            getTaskById: (taskId) =>
                get().tasks.find((task) => String(task.id) === String(taskId)),

            /**
             * Limpia todas las tareas almacenadas.
             */
            clearTasks: () => set({ tasks: [] }),
        }),
        {
            name: "task-storage",
            getStorage: () => localStorage,
            partialize: (state) => ({ tasks: state.tasks }),
        }
    )
)

export default useTaskStore
