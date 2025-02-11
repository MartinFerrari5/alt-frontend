// src/hooks/data/use-update-user.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userMutationKeys } from "../../keys/mutations";
import { userQueryKeys } from "../../keys/queries";
import { api } from "../../lib/axios";

/**
 * Hook para actualizar un usuario.
 * @param {string} userId - ID del usuario a actualizar.
 */
export const useUpdateUser = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: userMutationKeys.update(userId),
    mutationFn: async (data) => {
      // Preparamos el payload eliminando espacios en blanco
      const payload = {
        full_name: data?.full_name ? data.full_name.trim() : undefined,
        email: data?.email ? data.email.trim() : undefined,
        role: data?.role, // Puede ser opcional o necesario según la lógica de negocio
      };

      const { data: updatedUser } = await api.put(`/users/${userId}`, payload);
      return updatedUser;
    },
    retry: 2,
    onSuccess: (updatedUser) => {
      // Actualizamos la lista global de usuarios
      queryClient.setQueryData(userQueryKeys.getAll(), (oldUsers) => {
        return oldUsers
          ? oldUsers.map((user) => (user.id === userId ? updatedUser : user))
          : [];
      });

      // Actualizamos la caché del usuario individual
      queryClient.setQueryData(userQueryKeys.getById(userId), updatedUser);
    },
    onError: (error) => {
      console.error("🔴 Error al actualizar usuario:", error);
    },
  });
};
