// src/components/Tasks/Tasks.jsx
import React, { useState, useEffect } from 'react';
import { useTasks } from "../../hooks/data/task/useTasks";
import Header from "../Header";
import TaskItem from "./TaskItem";
import TaskFilter from "./TaskFilter";
import TaskStatusFilter from "./TaskStatusFilter";

const Tasks = () => {
  // Extraemos tasksData y luego aseguramos que tasks sea un array.
  const { tasks: tasksData, getTasks } = useTasks();
  const { isLoading, isError } = getTasks;

  // Si tasksData es un objeto con la propiedad tasks, extraemos ese array.
  const tasks = Array.isArray(tasksData)
    ? tasksData
    : (tasksData?.tasks || []);

  // Estados para cada filtro
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  // Estado para las tareas filtradas
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Se recalculan las tareas filtradas cada vez que cambia tasks o algún filtro.
  useEffect(() => {
    // Si tasks no es un array, se asigna un array vacío para evitar errores.
    if (!Array.isArray(tasks)) {
      setFilteredTasks([]);
      return;
    }
    const filtered = tasks.filter(task => {
      // Filtrado por nombre (suponiendo que task.full_name existe)
      const matchName = nameFilter
        ? task.full_name?.toLowerCase().includes(nameFilter.toLowerCase())
        : true;
      // Filtrado por fecha (se compara la fecha sin la hora)
      const matchDate = dateFilter
        ? new Date(task.task_date).toDateString() === new Date(dateFilter).toDateString()
        : true;
      // Filtrado por estado: si se seleccionó un filtro, se compara.
      const matchStatus =
        statusFilter !== null
          ? Number(task.status) === statusFilter
          : true;
      return matchName && matchDate && matchStatus;
    });
    setFilteredTasks(filtered);
  }, [tasks, nameFilter, dateFilter, statusFilter]);

  // Filtro por nombre y fecha
  const handleFilter = async ({ fullname, date }) => {
    setNameFilter(fullname);
    setDateFilter(date);
  };

  // Filtro por estado: actualiza el estado con el valor seleccionado (null, 0 o 1)
  const handleStatusFilter = (selectedStatus) => {
    setStatusFilter(selectedStatus);
  };

  return (
    <div className="w-full space-y-6 px-8 py-16">
      <Header subtitle="Tareas" title="Tareas" />
      <div className="space-y-3 rounded-xl bg-white p-6">
        <TaskFilter onFilter={handleFilter} />
        <TaskStatusFilter onFilterStatus={handleStatusFilter} />
        {isLoading ? (
          <p className="text-sm text-brand-text-gray">Cargando tareas...</p>
        ) : isError ? (
          <p className="text-sm text-red-500">Error al cargar las tareas.</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-sm text-brand-text-gray">No hay tareas disponibles.</p>
        ) : (
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="max-h-[500px] overflow-y-auto rounded-lg border">
                  <table className="w-full text-left text-sm text-gray-500">
                    <thead className="sticky top-0 z-10 bg-gray-600 text-xs uppercase text-gray-400">
                      <tr>
                        <th className="px-4 py-3">Usuario</th>
                        <th className="px-4 py-3">Empresa</th>
                        <th className="px-4 py-3">Proyecto</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Hora</th>
                        <th className="px-4 py-3">Tipo de hora</th>
                        <th className="px-4 py-3">hs trabajadas</th>
                        <th className="px-4 py-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map((task) => (
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
