// src/store/taskStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

const useTaskStore = create(
    persist(
        (set) => ({
            tasks: [],

            // Agregar una tarea
            addTask: (newTask) => {
                set((state) => ({
                    tasks: [
                        ...state.tasks,
                        {
                            ...newTask,
                            task_date: new Date(
                                newTask.task_date
                            ).toISOString(),
                        },
                    ],
                }))
            },

            // Actualizar una tarea
            updateTask: (taskId, updatedTask) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId
                            ? {
                                  ...updatedTask,
                                  task_date: new Date(
                                      updatedTask.task_date
                                  ).toISOString(),
                              }
                            : task
                    ),
                }))
            },

            // Eliminar una tarea
            deleteTask: (taskId) => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== taskId),
                }))
            },

            // Establecer la lista completa de tareas (útil para cargar datos iniciales)
            setTasks: (tasks) => {
                set({
                    tasks: tasks.map((task) => ({
                        ...task,
                        task_date: new Date(task.task_date).toISOString(),
                    })),
                })
            },
        }),
        {
            name: "task-storage",
            getStorage: () => localStorage,
        }
    )
)

export default useTaskStore
