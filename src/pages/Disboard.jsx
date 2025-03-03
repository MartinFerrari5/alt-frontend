// src/pages/Disboard.jsx
import { useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardCards from "../components/DashboardCards";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TaskItem from "../components/Tasks/TaskItem";
import TaskFilter from "../components/Tasks/TaskFilter";
import { useTasks } from "../hooks/data/task/useTasks";

const TABLE_HEADERS = [
  "Nombre",
  "Fecha",
  "HE",
  "HS",
  "Empresa",
  "Proyecto",
  "TH",
  "HD",
  "HT",
  "Estado",
];

const DisboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Si "status" no está definido, lo establecemos a "0" (pendiente)
  useEffect(() => {
    if (!searchParams.get("status")) {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("status", "0");
        return params;
      });
    }
  }, [searchParams, setSearchParams]);

  // Memoriza los filtros basados en los parámetros de la URL
  const filters = useMemo(
    () => ({
      fullname: searchParams.get("fullname") || "",
      company: searchParams.get("company") || "",
      project: searchParams.get("project") || "",
      date: searchParams.get("date") || "",
      status: searchParams.get("status") || "0",
    }),
    [searchParams]
  );

  // Utiliza el hook de filtrado
  const { useFilterTasks } = useTasks();
  const { data: filteredTasks, isLoading, isError } = useFilterTasks(filters);

  // Filtra las tareas válidas (que tengan un id)
  const validTasks = useMemo(
    () => (filteredTasks || []).filter((task) => task?.id),
    [filteredTasks]
  );
  const firstTask = validTasks[0];

  // Callback para actualizar los parámetros de búsqueda desde el filtro
  const handleFilter = useCallback(
    (filterData) => {
      const { fullname, company, project, status, startDate, endDate } = filterData;
      const dateRange =
        startDate && endDate ? `${startDate} ${endDate}` : startDate || "";
      setSearchParams({
        fullname: fullname || "",
        company: company || "",
        project: project || "",
        date: dateRange,
        status: status || "0",
      });
    },
    [setSearchParams]
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full space-y-6 px-8 py-16">
        <Header subtitle="Panel" title="Panel" />
        <DashboardCards />
        {/* Sección de filtros */}
        <div className="space-y-3 rounded-xl bg-white p-6">
            <h3 className="text-xl font-semibold">Tareas</h3>
                        {firstTask ? (
              <span className="text-sm text-brand-dark-gray">
                 Horas totales {firstTask.total}
              </span>
            ) : (
              <p className="text-sm text-brand-dark-gray">
                No hay tareas disponibles.
              </p>
            )}

        <div className="overflow-x-auto">
          <div className="min-w-full py-2">
        <TaskFilter onFilter={handleFilter} />
           <div className="max-h-[500px] overflow-y-auto rounded-lg border">
              <table className="w-full text-left text-sm text-gray-500">
                 <thead className="sticky top-0 z-10 bg-gray-600 text-xs uppercase text-gray-400">
                  <tr>
                    {TABLE_HEADERS.map((header) => (
                      <th key={header} className="px-4 py-3">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={TABLE_HEADERS.length}
                        className="px-6 py-5 text-center text-sm text-brand-text-gray"
                      >
                        Cargando tareas...
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td
                        colSpan={TABLE_HEADERS.length}
                        className="px-6 py-5 text-center text-sm text-red-500"
                      >
                        Error al cargar las tareas.
                      </td>
                    </tr>
                  ) : validTasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={TABLE_HEADERS.length}
                        className="px-6 py-5 text-center text-sm text-brand-text-gray"
                      >
                        No hay tareas disponibles.
                      </td>
                    </tr>
                  ) : (
                    validTasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Resumen de horas totales */}
          {/* <div className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              Horas totales
            </h4>
            {firstTask ? (
              <span className="font-normal text-gray-700">
                {firstTask.total}
              </span>
            ) : (
              <p className="font-normal text-gray-700">
                No hay tareas disponibles.
              </p>
            )}
          </div> */}
        </div>
        </div>
      </div>
    </div>
  );
};

export default DisboardPage;
