// /src/components/Tasks/TaskForm.jsx

import Input from "../Input";
import DatePicker from "./DatePicker";
import Button from "../Button";

const statusMap = {
  0: "En progreso",
  1: "Completado",
};

const TaskForm = ({
  register,
  errors,
  handleSubmit,
  isSubmitting,
  taskDate,
  setTaskDate,
  task,
  companies,
  projects,
  hourTypes,
}) => {
  if (!task) return null;

  const taskData = task;

  const formatTimeForInput = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.length > 5 ? timeStr.slice(0, 5) : timeStr;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 rounded-xl bg-brand-white p-6">
        {/* Campo Empresa */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Empresa
          </label>
          <select
            id="company"
            {...register("company")}
            defaultValue={taskData.company}
            className="form-select mt-1 block w-full"
          >
            <option value="">Seleccione una empresa</option>
            {companies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
          )}
        </div>

        {/* Campo Proyecto */}
        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700">
            Proyecto
          </label>
          <select
            id="project"
            {...register("project")}
            defaultValue={taskData.project}
            className="form-select mt-1 block w-full"
          >
            <option value="">Seleccione un proyecto</option>
            {projects.map((project, index) => (
              <option key={index} value={project}>
                {project}
              </option>
            ))}
          </select>
          {errors.project && (
            <p className="mt-1 text-sm text-red-600">{errors.project.message}</p>
          )}
        </div>

        {/* Campo Tipo de Tarea */}
        <Input
          id="task_type"
          label="Tipo de Tarea"
          {...register("task_type")}
          defaultValue={taskData.task_type}
          errorMessage={errors.task_type?.message}
        />

        {/* Campo Descripción */}
        <Input
          id="task_description"
          label="Descripción"
          {...register("task_description")}
          defaultValue={taskData.task_description}
          errorMessage={errors.task_description?.message}
        />

        {/* Campo Hora de Entrada */}
        <Input
          id="entry_time"
          label="Hora de Entrada"
          type="time"
          {...register("entry_time")}
          defaultValue={formatTimeForInput(taskData.entry_time)}
          errorMessage={errors.entry_time?.message}
        />

        {/* Campo Hora de Salida */}
        <Input
          id="exit_time"
          label="Hora de Salida"
          type="time"
          {...register("exit_time")}
          defaultValue={formatTimeForInput(taskData.exit_time)}
          errorMessage={errors.exit_time?.message}
        />

        {/* Campo Horas de Almuerzo */}
        <Input
          id="lunch_hours"
          label="Horas de Almuerzo"
          type="number"
          {...register("lunch_hours")}
          defaultValue={taskData.lunch_hours?.toString() || "1"}
          errorMessage={errors.lunch_hours?.message}
        />

        {/* Campo Tipo de Hora */}
        <div>
          <label htmlFor="hour_type" className="block text-sm font-medium text-gray-700">
            Tipo de Hora
          </label>
          <select
            id="hour_type"
            {...register("hour_type")}
            defaultValue={taskData.hour_type}
            className="form-select mt-1 block w-full"
          >
            <option value="">Seleccione un tipo de hora</option>
            {hourTypes.map((hourType, index) => (
              <option key={index} value={hourType}>
                {hourType}
              </option>
            ))}
          </select>
          {errors.hour_type && (
            <p className="mt-1 text-sm text-red-600">{errors.hour_type.message}</p>
          )}
        </div>

        {/* DatePicker para la fecha de la tarea */}
        <DatePicker value={taskDate} onChange={setTaskDate} />

        {/* Campo Estado */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="status"
            {...register("status")}
            defaultValue={taskData.status?.toString()}
            className="form-select mt-1 block w-full"
          >
            {Object.entries(statusMap).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="flex w-full justify-end gap-3 mt-4">
        <Button size="large" color="primary" disabled={isSubmitting} type="submit">
          {isSubmitting && <span className="animate-spin">⏳</span>} Actualizar
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
