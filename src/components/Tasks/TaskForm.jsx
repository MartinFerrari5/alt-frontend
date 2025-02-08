// src/components/Tasks/TaskForm.jsx
import Input from "../Input"
import DatePicker from "./DatePicker"
import Button from "../Button"
import TaskFormSkeleton from "./TaskFormSkeleton"

const statusMap = {
    0: "No iniciado",
    1: "En progreso",
    2: "Completado",
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
}) => (
    <form onSubmit={handleSubmit}>
        <div className="space-y-6 rounded-xl bg-brand-white p-6">
            {loader && <TaskFormSkeleton />}
            <Input
                id="company"
                label="Empresa"
                {...register("company")}
                errorMessage={errors.company?.message}
            />
            <Input
                id="project"
                label="Proyecto"
                {...register("project")}
                errorMessage={errors.project?.message}
            />
            <Input
                id="task_type"
                label="Tipo de Tarea"
                {...register("task_type")}
                errorMessage={errors.task_type?.message}
            />
            <Input
                id="task_description"
                label="Descripción"
                {...register("task_description")}
                errorMessage={errors.task_description?.message}
            />
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
            <Input
                id="lunch_hours"
                label="Horas de Almuerzo"
                type="number"
                {...register("lunch_hours")}
                errorMessage={errors.lunch_hours?.message}
            />
            <DatePicker value={taskDate} onChange={setTaskDate} />

            <select
                {...register("status")}
                defaultValue={task?.task?.[0]?.status?.toString() || "0"}
                className="form-select"
            >
                {Object.entries(statusMap).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
            {errors.status && <p className="error">{errors.status.message}</p>}
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

export default TaskForm
