import { create } from "zustand"
import { persist } from "zustand/middleware"

const useUserStore = create(
    persist(
        (set) => ({
            users: [],
            isLoading: false,
            error: null,

            /**
             * Establece la lista completa de usuarios.
             * @param {Array} users - Lista de usuarios.
             */
            setUsers: (users) => set({ users }),

            /**
             * Agrega un nuevo usuario al estado.
             * @param {Object} user - Nuevo usuario.
             */
            addUser: (user) =>
                set((state) => ({ users: [...state.users, user] })),

            /**
             * Actualiza un usuario existente.
             * @param {Object} updatedUser - Usuario actualizado.
             */
            updateUser: (updatedUser) =>
                set((state) => ({
                    users: state.users.map((user) =>
                        user.id === updatedUser.id ? updatedUser : user
                    ),
                })),

            /**
             * Elimina un usuario del estado.
             * @param {string|number} userId - ID del usuario a eliminar.
             */
            removeUser: (userId) =>
                set((state) => ({
                    users: state.users.filter((user) => user.id !== userId),
                })),

            /**
             * Establece el estado de carga.
             * @param {boolean} isLoading - Estado de carga.
             */
            setLoading: (isLoading) => set({ isLoading }),

            /**
             * Establece un error en el estado.
             * @param {string|Object} error - Error a establecer.
             */
            setError: (error) => set({ error }),

            /**
             * Limpia el error del estado.
             */
            clearError: () => set({ error: null }),
        }),
        {
            name: "user-storage", // Nombre de la clave en el localStorage
            getStorage: () => localStorage,
        }
    )
)

export default useUserStore
