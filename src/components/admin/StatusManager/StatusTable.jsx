// src/components/admin/StatusManager/StatusTable.jsx
import { useEffect, useState } from "react";
import StatusItem from "./StatusItem";
import TaskFilter from "../../Tasks/TaskFilter";
import Header from "../../Header";
import useStatusStore from "../../../store/statusStore";
import { useFilterExportedTasks, useGetStatus } from "../../../hooks/data/status/use-status-hooks";


const StatusTable = () => {
  // Obtenemos la data de todos los status mediante React Query
  const { data: statusData, isLoading, error } = useGetStatus();
  // Extraemos el setter del store para actualizar la lista de status
  const { statuses, setStatuses } = useStatusStore();
  // Estado local para los filtros (se actualizará al aplicar filtro)
  const [filterParams, setFilterParams] = useState(null);

  // Cuando se obtienen todos los status, se actualiza el store
  useEffect(() => {
    if (statusData) {
      setStatuses(statusData);
    }
  }, [statusData, setStatuses]);

  // Si se han aplicado filtros, se dispara la query de filtrado
  const {
    data: filteredData,
    isLoading: filterLoading,
    error: filterError,
  } = useFilterExportedTasks(filterParams || {});

  // Cuando se obtienen los datos filtrados, se actualiza el store
  useEffect(() => {
    if (filteredData) {
      setStatuses(filteredData);
    }
  }, [filteredData, setStatuses]);

  // Función para manejar la aplicación de filtros desde TaskFilter
  const handleFilter = (params) => {
    setFilterParams(params);
  };

  // Combina los estados de carga y error
  const loadingState = isLoading || filterLoading;
  const errorState = error || filterError;

  if (loadingState) return <div>Cargando estados...</div>;
  if (errorState)
    return <div>Error: {errorState.message || "Ocurrió un error"}</div>;

  // Se asume que 'statuses' es un array de objetos status
  const tasks = statuses || [];

  return (
    <div>
      <Header subtitle="Exportados" title="Exportados" tasks={tasks} />
      <div className="space-y-3 rounded-xl bg-white p-6">
        {/* El componente TaskFilter dispara la función handleFilter */}
        <TaskFilter onFilter={handleFilter} />
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="max-h-[500px] overflow-y-auto rounded-lg border">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="sticky top-0 z-10 bg-gray-600 text-xs uppercase text-gray-400">
                    <tr>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Project</th>
                      <th className="px-4 py-3">Task Type</th>
                      <th className="px-4 py-3">Task Description</th>
                      <th className="px-4 py-3">Entry Time</th>
                      <th className="px-4 py-3">Exit Time</th>
                      <th className="px-4 py-3">Hour Type</th>
                      <th className="px-4 py-3">Lunch Hours</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Task Date</th>
                      <th className="px-4 py-3">Worked Hours</th>
                      <th className="px-4 py-3">Full Name</th>
                      <th className="px-4 py-3">Total</th>
                    </tr>
                  </thead>
                  {tasks.length > 0 ? (
                    <tbody>
                      {tasks.map((task) => (
                        <StatusItem key={task.id} task={task} />
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan="13" className="text-center">
                          No tasks found
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusTable;
