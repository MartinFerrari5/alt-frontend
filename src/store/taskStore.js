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
                            task_date: newTask.task_date
                                ? new Date(newTask.task_date).toISOString()
                                : null,
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
                                  ...task,
                                  ...updatedTask,
                                  task_date: updatedTask.task_date
                                      ? new Date(updatedTask.task_date).toISOString()
                                      : task.task_date, // Preserve existing date if not provided
                              }
                            : task
                    ),
                }));
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
                        task_date: task.task_date ? new Date(task.task_date).toISOString() : null,
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
