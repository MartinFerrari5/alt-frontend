import Input from "../Input"
import DatePicker from "./DatePicker"
import Button from "../Button"
import TaskFormSkeleton from "./TaskFormSkeleton"

const statusMap = {
    0: "En progreso",
    1: "Completado",
}

const TaskForm = ({
    register,
    errors,
    handleSubmit,
    isSubmitting,
    taskDate,
    setTaskDate,
    task,
    loader,
}) => {
    // Ensure task data is available
    const taskData = task || {}

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6 rounded-xl bg-brand-white p-6">
                {loader && <TaskFormSkeleton />}
                <Input
                    id="company"
                    label="Empresa"
                    {...register("company")}
                    defaultValue={taskData.company || ""}
                    errorMessage={errors.company?.message}
                />
                <Input
                    id="project"
                    label="Proyecto"
                    {...register("project")}
                    defaultValue={taskData.project || ""}
                    errorMessage={errors.project?.message}
                />
                <Input
                    id="task_type"
                    label="Tipo de Tarea"
                    {...register("task_type")}
                    defaultValue={taskData.task_type || ""}
                    errorMessage={errors.task_type?.message}
                />
                <Input
                    id="task_description"
                    label="Descripción"
                    {...register("task_description")}
                    defaultValue={taskData.task_description || ""}
                    errorMessage={errors.task_description?.message}
                />
                <Input
                    id="entry_time"
                    label="Hora de Entrada"
                    type="time"
                    {...register("entry_time")}
                    defaultValue={taskData.entry_time || "09:00"}
                    errorMessage={errors.entry_time?.message}
                />
                <Input
                    id="exit_time"
                    label="Hora de Salida"
                    type="time"
                    {...register("exit_time")}
                    defaultValue={taskData.exit_time || "18:00"}
                    errorMessage={errors.exit_time?.message}
                />
                <Input
                    id="lunch_hours"
                    label="Horas de Almuerzo"
                    type="number"
                    {...register("lunch_hours")}
                    defaultValue={taskData.lunch_hours?.toString() || "1"}
                    errorMessage={errors.lunch_hours?.message}
                />
                <DatePicker value={taskDate} onChange={setTaskDate} />

                <select
                    {...register("status")}
                    defaultValue={taskData.status?.toString() || "0"}
                    className="form-select"
                >
                    {Object.entries(statusMap).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                {errors.status && (
                    <p className="error">{errors.status.message}</p>
                )}
            </div>

            <div className="flex w-full justify-end gap-3">
                <Button
                    size="large"
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                >
                    {isSubmitting && <span className="animate-spin">⏳</span>}{" "}
                    Guardar
                </Button>
            </div>
        </form>
    )
}

export default TaskForm
