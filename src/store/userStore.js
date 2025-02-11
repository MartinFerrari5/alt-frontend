// src/store/userStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      // Estado inicial del usuario
      user: {
        userId: null,
        fullName: null,
        email: null,
        role: null,
      },

      // Estados para manejar la actualización
      isUpdating: false,
      updateError: null,
      updateSuccess: false,

      /**
       * Establece (o actualiza) los datos del usuario.
       * @param {Object} userData - Objeto con los datos del usuario a actualizar.
       */
      setUser: (userData) =>
        set((state) => ({
          user: {
            ...state.user,
            ...userData,
          },
        })),

      /**
       * Inicia el proceso de actualización.
       * Por ejemplo, para activar un spinner en la UI.
       */
      startUpdate: () =>
        set({
          isUpdating: true,
          updateError: null,
          updateSuccess: false,
        }),

      /**
       * Finaliza la actualización con éxito, actualizando los datos del usuario.
       * @param {Object} updatedUser - Objeto con los nuevos datos del usuario.
       */
      finishUpdate: (updatedUser) =>
        set((state) => ({
          user: {
            ...state.user,
            ...updatedUser,
          },
          isUpdating: false,
          updateSuccess: true,
          updateError: null,
        })),

      /**
       * Establece un error en caso de que la actualización falle.
       * @param {string} error - Mensaje de error.
       */
      setUpdateError: (error) =>
        set({
          isUpdating: false,
          updateError: error,
          updateSuccess: false,
        }),

      /**
       * Limpia el estado de actualización (por ejemplo, para ocultar notificaciones).
       */
      clearUpdateState: () =>
        set({
          isUpdating: false,
          updateError: null,
          updateSuccess: false,
        }),

      /**
       * Reinicia la información del usuario (útil al hacer logout o resetear el perfil).
       */
      resetUser: () =>
        set({
          user: {
            userId: null,
            fullName: null,
            email: null,
            role: null,
          },
        }),
    }),
    {
      name: "user-storage", // Nombre bajo el que se persistirá en el storage (por ejemplo, localStorage)
      getStorage: () => localStorage,
    }
  )
);

export default useUserStore;
