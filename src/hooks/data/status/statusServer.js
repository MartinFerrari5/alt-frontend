// /src/api/statusServer.js
import { api } from "../../../lib/axios";

/**
 * Obtiene todos los statuses.
 */
export const getStatuses = async () => {
  const { data } = await api.get("/status");
  console.log("Status: ", data);
  // Se asume que la respuesta contiene un arreglo en data.tasks
  return data.tasks;
};

/**
 * Crea un nuevo status.
 * @param {Object} payload - Datos del nuevo status.
 */
export const postStatus = async (payload) => {
  const { data } = await api.post("/status", payload);
  console.log("Status: ", data);
  return data;
};

/**
 * Actualiza un status existente.
 * @param {number|string} id - ID del status.
 * @param {Object} updatedData - Datos actualizados.
 */
export const putStatus = async (id, updatedData) => {
  const { data } = await api.put(`/status/${id}`, updatedData);
  return data;
};

/**
 * Obtiene el status asociado a una tarea específica.
 * @param {number|string} task_id - ID de la tarea.
 */
export const getStatusByTask = async (task_id) => {
  const { data } = await api.get(`/status/task/${task_id}`);
  return data;
};

/**
 * Filtra tareas exportadas según parámetros.
 * @param {string} fullname
 * @param {string} date
 */
export const getFilteredExportedTasks = async (fullname, date) => {
  const params = new URLSearchParams();
  params.append("fullname", fullname || "");
  params.append("date", date || "");
  const { data } = await api.get(`/status/filtertasks?${params.toString()}`);
  // Se asume que la respuesta contiene un arreglo en data.tasks
  return data.tasks;
};
