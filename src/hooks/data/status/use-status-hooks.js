// /src/hooks/data/status/use-status-hooks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../../store/authStore";
import useStatusStore from "../../../store/statusStore";
import { api } from "../../../lib/axios";


// Claves de consulta para React Query relacionadas con "status"
const statusQueryKeys = {
  all: () => ["status"],
  detail: (id) => ["status", id],
  byTask: (task_id) => ["status", "task", task_id],
};

/**
 * Hook para obtener todos los status.
 * Se requiere que el usuario tenga rol "admin".
 */
export const useGetStatus = () => {
  const role = useAuthStore((state) => state.role);
  const setStatuses = useStatusStore((state) => state.setStatuses);

  return useQuery({
    queryKey: statusQueryKeys.all(),
    queryFn: async () => {
      if (role !== "admin") {
        throw new Error("No tienes permisos para obtener la información de status.");
      }
      const { data } = await api.get("/status");
    //   console.log("Status: ",data.tasks);
      return data.tasks;
    },
    enabled: role === "admin",
    onSuccess: (data) => {
      // Actualizamos el store global con los status obtenidos
      setStatuses(data);
    },
  });
};

/**
 * Hook para crear un nuevo status.
 * Se espera recibir un objeto con la estructura:
 * { tasks: [ ... ], id: "..." }
 */
export const useCreateStatus = () => {
  const role = useAuthStore((state) => state.role);
  const queryClient = useQueryClient();
  const addStatus = useStatusStore((state) => state.addStatus);

  return useMutation({
    mutationFn: async (payload) => {
      if (role !== "admin") {
        throw new Error("No tienes permisos para crear un status.");
      }
      const { data } = await api.post("/status/download", payload);
      return data;
    },
    onSuccess: (newStatus) => {
      // Invalida la query para refrescar la lista de status
      queryClient.invalidateQueries(statusQueryKeys.all());
      // Actualiza el store agregando el nuevo status
      addStatus(newStatus);
    },
  });
};

/**
 * Hook para actualizar un status existente.
 * Ejemplo de uso:
 *   const { mutate: updateStatus } = useUpdateStatus();
 *   updateStatus({ id: 123, updatedData: { name: "Actualizado" } });
 */
export const useUpdateStatus = () => {
  const role = useAuthStore((state) => state.role);
  const queryClient = useQueryClient();
  const updateLocalStatus = useStatusStore((state) => state.updateStatus);

  return useMutation({
    mutationFn: async ({ id, updatedData }) => {
      if (role !== "admin") {
        throw new Error("No tienes permisos para actualizar el status.");
      }
      const { data } = await api.put(`/status?task_id=${id}`, updatedData);
      return data;
    },
    onSuccess: (updatedStatus, variables) => {
      // Invalida la lista general y el detalle del status actualizado
      queryClient.invalidateQueries(statusQueryKeys.all());
      queryClient.invalidateQueries(statusQueryKeys.detail(variables.id));
      // Actualiza el estado global con el status actualizado
      updateLocalStatus(updatedStatus);
    },
  });
};

/**
 * Hook para obtener el status asociado a una tarea específica.
 *
 * @param {string|number} task_id - El ID de la tarea.
 */
export const useGetStatusByTask = (task_id) => {
  const role = useAuthStore((state) => state.role);

  return useQuery({
    queryKey: statusQueryKeys.byTask(task_id),
    queryFn: async () => {
      if (role !== "admin") {
        throw new Error("No tienes permisos para obtener el status de la tarea.");
      }
      const { data } = await api.get(`/status/task/${task_id}`);
      return data;
    },
    enabled: role === "admin" && !!task_id,
  });
};

/**
 * Hook para filtrar tareas exportadas.
 *
 * Endpoint: GET /reportes/status/filtertasks?fullname={fullname}&date={date}
 *
 * @param {Object} filters - Objeto con las propiedades "fullname" y "date".
 */
export const useFilterExportedTasks = (filters) => {
  const { fullname, date } = filters;
  console.log("fullname: ", fullname);
  console.log("date: ", date);

  return useQuery({
    queryKey: ["filterTasks", { fullname, date }],
    queryFn: async () => {
      const params = new URLSearchParams();
      // Se envía fullname siempre, incluso si está vacío
      params.append("fullname", fullname || "");
      // Se envía date, permitiendo que esté vacío si no se provee
      params.append("date", date || "");
      const { data } = await api.get(
        `/status/filtertasks?${params.toString()}`
      );
      console.log("Status: ", data.tasks);
      return data.tasks;
    },
    // La query se dispara si alguno de los parámetros tiene valor
    enabled: Boolean(fullname || date),
  });
};
