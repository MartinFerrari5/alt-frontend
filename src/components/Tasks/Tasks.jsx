// src/components/Tasks/Tasks.jsx
import { useGetTasks } from "../../hooks/data/task/use-get-tasks";

import Header from "../Header";
import TaskItem from "./TaskItem";
import TaskFilter from "./TaskFilter";
import useTaskStore from "../../store/taskStore";

const Tasks = () => {
  const { isLoading, isError } = useGetTasks();
  const tasks = useTaskStore((state) => state.tasks);
  const filterTasks = useTaskStore((state) => state.filterTasks);

  const handleFilter = async ({ fullname, date }) => {
    await filterTasks(fullname, date);
  };

  return (
    <div className="w-full space-y-6 px-8 py-16">
      <Header subtitle="Mis Tareas" title="Mis Tareas" />
      <div className="space-y-3 rounded-xl bg-white p-6">
        <TaskFilter onFilter={handleFilter} />
        {isLoading ? (
          <p className="text-sm text-brand-text-gray">Cargando tareas...</p>
        ) : isError ? (
          <p className="text-sm text-red-500">Error al cargar las tareas.</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-brand-text-gray">No hay tareas disponibles.</p>
        ) : (
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="max-h-[500px] overflow-y-auto rounded-lg border">
                  <table className="w-full text-left text-sm text-gray-500">
                    <thead className="sticky top-0 bg-white text-xs uppercase text-gray-600 shadow-md">
                      <tr>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Empresa</th>
                        <th className="px-6 py-3">Proyecto</th>
                        <th className="px-6 py-3">Fecha</th>
                        <th className="px-6 py-3">Hora</th>
                        <th className="px-6 py-3 text-right">Tipo de hora</th>
                        <th className="px-6 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
