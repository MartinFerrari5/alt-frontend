// src/components/Tasks/TaskStatusFilter.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TaskStatusFilter = ({ onFilterStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedStatus(value);
    // Si value es vacío, se entiende que no hay filtro de estado.
    const status = value === "" ? null : Number(value);
    onFilterStatus(status);
  };

  return (
    <select
      value={selectedStatus}
      onChange={handleChange}
      className="border p-2 rounded"
    >
      <option value="">Todas las tareas</option>
      <option value="1">Completadas</option>
      <option value="0">En Progreso</option>
    </select>
  );
};

TaskStatusFilter.propTypes = {
  onFilterStatus: PropTypes.func.isRequired,
};

export default TaskStatusFilter;
