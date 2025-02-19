import Input from "../Input"
import DatePicker from "./DatePicker"
import Button from "../Button"
import Dropdown from "../Dropdown/Dropdown"

// Mapeo de estados para el select (ajústalo según tu lógica)
const statusMap = {
    0: "En progreso",
    1: "Completado",
}

const formatTimeForInput = (timeStr) => {
    if (!timeStr) return ""
    return timeStr.length > 5 ? timeStr.slice(0, 5) : timeStr
}

const TaskForm = ({
    register,
    errors,
    handleSubmit,
    isSubmitting,
    taskDate,
    setTaskDate,
    task,
    // Recibimos las opciones ya cargadas desde el store
    companies,
    projects,
    hourTypes,
}) => {
    if (!task) return null

    // Indicadores de carga basados en la disponibilidad de las opciones
    const isLoadingCompanies = companies.length === 0
    const isLoadingProjects = projects.length === 0
    const isLoadingHourTypes = hourTypes.length === 0

    const taskData = task

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6 rounded-xl bg-brand-white p-6">
                {/* Dropdowns para Empresa, Proyecto, Tipo de Hora y Estado */}
                <div className="grid md:grid-cols-2 md:gap-6">
                    <Dropdown
                        id="company"
                        label="Empresa"
                        register={register}
                        error={errors.company}
                        isLoading={isLoadingCompanies}
                        isError={false}
                        items={companies}
                        loadingText="Cargando empresas..."
                        errorText="Error cargando empresas"
                    />
                    <Dropdown
                        id="project"
                        label="Proyecto"
                        register={register}
                        error={errors.project}
                        isLoading={isLoadingProjects}
                        isError={false}
                        items={projects}
                        loadingText="Cargando proyectos..."
                        errorText="Error cargando proyectos"
                    />
                    <Dropdown
                        id="hour_type"
                        label="Tipo de Hora"
                        register={register}
                        error={errors.hour_type}
                        isLoading={isLoadingHourTypes}
                        isError={false}
                        items={hourTypes}
                        loadingText="Cargando tipos de hora..."
                        errorText="Error cargando tipos de hora"
                    />
                    <div className="group relative z-0 mb-5 w-full">
                        <label
                            htmlFor="status"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Estado
                        </label>
                        <select
                            id="status"
                            {...register("status")}
                            className="form-select"
                        >
                            {Object.keys(statusMap).map((key) => (
                                <option key={key} value={key}>
                                    {statusMap[key]}
                                </option>
                            ))}
                        </select>
                    </div>
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

                {/* Grid para DatePicker y horarios */}
                <div className="grid md:grid-cols-2 md:gap-6">
                    <DatePicker
                        value={taskDate}
                        onChange={setTaskDate}
                        className="group relative z-0 mb-5 w-full"
                    />
                    <div className="group relative z-0 mb-5 w-full">
                        <Input
                            id="entry_time"
                            label="Hora de Entrada"
                            type="time"
                            {...register("entry_time")}
                            defaultValue={formatTimeForInput(
                                taskData.entry_time
                            )}
                            errorMessage={errors.entry_time?.message}
                        />
                    </div>
                    <div className="group relative z-0 mb-5 w-full">
                        <Input
                            id="exit_time"
                            label="Hora de Salida"
                            type="time"
                            {...register("exit_time")}
                            defaultValue={formatTimeForInput(
                                taskData.exit_time
                            )}
                            errorMessage={errors.exit_time?.message}
                        />
                    </div>
                    <div className="group relative z-0 mb-5 w-full">
                        <Input
                            id="lunch_hours"
                            label="Horas de Almuerzo"
                            type="number"
                            {...register("lunch_hours")}
                            defaultValue={
                                taskData.lunch_hours?.toString() || "1"
                            }
                            errorMessage={errors.lunch_hours?.message}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-4 flex w-full justify-end gap-3">
                <Button
                    size="large"
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                >
                    {isSubmitting && <span className="animate-spin">⏳</span>}{" "}
                    Actualizar
                </Button>
            </div>
        </form>
    )
}

export default TaskForm
