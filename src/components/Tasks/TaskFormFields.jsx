// /src/components/Tasks/TaskFormFields.jsx
import Dropdown from "../Dropdown/Dropdown"
import DatePicker from "./DatePicker"
import Input from "../Input"
import useAuthStore from "../../store/modules/authStore"

const TaskFormFields = ({
    companies_table,
    hour_type_table,
    types_table,
    filteredProjects,
    taskDate,
    setTaskDate,
    register,
    errors,
}) => {
    const user = useAuthStore((state) => state.user)
    const role = user?.role || "user"

    // Obtener la fecha actual y formatearla
    /* const today = new Date() */
    /* const formattedToday = today.toLocaleDateString("es-ES", {
        // 'es-ES' para formato español
        year: "numeric",
        month: "long",
        day: "numeric",
    }) */
    return (
        <div className="group relative z-0 mb-5 w-full">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {/* Dropdown Empresa */}
                <Dropdown
                    id="company"
                    label="Empresa"
                    register={register}
                    error={errors.company}
                    isLoading={!companies_table || companies_table.length === 0}
                    isError={false}
                    items={companies_table || []}
                    valueKey={role === "user" ? "company_id" : "id"}
                />
                {/* Dropdown Proyecto */}
                <Dropdown
                    id="project"
                    label="Proyecto"
                    register={register}
                    error={errors.project}
                    isLoading={filteredProjects.length === 0}
                    isError={false}
                    items={filteredProjects || []}
                    valueKey={role === "user" ? "project_id" : "id"}
                />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {/* Dropdown Tipo de Hora */}
                <Dropdown
                    id="hour_type"
                    label="Tipo de Hs"
                    register={register}
                    error={errors.hour_type}
                    isLoading={!hour_type_table || hour_type_table.length === 0}
                    isError={false}
                    items={hour_type_table || []}
                    valueKey="hour_type"
                />
                {/* Dropdown Tipo de Tarea */}
                <Dropdown
                    id="task_type"
                    label="Tipo de Tarea"
                    register={register}
                    error={errors.task_type?.message}
                    isLoading={!types_table || types_table.length === 0}
                    isError={false}
                    items={types_table || []}
                    valueKey="type"
                />
            </div>
            {/* Input Descripción */}
            <textarea
                id="task_description"
                {...register("task_description")}
                rows={3}
                className="focus:ring-primary-600 focus:border-primary-600 block w-full resize-y rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                placeholder="Descripción"
                style={{ minHeight: "3rem" }}
            />
            {errors.task_description && (
                <p className="mt-1 text-sm text-red-500">
                    {errors.task_description.message}
                </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {/* Entrada de Hora y Salida de Hora*/}
                <Input
                    id="entry_time"
                    label="Hora de Entrada"
                    type="time"
                    {...register("entry_time")}
                    errorMessage={errors.entry_time?.message}
                />
                <Input
                    id="exit_time"
                    label="Hora de Salida"
                    type="time"
                    {...register("exit_time")}
                    errorMessage={errors.exit_time?.message}
                />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {/* DatePicker y Horas de Almuerzo*/}

                <DatePicker value={taskDate} onChange={setTaskDate} />
                <Input
                    id="lunch_hours"
                    label="Horas de Almuerzo"
                    type="number"
                    min="0.1"
                    max="4"
                    step="0.1"
                    {...register("lunch_hours")}
                    errorMessage={errors.lunch_hours?.message}
                />
            </div>
        </div>
    )
}

export default TaskFormFields
