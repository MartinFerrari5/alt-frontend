// src/pages/Disboard.jsx
import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardCards from "../components/DashboardCards";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TaskItem from "../components/Tasks/TaskItem";
import TaskFilter from "../components/Tasks/TaskFilter";
import { useTasks } from "../hooks/data/task/useTasks";
import useAuthStore from "../store/authStore";

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
  const role = useAuthStore((state) => state.role);

  // Extrae los filtros desde la URL y reemplaza el '+' por un espacio
  const filters = useMemo(() => {
    const dateParam = searchParams.get("date") || "";
    return {
      fullname: searchParams.get("fullname") || "",
      company: searchParams.get("company") || "",
      project: searchParams.get("project") || "",
      date: dateParam.replace(/\+/g, " "),
      status: searchParams.get("status") || "",
    };
  }, [searchParams]);

  console.log("date: ", filters.date);

  const { getTasks, useFilterTasks } = useTasks({ all: true });
  const filterQuery = useFilterTasks(filters);

  // Selecciona las tareas a mostrar según si hay filtro activo o no
  const displayedTasks = Object.values(filters).some((value) => value !== "")
    ? filterQuery.data
    : getTasks.data;
  const isLoading = Object.values(filters).some((value) => value !== "")
    ? filterQuery.isLoading
    : getTasks.isLoading;
  const isError = Object.values(filters).some((value) => value !== "")
    ? filterQuery.isError
    : getTasks.isError;

  const validTasks = useMemo(
    () => (displayedTasks || []).filter((task) => task?.id),
    [displayedTasks]
  );

  console.log("validTasks: ", validTasks);

  // Función updateFilter (sin modificaciones)
  const updateFilter = useCallback(
    (filterData) => {
      const { fullname, company, project, status, startDate, endDate } = filterData;
      const dateRange =
        startDate && endDate ? `${startDate}+${endDate}` : startDate || "";
      setSearchParams({
        fullname: fullname || "",
        company: company || "",
        project: project || "",
        status: status || "",
        date: dateRange,
      });
    },
    [setSearchParams]
  );

  // Wrapper que adapta el objeto que envía TaskFilter (con propiedad "date")
  // y lo transforma en el formato que espera updateFilter (startDate y endDate)
  const handleFilter = useCallback(
    (filterData) => {
      let startDate = "";
      let endDate = "";
      if (filterData.date) {
        const dates = filterData.date.split(" ");
        if (dates.length === 2) {
          startDate = dates[0];
          endDate = dates[1];
        } else {
          startDate = filterData.date;
        }
      }
      updateFilter({
        fullname: filterData.fullname,
        company: filterData.company,
        project: filterData.project,
        status: filterData.status,
        startDate,
        endDate,
      });
    },
    [updateFilter]
  );

  const tableHeaders = useMemo(
    () =>
      role === "admin"
        ? TABLE_HEADERS
        : TABLE_HEADERS.filter((header) => header !== "Nombre"),
    [role]
  );

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={tableHeaders.length}
            className="px-6 py-5 text-center text-sm text-brand-text-gray"
          >
            Cargando tareas...
          </td>
        </tr>
      );
    }
    if (isError) {
      return (
        <tr>
          <td
            colSpan={tableHeaders.length}
            className="px-6 py-5 text-center text-sm text-red-500"
          >
            Error al cargar las tareas.
          </td>
        </tr>
      );
    }
    if (validTasks.length === 0) {
      return (
        <tr>
          <td
            colSpan={tableHeaders.length}
            className="px-6 py-5 text-center text-sm text-brand-text-gray"
          >
            No hay tareas disponibles.
          </td>
        </tr>
      );
    }
    return validTasks.map((task) => <TaskItem key={task.id} task={task} />);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full space-y-6 px-8 py-10 lg:ml-72">
        <Header subtitle="Panel" title="Panel" tasks={validTasks} />
        <DashboardCards />
        <div className="space-y-3 rounded-xl bg-white p-1">
          <div className="overflow-x-auto">
            <div className="min-w-full py-2">
              {/* Se pasa el wrapper en lugar de updateFilter directamente */}
              <TaskFilter onFilter={handleFilter} />
              <div className="max-h-[500px] overflow-y-auto rounded-lg border">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="sticky top-0 z-10 bg-gray-600 text-xs uppercase text-gray-400">
                    <tr>
                      {tableHeaders.map((header) => (
                        <th key={header} className="px-4 py-3">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{renderTableBody()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisboardPage;
